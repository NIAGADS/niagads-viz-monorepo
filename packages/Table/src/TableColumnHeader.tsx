import { ArrowDownUp, ArrowDownNarrowWide as SortAscIcon, ArrowUpWideNarrow as SortDescIcon } from "lucide-react";
import { Header, flexRender } from "@tanstack/react-table";
import React from "react";

import { Filter } from "./Filter";
import { HelpIconWrapper } from "@niagads/ui";
import { TableRow } from "./TableProperties";
import { _get } from "@niagads/common";
import styles from "./styles/table.module.css";

interface TableColumnHeaderProps {
    header: Header<TableRow, unknown>;
    areFiltersOpen: boolean;
}

const SORT_ICONS = {
    sort: ArrowDownUp,
    asc: SortAscIcon,
    desc: SortDescIcon,
};

export const TableColumnHeader = ({ header, areFiltersOpen }: TableColumnHeaderProps) => {
    const isSorted = header.column.getIsSorted();
    const SortIcon = SORT_ICONS[isSorted !== false ? isSorted : "sort"];
    const description = _get("description", header.column.columnDef.meta);

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
                        <HelpIconWrapper message={description} variant={"question"} tooltipPosition="bottom">
                            <span>{headerContent}</span>
                        </HelpIconWrapper>
                    ) : (
                        <span>{headerContent}</span>
                    )}
                    {canSort ? (
                        SortIcon ? (
                            <SortIcon
                                className={`${isSorted ? styles["visible"] : styles["invisible"]} ${styles["column-header-icon"]} ${styles.right}`}
                            />
                        ) : (
                            <div className={styles["column-header-sort-icon-placeholder"]}></div>
                        )
                    ) : null}
                </div>
            </div>
            {header.column.getCanFilter() && areFiltersOpen && <Filter column={header.column} />}
        </th>
    );
};
