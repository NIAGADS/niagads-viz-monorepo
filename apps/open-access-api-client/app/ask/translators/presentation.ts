import type { TableConfig } from "@niagads/table";
import type { PresentationIntent } from "../contracts.ts";
import { tableRules, tableTranslator, type FieldSpec, type PresentationData } from "./registry.ts";
import { translateBar, translateTable, type TranslatedBar } from "./index.ts";

type ResolvedPresentation =
    | { kind: "table"; config: TableConfig }
    | { kind: "bar"; config: TranslatedBar }
    | { kind: "unsupported"; message: string };

function canonicalField(fields: readonly FieldSpec[], name: string | null): string | null {
    return name === null ? null : (fields.find((field) => field.id === name || field.paths.includes(name))?.id ?? name);
}

/** UI adapters decide whether and how data can fulfill the requested view. */
export function resolvePresentation(
    result: PresentationData,
    intent: PresentationIntent,
    maxCategories: number
): ResolvedPresentation {
    try {
        if (intent.result_id !== result.id) throw new Error("Presentation intent references a different result");
        const hasPlotPreference = intent.plot_type || intent.group_by || intent.x || intent.y;
        if (intent.view === "table" || (intent.view === "auto" && !hasPlotPreference)) {
            return { kind: "table", config: translateTable(result) };
        }
        if (
            intent.plot_type &&
            !["bar", "bar_chart", "bar chart", "barchart"].includes(intent.plot_type.trim().toLowerCase())
        ) {
            return {
                kind: "unsupported",
                message: `The requested plot type “${intent.plot_type}” has no supported adapter.`,
            };
        }
        const id = tableTranslator(result);
        if (!id) throw new Error("No plot adapter supports these records");
        const fields = tableRules[id].fields;
        const categories = fields.filter((f) => f.categorical).map((f) => f.id);
        const requestedGroup = canonicalField(fields, intent.group_by);
        const requestedX = canonicalField(fields, intent.x);
        const requestedY = canonicalField(fields, intent.y);
        const groupBy =
            requestedGroup ??
            (id === "association_counts_table"
                ? "track"
                : [requestedX, requestedY].find((field) => field && categories.includes(field))) ??
            null;
        const measure = id === "association_counts_table" ? "num_associations" : "count";
        if ((requestedX && requestedX !== measure) || (requestedY && requestedY !== groupBy)) {
            throw new Error(
                "The supported bar adapter places counts on the x-axis and categories on the y-axis; the requested axes cannot be honored"
            );
        }
        return { kind: "bar", config: translateBar(result, groupBy, maxCategories) };
    } catch (error) {
        return {
            kind: "unsupported",
            message: `${error instanceof Error ? error.message : "The requested view could not be prepared"}.`,
        };
    }
}
