import { Button, Card, FilterChip, FilterChipBar, InlineIcon } from "@niagads/ui";
import { ChevronDown, ChevronRight, TrashIcon } from "lucide-react";
import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import React, { useState } from "react";

import AdvancedFilter from "../Filter";

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
    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    return (
        <div>
            
            <Card>
                <div>
                    <div onClick={() => setAreFiltersOpen(!areFiltersOpen)}>
                        <InlineIcon icon={areFiltersOpen ? <ChevronDown /> : <ChevronRight />}>
                            <span>Advanced Filters</span>
                        </InlineIcon>
                    </div>
                </div>
                <div>
                    {areFiltersOpen &&
                        filterableColumns.map(
                            (column) =>
                                column.columnDef.meta?.filterType === "internal" && (
                                    <AdvancedFilter key={column.id} column={column} />
                                )
                        )}
                </div>
            </Card>
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
        </div>
    );
};
