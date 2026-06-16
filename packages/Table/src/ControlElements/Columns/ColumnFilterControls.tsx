import styles from "./ColumnFilterControls.module.css";

import { Button, FilterChip, FilterChipBar, InlineIcon, StylingProps } from "@niagads/ui";
import { TrashIcon } from "lucide-react";
import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";

import { ColumnFilterType } from "../../types";
import FilterComponent from "./Filters/FilterUI";

interface ColumnFilterControlsProps {
    filterableColumns: Column<any, unknown>[];
    activeFilters: ColumnFiltersState;
    coreRowCount: number;
    onRemoveAll: () => void;
    onRemoveFilter: (filter: ColumnFilter) => void;
    filterGroupOrder?: string[];
}

export const ColumnFilterControls = ({
    filterableColumns,
    activeFilters,
    coreRowCount,
    onRemoveAll,
    onRemoveFilter,
    filterGroupOrder,
}: ColumnFilterControlsProps) => {
    const visualFilterColumns = useMemo(
        () =>
            filterableColumns
                .filter(
                    (column) =>
                        column.columnDef.meta?.filterType === "histogram" || column.columnDef.meta?.filterType === "pie"
                )
                .sort((a, b) => {
                    if (a.columnDef.meta?.filterType === "histogram" && b.columnDef.meta?.filterType === "pie") {
                        return -1;
                    }

                    if (a.columnDef.meta?.filterType === "pie" && b.columnDef.meta?.filterType === "histogram") {
                        return 1;
                    }

                    return 0;
                }),
        []
    );

    const booleanFilterColumns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "boolean"),
        []
    );

    const multiselectFilterColumns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "multiselect"),
        []
    );

    const selectFilterColumns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "select"),
        []
    );

    const additionalFilterColumns = useMemo(
        () =>
            filterableColumns.filter(
                (column) =>
                    column.columnDef.meta?.filterType === "boolean" ||
                    column.columnDef.meta?.filterType === "select" ||
                    column.columnDef.meta?.filterType === "multiselect"
            ),
        [filterableColumns]
    );

    const columnFilterGroups = useMemo(
        () =>
            additionalFilterColumns.reduce(
                (groups, column) => {
                    const groupName = column.columnDef.meta?.filterGroup || "other";
                    const updated = groups[groupName] ? [...groups[groupName], column] : [column];

                    return {
                        ...groups,
                        [groupName]: updated,
                    };
                },
                {} as Record<string, Column<any, unknown>[]>
            ),
        [additionalFilterColumns]
    );

    const hasAdditionalFilters = additionalFilterColumns.length > 0;

    return (
        <div className={styles["filter-controls-container"]}>
            {activeFilters.length > 0 && (
                <FilterChipBar
                    label={`Active Filters (${activeFilters.length})`}
                    actions={
                        <Button color="default" onClick={onRemoveAll}>
                            <InlineIcon icon={<TrashIcon size={16} />}>Clear all</InlineIcon>
                        </Button>
                    }
                >
                    {activeFilters.map((filter) => (
                        <FilterChip
                            key={`filter-chip-${filter.id}`}
                            label={filterableColumns.find((x) => x.id === filter.id)?.columnDef.header as string}
                            value={`${filter.value}`}
                            onRemove={() => onRemoveFilter(filter)}
                        />
                    ))}
                </FilterChipBar>
            )}

            <section className={styles["glance-section"]}>
                <header className={styles["glance-header"]}>
                    <span>At a Glance</span>
                </header>

                <div className={styles["visual-filter-grid"]}>
                    {visualFilterColumns.map((column) => (
                        <div className={styles["visual-filter-panel"]} key={`visual-filter-panel-${column.id}`}>
                            <FilterComponent key={`visual-filter-${column.id}`} column={column} />
                        </div>
                    ))}
                </div>
            </section>

            {hasAdditionalFilters && (
                <>
                    <div className={styles["additional-filters-header"]}>
                        <span>Additional Filters</span>
                    </div>

                    <div className={styles["additional-filter-grid"]}>
                        {filterGroupOrder
                            ? filterGroupOrder.map((groupName) => (
                                  <FilterGroup
                                      key={groupName}
                                      title={groupName}
                                      className={styles["additional-filter-panel"]}
                                      columns={columnFilterGroups[groupName]}
                                  />
                              ))
                            : Object.keys(columnFilterGroups).map((groupName) => (
                                  <FilterGroup
                                      key={groupName}
                                      title={groupName}
                                      className={styles["additional-filter-panel"]}
                                      columns={columnFilterGroups[groupName]}
                                  />
                              ))}
                    </div>
                </>
            )}
        </div>
    );
};

interface FilterGroupProps extends StylingProps {
    title: string;
    columns: Column<any, unknown>[];
}

const FilterGroup = ({ title, columns, className, style }: FilterGroupProps) => {
    const [redundantFilters, setRedundantFilters] = useState<string[]>([]);

    useEffect(() => {
        const redundantColumnIds = columns
            .filter((column) => {
                const allValues = column.getAllValues();
                return new Set(allValues).size === 1;
            })
            .map((column) => column.id);

        setRedundantFilters(redundantColumnIds);
    }, [columns]);

    const renderedFilters = useMemo(
        () =>
            columns
                .filter((column) => !redundantFilters.includes(column.id))
                .map((column) => (
                    <FilterComponent key={`${column.columnDef.meta?.filterType}-filter-${column.id}`} column={column} />
                )),
        [columns, redundantFilters]
    );

    const hasFilters = renderedFilters.length > 0;

    return hasFilters ? (
        <section className={className} style={style}>
            <header className={styles["additional-filter-panel-header"]}>{title}</header>
            <div className={styles["additional-filter-panel-body"]}>{renderedFilters}</div>
        </section>
    ) : null;
};
