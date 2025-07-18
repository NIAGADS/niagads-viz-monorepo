import React from "react";

type SkeletonTypes = "default" | "card" | "table";

interface SkeletonProps {
    type: SkeletonTypes;
}

const pulseKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}`;

const skeletonPulseStyle: React.CSSProperties = {
    animation: "pulse 1.5s ease-in-out 0s infinite",
};

export const Skeleton = ({ type }: SkeletonProps) => {
    React.useEffect(() => {
        // Inject keyframes only once
        if (!document.getElementById("skeleton-pulse-keyframes")) {
            const style = document.createElement("style");
            style.id = "skeleton-pulse-keyframes";
            style.innerHTML = pulseKeyframes;
            document.head.appendChild(style);
        }
    }, []);

    if (type === "default") {
        return (
            <div role="status" style={{ maxWidth: "24rem", ...skeletonPulseStyle }}>
                <div
                    style={{
                        height: "0.625rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        width: "12rem",
                        marginBottom: "1rem",
                    }}
                />
                <div
                    style={{
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        maxWidth: "300px",
                        marginBottom: "0.625rem",
                    }}
                />
                <div
                    style={{
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        maxWidth: "360px",
                        marginBottom: "0.625rem",
                    }}
                />
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                    Loading...
                </span>
            </div>
        );
    }
    if (type === "card") {
        return (
            <div
                role="status"
                style={{
                    maxWidth: "24rem",
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.125rem",
                    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                    ...skeletonPulseStyle,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "12rem",
                        marginBottom: "1rem",
                        background: "#d1d5db",
                        borderRadius: "0.125rem",
                    }}
                >
                    <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 20" style={{ color: "#e5e7eb" }}>
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div
                    style={{
                        height: "0.625rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        width: "12rem",
                        marginBottom: "1rem",
                    }}
                />
                <div
                    style={{
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        marginBottom: "0.625rem",
                    }}
                />
                <div
                    style={{
                        height: "0.5rem",
                        background: "#e5e7eb",
                        borderRadius: "9999px",
                        marginBottom: "0.625rem",
                    }}
                />
                <div style={{ height: "0.5rem", background: "#e5e7eb", borderRadius: "9999px" }} />
                <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                    <svg
                        width="40"
                        height="40"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: "#e5e7eb", marginRight: "0.75rem" }}
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                        <div
                            style={{
                                height: "0.625rem",
                                background: "#e5e7eb",
                                borderRadius: "9999px",
                                width: "8rem",
                                marginBottom: "0.5rem",
                            }}
                        />
                        <div
                            style={{ width: "12rem", height: "0.5rem", background: "#e5e7eb", borderRadius: "9999px" }}
                        />
                    </div>
                </div>
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                    Loading...
                </span>
            </div>
        );
    }
    if (type === "table") {
        return (
            <div>
                <div
                    role="status"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.125rem",
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                        ...skeletonPulseStyle,
                    }}
                >
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                paddingRight: "0.5rem",
                                gap: "0.5rem",
                                borderRight: i < 4 ? "1px solid #e5e7eb" : "none",
                            }}
                        >
                            <div
                                style={{
                                    height: "0.625rem",
                                    background: "#d1d5db",
                                    borderRadius: "9999px",
                                    width: "6rem",
                                    marginBottom: "0.625rem",
                                }}
                            />
                            <div>
                                <div
                                    style={{
                                        height: "0.625rem",
                                        background: "#e5e7eb",
                                        borderRadius: "9999px",
                                        width: "6rem",
                                        marginBottom: "0.625rem",
                                    }}
                                />
                                <div
                                    style={{
                                        width: "8rem",
                                        height: "0.5rem",
                                        background: "#e5e7eb",
                                        borderRadius: "9999px",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                    Loading...
                </span>
            </div>
        );
    }
    return <></>;
};
