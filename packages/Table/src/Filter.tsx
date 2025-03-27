import { Column } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { _get } from "@niagads/common";
import { TextInput } from "@niagads/ui";

interface Filter {
    column: Column<any, unknown>;
}

export const Filter = ({ column }: Filter) => {
    const columnFilterValue = column.getFilterValue();
    const colType = column.columnDef.meta?.type;

    const sortedUniqueValues = useMemo(() => {
        return Array.from(column.getFacetedUniqueValues().keys()).sort();
    }, [column.getFacetedUniqueValues()]);

    const minValue = useMemo(() => sortedUniqueValues[0], [sortedUniqueValues]);
    const maxValue = useMemo(() => sortedUniqueValues.at(-1), [sortedUniqueValues]);

    console.log(sortedUniqueValues);

    return colType === "float" ? (
        //TODO: if faceted unique values length is 5 or more use slider otherwise use dropdown
        <div>
            {/*  <Slider
                className="max-w-mid"
                label="Filter Range"
                minValue={+minValue}
                maxValue={+maxValue}
                defaultValue={[+minValue, +maxValue]}
                step={(maxValue - minValue) / 50}
                onChange={(val) => column.setFilterValue(val)}
            />*/}
        </div>
    ) : colType === "p_value" ? (
        //TODO: filter based on neg_log10_pvalue maybe
        <div>
            {/*<Slider
                className="max-w-mid"
                label="Filter Range"
                minValue={0}
                maxValue={+maxValue}
                defaultValue={+maxValue}
                step={(maxValue - minValue) / 50}
                onChange={(val) => column.setFilterValue([0, val])}
            />*/}
        </div>
    ) : sortedUniqueValues.length < 11 ? (
        <div>
            {/*<Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered">Select Filter</Button>
                </DropdownTrigger>
                <DropdownMenu
                    onSelectionChange={key => column.setFilterValue(key)}
                    //TODO: handle filtering based on mutiple selections
                    // selectionMode="multiple"
                    // closeOnSelect={false}
                >
                    {sortedUniqueValues.map((val) => (
                        <DropdownItem key={val}>
                            {val}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            */}
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
