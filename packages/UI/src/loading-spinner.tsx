import React from "react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ message = "Loading...", size = "md" }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    };

    return (
        <div className="loading-container">
            <div className={`spinner ${sizeClasses[size]}`} aria-hidden="true" />
            <p className="text-sm text-secondary" role="status" aria-live="polite">
                {message}
            </p>
        </div>
    );
}
