"use client";
/* View-model for every page. Ported from the prototype's single logic class:
   all derived, display-ready values are computed here from lib/data.ts so that
   editing a round's status in the data cascades across the site. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ADSP_DATA as D } from "./data";
import type { LiveStats, ProductionRecord } from "./types";

export type Page = "home" | "releases" | "datagen" | "phc" | "access" | "submit" | "about";
export type ReleasesView = "released" | "production";
export const ACCESS_SECTIONS = [["overview", "Overview"], ["apply", "How to Apply"], ["dss-gen3", "DSS & Gen3"]] as const;
export type AccessSection = (typeof ACCESS_SECTIONS)[number][0];

export interface SiteValsOptions {
  page: Page;
  view?: ReleasesView;
  section?: AccessSection;
  live?: LiveStats | null;
}

const VIZ = ["#332288", "#117733", "#44AA99", "#88CCEE", "#DDCC77", "#CC6677", "#AA4499"];
const BLUE = "var(--primary-blue)", GOLD = "var(--niagads-gold)";
const GREEN = "var(--success-green)", AMBER = "var(--warning-amber)", MUTED = "var(--text-muted)";
const SAMPLE_MODE = process.env.NEXT_PUBLIC_PRODUCTION_SOURCE === "sample";

export const num = (n: unknown) => (typeof n === "number" ? n.toLocaleString("en-US") : "—");
const isTBD = (v: unknown) => v == null || v === "TBD";
const scrollToId = (id: string) => { const el = document.getElementById(id); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16); };

const CARD_STYLES = {
  cardStyle1: { style: { padding: "2rem" } },
  cardStyle2: { style: { overflow: "hidden", padding: "0" } },
  cardStyle3: { style: { padding: "1.5rem" } },
  cardStyle4: { style: { borderLeft: "4px solid var(--primary-blue)", padding: "1.5rem" } },
  cardStyle6: { style: { padding: "1.5rem", display: "flex", flexDirection: "column" as const, gap: "0.9rem" } },
};
const STATE: Record<string, { marker: string; label: string; color: string }> = {
  complete:    { marker: "●", label: "Complete",    color: GREEN },
  in_progress: { marker: "◐", label: "In progress", color: AMBER },
  not_started: { marker: "○", label: "Not started", color: MUTED },
  tbd:         { marker: "?", label: "TBD",         color: MUTED },
};

interface Cell { v: string; bg: string; align: string; color: string; weight: string; padL: string; ws: string }
const cell = (v: string, o: Partial<Cell> = {}): Cell =>
  ({ v, bg: o.bg || "transparent", align: o.align || "left", color: o.color || "var(--text-primary)", weight: o.weight || "400", padL: o.padL || "1rem", ws: o.ws || "nowrap" });

const csvEsc = (v: unknown) => { const t = v == null ? "" : String(v); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
function downloadCsv(lines: unknown[][], filename: string) {
  const blob = new Blob([lines.map((l) => l.map(csvEsc).join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

type State = Record<string, any>;
type SetState = (u: State | ((s: State) => State)) => void;
type Sort = { key: string; dir: "asc" | "desc" } | null;

function toggleSort(setState: SetState, tk: string, key: string, text: boolean) {
  setState((st) => { const cur: Sort = st[tk + "Sort"]; return { [tk + "Sort"]: cur && cur.key === key ? { key, dir: cur.dir === "asc" ? "desc" : "asc" } : { key, dir: text ? "asc" : "desc" } }; });
}

/* ---------- Flat sortable / filterable table (PHC domains) ---------- */
function flatTable(state: State, setState: SetState, tk: string, o: any) {
  const q: string = state[tk + "Q"] || "", sort: Sort = state[tk + "Sort"] || null;
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  const nameKey = o.cols[0].key;
  const rows: any[] = toks.length ? o.rows.filter((r: any) => { const h = String(r.vals[nameKey]).toLowerCase(); return toks.every((t) => h.indexOf(t) >= 0); }) : o.rows.slice();
  const col = sort && o.cols.find((c: any) => c.key === sort.key);
  if (sort && col) { const dir = sort.dir === "asc" ? 1 : -1; rows.sort((a, b) => { const x = a.vals[col.key], y = b.vals[col.key]; const xa = col.text ? String(x).toLowerCase() : (x || 0), ya = col.text ? String(y).toLowerCase() : (y || 0); return dir * (xa < ya ? -1 : xa > ya ? 1 : 0); }); }
  const fmt = (c: any, v: any, bold: boolean) => { const cc: Cell = c.fmt ? c.fmt(v, bold) : cell(v ? num(v) : "—", { align: "right", color: v ? "var(--text-primary)" : "var(--gray-400)" }); cc.align = cc.align || "right"; if (bold) cc.weight = "700"; return cc; };
  const mk = (r: any, total: boolean) => ({ name: r.vals[nameKey], href: r.href, hasHref: !!r.href, noHref: !r.href, swatch: r.swatch, hasSwatch: !!r.swatch,
    weight: total ? "700" : o.nameWeight || "600", color: total || !r.href ? "var(--text-primary)" : BLUE, bg: total ? "var(--gray-100)" : "transparent",
    cells: o.cols.slice(1).map((c: any) => fmt(c, r.vals[c.key], total)) });
  const out = rows.map((r) => mk(r, false));
  if (o.total && rows.length) { const tv = o.total(rows); tv[nameKey] = toks.length ? o.totalLabel + " (filtered)" : o.totalLabel; out.push(mk({ vals: tv }, true)); }
  const cols = o.cols.map((c: any, i: number) => { const on = !!sort && sort.key === c.key;
    return { label: c.label, align: i === 0 ? "left" : "right", color: on ? BLUE : MUTED, arrow: on ? (sort!.dir === "asc" ? "▲" : "▼") : "↕", arrowColor: on ? BLUE : "var(--gray-400)",
      ariaSort: on ? (sort!.dir === "asc" ? "ascending" : "descending") : "none", onSort: () => toggleSort(setState, tk, c.key, !!c.text) }; });
  const onExport = () => downloadCsv([o.cols.map((c: any) => c.csv || c.label), ...rows.map((r) => o.cols.map((c: any) => r.vals[c.key]))], o.filename + (toks.length ? "-filtered" : "") + ".csv");
  return { cols, rows: out, q, onQ: (v: string) => setState({ [tk + "Q"]: v }), placeholder: o.placeholder,
    filtered: !!(toks.length || sort), onReset: () => setState({ [tk + "Q"]: "", [tk + "Sort"]: null }),
    countLabel: toks.length ? num(rows.length) + " of " + num(o.rows.length) + " " + o.noun : num(o.rows.length) + " " + o.noun,
    empty: rows.length === 0, ncols: cols.length, onExport };
}

/* ---------- Grouped cohort → study → sample-set table ---------- */
function sampleTable(state: State, setState: SetState, tk: string, o: any) {
  const q: string = state[tk + "Q"] || "", sort: Sort = state[tk + "Sort"] || null;
  const collapsed = !!state[tk + "Collapsed"];
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = (s: any) => [s.cohort, o.studyEnt(s.study).name, s.study, o.setEnt(s.sampleSet).name, s.sampleSet].join(" ").toLowerCase();
  const sets: any[] = toks.length ? o.sets.filter((s: any) => { const h = hay(s); return toks.every((t) => h.indexOf(t) >= 0); }) : o.sets;
  const col = sort && o.numCols.find((c: any) => c.key === sort.key);
  const dir = sort && sort.dir === "asc" ? 1 : -1;
  const itemKey = (s: any) => !sort || sort.key === "cohort" ? s.study + s.sampleSet : sort.key === "study" ? o.studyEnt(s.study).name.toLowerCase() : sort.key === "set" ? o.setEnt(s.sampleSet).name.toLowerCase() : (col.value(s) || 0);
  const cmp = (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0);
  const sub = (arr: any[], c: any) => (arr.length && arr.every((s) => c.value(s) === null) ? null : arr.reduce((a, s) => a + (c.value(s) || 0), 0));
  const groups = (o.cohorts as string[]).map((c) => ({ c, sets: sets.filter((s) => s.cohort === c) })).filter((g) => g.sets.length);
  groups.forEach((g) => g.sets.sort((a, b) => sort ? dir * cmp(itemKey(a), itemKey(b)) || cmp(a.study + a.sampleSet, b.study + b.sampleSet) : cmp(itemKey(a), itemKey(b))));
  if (sort) groups.sort((a, b) => dir * (col ? cmp(sub(a.sets, col), sub(b.sets, col)) : cmp(a.c.toLowerCase(), b.c.toLowerCase())));
  const rows: any[] = [];
  groups.forEach((g) => {
    rows.push({ group: true, item: false, label: g.c, href: o.cohortUrl(g.c), bg: "var(--gray-50)", cells: o.numCols.map((c: any) => o.cellFor(c, sub(g.sets, c), true)) });
    if (!collapsed) g.sets.forEach((s) => rows.push({ group: false, item: true, study: o.studyEnt(s.study), set: o.setEnt(s.sampleSet), cells: o.numCols.map((c: any) => o.cellFor(c, c.value(s), false)) }));
  });
  if (sets.length) rows.push({ group: true, item: false, label: toks.length ? o.totalLabel + " (filtered)" : o.totalLabel, bg: "var(--gray-100)", cells: o.numCols.map((c: any) => o.cellFor(c, sub(sets, c), true)) });
  const head = (key: string, label: string, align: string, color: string, sortable: boolean, text: boolean) => {
    const on = !!sort && sort.key === key;
    return { label, align, color: on ? BLUE : color, arrow: on ? (sort!.dir === "asc" ? "▲" : "▼") : sortable ? "↕" : "", arrowColor: on ? BLUE : "var(--gray-400)",
      ariaSort: on ? (sort!.dir === "asc" ? "ascending" : "descending") : "none", disabled: !sortable, cursor: sortable ? "pointer" : "default",
      onSort: sortable ? () => toggleSort(setState, tk, key, text) : undefined, colspan: undefined as number | undefined };
  };
  const cols = [...(collapsed ? [Object.assign(head("cohort", "Cohort", "left", MUTED, true, true), { colspan: 2 })] : [head("study", "Study", "left", MUTED, true, true), head("set", "Sample set", "left", MUTED, true, true)]),
    ...o.numCols.map((c: any) => head(c.key, c.label, "right", c.color || MUTED, c.sortable !== false, false))];
  const onExport = () => {
    const lines: unknown[][] = collapsed ? [["Cohort", "Sample sets", ...o.numCols.map((c: any) => c.csv || c.label)]] : [["Cohort", "Study", "Study ID", "Sample set", "Sample set ID", ...o.numCols.map((c: any) => c.csv || c.label)]];
    if (collapsed) groups.forEach((g) => lines.push([g.c, g.sets.length, ...o.numCols.map((c: any) => { const v = sub(g.sets, c); return v === null ? "TBD" : v; })]));
    else groups.forEach((g) => g.sets.forEach((s) => lines.push([s.cohort, o.studyEnt(s.study).name, s.study, o.setEnt(s.sampleSet).name, s.sampleSet,
      ...o.numCols.map((c: any) => { const v = c.value(s); return v === null ? "TBD" : v; })])));
    downloadCsv(lines, o.filename + (collapsed ? "-by-cohort" : "") + (toks.length ? "-filtered" : "") + ".csv");
  };
  const nCoh = (o.cohorts as string[]).filter((c) => o.sets.some((s: any) => s.cohort === c)).length;
  return { cols, rows, q, collapsed,
    viewTabs: ([["Cohorts only", true], ["Studies & sample sets", false]] as const).map(([label, v]) => ({ label, active: collapsed === v, onClick: () => setState({ [tk + "Collapsed"]: v }) })),
    onQ: (v: string) => setState({ [tk + "Q"]: v }),
    filtered: !!(toks.length || sort), onReset: () => setState({ [tk + "Q"]: "", [tk + "Sort"]: null }),
    countLabel: toks.length ? num(groups.length) + " of " + num(nCoh) + " cohorts" : num(nCoh) + " cohorts",
    empty: sets.length === 0, ncols: cols.length, onExport };
}

function compFor(dimKey: string, round: string) {
  const dim = D.composition[dimKey] || D.composition[Object.keys(D.composition)[0]];
  const counts = dim.counts[round] || [];
  const total = counts.reduce((a, b) => a + b, 0);
  const segs = dim.categories.map((label, j) => {
    const c = counts[j] || 0;
    const pct = total ? Math.round((c / total) * 1000) / 10 : 0;
    return { label, color: VIZ[j], pct, inner: pct >= 12 ? pct + "%" : "", countLabel: num(c), pctLabel: pct + "%" };
  });
  const aria = round + ", " + dim.label + ": " + segs.map((s) => s.label + " " + s.pctLabel).join(", ");
  return { round, segs, total, totalLabel: num(total) + " samples", aria };
}

type ProdLoad = { status: "loading" | "ok" | "unavailable"; records?: ProductionRecord[] };

export function useSiteVals({ page, view = "released", section: sectionProp = "overview", live }: SiteValsOptions) {
  const router = useRouter();
  const [state, setRaw] = useState<State>({ dim: "diagnosis", narrow: false, vw: 1280, prod: {} });
  const setState: SetState = useCallback((u) => setRaw((s) => ({ ...s, ...(typeof u === "function" ? u(s) : u) })), []);
  const requested = useRef<Set<string>>(new Set());

  // Viewport
  useEffect(() => {
    const onResize = () => setState({ narrow: window.innerWidth < 860, vw: Math.round(window.innerWidth / 40) * 40 });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setState]);

  // Scroll-spy for the Releases and Methods side navs
  useEffect(() => {
    const all = page === "releases" && view !== "production";
    if (page !== "datagen" && !all) return;
    const ids = all ? ["ar-overview", "ar-products", "ar-samples", "ar-characteristics", "ar-pubs"] : ["dg-core", "dg-evolution", "dg-derived", "dg-code"];
    const key = all ? "arActive" : "dgActive";
    const onScroll = () => {
      let cur = ids[0];
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) cur = ids[ids.length - 1];
      else for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 120) cur = id; }
      setRaw((s) => (s[key] === cur ? s : { ...s, [key]: cur }));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, view]);

  // Production status (Coda via server route)
  useEffect(() => {
    if (page !== "releases" || view !== "production" || SAMPLE_MODE) return;
    D.releases.filter((r) => r.status === "in_production").forEach(async (r) => {
      if (requested.current.has(r.id)) return;
      requested.current.add(r.id);
      const set = (v: ProdLoad) => setState((s) => ({ prod: { ...s.prod, [r.id]: v } }));
      set({ status: "loading" });
      try {
        const res = await fetch(D.links.productionApi + "?release=" + encodeURIComponent(r.id), { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        const j = await res.json();
        if (!Array.isArray(j.records)) throw new Error("bad shape");
        set({ status: "ok", records: j.records });
      } catch { set({ status: "unavailable" }); }
    });
  }, [page, view, setState]);

  // Deep links like /releases/production#prod-r6
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h) setTimeout(() => scrollToId(h), 300);
  }, []);

  const { narrow } = state;
  const dim: string = D.composition[state.dim] ? state.dim : Object.keys(D.composition)[0];
  const REL = D.releases;
  const byId = Object.fromEntries(REL.map((r) => [r.id, r]));
  const RELEASED = REL.filter((r) => r.status === "released").map((r) => r.id);
  const RS = D.releaseSummary;
  const OVR = RELEASED.filter((id) => RS[id]).map((id) => { const r = byId[id], s = RS[id]; const lab = (r.familiarLabel || r.assay).split(" ");
    return [id, lab[0], r.assay, s.first[0], s.first[1], s.qc ? s.qc[0] : "—", s.qc ? s.qc[1] : "", r.projectFileset || "TBD"] as const; });
  const CORE = D.coreProductRows.map(([k, label]) => [label, ...OVR.map((o) => RS[o[0]].products[k] || null)] as const);
  const PROD = REL.filter((r) => r.status === "in_production");
  const relNotes = (v: string) => D.links.releaseNotes.replace("{version}", v);


  // ---- Access sections ----
  const section = ACCESS_SECTIONS.some(([k]) => k === sectionProp) ? sectionProp : ACCESS_SECTIONS[0][0];
  const secHref = (k: string) => "/access" + (k === "overview" ? "" : "/" + k);
  const sideItems = ACCESS_SECTIONS.map(([k, label]) => ({
    label, href: secHref(k), current: section === k ? ("page" as const) : undefined,
    bl: section === k ? "var(--primary-blue)" : "transparent",
    bg: section === k ? "var(--surface)" : "transparent",
    fg: section === k ? BLUE : "var(--text-secondary)", fw: section === k ? "600" : "400",
  }));
  const sideFields: Record<string, string> = {}; ACCESS_SECTIONS.forEach(([k, label]) => (sideFields[label] = k));

  // ---- Samples (cohort → study → sample set) ----
  const DSS = D.dss;
  const cohorts: string[] = [];
  D.sampleSets.forEach((s) => { if (cohorts.indexOf(s.cohort) < 0) cohorts.push(s.cohort); });
  const cnt = (s: any, id: string) => (s.counts || {})[id] || 0;
  const entity = (names: Record<string, string>, url: string, id: string) => ({ name: names[id] || id, id, href: url ? url.replace("{id}", id) : undefined, showId: !!names[id] });
  const studyEnt = (id: string) => entity(DSS.studies, DSS.studyUrl, id);
  const setEnt = (id: string) => entity(DSS.sampleSets, DSS.sampleSetUrl, id);
  const cellFor = (_c: any, n: number | null, bold: boolean) => {
    if (n === null) return cell("TBD", { align: "right", color: MUTED });
    const cc = cell(n ? num(n) : "—", { align: "right", color: n ? "var(--text-primary)" : "var(--gray-400)" });
    if (bold) cc.weight = "700"; return cc;
  };
  const tblBase = { cohorts, studyEnt, setEnt, cellFor, cohortUrl: (c: string) => DSS.cohortUrls[c] };
  const RELD = REL.filter((r) => r.status === "released").slice().reverse();
  const allRelIds = RELD.map((r) => r.id);
  const selR: string[] = state.ssRounds && state.ssRounds.length ? state.ssRounds : allRelIds;
  const roundPicks = RELD.map((r) => { const on = selR.includes(r.id); return { label: r.id + " · " + (r.familiarLabel || "").split(" ")[0] + " " + r.assay, active: on, pressed: on ? "true" : "false",
    onClick: () => setState((st) => { const cur: string[] = st.ssRounds && st.ssRounds.length ? st.ssRounds : allRelIds; const nx = cur.includes(r.id) ? cur.filter((x) => x !== r.id) : cur.concat(r.id); return { ssRounds: nx.length ? nx : cur }; }) }; });
  const selRel = RELD.filter((r) => selR.includes(r.id));
  const samplesAll = {
    ...sampleTable(state, setState, "all", {
      ...tblBase,
      sets: D.sampleSets.filter((st) => selR.some((id) => cnt(st, id) > 0)), totalLabel: "All samples", filename: "ng00067-samples-" + selRel.map((r) => r.id.toLowerCase()).join("-"),
      numCols: selRel.map((r) => ({ key: r.id, label: r.id + " · " + r.assay, csv: r.id + (r.assay ? " (" + r.assay + ")" : ""), color: MUTED, sortable: true, value: (s: any) => cnt(s, r.id) })),
    }),
    caption: "Final sample counts listed here may be different than the initial release due to removal of participants and their data over time.", roundPicks,
    allRoundsOn: selR.length === RELD.length, onAllRounds: () => setState({ ssRounds: allRelIds }), onLatest: () => setState({ ssRounds: ["R5", "R2"] }),
  };

  // ---- Composition ----
  const navChipTabs = (items: [string, string][], key: string, setKey: string) => items.map(([k, label]) => ({
    label, active: key === k, onClick: (e?: MouseEvent) => { if (e) e.preventDefault(); setState({ [setKey]: k }); },
  }));
  const COMP = D.composition;
  const compBars = RELEASED.map((r) => compFor(dim, r));
  const compLegend = COMP[dim].categories.map((label, j) => ({ label, color: VIZ[j] }));
  const dim2: string = state.dim2 && state.dim2 !== dim && COMP[state.dim2] ? state.dim2 : "none";
  const XC = D.compositionCross;
  const X = XC[dim + "|" + dim2], XT = XC[dim2 + "|" + dim];
  const crossRound: string = RELEASED.indexOf(state.crossRound) >= 0 ? state.crossRound : RELEASED[RELEASED.length - 1];
  const xget = (a: string, b: string) => { const row = X ? (X[crossRound] || {})[a] : XT ? (XT[crossRound] || {})[b] : null; const k = X ? b : a; if (!row || !(k in row)) return 0; return row[k]; };
  const cross: Record<string, any> = { single: dim2 === "none", pending: dim2 !== "none" && !X && !XT, ready: dim2 !== "none" && !!(X || XT) };
  if (dim2 !== "none") {
    cross.pairLabel = COMP[dim].label + " × " + COMP[dim2].label;
    cross.legend = COMP[dim2].categories.map((label, j) => ({ label, color: VIZ[j] }));
    cross.roundTabs = navChipTabs(RELEASED.map((r) => [r, r]), crossRound, "crossRound");
    const A = COMP[dim].categories, B = COMP[dim2].categories;
    const fmtC = (v: number | null) => (v === null ? "<11" : num(v));
    const mat = A.map((a) => B.map((b) => xget(a, b)));
    const rowTot = A.map((a) => (COMP[dim].counts[crossRound] || [])[A.indexOf(a)] || 0);
    const colTot = B.map((b) => (COMP[dim2].counts[crossRound] || [])[B.indexOf(b)] || 0);
    const keep = A.map((_a, i) => rowTot[i] > 0);
    cross.round = crossRound; cross.showRoundTabs = true; cross.showRoundLabel = false;
    cross.rows = A.map((a, i) => {
      const vals = mat[i], tot = rowTot[i];
      return { label: a, totalLabel: num(tot), aria: a + ": " + B.map((b, j) => b + " " + fmtC(vals[j])).join(", "),
        segs: vals.map((v, j) => { const pct = tot && v ? (v / tot) * 100 : 0; return { pct: pct.toFixed(2), color: VIZ[j], inner: pct >= 9 ? Math.round(pct) + "%" : "", title: B[j] + ": " + fmtC(v) }; }) };
    }).filter((_r, i) => keep[i]);
    cross.cols = [{ label: COMP[dim].label + " \\ " + COMP[dim2].label, align: "left" }, ...B.map((b) => ({ label: b, align: "right" })), { label: "Total", align: "right" }];
    const cellOf = (v: number | null) => ({ text: fmtC(v), color: v === null ? MUTED : "var(--text-primary)" });
    const grand = rowTot.reduce((t, v) => t + v, 0);
    cross.tableRows = A.map((a, i) => ({ label: a, weight: "400", bg: "transparent", cells: [...mat[i].map(cellOf), cellOf(rowTot[i])] })).filter((_r, i) => keep[i])
      .concat([{ label: "Total", weight: "700", bg: "var(--gray-50)", cells: [...colTot.map(cellOf), cellOf(grand)] }]);
    cross.onExport = () => downloadCsv(
      [[COMP[dim].label + " / " + COMP[dim2].label, ...B, "Total"], ...A.flatMap((a, i) => (keep[i] ? [[a, ...mat[i].map(fmtC), rowTot[i]]] : [])), ["Total", ...colTot, grand]],
      "ng00067-" + crossRound.toLowerCase() + "-" + dim + "-by-" + dim2 + ".csv");
  }

  const PUBS = D.publications.map((p) => ({ ...p, href: "https://pubmed.ncbi.nlm.nih.gov/" + p.pmid + "/", tag: p.group === "preprint" ? " · preprint" : "" }));

  // ---- Production ----
  const prodCols = [["Project", "left"], ["Batch", "left"], ["Samples", "right"], ["File Received", "left"], ["ADSP IDs Generated", "left"], ["Pipeline Completed", "left"]].map(([label, align]) => ({ label, align }));
  const fmtPD = (d: string | null) => { if (!d) return "—"; const x = new Date(d + "T00:00:00"); return isNaN(x.getTime()) ? String(d) : x.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const prodFor = (id: string) => {
    const rel = byId[id]; if (!rel) return {} as any;
    const sr: ProdLoad = SAMPLE_MODE ? { status: "ok", records: D.productionSample.filter((r) => r.release === id) } : state.prod[id] || { status: "loading" };
    const rs = sr.records || [];
    const pm: Record<string, { id: string; name: string; total: number; rows: ProductionRecord[] }> = {};
    rs.forEach((r) => { (pm[r.projectId] = pm[r.projectId] || { id: r.projectId, name: r.projectName || r.projectId, total: r.totalSamples, rows: [] }).rows.push(r); });
    const dcol = (d: string | null) => (d ? "var(--text-primary)" : MUTED);
    const projs = Object.values(pm).map((p) => ({ id: p.id, name: p.name, total: num(p.total), batchLabel: p.rows.length === 1 ? "1 batch" : p.rows.length + " batches",
      batches: p.rows.map((r) => ({ batch: r.batch || "—", samples: num(r.batchSamples), fileReceived: fmtPD(r.fileReceived), adspIds: fmtPD(r.adspIdsGenerated), pipeline: fmtPD(r.pipelineCompleted),
        c1: dcol(r.fileReceived), c2: dcol(r.adspIdsGenerated), c3: dcol(r.pipelineCompleted) })) }));
    const done = rs.filter((r) => r.pipelineCompleted).length, ok = sr.status === "ok";
    return { id, activitySummary: rel.activitySummary, summary: rel.summary || "", indivNote: rel.individualNote || "",
      stages: (rel.productionStages || []).map((st, i, a) => { const k = STATE[st.state] || STATE.tbd; return { n: i + 1, label: st.label, status: st.status, color: k.color, marker: k.marker, arrow: i < a.length - 1 ? "→" : "" }; }),
      prod: { loading: sr.status === "loading", unavailable: sr.status === "unavailable", empty: ok && !rs.length, hasRows: ok && rs.length > 0, projects: projs,
        summary: ok && rs.length ? projs.length + " projects · " + rs.length + " batches · " + num(rs.reduce((t, r) => t + (r.batchSamples || 0), 0)) + " samples · pipeline completed for " + done + " of " + rs.length + " batches" : "" } };
  };

  // ---- Home ----
  const G = D.glance;
  const L = live || {};
  const version = L.version || null;
  const vLabel = version ? (/^NG/i.test(version) ? version : "NG00067.v" + version) : "TBD";
  const relDate = L.releaseDate || D.links.latestReleaseDate;
  const glanceVals = [
    { ...G.ng00067Version, value: vLabel, note: relDate ? "Released " + relDate : G.ng00067Version.note, href: undefined as string | undefined },
    { ...G.approvedDars, value: L.dars != null ? num(L.dars) : G.approvedDars.value, note: "Approved Data Access Requests (DARs) ↗", href: D.links.dars },
    { ...G.cohorts, value: L.cohorts != null ? num(L.cohorts) : G.cohorts.value, note: (G.cohorts.note || "Cohorts represented") + " ↗", href: "https://dss.niagads.org/datasets/ng00067/#cohorts" },
  ];
  const glance = glanceVals.map((g) => ({ ...g, valueColor: isTBD(g.value) ? "var(--gray-400)" : "#ffffff" }));
  const WGS_IDS = REL.filter((r) => r.status === "released" && r.assay === "WGS").map((r) => r.id);
  const sampN = (id: string) => (D.releaseFacts[id] || {}).samples || 0;
  const latest = WGS_IDS[WGS_IDS.length - 1];
  const gMax = Math.max(...WGS_IDS.map(sampN), 1);
  const growth = WGS_IDS.map((id) => ({ n: num(sampN(id)), h: Math.round((sampN(id) / gMax) * 82), label: id + " · " + (byId[id].familiarLabel || "").split(" ")[0],
    bg: id === latest ? GOLD : "rgba(255,255,255,0.28)", numColor: id === latest ? GOLD : "#ffffff" }));

  const homeAvail = (() => {
    const rel = REL.filter((r) => r.status === "released");
    const lw = rel.filter((r) => r.assay === "WGS").pop(), le = rel.filter((r) => r.assay === "WES").pop();
    const availNow = [lw && { big: lw.id + " · " + lw.familiarLabel, sub: "Latest released whole-genome sequencing round" }, le && { big: le.id + " · " + le.familiarLabel, sub: "Whole-exome sequencing resource" }].filter(Boolean);
    const earlier = rel.filter((r) => r.assay === "WGS" && r !== lw).map((r) => r.id);
    const list = earlier.length > 1 ? earlier.slice(0, -1).join(", ") + ", and " + earlier[earlier.length - 1] : earlier.join("");
    return { availNow, inProdNow: PROD.map((r) => ({ big: r.id + " · " + r.assay, sub: r.activitySummary || "In production" })), hasProdNow: PROD.length > 0,
      cumulNote: lw && earlier.length ? lw.id + " builds cumulatively on the earlier " + list + " WGS rounds. Explore Sequencing Rounds to compare the release history and core data products." : "" };
  })();

  // ---- PHC ----
  const PG = ([["BIOMARKERS", ["CSF biomarkers", "Plasma biomarkers"]], ["CLINICAL", ["Demographics & diagnosis", "Cognition", "Vascular risk factors"]], ["NEUROPATH.", ["Neuropathology"]], ["IMAGING", ["MRI T1 (FreeSurfer)", "MRI MUSE", "FLAIR", "DTI", "PET amyloid", "PET tau"]]] as const)
    .map(([label, ns]) => ({ label, idx: ns.map((n) => D.phc.domains.indexOf(n)).filter((j) => j >= 0) })).filter((g) => g.idx.length);
  const phcOrder = PG.flatMap((g) => g.idx);
  const phcMax = Math.max(...D.phc.cohorts.flatMap((c) => c.counts)), phcTotMax = Math.max(...D.phc.total);
  const heat = (v: number, bold: boolean) => {
    if (bold || !v) return cell(v ? num(v) : "—", { align: "right", color: v ? "var(--text-primary)" : "var(--gray-400)", weight: bold ? "700" : "400" });
    const t = Math.log(v + 1) / Math.log(phcMax + 1), p = Math.round(8 + t * 72);
    return cell(num(v), { align: "right", bg: "color-mix(in oklch, var(--primary-blue) " + p + "%, white)", color: p >= 76 ? "#ffffff" : "var(--text-primary)", weight: p >= 76 ? "600" : "400" });
  };
  const phcHeadGroups = PG.map((g) => ({ label: g.label, span: g.idx.length }));
  const phcBars = phcOrder.map((j) => { const n = D.phc.cohorts.filter((c) => c.counts[j] > 0).length; return { total: num(D.phc.total[j]), h: Math.round((D.phc.total[j] / phcTotMax) * 100) + "%", cohorts: n + (n === 1 ? " cohort" : " cohorts") }; });
  const phcTable = flatTable(state, setState, "phc", {
    cols: [{ key: "name", label: "Cohort", text: true }, ...phcOrder.map((j) => ({ key: "d" + j, label: D.phc.domains[j], fmt: heat }))],
    rows: D.phc.cohorts.map((c) => { const v: Record<string, any> = { name: c.name }; c.counts.forEach((n, j) => (v["d" + j] = n || 0)); return { href: c.url || DSS.cohortUrls[c.name], vals: v }; }),
    total: (rs: any[]) => { const v: Record<string, any> = {}; D.phc.domains.forEach((_, j) => (v["d" + j] = rs.length === D.phc.cohorts.length ? D.phc.total[j] : rs.reduce((a, r) => a + (r.vals["d" + j] || 0), 0))); return v; },
    totalLabel: "Total", noun: "cohorts", placeholder: "Filter cohorts", filename: "ng00067-phc-domains-by-cohort",
  });
  const phcStats = (() => {
    const P = D.phc;
    const img = ["DTI", "FLAIR", "PET amyloid", "PET tau", "MRI T1 (FreeSurfer)", "MRI MUSE"].map((n) => P.domains.indexOf(n));
    const imgCohorts = P.cohorts.filter((c) => img.some((j) => c.counts[j] > 0)).length;
    return [
      { value: num(P.total[P.domains.indexOf("Demographics & diagnosis")]), label: "subjects with harmonized demographics & diagnosis" },
      { value: String(P.cohorts.length), label: "cohorts with PHC data and ADSP sequencing" },
      { value: String(P.domains.length), label: "harmonized phenotype domains" },
      { value: String(imgCohorts), label: "cohorts with harmonized imaging" },
    ];
  })();

  // ---- About timeline ----
  const timeline = (() => {
    const yr = (d: string) => d.slice(-4);
    const lw = OVR.filter((x) => x[2] === "WGS").pop();
    type T = { year: string; title: string; note: string; kind: "inst" | "rel" | "prod"; href?: string };
    const items: T[] = [
      { year: "2012", title: "NIAGADS established", note: "NIA–Penn cooperative agreement", kind: "inst" },
      ...OVR.map((x, k): T => ({ year: yr(x[4]), title: x[0] + " · " + x[1] + " " + x[2] + (lw && x[0] === lw[0] && x[5] !== "—" && x[4] !== x[6] ? " preview" : ""), note: k === 0 ? "NIAGADS begins distributing ADSP sequencing data" : "First released " + x[4], kind: "rel", href: "/releases" })),
      ...(lw && lw[6] && lw[6] !== lw[4] ? [{ year: yr(lw[6]), title: lw[0] + " QC'd WGS callset", note: "Released " + lw[6], kind: "rel", href: "/releases" } as T] : []),
      ...(PROD.length ? [{ year: String(new Date().getFullYear()), title: PROD.map((r) => r.id).join(" and ") + " in production", note: "Follow production status", kind: "prod", href: "/releases/production" } as T] : []),
    ];
    return items.map((t, k) => ({ ...t, href: t.href || "/about", pe: t.href ? "auto" : "none",
      dot: t.kind === "rel" ? BLUE : t.kind === "prod" ? "var(--surface)" : "var(--gray-400)", dotBorder: t.kind === "prod" ? AMBER : t.kind === "rel" ? BLUE : "var(--gray-400)",
      yearColor: t.kind === "prod" ? AMBER : t.kind === "rel" ? BLUE : "var(--text-muted)", titleColor: t.kind === "inst" ? "var(--text-secondary)" : "var(--text-primary)",
      lineStyle: k === items.length - 2 ? "dashed" : k === items.length - 1 ? "none" : "solid" }));
  })();

  const sideNav = (items: [string, string][], activeKey: string, fallback?: string) => items.map(([id, label]) => {
    const on = (state[activeKey] || fallback) === id;
    return { label, bl: on ? GOLD : "transparent", fg: on ? BLUE : "var(--text-secondary)", fw: on ? "700" : "500",
      onClick: (e: MouseEvent) => { e.preventDefault(); scrollToId(id); if (activeKey === "dgActive") setState({ dgActive: id }); } };
  });

  return {
    ...CARD_STYLES,
    aboutRoles: [
      ["Coordinate Data Intake", "Receive sequencing data, study information, metadata, phenotypes, consent documentation, and related information needed to integrate new ADSP submissions."],
      ["Generate & Release Genomic Data", "Process ADSP sequencing data:  individual-level processing, joint calling, structural variant calling, QC, and prepare genomic data products for release."],
      ["Maintain the ADSP Data Resource", "Organize sequencing releases, phenotype resources, metadata, derived resources, and associated data products as the ADSP resource grows."],
      ["Distribute Data to Researchers", "Maintain NG00067 and the NIAGADS infrastructure used to discover, request, access, and download ADSP data."],
    ].map(([title, body], k) => ({ n: "0" + (k + 1), title, body })),
    timeline,
    isNarrow: narrow, isWide: !narrow,
    heroGenomes: num(sampN(latest)), growth, growthAria: "Whole genomes by round: " + WGS_IDS.map((id) => id + " " + num(sampN(id))).join(", "),
    wesN: num(REL.filter((r) => r.status === "released" && r.assay === "WES").reduce((t, r) => t + sampN(r.id), 0)),
    glanceDars: glance.find((g) => /DAR/.test(g.note || "")) || ({} as (typeof glance)[number]),
    glanceCohorts: glance.find((g) => /ohort/i.test(g.note || "")) || ({} as (typeof glance)[number]),
    glance: glance.slice(1), glanceVersion: glance[0],
    cohortsDssHref: "https://dss.niagads.org/adsp-cohort-information/",
    ...homeAvail,
    guideCards: [
      { title: "Sequencing Rounds", body: "Compare released ADSP sequencing data and see what's currently in production.", cta: "Explore sequencing data →", href: "/releases" },
      { title: "Pipelines & Methods", body: "See how ADSP sequencing data are processed and how methods have evolved.", cta: "Explore methods →", href: "/methods" },
      { title: "Phenotypes", body: "Explore basic ADSP phenotypes and ADSP-PHC harmonized phenotype resources.", cta: "Explore phenotypes →", href: "/phenotypes" },
    ].map((c, k) => ({ ...c, n: "0" + (k + 1) })),

    section, sideItems, sideFields,
    onSideChange: (e: ChangeEvent<HTMLSelectElement>) => { if (e.target.value) router.push(secHref(e.target.value)); },
    accOverview: section === "overview", accApply: section === "apply", accDss: section === "dss-gen3",

    dimTabs: navChipTabs(Object.keys(COMP).map((k) => [k, COMP[k].label]), dim, "dim"),
    dim2Tabs: navChipTabs([["none", "None"], ...Object.keys(COMP).filter((k) => k !== dim).map((k): [string, string] => [k, COMP[k].label])], dim2, "dim2"),
    cross,
    viewTabs: ([["released", "Released Rounds", "/releases"], ["production", "In Production", "/releases/production"]] as const).map(([k, label, href]) => ({ label, href, active: view === k, current: view === k ? ("page" as const) : undefined,
      bg: view === k ? "var(--primary-blue)" : "var(--surface)", fg: view === k ? "#ffffff" : "var(--text-primary)", bd: view === k ? "var(--primary-blue)" : "var(--border)" })),
    isReleasedView: page === "releases" && view === "released", isProdView: page === "releases" && view === "production",
    roundOverview: OVR.map((o) => ({ label: o[0] + " · " + o[1], assay: o[2], samples: num((D.releaseFacts[o[0]] || {}).samples), firstV: o[3], firstD: o[4], href: relNotes(o[3].replace(/^v/, "")), qcV: o[5], qcD: o[6], fileset: o[7] })),
    coreCols: [{ label: "Core Data Product", align: "left" }, ...OVR.map((o) => ({ label: o[0] + " · " + o[1] + " " + o[2], align: "center" }))],
    coreRows: CORE.map((r) => ({ label: r[0], cells: r.slice(1).map((c: any) => ({ has: !!c, none: !c, v: c ? c[0] : "", date: c ? c[1] : "", href: c ? relNotes(c[0].replace(/^v|\*$/g, "")) : "" })) })),
    relPubs: PUBS.filter((p) => p.group === "release" || p.group === "preprint").map((p) => ({ roundsLabel: (p.releases || []).join(" · "), citation: p.citation, pmid: p.pmid, href: p.href,
      note: ((p.description.match(/\((.*)\)$/) || [])[1] || p.description) + (p.group === "preprint" ? " · preprint" : "") })),
    prodCards: PROD.map((r) => ({ id: r.id, title: r.id + " · " + r.assay, activity: r.activitySummary, href: "/releases/production#prod-" + r.id.toLowerCase(),
      onClick: (e: MouseEvent) => { e.preventDefault(); scrollToId("prod-" + r.id.toLowerCase()); } })),
    r6: prodFor("R6"), r7: prodFor("R7"),
    toBasic: (e: MouseEvent) => { e.preventDefault(); scrollToId("ph-basic"); }, toPhc: (e: MouseEvent) => { e.preventDefault(); scrollToId("ph-phc"); },
    arNav: sideNav([["ar-overview", "Round Overview"], ["ar-products", "Core Data Products"], ["ar-samples", "Samples & Studies"], ["ar-characteristics", "Sample Characteristics"], ["ar-pubs", "Related Publications"]], "arActive", "ar-overview"),
    dgNav: sideNav([["dg-core", "Core workflow"], ["dg-evolution", "Methods evolution"], ["dg-derived", "Derived resources"], ["dg-code", "Code & publications"]], "dgActive"),
    dimField: COMP[dim].sourceField || COMP[dim].label,

    samplesAll, compBars, compLegend,
    prodBadge: SAMPLE_MODE ? "EXAMPLE DATA" : "", prodCols,

    pubGroups: D.publicationGroups.map((g) => ({ label: g.label, items: PUBS.filter((p) => p.group === g.key) })).filter((g) => g.items.length),
    phcTable, phcHeadGroups, phcBars, phcStats,
  };
}

export type SiteVals = ReturnType<typeof useSiteVals>;
