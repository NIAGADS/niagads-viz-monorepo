import React, { useEffect, useId, useState } from "react";
import { TextInput, Toggle, ToggleGroup } from "@niagads/ui";

import { ActionMenu } from "@niagads/ui/client";
import { Column } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { GenericColumn } from "../Column";
import { TableRow } from "../TableProperties";
import styles from "../styles/controls.module.css";

interface ColumnControlsProps {
    columns: Column<TableRow, unknown>[];
    onSelect: (col: GenericColumn) => void;
}
export const ColumnControls = ({ columns, onSelect }: ColumnControlsProps) => {
    const [search, setSearch] = useState("");
    const filteredColumns = columns.filter((col) => {
        const label = col.columnDef.header?.toString() || "";
        return label.toLowerCase().includes(search.toLowerCase());
    });
    return (
        <ActionMenu icon={Columns3} label={"Columns"} buttonColor="default">
            <div className={styles["column-controls-container"]}>
                <TextInput
                    onChange={(val) => setSearch(val)}
                    placeholder={`Search columns...`}
                    value={search}
                    style={{ fontSize: "0.8rem" }}
                />

                <div className={styles["column-controls-toggle-container"]}>
                    <ToggleGroup asGrid={false}>
                        {filteredColumns.map((col) => {
                            return (
                                col.getCanHide() && (
                                    <Toggle
                                        key={`toggle_${col.columnDef.id}`}
                                        label={col.columnDef.header?.toString()}
                                        truncateLabel={true}
                                        checked={col.getIsVisible()}
                                        onChange={(checked) => col.toggleVisibility?.(checked)}
                                        variant="primary"
                                    ></Toggle>
                                )
                            );
                        })}
                    </ToggleGroup>
                </div>
            </div>
        </ActionMenu>
    );
};
