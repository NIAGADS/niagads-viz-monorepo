import { Column } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { _get } from "@niagads/common";
import { Select } from "@niagads/ui";
import { Autocomplete, Slider } from "@niagads/ui/client";

interface FilterProps {
    column: Column<any, unknown>;
}

const Filter = ({ column }: FilterProps) => {
    const sortedUniqueValues = useMemo(() => {
        return Array.from(column.getFacetedUniqueValues().keys()).sort();
    }, [column.getSize()]);

    return (
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
    );
};

export default Filter;
