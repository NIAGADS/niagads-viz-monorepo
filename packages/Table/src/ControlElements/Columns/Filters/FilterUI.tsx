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
    otherValues: string[]; // array of values that make up the "Other" if exists
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
    } else {
        return [value];
    }
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
            placeholder={"Select ..."}
            options={opts}
            onChange={(v) => column.setFilterValue(__resolveTextFilterValue(v, otherValues))}
        />
    );
};

const CheckBoxFilter = ({ column, values, otherValues }: TextFilterProps) => {
    const resolveFilterValue = useCallback(
        (newFilterValues: string[]) => {
            if (newFilterValues.length > 0) {
                if (newFilterValues.includes("Other")) {
                    let adjustedFilterValues: string[] = newFilterValues.filter((v) => v !== "Other");
                    return [...adjustedFilterValues, ...otherValues];
                }
                return newFilterValues;
            } else {
                return undefined;
            }
        },
        [otherValues]
    );
    const opts = useMemo(() => {
        return Object.entries(values).reduce(
            (acc, [value, count]) => {
                acc[value] = <Badge style={{ fontSize: "0.75rem" }}>{count}</Badge>;
                return acc;
            },
            {} as Record<string, ReactNode>
        );
    }, [values]);

    const optionKeys = Object.keys(opts);
    const filterValues = column.getFilterValue() as string[];
    const filterValuesIncludeOther = filterValues.some((item) => otherValues.includes(item));
    let selectedValues = filterValues.filter((item) => !otherValues.includes(item)) || [];
    if (filterValuesIncludeOther) {
        selectedValues.push("Other");
    }
    const label: string = column.columnDef.header!.toString();

    return (
        <>
            <div>{label}</div>
            <div className={styles["filter-checkbox-grid"]}>
                {optionKeys.map((optionKey) => (
                    <div key={optionKey} className={styles["filter-checkbox-item"]}>
                        <Checkbox
                            name={`${column.id}-${optionKey}`}
                            checked={selectedValues.includes(optionKey)}
                            onChange={(e) => {
                                const newValues = e.target.checked
                                    ? [...selectedValues, optionKey]
                                    : selectedValues.filter((v) => v !== optionKey);
                                column.setFilterValue(resolveFilterValue(newValues));
                            }}
                        />
                        <span className={styles["filter-checkbox-label"]}>{optionKey}</span>
                        {opts[optionKey]}
                    </div>
                ))}
            </div>
        </>
    );
};

const BooleanFilter = ({ column, values }: Omit<TextFilterProps, "otherValues">) => {
    const meta = column.columnDef.meta!;
    const trueValue = meta.trueValue ? meta.trueValue.toString() : "true";
    const label: string = column.columnDef.header!.toString();
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
    const handleRangeFilter = (range: Range) => {
        if (isPvalue) {
            const threshold = Math.pow(10, -range.min);
            column.setFilterValue(threshold);
        } else {
            // TODO / FIXME: create a filterFn that takes a range
            column.setFilterValue(range);
        }
    };
    const dataRange = column.getFacetedMinMaxValues();
    const title = column.columnDef.header!.toString();
    if (dataRange) {
        if (isPvalue) {
            const values: number[] = (column.getAllValues(true, naValue) as number[]).map((v) => negLog10(v));
            return (
                <ThresholdSelectHistogram
                    limit={7}
                    limitType={"max"}
                    onRangeSelect={handleRangeFilter}
                    data={values}
                    numBins={50}
                    title={title}
                    max={50}
                    displayOpts={{ width: 250 }}
                />
            );
        } else {
            const values: number[] = column.getAllValues(true, naValue) as number[];

            return (
                <RangeSelectHistogram
                    range={{ min: dataRange[0], max: dataRange[1] }}
                    onRangeSelect={handleRangeFilter}
                    data={values}
                    numBins={50}
                    title={title}
                    displayOpts={{ width: 250 }}
                />
            );
        }
    }
    return <NoValidValuesMessage columnName={column.columnDef.header!.toString()} />;
};

const Filter = ({ column }: FilterProps) => {
    const meta = column.columnDef.meta!;

    if (NUMERIC_CELL_TYPES.includes(meta.type)) {
        return <NumericFilter column={column} />;
    }

    const uniqueValues: Map<string, number> = column.getFacetedUniqueValues();

    // quick check if only NAs are left
    const naValue = meta.naValue || DEFAULT_NA_VALUE;
    const naCount: number = uniqueValues.get(naValue) || 0;
    // if only NAs, no further action needed
    if (naCount && uniqueValues.size == 1) {
        return <NoValidValuesMessage columnName={column.columnDef.header!.toString()} />;
    }

    // otherwise dealing w/some sort of text/categorical data
    // sort the unique values by counts,
    // accounting for NA and realistic display limits
    // defaults always to RichSelect unless user overrides
    const { sortedValueHash: sortedUniqueValues, otherValueList: otherValues } = useMemo(() => {
        if (naCount > 0) {
            uniqueValues.delete(naValue);
        }

        // Truncate to MAX_FILTER_CATEGORIES and collapse residuals into "Other"
        let sortedValueHash: Record<string, number> = {};
        let otherValueList: string[] = [];
        if (uniqueValues.size > MAX_FILTER_CATEGORIES) {
            const topEntryHash: Record<string, number> = {};
            const sortedEntries = [...uniqueValues.entries()].sort((a, b) => b[1] - a[1]);
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

            // sort resultHash by value, alphabetically
            sortedValueHash = Object.keys(topEntryHash)
                .sort()
                .reduce(
                    (acc, key) => {
                        acc[key] = topEntryHash[key];
                        return acc;
                    },
                    {} as Record<string, number>
                );
            sortedValueHash["Other"] = otherCount;
        } else {
            sortedValueHash = Object.keys(Object.fromEntries(uniqueValues))
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
        return <CheckBoxFilter column={column} values={sortedUniqueValues} otherValues={otherValues} />;
    }

    return <RichSelectFilter column={column} values={sortedUniqueValues} otherValues={otherValues} />;
};

export default Filter;
