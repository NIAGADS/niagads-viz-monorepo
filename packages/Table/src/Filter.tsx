import React, { ReactNode, useMemo } from "react";
import { _get, _isNA } from "@niagads/common";

import { ActionMenu } from "@niagads/ui/client";
import { Badge } from "@niagads/ui";
import { Checkbox } from "@niagads/ui";
import { Column } from "@tanstack/react-table";
import { Filter as FilterIcon } from "lucide-react";
import { RichSelect } from "@niagads/ui/client";
import styles from "./styles/filter.module.css";

const NUMERIC_CELL_TYPES = ["float", "integer", "pvalue", "percentage_cell"];
const MAX_FILTER_CATEGORIES = 7;

interface FilterProps {
    column: Column<any, unknown>;
}

interface StringFilterProps extends FilterProps {
    values: Record<string, number>;
}

const PieChartFilter = ({ column, values }: StringFilterProps) => {
    return <div>Pie Chart: {column.columnDef.header?.toString()}</div>;
};

const RichSelectFilter = ({ column, values }: StringFilterProps) => {
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

const CheckBoxFilter = ({ column, values }: StringFilterProps) => {
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
    return <div>Boolean: {column.columnDef.header?.toString()}</div>;
};

const NumericFilter = ({ column }: FilterProps) => {
    return <div>Boolean: {column.columnDef.header?.toString()}</div>;
};

const Filter = ({ column }: FilterProps) => {
    const meta = column.columnDef.meta!;

    if (meta.type === "boolean") {
        return <BooleanFilter column={column} />;
    }
    if (meta.type in NUMERIC_CELL_TYPES) {
        return <NumericFilter column={column} />;
    }

    // string-based data
    // find and sort the unique values, accounting for NA
    // and realistic display limits
    // defaults always to Select unless user overrides
    const sortedUniqueValues: Record<string, number> = useMemo(() => {
        const valueCountHash: Record<string, number> = {};
        let naValue: string | null = null;
        let naCount: number = 0;

        column.getFacetedUniqueValues().forEach((_, value) => {
            valueCountHash[value] = (valueCountHash[value] || 0) + 1;
            if (!naValue && value === meta.naValue) {
                naValue = value;
            }
        });

        // Remove NA value from hash if it is present in the data
        if (naValue !== null) {
            naCount = valueCountHash[naValue];
            delete valueCountHash[naValue];
        }

        let sortedEntries = Object.entries(valueCountHash).sort((a, b) => b[1] - a[1]);

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

        if (naValue) {
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

/* return (
        <div>
            {sortedUniqueValues.length < 11 ? (
                <div>
                    <Select
                        id={`${column.id}-filter`}
                        fields={sortedUniqueValues}
                        onChange={(e) => column.setFilterValue(e.target.value)}
                        value={(column.getFilterValue() as string) || "---"}
                    />
                </div>
            ) : sortedUniqueValues.length < 31 ? (
                <div>
                    <Autocomplete
                        suggestions={sortedUniqueValues}
                        onSelect={(selection) => column.setFilterValue(selection)}
                    />
                </div>
            ) : (
                <div></div>
                // TODO: decide if we want to use text filters for columns that have a lot of different values
                // <div>
                //     <TextInput
                //         onChange={(value) => column.setFilterValue(value)}
                //         placeholder={`Search...`}
                //         value={(columnFilterValue ?? "") as string}
                //     />
                // </div>
            )}
        </div>
    );*/
