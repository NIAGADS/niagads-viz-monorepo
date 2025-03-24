import React from "react";

const __TAILWIND_CSS = {
    label: "block mb-2 text-sm font-medium text-gray-900",
    slider: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
}

interface SliderProps {
    name: string;
    label?: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
}

export const Slider = ({
    name,
    label,
    value,
    min,
    max,
    step,
    onChange,
}: SliderProps) => {
    const valueChanged = (v: number) => v !== value && onChange(v)

    return (
        <div>
            {label && (
                <label htmlFor={name} className={__TAILWIND_CSS.label}>
                    {label}
                </label>
            )}
            <input
                id={name}
                type="range"
                onChange={(e) => valueChanged(+e.target.value)}
                value={value}
                min={min}
                max={max}
                step={step}
                className={__TAILWIND_CSS.slider}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2 -bottom-2">{min}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-2 -bottom-2">{max}</span>
        </div>
    );
};
