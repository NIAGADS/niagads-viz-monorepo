import { Column } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { _get } from "@niagads/common";
import { TextInput } from "@niagads/ui";
import { Slider, Dropdown } from "@niagads/ui/client";

interface FilterProps {
    column: Column<any, unknown>;
}

export const Filter = ({ column }: FilterProps) => {
    const columnFilterValue = column.getFilterValue();
    const colType = column.columnDef.meta?.type;

    const sortedUniqueValues = useMemo(() => {
        return Array.from(column.getFacetedUniqueValues().keys()).sort();
    }, [column.getFacetedUniqueValues()]);

    console.log(sortedUniqueValues);

    return colType === "float" ? (
        <FloatFilter sortedValues={sortedUniqueValues} onChange={val => column.setFilterValue(val)} />
    ) : colType === "p_value" ? (
        <PValueFilter sortedValues={sortedUniqueValues} onChange={val => column.setFilterValue(val)} />
    ) : sortedUniqueValues.length < 11 ? (
        <DropdownFilter  values={sortedUniqueValues} onChange={val => column.setFilterValue(val)} />
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

interface FloatFilterProps {
    sortedValues: number[];
    onChange: (val: number[]) => void;
}

const FloatFilter = ({ sortedValues, onChange }: FloatFilterProps) => {
    const minValue = useMemo(() => sortedValues[0], [sortedValues]);
    const maxValue = useMemo(() => sortedValues.at(-1), [sortedValues]) || 100;

    const [value, setValue] = useState([minValue, maxValue])

    useEffect(() => onChange(value), [value])

    return (
        //TODO: if faceted unique values length is 5 or more use slider otherwise use dropdown
        <div>
             <Slider
                name="Filter Range"
                min={+minValue}
                max={+maxValue}
                value={value}
                step={(maxValue - minValue) / 50}
                onChange={val => setValue(val)}
            />
        </div>
    );
};

const PValueFilter = ({ sortedValues, onChange }: FloatFilterProps) => {
    const minValue = useMemo(() => sortedValues[0], [sortedValues]);
    const maxValue = useMemo(() => sortedValues.at(-1), [sortedValues]) || 100;

    const [value, setValue] = useState([minValue, maxValue])

    useEffect(() => onChange(value), [value])

    return (
        //TODO: if faceted unique values length is 5 or more use slider otherwise use dropdown
        <div>
             <Slider
                name="Filter Range"
                min={0}
                max={+maxValue}
                value={value}
                step={(maxValue - minValue) / 50}
                onChange={val => setValue(val)}
            />
        </div>
    );
};

interface DropdownFilterProps {
    values: any[];
    onChange: (val: any[]) => void;
}

const DropdownFilter = ({ values, onChange }: DropdownFilterProps) => {
    const [selected, setSelected] = useState<any[]>([]);

    useEffect(() => onChange(selected), [selected]);

    return (
        <div>
            <Dropdown 
                options={values}
                closeOnSelect={false}
                onSelect={opt => setSelected(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
            />
        </div>
    )
};

