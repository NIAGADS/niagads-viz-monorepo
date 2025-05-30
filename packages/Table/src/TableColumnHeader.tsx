import React, { useState } from "react";

import { TableRow } from "./TableProperties";
import { flexRender, Header } from "@tanstack/react-table";

import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";

import { Button } from "@niagads/ui";
import { renderTooltip } from "@niagads/ui/client";
import { _get } from "@niagads/common";
import { Filter } from "./Filter";

interface TableColumnHeaderProps {
    header: Header<TableRow, unknown>;
    tableId: string;
}

const __ICONS = {
    sort: ArrowsUpDownIcon,
    asc: ArrowUpIcon,
    desc: ArrowDownIcon,
};

export const TableColumnHeader = ({ header, tableId }: TableColumnHeaderProps) => {
    const isSorted = header.column.getIsSorted();
    const SortIcon = __ICONS[isSorted !== false ? isSorted : "sort"];
    const description = _get("description", header.column.columnDef.meta);
    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <th key={header.id} scope="col" className="column-header column-header-text">
            <div className="inline-flex">
                <div
                    className={`inline-flex py-1 ${header.column.getCanSort() ? "cursor-pointer" : "cursor-default"}`}
                    onClick={header.column.getToggleSortingHandler()}
                >
                    <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    {description &&
                        renderTooltip(
                            `${tableId}-${header.column.id}-info`,
                            <QuestionMarkCircleIcon className="info-bubble ml-1" />,
                            description
                        )}
                    {header.column.getCanSort() ? (
                        SortIcon ? (
                            <SortIcon className={`${isSorted ? "visible" : "invisible"} column-header-icon`} />
                        ) : (
                            <div className="h-[19px] w-[20px]"></div>
                        )
                    ) : null}
                </div>

                {header.column.getCanFilter() && (
                    <div className="ml-5">
                        <Button variant="primary" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
                            <FunnelIcon className="icon-button stroke-white"></FunnelIcon>
                        </Button>
                    </div>
                )}
            </div>
            {filterOpen && <Filter column={header.column} />}
        </th>
    );
};
