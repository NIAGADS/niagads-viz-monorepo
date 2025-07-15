import React, { ReactNode } from "react";

interface RecordOverviewSectionProps {
    children: ReactNode;
}

const RecordOverviewSection = ({ children }: RecordOverviewSectionProps) => {
    return (
        <div id="overview" className="overview-section">
            {/* Grid layout for overview cards */}
            <div className="overview-grid">{children}</div>
        </div>
    );
};

export default RecordOverviewSection;
