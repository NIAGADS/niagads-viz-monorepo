import React, { useState } from "react";

import { Row } from "@tanstack/react-table";
import { TableRow } from "../TableProperties";
import { X } from "lucide-react";

interface RowSelectionControlsProps {
    selectedRows: Row<TableRow>[];
    displayColumn: string;
    onToggleShowSelected: () => void;
}

export const RowSelectionControls = ({
    selectedRows,
    displayColumn,
    onToggleShowSelected,
}: RowSelectionControlsProps) => {
    const [showingSelected, setShowingSelected] = useState(false);

    const handleToggle = () => {
        setShowingSelected(!showingSelected);
        onToggleShowSelected();
    };

    return selectedRows.length > 0 ? (
        <div className="row-selection-controls">
            <div className="row-selection-sidebar">
                <div>Selected Rows:</div>
                <div className="toggle" onClick={() => handleToggle()}>
                    Show {showingSelected ? " All Rows" : " Selected Rows"}
                </div>
            </div>
            <div className="row-selection-items">
                {selectedRows.map((row) => {
                    return (
                        <div className="pill" key={row.id}>
                            {row.renderValue(displayColumn)}
                            <X className="icon clickable" onClick={row.getToggleSelectedHandler()} />
                        </div>
                    );
                })}
            </div>
        </div>
    ) : (
        <></>
    );
};
