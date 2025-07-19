import React from "react";
import styles from "./styles/skeleton.module.css";

type SkeletonTypes = "default" | "card" | "table";

interface SkeletonProps {
    type: SkeletonTypes;
}

export const Skeleton = ({ type }: SkeletonProps) => {
    if (type === "default") {
        return (
            <div role="status" className={`${styles["skeleton-default"]} ${styles["skeleton-pulse"]}`}>
                <div className={styles["skeleton-bar"]} />
                <div className={styles["skeleton-bar-sm"]} />
                <div className={styles["skeleton-bar-md"]} />
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                    Loading...
                </span>
            </div>
        );
    }
    if (type === "card") {
        return (
            <div role="status" className={`${styles["skeleton-card"]} ${styles["skeleton-pulse"]}`}>
                <div className={styles["skeleton-card-img"]}>
                    <svg
                        width="40"
                        height="40"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                        className={styles["skeleton-card-row-icon"]}
                    >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className={styles["skeleton-card-bar"]} />
                {/*<div className={styles["skeleton-card-bar-sm"]} />
                <div className={styles["skeleton-card-bar-sm"]} />
                <div className={styles["skeleton-card-bar-md"]} />
                <div className={styles["skeleton-card-row"]}>
                    <svg
                        width="40"
                        height="40"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        className={styles["skeleton-card-row-icon"]}
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                    <div>
                        <div className={styles["skeleton-card-row-bar"]} />
                        <div className={styles["skeleton-card-row-bar-md"]} />
                    </div>
                </div>*/}
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                    Loading...
                </span>
            </div>
        );
    }
    if (type === "table") {
        return (
            <div>
                <div role="status" className={`${styles["skeleton-table"]} ${styles["skeleton-pulse"]}`}>
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={styles["skeleton-table-col"]}
                            style={{ borderRight: i < 4 ? undefined : "none" }}
                        >
                            <div className={styles["skeleton-table-bar"]} />
                            <div>
                                <div className={styles["skeleton-table-bar-sm"]} />
                                <div className={styles["skeleton-table-bar-md"]} />
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
