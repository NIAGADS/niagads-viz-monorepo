import { HeaderGroup } from "@tanstack/react-table";
import React from "react";
import { TableColumnHeader } from "./TableColumnHeader";
import { TableRow } from "./types";

interface TableHeaderProps {
    headerGroups: HeaderGroup<TableRow>[];
}

const TableHeader = ({ headerGroups }: TableHeaderProps) => (
    <thead>
        {headerGroups.map((headerGroup: HeaderGroup<TableRow>) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return <TableColumnHeader key={header.id} header={header} />;
                })}
            </tr>
        ))}
    </thead>
);

export default TableHeader;
