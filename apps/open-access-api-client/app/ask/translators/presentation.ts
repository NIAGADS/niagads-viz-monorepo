import type { RegionalManhattanPlotProps } from "@niagads/charts";
import type { TableConfig } from "@niagads/table";
import type { PresentationIntent } from "../contracts.ts";
import { fieldValue, tableRules, tableTranslator, type FieldSpec, type PresentationData } from "./registry.ts";
import { translateBar, translateTable, type TranslatedBar } from "./index.ts";
import { translateRegionalManhattan } from "./regional-manhattan.ts";

type ResolvedPresentation =
    | { kind: "table"; config: TableConfig }
    | { kind: "bar"; config: TranslatedBar }
    | { kind: "regional_manhattan"; config: RegionalManhattanPlotProps }
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
        if (intent.filters.length) {
            const adapter = tableTranslator(result);
            if (!adapter) throw new Error("No adapter supports filters for these records");
            const filters = intent.filters.map((filter) => {
                const field = tableRules[adapter].fields.find(
                    (field) => field.id === filter.field || field.paths.includes(filter.field)
                );
                if (!field || field.projection !== "scalar")
                    throw new Error(`Unsupported filter field: ${filter.field}`);
                const expectedType = ["integer", "float"].includes(field.type)
                    ? "number"
                    : field.type === "boolean"
                      ? "boolean"
                      : "string";
                if (typeof filter.value !== expectedType) throw new Error(`Invalid filter value for ${field.header}`);
                return { field, value: filter.value };
            });
            result = {
                ...result,
                rows: result.rows.filter((row) =>
                    filters.every(({ field, value }) => fieldValue(row, field) === value)
                ),
            };
        }
        const hasPlotPreference = intent.plot_type || intent.group_by || intent.x || intent.y;
        if (intent.view === "table" || (intent.view === "auto" && !hasPlotPreference)) {
            return { kind: "table", config: translateTable(result) };
        }
        const plotType = intent.plot_type?.trim().toLowerCase();
        if (
            [
                "regional_manhattan",
                "regional_manhattan_plot",
                "regional manhattan",
                "regional manhattan plot",
                "regionalmanhattanplot",
                "manhattan",
            ].includes(plotType ?? "") ||
            (!plotType &&
                ["gene", "region"].includes(result.entity) &&
                result.annotation === "associations" &&
                result.content === "full")
        ) {
            return { kind: "regional_manhattan", config: translateRegionalManhattan(result, intent) };
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
        if (Array.isArray(intent.group_by) && intent.group_by.length !== 1)
            throw new Error("Bar plots support one grouping field");
        const requestedGroup = canonicalField(
            fields,
            Array.isArray(intent.group_by) ? intent.group_by[0] : intent.group_by
        );
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
