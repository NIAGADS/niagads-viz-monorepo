import { recordAdapters } from "./records.ts";
import type { ResultSet } from "../contracts.ts";

export type PresentationData = Pick<ResultSet, "id" | "entity" | "annotation" | "content" | "rows">;

export type TableTranslatorId = keyof typeof recordAdapters;
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
export const tableRules: Record<TableTranslatorId, TableRule> = recordAdapters;
export const tableTranslatorIds = Object.keys(tableRules) as [TableTranslatorId, ...TableTranslatorId[]];

export function tableTranslator(
    result: Pick<ResultSet, "entity" | "annotation" | "content">
): TableTranslatorId | undefined {
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

export function validateRows(result: Pick<ResultSet, "rows">, id: TableTranslatorId): void {
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
