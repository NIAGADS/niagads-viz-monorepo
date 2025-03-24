"use client";
import React, { useState, useEffect, useId } from "react";

import { Button, Checkbox } from "@bug_sam/ui";
import { ViewColumnsIcon } from "@heroicons/react/24/solid";
import { _get } from "@bug_sam/common";
import { GenericColumn } from "../Column";
import { Column } from "@tanstack/react-table";
import { TableRow } from "../TableProperties";

interface ColumnControlsProps {
    columns: Column<TableRow, unknown>[];
    onSelect: (col: GenericColumn) => void;
}

// working from https://www.creative-tim.com/twcomponents/component/pure-css-dropdown-using-focus-within
// idea to create a drop down menu w/select which data and which format

export const ColumnControls = ({ columns, onSelect }: ColumnControlsProps) => {
    return (
        <div className="relative inline-block text-left dropdown">
            <Button variant="white">
                <ViewColumnsIcon className={`icon-button`}></ViewColumnsIcon>
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
        </div>
    );
};
