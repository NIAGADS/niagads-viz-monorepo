import { Button, Card, FilterChip, FilterChipBar, InlineIcon } from "@niagads/ui";
import React, { useState } from "react";

import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, ListFilterPlus, TrashIcon } from "lucide-react";
import AdvancedFilter from "../Filter";

interface ColumnFilterControlsProps {
    filterableColumns: Column<any, unknown>[];
    activeFilters: ColumnFiltersState;
    onRemoveAll: () => void;
    onRemoveFilter: (filter: ColumnFilter) => void;
}

export const ColumnFilterControls = ({ filterableColumns, activeFilters, onRemoveAll, onRemoveFilter }: ColumnFilterControlsProps) => {
    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    return (
        <div>
            <Card variant="full">
                <div >
                    <div onClick={() => setAreFiltersOpen(!areFiltersOpen)}>
                        <InlineIcon icon={areFiltersOpen ? <ChevronDown /> : <ChevronRight />}>
                            <span>Advanced Filters</span>
                        </InlineIcon>
                    </div>
                    {activeFilters.length > 0 && (
                        <FilterChipBar label={"Active Column Filters:"}>
                            <Button color="default" onClick={onRemoveAll}>
                                <InlineIcon icon={<TrashIcon size={18} />}>Remove all</InlineIcon>
                            </Button>
                            {activeFilters.map((filter) => (
                                <FilterChip
                                    key={`filter-chip-${filter.id}`}
                                    label={filter.id}
                                    value={`${filter.value}`}
                                    onRemove={() => onRemoveFilter(filter)}
                                />
                            ))}
                        </FilterChipBar>
                    )}
                </div>
                <div>
                    {areFiltersOpen && filterableColumns.map(column => (
                        <AdvancedFilter column={column} />
                    ))}
                </div>
            </Card>
        </div>
    );
};
