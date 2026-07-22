import { Button, FilterChip, FilterChipBar, InlineIcon, StylingProps } from "@niagads/ui";
import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import FilterComponent from "./Filters/FilterUI";
import { TrashIcon } from "lucide-react";

import styles from "./ColumnFilterControls.module.css";

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
    const [showAtAGlanceFilters, setShowAtAGlanceFilters] = useState(true);
    const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);

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
        [filterableColumns]
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

    const hasVisualFilters = visualFilterColumns.length > 0;
    const hasAdditionalFilters = additionalFilterColumns.length > 0;

    return (
        <div className={styles["filter-controls-container"]}>
            <FilterChipBar
                label={`Active Filters (${activeFilters.length})`}
                actions={
                    activeFilters.length > 0 ? (
                        <Button color="default" onClick={onRemoveAll}>
                            <InlineIcon icon={<TrashIcon size={16} />}>Clear all</InlineIcon>
                        </Button>
                    ) : undefined
                }
            >
                {activeFilters.length > 0 ? (
                    activeFilters.map((filter) => (
                        <FilterChip
                            key={`filter-chip-${filter.id}`}
                            label={filterableColumns.find((x) => x.id === filter.id)?.columnDef.header as string}
                            value={`${filter.value}`}
                            onRemove={() => onRemoveFilter(filter)}
                        />
                    ))
                ) : (
                    <FilterChip label="None" disabled />
                )}
            </FilterChipBar>

            {hasVisualFilters && (
                <section className={styles["glance-section"]}>
                    <header className={styles["section-header"]}>
                        <span>At a Glance</span>

                        <SectionToggleButton
                            isExpanded={showAtAGlanceFilters}
                            expandedLabel="Collapse At a Glance filters"
                            collapsedLabel="Expand At a Glance filters"
                            onClick={() => setShowAtAGlanceFilters((value) => !value)}
                        />
                    </header>

                    {showAtAGlanceFilters && (
                        <div className={styles["visual-filter-grid"]}>
                            {visualFilterColumns.map((column) => (
                                <div className={styles["visual-filter-panel"]} key={`visual-filter-panel-${column.id}`}>
                                    <FilterComponent key={`visual-filter-${column.id}`} column={column} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {hasAdditionalFilters && (
                <section className={styles["additional-filters-section"]}>
                    <header className={styles["section-header"]}>
                        <span>Additional Filters</span>

                        <SectionToggleButton
                            isExpanded={showAdditionalFilters}
                            expandedLabel="Collapse additional filters"
                            collapsedLabel="Expand additional filters"
                            onClick={() => setShowAdditionalFilters((value) => !value)}
                        />
                    </header>

                    {showAdditionalFilters && (
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
                    )}
                </section>
            )}
        </div>
    );
};

interface SectionToggleButtonProps {
    isExpanded: boolean;
    expandedLabel: string;
    collapsedLabel: string;
    onClick: () => void;
}

const SectionToggleButton = ({ isExpanded, expandedLabel, collapsedLabel, onClick }: SectionToggleButtonProps) => (
    <button
        type="button"
        className={styles["section-toggle-button"]}
        onClick={onClick}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? expandedLabel : collapsedLabel}
    >
        <span className={styles["section-toggle-icon"]}>{isExpanded ? "−" : "+"}</span>
        <span>{isExpanded ? "Collapse" : "Expand"}</span>
    </button>
);

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
