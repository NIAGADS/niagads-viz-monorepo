import React, { ReactNode } from "react";

import { ExternalLink } from "lucide-react";
import { RecordType } from "@/lib/types";

interface RecordOverviewSectionProps {
    children: ReactNode;
}

export const RecordOverviewSection = ({ children }: RecordOverviewSectionProps) => {
    return (
        <div id="overview" className="overview-section">
            {/* Grid layout for overview cards */}
            <div className="overview-grid">{children}</div>
        </div>
    );
};

export const renderRecordTitle = (
    displayId: string,
    externalId: string | null,
    externalUrl: string,
    recordType: RecordType
) => {
    // TODO: title for the link indicating which external resource (depending on record type) this will take you to
    return (
        <div className="record-title">
            <span className={`record-type-badge ${recordType}`}>{displayId}</span>

            {externalId && <span>-</span>}
            {externalId && (
                <a
                    className="record-external-identifier record-external-identifier-text"
                    href={`${externalUrl}${externalId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {externalId}{" "}
                    <ExternalLink className="record-external-identifier record-external-identifier-icon"></ExternalLink>
                </a>
            )}
        </div>
    );
};
