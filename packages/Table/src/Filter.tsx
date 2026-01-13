import { Column } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { _get } from "@niagads/common";
import { TextInput, Select } from "@niagads/ui";
import { Slider } from "@niagads/ui/client";

interface FilterProps {
    column: Column<any, unknown>;
}

export const Filter = ({ column }: FilterProps) => {
    const columnFilterValue = column.getFilterValue();
    const colType = column.columnDef.meta?.type;

    const sortedUniqueValues = useMemo(() => {
        return Array.from(column.getFacetedUniqueValues().keys()).sort();
    }, [column.getFacetedUniqueValues()]);

    const minValue = useMemo(() => sortedUniqueValues[0], [sortedUniqueValues]);
    const maxValue = useMemo(() => sortedUniqueValues.at(-1), [sortedUniqueValues]);

    return colType === "float" ? (
        //TODO: if faceted unique values length is 5 or more use slider otherwise use dropdown
        <div>
            <Slider
                name={`${column.id}-filter`}
                label="Filter Range"
                min={+minValue}
                max={+maxValue}
                step={(maxValue - minValue) / 50}
                value={[(column.getFilterValue() as number) || +maxValue]}
                onChange={(val) => column.setFilterValue(val)}
            />
        </div>
    ) : colType === "p_value" ? (
        //TODO: filter based on neg_log10_pvalue maybe
        <div>
            <Slider
                name={`${column.id}-filter`}
                label="Filter Range"
                min={+minValue}
                max={+maxValue}
                step={(maxValue - minValue) / 50}
                value={[0, (column.getFilterValue() as number) || +maxValue]}
                onChange={(val) => column.setFilterValue([0, val])}
            />
        </div>
    ) : sortedUniqueValues.length < 11 ? (
        <div>
            <Select
                id={`${column.id}-filter`}
                fields={sortedUniqueValues}
                onChange={(e) => column.setFilterValue(e.target.value)}
            />
        </div>
    ) : (
        <div>
            <TextInput
                onChange={(value) => column.setFilterValue(value)}
                placeholder={`Search...`}
                value={(columnFilterValue ?? "") as string}
            />
        </div>
    );
};
