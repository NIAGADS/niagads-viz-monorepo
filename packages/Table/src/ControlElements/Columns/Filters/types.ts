import { Column } from "@tanstack/react-table";

export interface RowValueSummary {
    counts: Record<string, number>; // value: count mapping
    otherValues: string[]; // list of any values consolidated into "Other"
}

export interface FilterColumn {
    column: Column<any, unknown>;
}

export interface FilterProps extends FilterColumn {
    referenceValues: RowValueSummary;
    filteredValues: RowValueSummary;
    showLabel?: boolean;
}

// topic filters may combine values across multiple columns
export interface TopicFilterProps extends Omit<FilterProps, "column"> {
    columns: Column<any, unknown>[];
}
