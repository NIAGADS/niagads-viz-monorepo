import React, { useEffect, useId, useState } from "react";
import { Toggle, ToggleGroup } from "@niagads/ui";

import { ActionMenu } from "@niagads/ui/client";
import { Column } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { GenericColumn } from "../Column";
import { TableRow } from "../TableProperties";

interface ColumnControlsProps {
    columns: Column<TableRow, unknown>[];
    onSelect: (col: GenericColumn) => void;
}

export const ColumnControls = ({ columns, onSelect }: ColumnControlsProps) => {
    return (
        <ActionMenu
            onChange={function (value: string): void {
                throw new Error("Function not implemented.");
            }}
            icon={Columns3}
            label={"Columns"}
        >
            {"TEST"}
        </ActionMenu>
    );
};

/*
        <div className="relative inline-block text-left dropdown">
            <Button color="white">
                <Columns3 className={`icon-button`}></Columns3>
                <span className="ml-2 uppercase">Columns</span>
            </Button>

            <div className="hidden dropdown-menu">
                <div
                    role="menu"
                    className="z-50 absolute left-0 w-56 mt-2 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                >
                    <div className="flex flex-col px-4 py-3">
                        {columns.map((col) => {
                            // console.log(col.columnDef.id)
                            return (
                                col.getCanHide() && (
                                    <Checkbox
                                        name="show_columns"
                                        variant="accent"
                                        key={`toggle_${col.columnDef.id}`}
                                        label={col.columnDef.header?.toString()}
                                        checked={col.getIsVisible()}
                                        onChange={col.getToggleVisibilityHandler()}
                                    />
                                )
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>*/
