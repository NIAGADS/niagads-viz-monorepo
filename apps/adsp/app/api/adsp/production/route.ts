/* ADSP production status — server-side only.
   Token lives in env CODA_API_TOKEN and never reaches the browser.
   Client calls GET /api/adsp/production?release=R6 and receives normalized, display-ready fields. */
import type { ProductionRecord } from "@/lib/types";

const DOC = "1v0WT1rPok";
const PROJECTS = "grid-EFf5zqX_mk";
const TASKS = "grid-Ulvg0Zvw0s";

const P = {
    projectId: "c-90FI_oF7St",
    projectName: "c-vxgkuDgU0Y",
    release: "c-nmpKzUXaO8",
    batchSamples: "c-qmHKeeXTfJ",
    batch: "c-V1zb746EYM",
    fileReceived: "c-eiRM26pSi_",
} as const;
const T = {
    task: "c-MSyo4iQFGp",
    projectId: "c-OWEmOs3nPa",
    batch: "c-LvyzuC6U4k",
    progress: "c-bKNm0hKefg",
    completed: "c-6XQ9WnwA4n",
} as const;
const MILESTONES: Record<string, "adspIdsGenerated" | "pipelineCompleted"> = {
    "ID-Remapping": "adspIdsGenerated",
    "Run Pipeline Full": "pipelineCompleted",
};

type Row = Record<string, unknown>;

async function allRows(table: string): Promise<Row[]> {
    const out: Row[] = [];
    let pageToken = "";
    do {
        const url = `https://coda.io/apis/v1/docs/${DOC}/tables/${table}/rows?valueFormat=simple&limit=500${pageToken ? "&pageToken=" + pageToken : ""}`;
        const r = await fetch(url, {
            headers: { Authorization: `Bearer ${process.env.CODA_API_TOKEN}` },
            next: { revalidate: 900 },
        });
        if (!r.ok) throw new Error("coda " + r.status);
        const j = (await r.json()) as { items: { values: Row }[]; nextPageToken?: string };
        out.push(...j.items.map((i) => i.values));
        pageToken = j.nextPageToken || "";
    } while (pageToken);
    return out;
}

const str = (v: unknown) => (Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v)).trim();
const n = (v: unknown) => {
    const x = Number(String(v ?? "").replace(/,/g, ""));
    return Number.isFinite(x) ? x : 0;
};
const date = (v: unknown) => {
    const s = str(v);
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
};
const key = (pid: string, batch: string | null) => `${pid}||${batch || ""}`;

async function normalize(release: string | null): Promise<ProductionRecord[]> {
    const [projects, tasks] = await Promise.all([allRows(PROJECTS), allRows(TASKS)]);

    const done: Record<string, Partial<Record<"adspIdsGenerated" | "pipelineCompleted", string | null>>> = {};
    for (const t of tasks) {
        const field = MILESTONES[str(t[T.task])];
        if (!field || n(t[T.progress]) < 100) continue;
        (done[key(str(t[T.projectId]), str(t[T.batch]))] ||= {})[field] = date(t[T.completed]);
    }

    const byProject: Record<string, Row[]> = {};
    for (const p of projects) {
        const id = str(p[P.projectId]);
        if (id) (byProject[id] ||= []).push(p);
    }

    const records: ProductionRecord[] = [];
    for (const [projectId, rows] of Object.entries(byProject)) {
        const rel = str((rows.find((r) => str(r[P.release])) || {})[P.release]);
        if (release && rel.toUpperCase() !== release.toUpperCase()) continue;
        const parent = rows.find((r) => !str(r[P.batch])) || rows[0];
        const batches = rows.filter((r) => str(r[P.batch]));
        const totalSamples = rows.reduce((s, r) => s + n(r[P.batchSamples]), 0);
        for (const r of batches.length ? batches : [parent]) {
            const batch = str(r[P.batch]) || null;
            const m = done[key(projectId, batch)] || {};
            records.push({
                projectId,
                projectName: str(parent[P.projectName]),
                release: rel,
                totalSamples,
                batch,
                batchSamples: n(r[P.batchSamples]),
                fileReceived: date(r[P.fileReceived]) || date(parent[P.fileReceived]),
                adspIdsGenerated: m.adspIdsGenerated || null,
                pipelineCompleted: m.pipelineCompleted || null,
            });
        }
    }
    return records;
}

export async function GET(req: Request) {
    const release = new URL(req.url).searchParams.get("release");
    try {
        return Response.json({ release, records: await normalize(release), fetchedAt: new Date().toISOString() });
    } catch (e) {
        console.error("[adsp/production]", e);
        return Response.json({ error: "unavailable" }, { status: 503 });
    }
}
