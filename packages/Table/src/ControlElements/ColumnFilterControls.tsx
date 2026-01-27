import { Button, FilterChip, FilterChipBar, InlineIcon, Toggle } from "@niagads/ui";
import React, { useState } from "react";

import { Column, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";

interface ColumnFilterControlsProps {
    activeFilters: ColumnFiltersState;
    onRemoveAll: () => void;
    onRemoveFilter: (filter: ColumnFilter) => void;
}

export const ColumnFilterControls = ({ activeFilters, onRemoveAll, onRemoveFilter }: ColumnFilterControlsProps) => {
    if (activeFilters.length === 0) return null;
    return (
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
    );
};
