import React from "react";
import styles from "./styles/loading-spinner.module.css";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

const sizeClass: Record<string, string> = {
    sm: styles["spinner-sm"],
    md: styles["spinner-md"],
    lg: styles["spinner-lg"],
};

export const LoadingSpinner = ({ message = "Loading...", size = "md" }: LoadingSpinnerProps) => {
    return (
        <div className={styles["spinner-container"]}>
            <div className={`${styles["spinner"]} ${sizeClass[size]}`} aria-hidden="true" />
            {message && (
                <p className={styles["spinner-message"]} role="status" aria-live="polite">
                    {message}
                </p>
            )}
        </div>
    );
};
