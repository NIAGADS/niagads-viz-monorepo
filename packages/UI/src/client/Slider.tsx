import React from "react";
import styles from "../styles/slider.module.css";

interface SliderProps {
    name: string;
    label?: string;
    value: number[];
    min: number;
    max: number;
    step: number;
    variant?: SliderVariants;
    onChange: (v: number[]) => void;
}

type SliderVariants = "default" | "primary" | "secondary" | "accent";

export const Slider = ({ variant = "default", name, label, value, min, max, step, onChange }: SliderProps) => {
    const valueChanged = (v: number[]) => v !== value && onChange(v);

    return (
        <div>
            {label && (
                <label htmlFor={name} className={styles["ui-slider-label"]}>
                    {label}
                </label>
            )}
            {value.length > 1 ? (
                <div>
                    <input
                        id={name}
                        type="range"
                        onChange={(e) => {
                            const val = +e.target.value;
                            val < value[1] && valueChanged([val, value[1]]);
                        }}
                        value={value[0]}
                        min={min}
                        max={max}
                        step={step}
                        className={`${styles["ui-slider"]} ${styles[variant]}`}
                    />
                    <input
                        id={name}
                        type="range"
                        onChange={(e) => {
                            const val = +e.target.value;
                            val > value[0] && valueChanged([value[0], val]);
                        }}
                        value={value[1]}
                        min={min}
                        max={max}
                        step={step}
                        className={`${styles["ui-slider"]} ${styles["ui-second-thumb"]} ${styles[variant]}`}
                    />
                </div>
            ) : (
                <input
                    id={name}
                    type="range"
                    onChange={(e) => valueChanged([+e.target.value])}
                    value={value[0]}
                    min={min}
                    max={max}
                    step={step}
                    className={`${styles["ui-slider"]} ${styles[variant]}`}
                />
            )}
            <span className={styles["ui-slider-range-label"]} style={{ left: 0 }}>
                {min}
            </span>
            <span className={styles["ui-slider-range-label"]} style={{ right: 0 }}>
                {max}
            </span>
        </div>
    );
};
