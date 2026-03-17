import React from "react";
import styles from "../styles/slider.module.css";

export type SliderVariant = "single" | "min" | "max" | "range";
interface SliderProps {
    /** Unique identifier for the slider */
    name: string;
    /** Display label above the slider */
    label?: string;
    /** Current value: [value] for single/min/max, [min, max] for range */
    value: number[];
    /** Minimum allowed value */
    min: number;
    /** Maximum allowed value */
    max: number;
    /** Step increment */
    step: number;
    /** Slider type: "single" (free), "min" (highlight min→value), "max" (highlight value→max), "range" (two thumbs) */
    variant?: SliderVariant;
    /** Callback when value changes */
    onChange: (v: number[]) => void;
}

export const Slider = ({ name, label, value, min, max, step, variant = "single", onChange }: SliderProps) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const minInputRef = React.useRef<HTMLInputElement>(null);
    const maxInputRef = React.useRef<HTMLInputElement>(null);

    // Calculate percentages for positioning
    const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

    // Handle single/min/max slider change
    const handleSingleChange = (newValue: number) => {
        onChange([newValue]);
    };

    // Keyboard accessibility for single slider
    const handleSingleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value[0];
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(min, value[0] - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(max, value[0] + step);
        }
        if (newValue !== value[0]) {
            onChange([newValue]);
        }
    };

    // Keyboard accessibility for range slider
    const handleRangeMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value[0];
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(min, value[0] - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(value[1], value[0] + step);
        }
        if (newValue !== value[0]) {
            handleRangeMinChange(newValue);
        }
    };
    const handleRangeMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value[1];
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(value[0], value[1] - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(max, value[1] + step);
        }
        if (newValue !== value[1]) {
            handleRangeMaxChange(newValue);
        }
    };

    // Handle range slider min thumb change
    const handleRangeMinChange = (newValue: number) => {
        if (newValue <= value[1]) {
            onChange([newValue, value[1]]);
        }
    };

    // Handle range slider max thumb change
    const handleRangeMaxChange = (newValue: number) => {
        if (newValue >= value[0]) {
            onChange([value[0], newValue]);
        }
    };

    // Dynamically adjust z-index for range slider
    const handlePointerDown = (isMin: boolean) => {
        if (minInputRef.current && maxInputRef.current) {
            if (isMin) {
                minInputRef.current.style.zIndex = "7";
                maxInputRef.current.style.zIndex = "5";
            } else {
                maxInputRef.current.style.zIndex = "7";
                minInputRef.current.style.zIndex = "5";
            }
        }
    };

    // Update track fill
    React.useEffect(() => {
        if (trackRef.current) {
            if (variant === "min") {
                // Highlight from min to current value
                trackRef.current.style.left = "0";
                trackRef.current.style.right = `${100 - getPercent(value[0])}%`;
            } else if (variant === "max") {
                // Highlight from current value to max
                trackRef.current.style.left = `${getPercent(value[0])}%`;
                trackRef.current.style.right = "0";
            } else if (variant === "range" && value.length === 2) {
                // Range: highlight between both values
                trackRef.current.style.left = `${getPercent(value[0])}%`;
                trackRef.current.style.right = `${100 - getPercent(value[1])}%`;
            }
        }
    }, [value, variant, min, max]);

    const isRangeVariant = variant === "range" && value.length === 2;

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={`${name}-slider`} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.sliderWrapper}>
                {isRangeVariant ? (
                    <>
                        <div className={styles.track} />
                        <div className={styles.fill} ref={trackRef} />
                        <input
                            id={`${name}-min`}
                            ref={minInputRef}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value[0]}
                            onChange={(e) => handleRangeMinChange(+e.target.value)}
                            onPointerDown={() => handlePointerDown(true)}
                            className={`${styles.input} ${styles.inputMin}`}
                            aria-label={`${label || name} minimum`}
                            role="slider"
                            aria-valuenow={value[0]}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value[0])}
                            tabIndex={0}
                            onKeyDown={handleRangeMinKeyDown}
                        />
                        <input
                            id={`${name}-max`}
                            ref={maxInputRef}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value[1]}
                            onChange={(e) => handleRangeMaxChange(+e.target.value)}
                            onPointerDown={() => handlePointerDown(false)}
                            className={`${styles.input} ${styles.inputMax}`}
                            aria-label={`${label || name} maximum`}
                            role="slider"
                            aria-valuenow={value[1]}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value[1])}
                            tabIndex={0}
                            onKeyDown={handleRangeMaxKeyDown}
                        />
                    </>
                ) : (
                    <>
                        <div className={styles.track} />
                        <div className={styles.fill} ref={trackRef} />
                        <input
                            id={`${name}-slider`}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value[0]}
                            onChange={(e) => handleSingleChange(+e.target.value)}
                            className={`${styles.input} ${styles.inputSingle}`}
                            aria-label={label || name}
                            role="slider"
                            aria-valuenow={value[0]}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value[0])}
                            tabIndex={0}
                            onKeyDown={handleSingleKeyDown}
                        />
                    </>
                )}
            </div>

            <div className={styles.bounds}>
                <span className={styles.boundLabel}>{min}</span>
                <span className={styles.boundLabel}>{max}</span>
            </div>
        </div>
    );
};
