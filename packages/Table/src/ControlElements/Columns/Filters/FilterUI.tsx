import { Alert, Badge, Checkbox } from "@niagads/ui";
import { PieChart, PieChartDataRow, RangeSelectHistogram, ThresholdSelectHistogram } from "@niagads/charts";
import { Range, negLog10 } from "@niagads/common";
import React, { ReactNode, useCallback, useMemo } from "react";

import { Column } from "@tanstack/react-table";
import { DEFAULT_NA_VALUE } from "../../../types";
import { RichSelect } from "@niagads/ui/client";
import styles from "./filter.module.css";

export const NUMERIC_CELL_TYPES = ["float", "integer", "pvalue", "percentage_cell"];
const MAX_FILTER_CATEGORIES = 7;

interface RowValueSummary {
    counts: Record<string, number>; // value: count mapping
    otherValues: string[]; // list of any values consolidated into "Other"
}

interface FilterProps {
    column: Column<any, unknown>;
}

interface TextFilterProps extends FilterProps {
    column: Column<any, unknown>;
    referenceValues: RowValueSummary;
    filteredValues: RowValueSummary;
}

interface MultiSelectPillFilterProps extends TextFilterProps {
    showLabel?: boolean;
}

const NoValidValuesMessage = ({ columnName }: { columnName: string }) => (
    <Alert variant="info" message={columnName}>
        <p>Cannot filter on this column: all values are N/A.</p>
    </Alert>
);

const __resolveTextFilterValue = (value: string | undefined, otherValues: string[]) => {
    if (value === undefined) {
        return value;
    }

    if (value === "Other") {
        return otherValues;
    }

    return [value];
};

/**
 * Sorts and organizes unique values for filter display, handling overflow by grouping into "Other"
 *
 * @param {string} naValue - The N/A value representation
 * @param {Map<string, number>} valueCounts - Map of unique values and their counts
 * @returns {RowValueSummary} Object with sorted value/count map and list of values grouped as "other"
 */
const _organizeValueCounts = (valueCounts: Map<string, number>, naValue: string): RowValueSummary => {
    let filteredValueCounts: Record<string, number> = {};
    let otherValues: string[] = [];

    // consolidate values if there are too many into "Other"
    if (valueCounts.size > MAX_FILTER_CATEGORIES) {
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

        filteredValueCounts = Object.fromEntries(topEntries.sort(([a], [b]) => a.localeCompare(b)));

        filteredValueCounts.Other = otherEntries.count;
        otherValues = otherEntries.values;
    } else {
        // count
        filteredValueCounts = Object.keys(Object.fromEntries(valueCounts))
            .filter((key) => key !== naValue)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = valueCounts.get(key)!;
                    return acc;
                },
                {} as Record<string, number>
            );
    }

    // add NAs back in if relevant
    const naCount = valueCounts.get(naValue) || 0;
    if (naCount > 0) {
        filteredValueCounts[naValue] = naCount;
    }

    return { counts: filteredValueCounts, otherValues: otherValues };
};

const PieChartFilter = ({ column, referenceValues, filteredValues }: TextFilterProps) => {
    const referenceChartData: PieChartDataRow[] = useMemo(
        () =>
            Object.entries(referenceValues.counts).map(([key, count]) => ({
                id: key,
                value: count,
            })),
        [column.id]
    );

    // need to build same object for filtered data (inner pie), but
    // ensure that the order of the fields is the same
    const filteredChartData: PieChartDataRow[] = useMemo(() => {
        const referenceOrder = Object.keys(referenceValues.counts);
        return Object.entries(filteredValues.counts)
            .sort(([keyA], [keyB]) => {
                const indexA = referenceOrder.indexOf(keyA);
                const indexB = referenceOrder.indexOf(keyB);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return 0;
            })
            .map(([key, count]) => ({
                id: key,
                value: count,
            }));
    }, [column.id, filteredValues.counts]);

    return (
        <PieChart
            title={column.columnDef.header!.toString()}
            data={filteredChartData}
            referenceData={referenceChartData}
            legendPosition="right"
            onClick={(v: string) => column.setFilterValue(__resolveTextFilterValue(v, referenceValues.otherValues))}
            displayOpts={{ width: 200 }}
            preserveSliceOrder={true}
        />
    );
};

const RichSelectFilter = ({ column, referenceValues, filteredValues }: TextFilterProps) => {
    const opts = useMemo(() => {
        return Object.entries(filteredValues.counts).reduce(
            (acc, [value, count]) => {
                acc[value] = <Badge style={{ fontSize: "0.75rem" }}>{count}</Badge>;
                return acc;
            },
            {} as Record<string, ReactNode>
        );
    }, [filteredValues]);

    return (
        <RichSelect
            label={column.columnDef.header!.toString()}
            placeholder="Select ..."
            options={opts}
            onChange={(v) => column.setFilterValue(__resolveTextFilterValue(v, referenceValues.otherValues))}
        />
    );
};

const MultiSelectPillFilter = ({
    column,
    referenceValues,
    filteredValues,
    showLabel = true,
}: MultiSelectPillFilterProps) => {
    const otherValues = useMemo(() => referenceValues.otherValues, [column.id]);
    const resolveFilterValue = useCallback(
        (newFilterValues: string[]) => {
            if (newFilterValues.length > 0) {
                if (newFilterValues.includes("Other")) {
                    const adjustedFilterValues = newFilterValues.filter((v) => v !== "Other");
                    return [...adjustedFilterValues, ...otherValues];
                }

                return newFilterValues;
            }

            return undefined;
        },
        [column.id]
    );

    const opts = useMemo(() => {
        return Object.entries(filteredValues.counts).reduce(
            (acc, [value, count]) => {
                acc[value] = count;
                return acc;
            },
            {} as Record<string, number>
        );
    }, [filteredValues]);

    // determine which options are currently "selected/checked"
    const optionKeys = Object.keys(opts);
    const filterValues = (column.getFilterValue() as string[]) || [];
    const filterValuesIncludeOther = filterValues.some((item) => otherValues.includes(item));

    let selectedValues = filterValues.filter((item) => !otherValues.includes(item)) || [];
    if (filterValuesIncludeOther) {
        selectedValues.push("Other");
    }

    const label = column.columnDef.header!.toString();

    return (
        <div className={styles["filter-pill-container"]}>
            {showLabel && <div className={styles["filter-field-label"]}>{label}</div>}

            <div className={styles["filter-pill-grid"]}>
                {optionKeys.map((optionKey) => {
                    const isSelected = selectedValues.includes(optionKey);
                    const newValues = isSelected
                        ? selectedValues.filter((v) => v !== optionKey)
                        : [...selectedValues, optionKey];

                    return (
                        <button
                            key={optionKey}
                            type="button"
                            className={[styles["filter-pill"], isSelected && styles["filter-pill-selected"]]
                                .filter(Boolean)
                                .join(" ")}
                            aria-pressed={isSelected}
                            onClick={() => column.setFilterValue(resolveFilterValue(newValues))}
                        >
                            <span className={styles["filter-pill-icon"]}>{isSelected ? "✓" : "+"}</span>
                            <span className={styles["filter-pill-label"]}>{optionKey}</span>
                            <span className={styles["filter-pill-count"]}>{opts[optionKey]}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const BooleanFilter = ({ column, referenceValues, filteredValues }: Omit<TextFilterProps, "otherValues">) => {
    const meta = column.columnDef.meta!;
    const trueValue = meta.trueValue ? meta.trueValue.toString() : "true";
    const label = column.columnDef.header!.toString();
    const filterValue = column.getFilterValue();
    const trueCount = filteredValues.counts[trueValue] || 0;

    return (
        <div className={styles["filter-boolean-container"]}>
            <div className={styles["filter-boolean-item"]}>
                <Checkbox
                    name={`${column.id}-boolean`}
                    checked={filterValue === trueValue}
                    onChange={(e) => {
                        column.setFilterValue(e.target.checked ? trueValue : undefined);
                    }}
                />
                <span className={styles["filter-boolean-value"]}>{label}</span>
                <Badge className={styles["filter-boolean-count"]}>{trueCount}</Badge>
            </div>
        </div>
    );
};

const NumericFilter = ({ column }: FilterProps) => {
    const naValue = column.columnDef.meta?.naValue || DEFAULT_NA_VALUE;
    const isPvalue: boolean = column.columnDef.meta!.type === "pvalue";

    const referenceData = useMemo(() => {
        // filter out nulls
        const values = isPvalue
            ? (column.getAllValues(true, naValue) as number[]).map((v) => negLog10(v))
            : (column.getAllValues(true, naValue) as number[]);

        const rd = {
            values: values,
            range:
                values.length > 0
                    ? {
                          min: Math.min(...values),
                          max: Math.max(...values),
                      }
                    : undefined,
        };
        return rd;
    }, [column.id]);

    let filterValue: any = column.getFilterValue();
    if (filterValue === undefined) {
        filterValue = isPvalue ? referenceData.range!.min : referenceData.range;
    }

    const handleRangeFilter = useCallback(
        (range: Range) => {
            if (isPvalue) {
                const threshold = range.min; //Math.pow(10, -range.min);
                column.setFilterValue(threshold);
            } else {
                // TODO / FIXME: create a filterFn that takes a range
                column.setFilterValue(range);
            }
        },
        [column.id]
    );

    const title = column.columnDef.header!.toString();

    const displayOpts = { width: 250 };

    if (referenceData.range) {
        const filteredValues: number[] = isPvalue
            ? (column.getFilteredValues(true, naValue) as number[]).map((v) => negLog10(v))
            : (column.getFilteredValues(true, naValue) as number[]);

        if (isPvalue) {
            return (
                <ThresholdSelectHistogram
                    limit={filterValue as number}
                    limitType={"max"}
                    onRangeSelect={handleRangeFilter}
                    data={referenceData.values}
                    overlayData={filteredValues}
                    numBins={50}
                    title={title}
                    max={50}
                    displayOpts={displayOpts}
                    yAxisScale="log10"
                />
            );
        }

        return (
            <RangeSelectHistogram
                range={filterValue}
                onRangeSelect={handleRangeFilter}
                data={referenceData.values}
                numBins={50}
                title={title}
                overlayData={filteredValues}
                displayOpts={displayOpts}
            />
        );
    }

    return <NoValidValuesMessage columnName={column.columnDef.header!.toString()} />;
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
 * @param {FilterProps} props - The component props
 * @param {Column} props.column - The TanStack React Table column instance containing:
 * @returns {ReactNode} A filter UI component appropriate for the column type
 */
const Filter = ({ column }: FilterProps) => {
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
        return <NoValidValuesMessage columnName={column.columnDef.header!.toString()} />;
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

    if (meta.type === "boolean") {
        return <BooleanFilter column={column} referenceValues={referenceValues} filteredValues={filteredValues} />;
    }

    if (meta.filterType === "pie") {
        return <PieChartFilter column={column} referenceValues={referenceValues} filteredValues={filteredValues} />;
    }

    if (meta.filterType === "multiselect") {
        return (
            <MultiSelectPillFilter column={column} referenceValues={referenceValues} filteredValues={filteredValues} />
        );
    }

    return <RichSelectFilter column={column} referenceValues={referenceValues} filteredValues={filteredValues} />;
};

export default Filter;
