import React from "react";

interface SliderProps {
    name: string;
    label?: string;
    value: number;
    min: number;
    max: number;
    step: number;
    variant?: SliderVariants;
    onChange: (v: number) => void;
}

type SliderVariants = "default" | "primary" | "secondary" | "accent";

export const Slider = ({ variant = "default", name, label, value, min, max, step, onChange }: SliderProps) => {
    const valueChanged = (v: number) => v !== value && onChange(v);

    return (
        <div>
            {label && (
                <label htmlFor={name} className="ui-slider-label">
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
                className={`ui-slider ${variant}`}
            />
            <span className="ui-slider-range-label start">{min}</span>
            <span className="ui-slider-range-label end">{max}</span>
        </div>
    );
};
