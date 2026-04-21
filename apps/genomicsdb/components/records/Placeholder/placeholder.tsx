import "./placeholder.css";

import type React from "react";

interface PlaceholderProps {
    type: "table" | "list" | "chart" | "network";
    height?: number;
    children?: React.ReactNode;
}

const Placeholder = ({ type, height }: PlaceholderProps) => {
    const getPlaceholderContent = () => {
        switch (type) {
            case "table":
                return (
                    <div className="placeholder-table">
                        <div className="placeholder-row header"></div>
                        <div className="placeholder-row"></div>
                        <div className="placeholder-row"></div>
                        <div className="placeholder-row"></div>
                    </div>
                );
            case "list":
                return (
                    <div className="placeholder-list">
                        <div className="placeholder-list-item"></div>
                        <div className="placeholder-list-item"></div>
                        <div className="placeholder-list-item"></div>
                    </div>
                );
            case "chart":
                return (
                    <div className="placeholder-chart">
                        <div className="placeholder-bars">
                            <div className="placeholder-bar" style={{ height: "60%" }}></div>
                            <div className="placeholder-bar" style={{ height: "80%" }}></div>
                            <div className="placeholder-bar" style={{ height: "40%" }}></div>
                            <div className="placeholder-bar" style={{ height: "90%" }}></div>
                            <div className="placeholder-bar" style={{ height: "70%" }}></div>
                        </div>
                    </div>
                );
            case "network":
                return (
                    <div className="placeholder-network">
                        <div className="placeholder-nodes">
                            <div className="placeholder-node central"></div>
                            <div className="placeholder-node"></div>
                            <div className="placeholder-node"></div>
                            <div className="placeholder-node"></div>
                            <div className="placeholder-node"></div>
                        </div>
                        <div className="placeholder-edges">
                            <div className="placeholder-edge"></div>
                            <div className="placeholder-edge"></div>
                            <div className="placeholder-edge"></div>
                            <div className="placeholder-edge"></div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="placeholder-container" style={{ height: height }}>
            {getPlaceholderContent()}
        </div>
    );
};

export default Placeholder;
