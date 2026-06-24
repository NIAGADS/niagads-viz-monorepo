import { Alert, Badge, Checkbox } from "@niagads/ui";
import { PieChart, PieChartDataRow, RangeSelectHistogram, ThresholdSelectHistogram } from "@niagads/charts";
import { Range, negLog10 } from "@niagads/common";
import React, { ReactNode, useCallback, useMemo } from "react";

import { Column } from "@tanstack/react-table";
import { DEFAULT_NA_VALUE } from "../../../types";
import { Key } from "lucide-react";
import { RichSelect } from "@niagads/ui/client";
import styles from "./filter.module.css";

export const NUMERIC_CELL_TYPES = ["float", "integer", "pvalue", "percentage_cell"];
const MAX_FILTER_CATEGORIES = 7;

interface FilterProps {
    column: Column<any, unknown>;
}

interface TextFilterProps extends FilterProps {
    column: Column<any, unknown>;
    values: Record<string, number>;
    otherValues: string[];
}

interface MultiSelectPillFilterProps extends TextFilterProps {
    showLabel?: boolean;
}

const NoValidValuesMessage = ({ columnName }: { columnName: string }) => (
    <Alert variant="info" message={columnName}>
        <p>Only N/A values remain. Adjust other filters to see valid options for this column.</p>
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

const PieChartFilter = ({ column, values, otherValues }: TextFilterProps) => {
    const referenceChartData: PieChartDataRow[] = useMemo(() => {
        const naValue = column.columnDef.meta?.naValue || DEFAULT_NA_VALUE;
        const uniqueValues: Map<string, number> = column.getAllFacetedUniqueValues(true, naValue);
        const naCount = uniqueValues.get(naValue) || 0;
        return Object.entries(sortFacetedValues(naCount, naValue, uniqueValues).facets).map(([key, count]) => ({
            id: key,
            value: count,
        }));
    }, [column.id]);

    const chartData: PieChartDataRow[] = useMemo(
        () =>
            Object.entries(values).map(([key, count]) => ({
                id: key,
                value: count,
            })),
        [values]
    );

    return (
        <PieChart
            title={column.columnDef.header!.toString()}
            referenceData={referenceChartData}
            data={chartData}
            legendPosition="right"
            onClick={(v: string) => column.setFilterValue(__resolveTextFilterValue(v, otherValues))}
            displayOpts={{ width: 200 }}
        />
    );
};

const RichSelectFilter = ({ column, values, otherValues }: TextFilterProps) => {
    const opts = useMemo(() => {
        return Object.entries(values).reduce(
            (acc, [value, count]) => {
                acc[value] = <Badge style={{ fontSize: "0.75rem" }}>{count}</Badge>;
                return acc;
            },
            {} as Record<string, ReactNode>
        );
    }, [values]);

    return (
        <RichSelect
            label={column.columnDef.header!.toString()}
            placeholder="Select ..."
            options={opts}
            onChange={(v) => column.setFilterValue(__resolveTextFilterValue(v, otherValues))}
        />
    );
};

const MultiSelectPillFilter = ({ column, values, otherValues, showLabel = true }: MultiSelectPillFilterProps) => {
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
        [otherValues]
    );

    const opts = useMemo(() => {
        return Object.entries(values).reduce(
            (acc, [value, count]) => {
                acc[value] = count;
                return acc;
            },
            {} as Record<string, number>
        );
    }, [values]);

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

const BooleanFilter = ({ column, values }: Omit<TextFilterProps, "otherValues">) => {
    const meta = column.columnDef.meta!;
    const trueValue = meta.trueValue ? meta.trueValue.toString() : "true";
    const label = column.columnDef.header!.toString();
    const filterValue = column.getFilterValue();
    const trueCount = values[trueValue] || 0;

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
 * Sorts and organizes unique values for filter display, handling overflow by grouping into "Other"
 *
 * @param {number} naCount - Count of N/A values
 * @param {string} naValue - The N/A value representation
 * @param {Map<string, number>} uniqueValues - Map of unique values and their counts
 * @returns {Object} Object with sorted faceted values and list of values grouped as "other"
 */
const sortFacetedValues = (
    naCount: number,
    naValue: string,
    uniqueValues: Map<string, number>
): { facets: Record<string, number>; other: string[] } => {
    if (naCount > 0) {
        uniqueValues.delete(naValue);
    }

    let facets: Record<string, number> = {};
    let otherValues: string[] = [];

    if (uniqueValues.size > MAX_FILTER_CATEGORIES) {
        const topEntryHash: Record<string, number> = {};
        const sortedEntries = [...uniqueValues.entries()].sort((a, b) => b[1] - a[1]);
        const topEntries = sortedEntries.slice(0, MAX_FILTER_CATEGORIES - 1);

        const otherEntries = sortedEntries.slice(MAX_FILTER_CATEGORIES - 1).reduce(
            (acc, [value, count]) => ({
                values: [...acc.values, value],
                count: acc.count + count,
            }),
            { values: [] as string[], count: 0 }
        );

        topEntries.forEach(([value, count]) => {
            topEntryHash[value] = count;
        });

        facets = Object.keys(topEntryHash)
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = topEntryHash[key];
                    return acc;
                },
                {} as Record<string, number>
            );

        facets.Other = otherEntries.count;
        otherValues = otherEntries.values;
    } else {
        facets = Object.keys(Object.fromEntries(uniqueValues))
            .sort()
            .reduce(
                (acc, key) => {
                    acc[key] = uniqueValues.get(key)!;
                    return acc;
                },
                {} as Record<string, number>
            );
    }

    if (naCount > 0) {
        facets[naValue] = naCount;
    }

    return { facets: facets, other: otherValues };
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
 * - If only N/A values remain after filtering, shows a message prompting adjustment of other filters
 *
 * @param {FilterProps} props - The component props
 * @param {Column} props.column - The TanStack React Table column instance containing:
 * @returns {ReactNode} A filter UI component appropriate for the column type
 */
const Filter = ({ column }: FilterProps) => {
    const meta = column.columnDef.meta!;

    if (NUMERIC_CELL_TYPES.includes(meta.type)) {
        return <NumericFilter column={column} />;
    }

    const uniqueValues: Map<string, number> = column.getFacetedUniqueValues();
    const naValue = meta.naValue || DEFAULT_NA_VALUE;
    const naCount = uniqueValues.get(naValue) || 0;

    if (naCount && uniqueValues.size === 1) {
        return <NoValidValuesMessage columnName={column.columnDef.header!.toString()} />;
    }

    const facetedValues = useMemo(() => {
        return sortFacetedValues(naCount, naValue, uniqueValues);
    }, [Array.from(uniqueValues.entries())]);

    if (meta.type === "boolean") {
        return <BooleanFilter column={column} values={facetedValues.facets} />;
    }

    if (meta.filterType === "pie") {
        return <PieChartFilter column={column} values={facetedValues.facets} otherValues={facetedValues.other} />;
    }

    if (meta.filterType === "multiselect") {
        return (
            <MultiSelectPillFilter column={column} values={facetedValues.facets} otherValues={facetedValues.other} />
        );
    }

    return <RichSelectFilter column={column} values={facetedValues.facets} otherValues={facetedValues.other} />;
};

export default Filter;
