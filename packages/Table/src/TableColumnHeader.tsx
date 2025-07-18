import {
    ArrowDownUp,
    HelpCircle,
    ListFilterPlus,
    ArrowDownNarrowWide as SortAscIcon,
    ArrowUpWideNarrow as SortDescIcon,
} from "lucide-react";
import { Header, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";

import { Button } from "@niagads/ui";
import { Filter } from "./Filter";
import { TableRow } from "./TableProperties";
import { _get } from "@niagads/common";
import { renderTooltip } from "@niagads/ui/client";

interface TableColumnHeaderProps {
    header: Header<TableRow, unknown>;
    tableId: string;
}

const __ICONS = {
    sort: ArrowDownUp,
    asc: SortAscIcon,
    desc: SortDescIcon,
};

export const TableColumnHeader = ({ header, tableId }: TableColumnHeaderProps) => {
    const isSorted = header.column.getIsSorted();
    const SortIcon = __ICONS[isSorted !== false ? isSorted : "sort"];
    const description = _get("description", header.column.columnDef.meta);
    const [filterOpen, setFilterOpen] = useState(false);

    const canSort = header.column.getCanSort();

    return (
        <th key={header.id} scope="col" className={`column-header column-header-text ${canSort ? "sortable" : ""}`}>
            <div className="column-header-controls-container">
                <div
                    className={`${canSort ? "column-header-controls sortable" : "column-header-controls"}`}
                    onClick={header.column.getToggleSortingHandler()}
                >
                    <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    {description &&
                        renderTooltip(
                            `${tableId}-${header.column.id}-info`,
                            <HelpCircle className="info-bubble column-header-info-icon" />,
                            description
                        )}
                    {canSort ? (
                        SortIcon ? (
                            <SortIcon className={`${isSorted ? "visible" : "invisible"} column-header-icon`} />
                        ) : (
                            <div className="column-header-sort-icon-placeholder"></div>
                        )
                    ) : null}
                </div>

                {header.column.getCanFilter() && (
                    <div className="column-header-filter-control-container">
                        <Button variant="primary" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
                            <ListFilterPlus className="icon-button stroke-white"></ListFilterPlus>
                        </Button>
                    </div>
                )}
            </div>
            {filterOpen && <Filter column={header.column} />}
        </th>
    );
};
