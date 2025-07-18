import React from "react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
}

const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { width: "1rem", height: "1rem" },
    md: { width: "2rem", height: "2rem" },
    lg: { width: "3rem", height: "3rem" },
};

export const LoadingSpinner = ({ message = "Loading...", size = "md" }: LoadingSpinnerProps) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <div
                className="spinner"
                style={{
                    ...sizeStyles[size],
                    border: "4px solid #e5e7eb", // light gray
                    borderTop: "4px solid #3b82f6", // blue
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }}
                aria-hidden="true"
            />
            <p style={{ fontSize: "0.875rem", color: "#f59e42", margin: 0 }} role="status" aria-live="polite">
                {message}
            </p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
