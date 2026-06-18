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

    const displayOpts = { width: "100%", aspectRatio: 0.6 };

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

    const { sortedValueHash: sortedUniqueValues, otherValueList: otherValues } = useMemo(() => {
        const validEntries = [...uniqueValues.entries()].filter(([value]) => value !== naValue);

        let sortedValueHash: Record<string, number> = {};
        let otherValueList: string[] = [];

       if (validEntries.length > MAX_FILTER_CATEGORIES) {
            const topEntryHash: Record<string, number> = {};
            const sortedEntries = validEntries.sort((a, b) => b[1] - a[1]);
            const topEntries = sortedEntries.slice(0, MAX_FILTER_CATEGORIES - 1);

            const { otherValueList: otherVals, otherCount } = sortedEntries.slice(MAX_FILTER_CATEGORIES - 1).reduce(
                (acc, [value, count]) => ({
                    otherValueList: [...acc.otherValueList, value],
                    otherCount: acc.otherCount + count,
                }),
                { otherValueList: [] as string[], otherCount: 0 }
            );

            otherValueList = otherVals;

            topEntries.forEach(([value, count]) => {
                topEntryHash[value] = count;
            });

            sortedValueHash = Object.keys(topEntryHash)
                .sort()
                .reduce(
                    (acc, key) => {
                        acc[key] = topEntryHash[key];
                        return acc;
                    },
                    {} as Record<string, number>
                );

            sortedValueHash.Other = otherCount;
        } else {
            sortedValueHash = validEntries
                .map(([value]) => value)
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
            sortedValueHash[naValue] = naCount;
        }

        return { sortedValueHash, otherValueList };
    }, [Array.from(uniqueValues.entries())]);

    if (meta.type === "boolean") {
        return <BooleanFilter column={column} values={sortedUniqueValues} />;
    }

    if (meta.filterType === "pie") {
        return <PieChartFilter column={column} values={sortedUniqueValues} otherValues={otherValues} />;
    }

    if (meta.filterType === "multiselect") {
        return <MultiSelectPillFilter column={column} values={sortedUniqueValues} otherValues={otherValues} />;
    }

    return <RichSelectFilter column={column} values={sortedUniqueValues} otherValues={otherValues} />;
};

export default Filter;
