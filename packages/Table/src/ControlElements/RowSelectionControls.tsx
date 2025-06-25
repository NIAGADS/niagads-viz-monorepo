import { Row } from "@tanstack/react-table"
import React, { useState } from "react"
import { TableRow } from "../TableProperties"

import { XMarkIcon } from "@heroicons/react/16/solid"

interface RowSelectionControlsProps {
    selectedRows: Row<TableRow>[];
    displayColumn: string;
    onToggleShowSelected: () => void;
}

export const RowSelectionControls = ({ selectedRows, displayColumn, onToggleShowSelected }: RowSelectionControlsProps) => {
    const [showingSelected, setShowingSelected] = useState(false);

    const handleToggle = () => {
        setShowingSelected(!showingSelected);
        onToggleShowSelected();
    }

    return selectedRows.length > 0 ? (
        <div className="row-selection-controls">
            <div className="row-selection-sidebar">
                <div>Selected Rows:</div>
                <div className="toggle" onClick={() => handleToggle()}>
                    Show {showingSelected ? " All Rows" : " Selected Rows"}
                </div>
            </div>
            <div className="row-selection-items">
                {selectedRows.map(row => {
                    return (
                        <div className="pill" key={row.id}>
                            {row.renderValue(displayColumn)}
                            <XMarkIcon className="icon clickable" onClick={row.getToggleSelectedHandler()} />
                        </div>
                    );
                })}
            </div>
        </div>
    ) : (
        <></>
    )
}
