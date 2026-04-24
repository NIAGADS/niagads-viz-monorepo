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
                <div>
                    <div onClick={() => setIsExpanded(!isExpanded)}>
                        <InlineIcon icon={isExpanded ? <ChevronDown /> : <ChevronRight />}>
                            <span>Filters</span>
                        </InlineIcon>
                    </div>
                </div>
                <div>
                    {isExpanded &&
                        filterableColumns.map((column) => <AdvancedFilter key={column.id} column={column} />)}
                </div>
            </Card>
        </div>
    );
};
