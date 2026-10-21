import type { TableColumn, TableConfig, TableCell } from "@niagads/table";
import type { Presentation, ResultSet, TablePresentation } from "../contracts.ts";
import { fieldValue, tableRules, traitLabels, validateSelection } from "./registry.ts";

const DECIMAL_PVALUE = /^\+?(\d*\.?\d+)(?:e([+-]?\d+))?$/i;

function normalizedPvalue(input: unknown) {
    const match = String(input).match(DECIMAL_PVALUE);
    if (!match) throw new Error("Invalid reported p-value for numeric sorting");
    const [integer, fraction = ""] = match[1].split(".");
    const digits = (integer + fraction).replace(/^0+/, "").replace(/0+$/, "");
    const exponent = BigInt(match[2] ?? "0") + BigInt(integer.length) - BigInt((integer + fraction).search(/[1-9]/));
    return { digits, exponent };
}

/** Compare scientific decimal strings without floating-point underflow. */
export function comparePvalues(a: unknown, b: unknown): number {
    if (a == null || a === "n/a") return b == null || b === "n/a" ? 0 : 1;
    if (b == null || b === "n/a") return -1;
    const x = normalizedPvalue(a),
        y = normalizedPvalue(b);
    if (!x.digits || !y.digits) return !x.digits ? (!y.digits ? 0 : -1) : 1;
    if (x.exponent !== y.exponent) return x.exponent > y.exponent ? 1 : -1;
    return x.digits === y.digits ? 0 : x.digits > y.digits ? 1 : -1;
}

export function translateTable(result: ResultSet, panel: TablePresentation): TableConfig {
    const id = validateSelection(result, panel);
    const allFields = tableRules[id].fields;
    const fields = panel.parameters.columns
        ? panel.parameters.columns.map((id) => allFields.find((f) => f.id === id)!)
        : allFields;
    const columns: TableColumn[] = fields.map((field) => {
        const column: TableColumn = {
            id: field.id,
            header: field.header,
            type: field.type,
            required: field.required,
            disableColumnFilter: !field.categorical,
            filterOpts: field.categorical ? { filterType: field.type === "boolean" ? "boolean" : "pie" } : undefined,
        };
        if (field.type === "pvalue") {
            column.disableSorting = result.rows.some((row) => {
                const value = fieldValue(row, field);
                return value !== null && !DECIMAL_PVALUE.test(String(value));
            });
            column.sortingFn = (a, b, id) => comparePvalues(a.getValue(id), b.getValue(id));
            column.description = column.disableSorting
                ? "Reported p-value text is preserved. Use the separate −log10(p) column for numeric sorting."
                : "Reported p-value text is preserved; numeric sorting supports scientific notation.";
        }
        if (field.id === "score")
            column.description = "Semantic similarity is a search score, not association significance.";
        return column;
    });
    const data = result.rows.map((row) =>
        Object.fromEntries(
            fields.map((field): [string, TableCell | TableCell[]] => {
                const value = fieldValue(row, field);
                if (value === null) return [field.id, null];
                if (field.projection === "traits") return [field.id, traitLabels(value)];
                if (field.type === "link") {
                    const url = new URL(value as string);
                    if (!["https:", "http:", "ftp:"].includes(url.protocol))
                        throw new Error("Unsupported download URL scheme");
                    return [field.id, { value, url: value }];
                }
                return [field.id, value as TableCell];
            })
        )
    );
    return {
        id: `${result.id}-${panel.translator}`,
        columns,
        data,
        options: { enableExport: true, enableColumnFilters: true },
    };
}

type BarPresentation = Exclude<Presentation, TablePresentation>;
export type TranslatedBar = {
    data: { term: string; count: number }[];
    scope: string;
    showChart: boolean;
    notice?: string;
    table: TableConfig;
};

export function translateBar(result: ResultSet, panel: BarPresentation, maxCategories: number): TranslatedBar {
    const id = validateSelection(result, panel);
    let data: TranslatedBar["data"];
    let scope: string;
    if (panel.translator === "association_counts_bar") {
        data = result.rows.map((row) => ({ term: row.track as string, count: row.num_associations as number }));
        scope = "Association counts from the returned API summary; this page may contain only some tracks.";
    } else {
        const field = tableRules[id].fields.find((f) => f.id === panel.parameters.group_by)!;
        const counts = new Map<string | null, number>();
        for (const row of result.rows) {
            const value = fieldValue(row, field);
            const key = value === null ? null : String(value);
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        let missingLabel = "Missing";
        while (counts.has(missingLabel)) missingLabel += " (missing)";
        data = Array.from(counts, ([key, count]) => ({ term: key === null ? missingLabel : key, count }));
        scope = `${field.header}: counts of loaded records, independent of table filters; not database totals.`;
    }
    const table: TableConfig = {
        id: `${result.id}-${panel.translator}-counts`,
        columns: [
            {
                id: "term",
                header: panel.translator === "association_counts_bar" ? "Track" : "Category",
                type: "text",
                required: true,
                disableColumnFilter: true,
            },
            {
                id: "count",
                header: panel.translator === "association_counts_bar" ? "Associations" : "Loaded records",
                type: "integer",
                disableColumnFilter: true,
            },
        ],
        data,
        options: { enableExport: true },
    };
    return {
        data,
        scope,
        table,
        showChart: data.length > 0 && data.length <= maxCategories,
        notice:
            data.length > maxCategories
                ? `This result has ${data.length} categories; the bar limit is ${maxCategories}. All counts remain in the table.`
                : undefined,
    };
}
