import { tableTranslatorRules } from "../types.generated.ts";
import type { Presentation, ResultSet } from "../contracts.ts";

export type TableTranslatorId = keyof typeof tableTranslatorRules;
export type FieldSpec = {
    id: string;
    header: string;
    type: "text" | "integer" | "float" | "boolean" | "link" | "pvalue";
    paths: readonly string[];
    required: boolean;
    categorical: boolean;
    projection: "scalar" | "text_list" | "traits";
};
type TableRule = {
    entities: readonly string[];
    annotation: string | null;
    content: readonly string[];
    fields: readonly FieldSpec[];
};
export const tableRules: Record<TableTranslatorId, TableRule> = tableTranslatorRules;
export const tableTranslatorIds = Object.keys(tableRules) as [TableTranslatorId, ...TableTranslatorId[]];

export function tableTranslator(result: ResultSet): TableTranslatorId | undefined {
    return tableTranslatorIds.find((id) => {
        const rule = tableRules[id];
        return (
            rule.entities.includes(result.entity) &&
            rule.annotation === result.annotation &&
            rule.content.includes(result.content)
        );
    });
}

export function fieldValue(row: Record<string, unknown>, field: FieldSpec): unknown {
    for (const path of field.paths) {
        let value: unknown = row;
        for (const key of path.split("."))
            value =
                value !== null && typeof value === "object" && !Array.isArray(value)
                    ? (value as Record<string, unknown>)[key]
                    : undefined;
        if (value != null) return value;
    }
    return null;
}

export function traitLabels(value: unknown): string[] {
    if (value === null || typeof value !== "object" || Array.isArray(value))
        throw new Error("Traits must be grouped ontology terms");
    return Object.entries(value).flatMap(([context, terms]) => {
        if (!Array.isArray(terms)) throw new Error("Trait groups must contain lists");
        return terms.map((term: unknown) => {
            if (!term || typeof term !== "object" || Array.isArray(term)) throw new Error("Invalid trait term");
            const entry = term as Record<string, unknown>;
            const label = entry.term ?? entry.id;
            if (typeof label !== "string") throw new Error("Trait term requires a label or identifier");
            return `${context}: ${label}`;
        });
    });
}

export function validateRows(result: ResultSet, id: TableTranslatorId): void {
    for (const row of result.rows) {
        for (const field of tableRules[id].fields) {
            const value = fieldValue(row, field);
            if (value === null) {
                if (field.required) throw new Error(`Missing required field ${field.id}`);
                continue;
            }
            let valid: boolean;
            if (field.projection === "traits") {
                traitLabels(value);
                continue;
            } else if (field.projection === "text_list")
                valid = Array.isArray(value) && value.every((v) => typeof v === "string");
            else if (["text", "link", "pvalue"].includes(field.type)) valid = typeof value === "string";
            else if (field.type === "boolean") valid = typeof value === "boolean";
            else
                valid =
                    typeof value === "number" &&
                    Number.isFinite(value) &&
                    (field.type !== "integer" || Number.isInteger(value));
            if (!valid) throw new Error(`Invalid value for ${field.id}`);
            if (field.id === "num_associations" && (value as number) < 0)
                throw new Error("Association counts must be nonnegative integers");
        }
    }
}

export function validateSelection(result: ResultSet, panel: Presentation): TableTranslatorId {
    if (panel.result_id !== result.id) throw new Error("Unknown result reference");
    const id = tableTranslator(result);
    if (!id) throw new Error("No registered translator supports this result");
    validateRows(result, id);
    const fields = tableRules[id].fields;
    if (panel.translator === "category_counts_bar") {
        if (!fields.some((f) => f.categorical && f.id === panel.parameters.group_by))
            throw new Error("Grouping field is not registered for this result");
    } else if (panel.translator === "association_counts_bar") {
        if (id !== "association_counts_table") throw new Error("Bar requires an association summary");
    } else {
        if (panel.translator !== id) throw new Error("Table translator is incompatible with this result");
        const columns = panel.parameters.columns;
        if (columns) {
            if (new Set(columns).size !== columns.length || columns.some((id) => !fields.some((f) => f.id === id)))
                throw new Error("Columns must be unique registered fields");
            if (fields.some((f) => f.required && !columns.includes(f.id)))
                throw new Error("Required identifier columns cannot be hidden");
        }
    }
    return id;
}
