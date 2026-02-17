import { Button, FilterChip, FilterChipBar, InlineIcon, Toggle } from "@niagads/ui";
import React, { useEffect, useState } from "react";

import { Row } from "@tanstack/react-table";
import { TableRow } from "../TableProperties";
import { TrashIcon } from "lucide-react";
import styles from "../styles/controls.module.css";

interface RowSelectionControlsProps {
    selectedRows: Row<TableRow>[];
    displayColumn: string;
    onToggleSelectedFilter: (isFiltered: boolean) => void;
    onRemoveAll: () => void;
}

export const RowSelectionControls = ({
    onToggleSelectedFilter,
    selectedRows,
    onRemoveAll,
    displayColumn,
}: RowSelectionControlsProps) => {
    const [isFiltered, setIsFiltered] = useState(false);
    const didMount = React.useRef(false);

    useEffect(() => {
        if (didMount.current) {
            onToggleSelectedFilter(isFiltered);
        } else {
            didMount.current = true;
        }
    }, [isFiltered]);

    if (selectedRows.length === 0) return null;

    return (
        <FilterChipBar label={"Selected rows"}>
            <Button color="default" onClick={onRemoveAll}>
                <InlineIcon icon={<TrashIcon size={18} />}>Unselect all</InlineIcon>
            </Button>

            <Toggle
                checked={isFiltered}
                onChange={(checked) => {
                    setIsFiltered(checked);
                }}
                label={"Show selected only"}
                variant="primary"
                style={{ marginRight: 12 }}
            />

            {selectedRows.map((row) => (
                <FilterChip
                    key={`filter-chip-${row.id}`}
                    label={row.renderValue(displayColumn)}
                    onRemove={() => row.getToggleSelectedHandler()({ target: { checked: false } })}
                />
            ))}
        </FilterChipBar>
    );
};
