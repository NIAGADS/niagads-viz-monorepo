import { Button, FilterChip, FilterChipBar, InlineIcon, StylingProps } from "@niagads/ui";
import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";

import { ColumnFilterType } from "../../types";
import FilterComponent from "./Filters/FilterUI";
import { TrashIcon } from "lucide-react";
import styles from "./ColumnFilterControls.module.css";

interface ColumnFilterControlsProps {
    filterableColumns: Column<any, unknown>[];
    activeFilters: ColumnFiltersState;
    coreRowCount: number;
    onRemoveAll: () => void;
    onRemoveFilter: (filter: ColumnFilter) => void;
}

interface FilterGroupProps extends StylingProps {
    title: string;
    columns: Column<any, unknown>[];
    coreRowCount: number;
    filterType: ColumnFilterType;
}

const FilterGroup = ({ title, columns, coreRowCount, filterType, className, style }: FilterGroupProps) => {
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
                .map((column) => <FilterComponent key={`${filterType}-filter-${column.id}`} column={column} />),
        [columns, filterType, redundantFilters]
    );

    const hasFilters = renderedFilters.length > 0;

    return hasFilters ? (
        <section className={className} style={style}>
            <header className={styles["additional-filter-panel-header"]}>{title}</header>
            <div className={styles["additional-filter-panel-body"]}>{renderedFilters}</div>
        </section>
    ) : null;
};

export const ColumnFilterControls = ({
    filterableColumns,
    activeFilters,
    coreRowCount,
    onRemoveAll,
    onRemoveFilter,
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

    const multiselectFilterColunns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "multiselect"),
        []
    );

    const selectFilterColunns = useMemo(
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

    // FIXME: after aggregating additional columns build these dynamically from column filter groups
    // with order based on order pulled from table options

    const variantFlagColumns = useMemo(
        () => additionalFilterColumns.filter((column) => column.columnDef.meta?.filterType === "boolean"),
        [additionalFilterColumns]
    );

    const functionalAnnotationColumns = useMemo(
        () =>
            additionalFilterColumns.filter((column) => {
                const header = column.columnDef.header?.toString().toLowerCase();

                return header === "impact" || header === "consequence";
            }),
        [additionalFilterColumns]
    );

    const sampleContextColumns = useMemo(
        () =>
            additionalFilterColumns.filter((column) => {
                const header = column.columnDef.header?.toString().toLowerCase();

                return header === "population" || header === "tissue" || header === "biomarker";
            }),
        [additionalFilterColumns]
    );

    const groupedColumnIds = useMemo(
        () =>
            new Set([
                ...variantFlagColumns.map((column) => column.id),
                ...functionalAnnotationColumns.map((column) => column.id),
                ...sampleContextColumns.map((column) => column.id),
            ]),
        [functionalAnnotationColumns, sampleContextColumns, variantFlagColumns]
    );

    const otherAdditionalColumns = useMemo(
        () => additionalFilterColumns.filter((column) => !groupedColumnIds.has(column.id)),
        [additionalFilterColumns, groupedColumnIds]
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
                    {activeFilters.map((filter) => {
                        const column = filterableColumns.find((x) => x.id === filter.id);
                        const valueStr = `${filter.value}`;
                        const displayValue =
                            column?.columnDef.meta?.filterType !== "multiselect" && valueStr.includes(",")
                                ? "Other"
                                : valueStr;
                        return (
                            <FilterChip
                                key={`filter-chip-${filter.id}`}
                                label={column?.columnDef.header as string}
                                value={displayValue}
                                onRemove={() => onRemoveFilter(filter)}
                            />
                        );
                    })}
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
                        <FilterGroup
                            title="Variant Flags"
                            className={styles["additional-filter-panel"]}
                            columns={variantFlagColumns}
                            coreRowCount={coreRowCount}
                            filterType="boolean"
                        />

                        <FilterGroup
                            title="Functional Annotation"
                            className={styles["additional-filter-panel"]}
                            columns={functionalAnnotationColumns}
                            coreRowCount={coreRowCount}
                            filterType="select"
                        />

                        <FilterGroup
                            title="Sample / Study Context"
                            className={styles["additional-filter-panel"]}
                            columns={sampleContextColumns}
                            coreRowCount={coreRowCount}
                            filterType="select"
                        />

                        {otherAdditionalColumns.length > 0 && (
                            <FilterGroup
                                title="Other"
                                className={styles["additional-filter-panel"]}
                                columns={otherAdditionalColumns}
                                coreRowCount={coreRowCount}
                                filterType="select"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
