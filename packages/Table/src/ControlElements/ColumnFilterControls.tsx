import { Button, Card, CardBody, CardHeader, FilterChip, FilterChipBar, InlineIcon } from "@niagads/ui";
import { ChevronDown, ChevronRight, TrashIcon } from "lucide-react";
import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import React, { useState } from "react";

import FilterComponent from "../Filter";

interface ColumnFilterControlsProps {
    filterableColumns: Column<any, unknown>[];
    activeFilters: ColumnFiltersState;
    onRemoveAll: () => void;
    onRemoveFilter: (filter: ColumnFilter) => void;
}

export const ColumnFilterControls = ({
    filterableColumns,
    activeFilters,
    onRemoveAll,
    onRemoveFilter,
}: ColumnFilterControlsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
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
                <CardHeader>
                    <div onClick={() => setIsExpanded(!isExpanded)}>
                        <InlineIcon icon={isExpanded ? <ChevronDown /> : <ChevronRight />}>
                            <span>Filters</span>
                        </InlineIcon>
                    </div>
                </CardHeader>
                <CardBody style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    {isExpanded &&
                        filterableColumns.map((column) => (
                            <Card layout="flex" key={`filter-card-${column.id}`} span={3} outline={false}>
                                <FilterComponent key={`filter-${column.id}`} column={column} />
                            </Card>
                        ))}
                </CardBody>
            </Card>
        </div>
    );
};
