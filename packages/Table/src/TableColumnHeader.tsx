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
import { HelpIconWrapper } from "@niagads/ui/client";
import { TableRow } from "./TableProperties";
import { _get } from "@niagads/common";
import styles from "./styles/table.module.css";

interface TableColumnHeaderProps {
    header: Header<TableRow, unknown>;
    tableId: string;
}

const SORT_ICONS = {
    sort: ArrowDownUp,
    asc: SortAscIcon,
    desc: SortDescIcon,
};

export const TableColumnHeader = ({ header, tableId }: TableColumnHeaderProps) => {
    const isSorted = header.column.getIsSorted();
    const SortIcon = SORT_ICONS[isSorted !== false ? isSorted : "sort"];
    const description = _get("description", header.column.columnDef.meta);
    const [filterOpen, setFilterOpen] = useState(false);

    const canSort = header.column.getCanSort();

    const headerContent = flexRender(header.column.columnDef.header, header.getContext());

    return (
        <th
            key={header.id}
            scope="col"
            className={`${styles["column-header"]} ${styles["column-header-text"]} ${canSort ? styles["sortable"] : ""}`}
        >
            <div className={styles["column-header-controls-container"]}>
                <div
                    className={
                        canSort
                            ? `${styles["column-header-controls"]} ${styles["sortable"]}`
                            : styles["column-header-controls"]
                    }
                    onClick={header.column.getToggleSortingHandler()}
                >
                    {description ? (
                        <HelpIconWrapper
                            anchorId={`${tableId}-${header.column.id}-info`}
                            message={description}
                            variant={"question"}
                        >
                            <span>{headerContent}</span>
                        </HelpIconWrapper>
                    ) : (
                        <span>{headerContent}</span>
                    )}
                    {canSort ? (
                        SortIcon ? (
                            <SortIcon
                                className={`${isSorted ? styles["visible"] : styles["invisible"]} ${styles["column-header-icon"]}`}
                            />
                        ) : (
                            <div className={styles["column-header-sort-icon-placeholder"]}></div>
                        )
                    ) : null}
                </div>

                {header.column.getCanFilter() && (
                    <div className={styles["column-header-filter-control-container"]}>
                        <Button variant="primary" onClick={() => setFilterOpen(!filterOpen)}>
                            <ListFilterPlus className={`${styles["column-header-icon"]}}`} size={12}></ListFilterPlus>
                        </Button>
                    </div>
                )}
            </div>
            {filterOpen && <Filter column={header.column} />}
        </th>
    );
};
