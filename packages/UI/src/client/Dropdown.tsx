import React, { useState } from "react";

export interface DropdownOption<T> {
    value: T;
    name: string;
}

interface DropdownProps<T> {
    options: DropdownOption<T>[];
    closeOnSelect: boolean;
    onSelect: (option: T[]) => void;
}

export const Dropdown = <T,>({ options, closeOnSelect, onSelect }: DropdownProps<T>) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selected, setSelected] = useState<DropdownOption<T>[]>([]);

    const handleSelect = (x: DropdownOption<T>) => {
        let updated = [];
        if (selected.find((o) => o.value === x.value)) {
            updated = selected.filter((o) => o.value !== x.value);
        } else {
            updated = [...selected, x];
        }
        setSelected(updated);
        onSelect(updated.map((o) => o.value));
        closeOnSelect && setVisible(false);
    };

    return (
        <div className="ui-dropdown-container">
            <div className="ui-dropdown-button" onClick={() => setVisible(!visible)}>
                {selected.length === 0 ? "Select..." : selected.map((o) => o.name).join(", ")}
            </div>
            {visible ? (
                <div className="ui-dropdown-items">
                    {options.map((option) => {
                        return <div onClick={() => handleSelect(option)}>{option.name}</div>;
                    })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
