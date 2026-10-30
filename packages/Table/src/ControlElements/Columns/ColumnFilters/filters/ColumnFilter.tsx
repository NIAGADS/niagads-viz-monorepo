import {
    BooleanFilter,
    MultiSelectPillFilter,
    NUMERIC_CELL_TYPES,
    NoValidValueAlert,
    NumericFilter,
    PieChartFilter,
    RichSelectFilter,
} from ".";
import { FilterColumn, RowValueSummary } from "./types";
import React, { useMemo } from "react";

import { DEFAULT_NA_VALUE } from "../../../../types";

const MAX_FILTER_CATEGORIES = 7;

/**
 * Sorts and organizes unique values for filter display, handling overflow by grouping into "Other"
 *
 * @param naValue - The N/A value representation
 * @param valueCounts - Map of unique values and their counts
 * @returns Object with sorted value/count map and list of values grouped as "other"
 */
const _organizeValueCounts = (valueCounts: Map<string, number>, naValue: string): RowValueSummary => {
    let filteredValueCounts: Record<string, number> = {};
    let otherValues: string[] = [];

    // consolidate values if there are too many into "Other"
    if (valueCounts.size > MAX_FILTER_CATEGORIES) {
        // sort by most frequent to least frequent values; filtering for n/as
        const sortedEntries = [...valueCounts.entries()]
            .filter(([value]) => value !== naValue)
            .sort((a, b) => b[1] - a[1]);

        const topEntries = sortedEntries.slice(0, MAX_FILTER_CATEGORIES - 1);
        const otherEntries = sortedEntries.slice(MAX_FILTER_CATEGORIES - 1).reduce(
            (acc, [value, count]) => ({
                values: [...acc.values, value],
                count: acc.count + count,
            }),
            { values: [] as string[], count: 0 }
        );

        filteredValueCounts = Object.fromEntries(topEntries);

        filteredValueCounts.Other = otherEntries.count;
        otherValues = otherEntries.values;
    } else {
        const sortedEntries = [...valueCounts.entries()]
            .filter(([value]) => value !== naValue)
            .sort((a, b) => b[1] - a[1]);

        filteredValueCounts = Object.fromEntries(sortedEntries);
    }

    // add NAs back in if relevant
    const naCount = valueCounts.get(naValue) || 0;
    if (naCount > 0) {
        filteredValueCounts[naValue] = naCount;
    }

    return { counts: filteredValueCounts, otherValues: otherValues };
};

/**
 * Renders an appropriate filter UI component based on the column's data type and metadata.
 *
 * For categorical columns with too many unique values (> MAX_FILTER_CATEGORIES):
 * - Keeps the top  categories sorted alphabetically by count (descending)
 * - Groups remaining categories under an "Other" option
 * - The otherValues array tracks which actual values are grouped under "Other"
 * - This allows the filter to correctly expand "Other" back to its constituent values
 *
 * Special handling for N/A values:
 * - N/A values are tracked separately and always displayed
 * - If only N/A values exist before filtering, shows a message prompting adjustment of other filters
 *
 * @param props - The component props
 * @param props.column - The TanStack React Table column instance containing:
 * @returns A filter UI component appropriate for the column type
 */
const ColumnFilter = ({ column }: FilterColumn) => {
    const meta = column.columnDef.meta!;
    const naValue = meta.naValue || DEFAULT_NA_VALUE;

    if (NUMERIC_CELL_TYPES.includes(meta.type)) {
        return <NumericFilter column={column} />;
    }

    // get "reference" unique values -> all possible values in pre-filtered data
    const valueCounts: Map<string, number> = useMemo(() => column.getUniqueValues(), [column.id]);
    const naCount = valueCounts.get(naValue) || 0;

    // return No Valid Values if every value in the unfiltered column is NA
    if (naCount && valueCounts.size === 1) {
        return <NoValidValueAlert columnName={column.columnDef.header!.toString()} />;
    }

    // otherwise, sort and consolidate the value map
    const referenceValues = useMemo(() => {
        return _organizeValueCounts(valueCounts, naValue);
    }, [column.id]);

    // get faceted values and do the same
    const filteredValueCount = column.getFacetedUniqueValues();
    const filteredValues = useMemo(() => {
        return _organizeValueCounts(filteredValueCount, naValue);
    }, [Array.from(filteredValueCount.entries())]);

    const FilterProps = { column, referenceValues, filteredValues };

    if (meta.type === "boolean") {
        return <BooleanFilter {...FilterProps} />;
    }

    if (meta.filterType) {
        if (meta.filterType === "pie") {
            return <PieChartFilter {...FilterProps} />;
        }

        if (meta.filterType === "multiselect" || meta.filterType === "topics") {
            return <MultiSelectPillFilter {...FilterProps} />;
        }
    }

    return <RichSelectFilter {...FilterProps} />;
};

export default ColumnFilter;
