import React, { useEffect } from "react";

import { Range } from "@niagads/common";
import styles from "../styles/slider.module.css";

interface SliderProps {
    name: string;
    label?: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
}

export const Slider = ({ name, label, value, min, max, step, onChange }: SliderProps) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    // Handle single/min/max slider change
    const handleSingleChange = (v: number) => {
        onChange(v);
    };

    // Keyboard accessibility for single slider
    const handleSingleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(min, value - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(max, value + step);
        }
        if (newValue !== value) {
            onChange(newValue);
        }
    };

    return (
        <>
            <div className={styles.container}>
                {label && (
                    <label htmlFor={`${name}-slider`} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.sliderWrapper}>
                    <div className={styles.track} />
                    <div className={styles.fill} ref={trackRef} />
                    <input
                        id={`${name}-slider`}
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => handleSingleChange(+e.target.value)}
                        className={`${styles.input} ${styles.inputSingle}`}
                        aria-label={label || name}
                        role="slider"
                        aria-valuenow={value}
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuetext={String(value)}
                        tabIndex={0}
                        onKeyDown={handleSingleKeyDown}
                    />
                </div>
            </div>

            <div className={styles.bounds}>
                <span className={styles.boundLabel}>{min}</span>
                <span className={styles.boundLabel}>{max}</span>
            </div>
        </>
    );
};

export type RangeSliderVariant = "min" | "max" | "range";

interface RangeSliderProps extends Omit<SliderProps, "value" | "onChange"> {
    value: Range;
    variant: RangeSliderVariant;
    onChange: (v: Range) => void;
}

export const RangeSlider = ({ name, label, value, min, max, step, variant = "range", onChange }: RangeSliderProps) => {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const minInputRef = React.useRef<HTMLInputElement>(null);
    const maxInputRef = React.useRef<HTMLInputElement>(null);

    // Calculate percentages for positioning
    const getPercent = (v: number) => ((v - min) / (max - min)) * 100;

    // Keyboard accessibility for range slider
    const handleRangeMinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value.min;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(min, value.min - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(value.max, value.min + step);
        }
        if (newValue !== value.min) {
            handleRangeMinChange(newValue);
        }
    };
    const handleRangeMaxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newValue = value.max;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            newValue = Math.max(value.min, value.max - step);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            newValue = Math.min(max, value.max + step);
        }
        if (newValue !== value.max) {
            handleRangeMaxChange(newValue);
        }
    };

    // Handle range slider min thumb change
    const handleRangeMinChange = (v: number) => {
        if (v <= value.max) {
            onChange({ min: v, max: value.max });
        }
    };

    // Handle range slider max thumb change
    const handleRangeMaxChange = (v: number) => {
        if (v >= value.min) {
            onChange({ min: value.min, max: v });
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
    useEffect(() => {
        if (trackRef.current) {
            if (variant === "min") {
                // Highlight from min to current value
                trackRef.current.style.left = "0";
                trackRef.current.style.right = `${100 - getPercent(value.min)}%`;
            } else if (variant === "max") {
                // Highlight from current value to max
                trackRef.current.style.left = `${getPercent(value.max)}%`;
                trackRef.current.style.right = "0";
            } else if (variant === "range") {
                // Range: highlight between both values
                trackRef.current.style.left = `${getPercent(value.min)}%`;
                trackRef.current.style.right = `${100 - getPercent(value.max)}%`;
            }
        }
    }, [value, variant, min, max]);

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={`${name}-slider`} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.sliderWrapper}>
                {variant === "range" ? (
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
                            value={value.min}
                            onChange={(e) => handleRangeMinChange(+e.target.value)}
                            onPointerDown={() => handlePointerDown(true)}
                            className={`${styles.input} ${styles.inputMin}`}
                            aria-label={`${label || name} minimum`}
                            role="slider"
                            aria-valuenow={value.min}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value.min)}
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
                            value={value.max}
                            onChange={(e) => handleRangeMaxChange(+e.target.value)}
                            onPointerDown={() => handlePointerDown(false)}
                            className={`${styles.input} ${styles.inputMax}`}
                            aria-label={`${label || name} maximum`}
                            role="slider"
                            aria-valuenow={value.max}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value.max)}
                            tabIndex={0}
                            onKeyDown={handleRangeMaxKeyDown}
                        />
                    </>
                ) : variant === "min" ? (
                    <>
                        <div className={styles.track} />
                        <div className={styles.fill} ref={trackRef} />
                        <input
                            id={`${name}-slider`}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value.min}
                            onChange={(e) => handleRangeMinChange(+e.target.value)}
                            className={`${styles.input} ${styles.inputSingle}`}
                            aria-label={label || name}
                            role="slider"
                            aria-valuenow={value.min}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value.min)}
                            tabIndex={0}
                            onKeyDown={handleRangeMinKeyDown}
                        />
                    </>
                ) : variant === "max" ? (
                    <>
                        <div className={styles.track} />
                        <div className={styles.fill} ref={trackRef} />
                        <input
                            id={`${name}-slider`}
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value.max}
                            onChange={(e) => handleRangeMaxChange(+e.target.value)}
                            className={`${styles.input} ${styles.inputSingle}`}
                            aria-label={label || name}
                            role="slider"
                            aria-valuenow={value.max}
                            aria-valuemin={min}
                            aria-valuemax={max}
                            aria-valuetext={String(value.max)}
                            tabIndex={0}
                            onKeyDown={handleRangeMaxKeyDown}
                        />
                    </>
                ) : null}
            </div>

            <div className={styles.bounds}>
                <span className={styles.boundLabel}>{min}</span>
                <span className={styles.boundLabel}>{max}</span>
            </div>
        </div>
    );
};
