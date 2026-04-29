import "./ColumnFilterControls.css";

import {
    Button,
    Card,
    CardBody,
    CardGrid,
    CardHeader,
    CardSpan,
    FilterChip,
    FilterChipBar,
    InlineIcon,
    StylingProps,
} from "@niagads/ui";
import { ChevronDown, ChevronRight, TrashIcon } from "lucide-react";
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
}

interface FilterCardProps extends StylingProps {
    columns: Column<any, unknown>[];
    coreRowCount: number;
    span: CardSpan;
    filterType: ColumnFilterType;
}

const FilterCard = ({ columns, coreRowCount, span, filterType, className, style }: FilterCardProps) => {
    const [redundantFilters, setRedundantFilters] = useState<string[]>([]);

    // filter out any columns that have the same value for every row in the table
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
        [redundantFilters]
    );

    const hasFilters = renderedFilters.length > 0;

    return hasFilters ? (
        <Card className={className} style={style} span={span}>
            {renderedFilters}
        </Card>
    ) : (
        <></>
    );
};

export const ColumnFilterControls = ({
    filterableColumns,
    activeFilters,
    coreRowCount,
    onRemoveAll,
    onRemoveFilter,
}: ColumnFilterControlsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const visualFilterColumns = useMemo(
        () =>
            filterableColumns
                .filter(
                    (column) =>
                        column.columnDef.meta?.filterType === "histogram" || column.columnDef.meta?.filterType === "pie"
                )
                .sort((a, b) => {
                    // histogram comes first
                    if (a.columnDef.meta?.filterType === "histogram" && b.columnDef.meta?.filterType === "pie")
                        return -1;
                    if (a.columnDef.meta?.filterType === "pie" && b.columnDef.meta?.filterType === "histogram")
                        return 1;
                    return 0;
                }),
        [filterableColumns]
    );

    const booleanFilterColumns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "boolean"),
        [filterableColumns]
    );

    const multiselectFilterColunns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "multiselect"),
        [filterableColumns]
    );

    const selectFilterColunns = useMemo(
        () => filterableColumns.filter((column) => column.columnDef.meta?.filterType === "select"),
        [filterableColumns]
    );

    const hasAdditionalFilters =
        booleanFilterColumns.length + multiselectFilterColunns.length + selectFilterColunns.length > 0;

    return (
        <>
            {activeFilters.length > 0 && (
                <FilterChipBar label={"Active Column Filters:"}>
                    <Button color="default" onClick={onRemoveAll}>
                        <InlineIcon icon={<TrashIcon size={18} />}>Remove all</InlineIcon>
                    </Button>
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
            <Card>
                <CardHeader>At a Glance</CardHeader>
                <CardBody style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    {visualFilterColumns.map((column) => (
                        <Card layout="flex" key={`visual-filter-card-${column.id}`} span={3} outline={false}>
                            <FilterComponent key={`visual-filter-${column.id}`} column={column} />
                        </Card>
                    ))}
                </CardBody>
            </Card>

            {hasAdditionalFilters && (
                <>
                    <div onClick={() => setIsExpanded(!isExpanded)}>
                        <InlineIcon icon={isExpanded ? <ChevronDown /> : <ChevronRight />}>
                            <span>Additional Filters</span>
                        </InlineIcon>
                    </div>
                    {isExpanded && (
                        <CardGrid>
                            <FilterCard
                                columns={booleanFilterColumns}
                                coreRowCount={coreRowCount}
                                filterType={"boolean"}
                                span={2}
                            />
                            <FilterCard
                                columns={selectFilterColunns}
                                coreRowCount={coreRowCount}
                                filterType={"select"}
                                span={3}
                            />
                            <FilterCard
                                columns={multiselectFilterColunns}
                                coreRowCount={coreRowCount}
                                filterType={"multiselect"}
                                span={3}
                            />
                        </CardGrid>
                    )}
                </>
            )}
        </>
    );
};
