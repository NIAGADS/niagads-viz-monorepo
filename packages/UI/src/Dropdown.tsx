import React, { useState } from "react";

const __TAILWIND_CSS = {
    root: "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 my-2.5",
    button: "inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    dropdown: "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none",

}

export interface DropdownOption<T> {
    value: T
    name: string
}

interface DropdownProps<T> {
    options: DropdownOption<T>[];
    closeOnSelect: boolean;
    onSelect: (option: T[]) => void;
}

export const Dropdown = <T,>({
    options,
    closeOnSelect,
    onSelect
}: DropdownProps<T>) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [selected, setSelected] = useState<DropdownOption<T>[]>([]);

    const handleSelect = (x: DropdownOption<T>) => {
        let updated = [];
        if (selected.find(o => o.value === x.value)) {
            updated = selected.filter(o => o.value !== x.value);
        } else {
            updated = [...selected, x];
        }
        setSelected(updated);
        onSelect(updated.map(o => o.value));
        closeOnSelect && setVisible(false);
    }

    return (
        <div className="relative inline-block text-left">
            <div
                className={__TAILWIND_CSS.button}
                onClick={() => setVisible(!visible)}
            >
                {selected.length === 0 ? "Select..." : selected.map(o => o.name).join(", ")}
            </div>
            {visible ? (
                <div className={__TAILWIND_CSS.dropdown}>
                    {options.map((option) => {
                        return (
                            <div onClick={() => handleSelect(option)}>
                                {option.name}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
