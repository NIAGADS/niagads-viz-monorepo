/* TODOs
- how to handle NAs
    - what to do when all values are NA (pre-filtered/post-filtered)
- what to do when all values are the same (pre-filtered/post-filtered)
- fitler ordering: charts, booleans, multiselect, select?
*/

import { ActionMenu, RichSelect } from "@niagads/ui/client";
import { Alert, Badge, Checkbox } from "@niagads/ui";
import { PieChart, PieChartDataRow, RangeSelectHistogram, ThresholdSelectHistogram } from "@niagads/charts";
import { Range, negLog10 } from "@niagads/common";
import React, { ReactNode, useEffect, useMemo } from "react";

import { Column } from "@tanstack/react-table";
import { DEFAULT_NA_VALUE } from "./Cell";
import { Filter as FilterIcon } from "lucide-react";
import styles from "./styles/filter.module.css";

const NUMERIC_CELL_TYPES = ["float", "integer", "pvalue", "percentage_cell"];
const MAX_FILTER_CATEGORIES = 7;

interface FilterProps {
    column: Column<any, unknown>;
}

interface TextFilterProps extends FilterProps {
    values: Record<string, number>;
}

const PieChartFilter = ({ column, values }: TextFilterProps) => {
    const chartData: PieChartDataRow[] = useMemo(
        () =>
            Object.entries(values).map(([key, count]) => ({
                id: key,
                value: count,
            })),
        [values]
    );
    return <PieChart data={chartData} legendPosition="bottom" onClick={(v) => column.setFilterValue(v)} />;
};

const RichSelectFilter = ({ column, values }: TextFilterProps) => {
    const opts = useMemo(() => {
        return Object.entries(values).reduce(
            (acc, [value, count]) => {
                acc[value] = <Badge style={{ fontSize: "0.75rem" }}>{count}</Badge>;
                return acc;
            },
            {} as Record<string, ReactNode>
        );
    }, [values]);
    const label: string = column.columnDef.header!.toString();
    return <RichSelect placeholder={label} options={opts} onChange={(v) => column.setFilterValue(v)} />;
};

const CheckBoxFilter = ({ column, values }: TextFilterProps) => {
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
    const selectedValues = (column.getFilterValue() as string[]) || [];
    const label: string = column.columnDef.header!.toString();

    return (
        <ActionMenu label={label} icon={FilterIcon}>
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
                                column.setFilterValue(newValues.length > 0 ? newValues : undefined);
                            }}
                        />
                        <span className={styles["filter-checkbox-label"]}>{optionKey}</span>
                        {opts[optionKey]}
                    </div>
                ))}
            </div>
        </ActionMenu>
    );
};

const BooleanFilter = ({ column }: FilterProps) => {
    const meta = column.columnDef.meta!;
    const label: string = column.columnDef.header!.toString();
    const filterValue = column.getFilterValue();

    // Count true values using faceted values
    const trueCount = Array.from(column.getFacetedUniqueValues().keys()).filter((val) => val === true).length;

    return (
        <div className={styles["filter-boolean-container"]}>
            <div className={styles["filter-boolean-label"]}>{label}</div>
            <div className={styles["filter-boolean-item"]}>
                <Checkbox
                    name={`${column.id}-boolean`}
                    checked={filterValue === true}
                    onChange={(e) => {
                        column.setFilterValue(e.target.checked ? true : false);
                    }}
                />
                <span className={styles["filter-boolean-value"]}>{meta.trueValue}</span>
                <Badge style={{ fontSize: "0.75rem" }}>{trueCount}</Badge>
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
    if (dataRange) {
        if (isPvalue) {
            const values: number[] = (column.getAllValues(true, naValue) as number[]).map((v) => negLog10(v));
            return (
                <ThresholdSelectHistogram
                    limit={7}
                    limitType={"min"}
                    onRangeSelect={handleRangeFilter}
                    data={values}
                    numBins={50}
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
                />
            );
        }
    }
    return (
        <Alert variant="info" message="No valid values">
            <p>
                No valid values available for this column after applying other filters. Only missing or NA values
                remain.
            </p>
            <p>Try adjusting or clearing other filters to see more data for this column.</p>
        </Alert>
    );
};

const Filter = ({ column }: FilterProps) => {
    const meta = column.columnDef.meta!;

    if (meta.type === "boolean") {
        return <BooleanFilter column={column} />;
    }
    if (meta.type in NUMERIC_CELL_TYPES) {
        return <NumericFilter column={column} />;
    }

    // text data
    // find and sort the unique values, accounting for NA
    // and realistic display limits
    // defaults always to Select unless user overrides
    const sortedUniqueValues: Record<string, number> = useMemo(() => {
        const naValue = meta.naValue || DEFAULT_NA_VALUE;
        const uniqueValues: Map<string, number> = column.getFacetedUniqueValues();
        const naCount: number | undefined = uniqueValues.get(naValue);
        if (naCount) {
            uniqueValues.delete(naValue);
        }

        const sortedEntries = [...uniqueValues.entries()].sort((a, b) => b[1] - a[1]);

        // Truncate to MAX_FILTER_CATEGORIES and collapse residuals into "Other"
        const resultHash: Record<string, number> = {};
        if (sortedEntries.length > MAX_FILTER_CATEGORIES) {
            const topEntries = sortedEntries.slice(0, MAX_FILTER_CATEGORIES - 1);
            const otherCount = sortedEntries
                .slice(MAX_FILTER_CATEGORIES - 1)
                .reduce((sum, [, count]) => sum + count, 0);
            topEntries.forEach(([value, count]) => {
                resultHash[value] = count;
            });

            resultHash["Other"] = otherCount;
        } else {
            sortedEntries.forEach(([value, count]) => {
                resultHash[value] = count;
            });
        }

        if (naCount) {
            resultHash[naValue] = naCount;
        }
        return resultHash;
    }, [column.getSize()]);

    if (meta.filterType === "pie") {
        return <PieChartFilter column={column} values={sortedUniqueValues} />;
    }

    if (meta.filterType === "multiselect") {
        return <CheckBoxFilter column={column} values={sortedUniqueValues} />;
    }

    return <RichSelectFilter column={column} values={sortedUniqueValues} />;
};

export default Filter;
