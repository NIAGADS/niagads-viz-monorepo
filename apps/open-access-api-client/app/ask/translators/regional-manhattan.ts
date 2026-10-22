import type { RegionalManhattanPlotProps } from "@niagads/charts";
import type { PresentationIntent } from "../contracts.ts";
import { traitLabels, validateRows, type PresentationData } from "./registry.ts";

const PHENOTYPES = ["disease", "neuropathology", "disease_or_neuropathology"];

/** Adapt reported regional association records without aggregating study results. */
export function translateRegionalManhattan(
    result: PresentationData,
    intent: PresentationIntent
): RegionalManhattanPlotProps {
    if (
        !["gene", "region"].includes(result.entity) ||
        result.annotation !== "associations" ||
        result.content !== "full"
    )
        throw new Error("Regional Manhattan plots require full gene or regional association records");
    validateRows(result, "associations_table");
    if (!result.rows.length) throw new Error("No loaded associations are available to plot");
    if (intent.x && intent.x !== "position") throw new Error("Regional Manhattan plots use position on the x-axis");
    if (intent.y && !["neg_log10_pvalue", "pvalue"].includes(intent.y))
        throw new Error("Regional Manhattan plots use −log10(p) on the y-axis");

    const groups =
        intent.group_by === null
            ? ["population", "disease_or_neuropathology"]
            : Array.isArray(intent.group_by)
              ? intent.group_by
              : [intent.group_by];
    if (groups.some((group) => group !== "population" && !PHENOTYPES.includes(group)))
        throw new Error("Regional Manhattan grouping supports population, disease and neuropathology");
    const phenotypeGroups = groups.filter((group) => PHENOTYPES.includes(group));
    const combinedPhenotype = phenotypeGroups.includes("disease_or_neuropathology") || phenotypeGroups.length > 1;
    const phenotype = combinedPhenotype ? "disease_or_neuropathology" : phenotypeGroups[0];
    const colorLabel =
        phenotype === "disease"
            ? "Disease"
            : phenotype === "neuropathology"
              ? "Neuropathology"
              : "Disease or neuropathology";
    const chromosome = result.rows[0].chromosome;
    if (typeof chromosome !== "string" || !chromosome)
        throw new Error("Regional associations require a reported chromosome");

    const points = result.rows.map((row) => {
        if (row.chromosome !== chromosome) throw new Error("A regional Manhattan plot requires one chromosome");
        if (typeof row.position !== "number" || !Number.isInteger(row.position) || row.position < 1)
            throw new Error("Regional associations require a reported position in base pairs");
        if (
            typeof row.neg_log10_pvalue !== "number" ||
            !Number.isFinite(row.neg_log10_pvalue) ||
            row.neg_log10_pvalue < 0
        )
            throw new Error("Regional associations require a finite reported −log10(p) score");
        const population = groups.includes("population") ? traitLabels(row.traits, "population") : [];
        const phenotypes = phenotype
            ? combinedPhenotype
                ? [...traitLabels(row.traits, "disease"), ...traitLabels(row.traits, "neuropathology")]
                : traitLabels(row.traits, phenotype as "disease" | "neuropathology")
            : [];
        return {
            position: row.position / 1_000_000,
            score: row.neg_log10_pvalue,
            colorCategory: phenotype
                ? [...new Set(phenotypes)].sort().join("; ") || `${colorLabel} not reported`
                : "All associations",
            symbolCategory: groups.includes("population")
                ? [...new Set(population)].sort().join("; ") || "Population not reported"
                : "All associations",
            feature_id: row.variant as string,
            tooltipInfo: [
                ...(typeof row.pvalue === "string" ? [{ label: "Reported p-value", value: row.pvalue }] : []),
                ...(typeof row.track === "string" ? [{ label: "Source track", value: row.track }] : []),
            ],
        };
    });
    return {
        data: { points },
        title: intent.title,
        xAxis: { label: `Position on chromosome ${chromosome.replace(/^chr/i, "")} (Mb)` },
        yAxis: { label: "−log10(p)" },
        legend: {
            colorLabel: phenotype ? colorLabel : "Associations",
            symbolLabel: groups.includes("population") ? "Population" : "Associations",
        },
        ariaLabel: intent.title,
    };
}
