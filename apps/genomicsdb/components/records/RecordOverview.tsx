import React, { ReactNode } from "react";

import { ExternalLink } from "lucide-react";
import { InlineIcon } from "@niagads/ui";
import { RecordType } from "@/lib/types";
import badgeStyles from "./styles/record-type.module.css";
import styles from "./styles/record.module.css";

interface RecordOverviewProps {
    children: ReactNode;
}

export const RecordOverview = ({ children }: RecordOverviewProps) => {
    return (
        <div id="overview" className={styles.overviewGrid}>
            {children}
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
        <div className={styles.title}>
            <span className={`${badgeStyles.recordTypeBadge} ${badgeStyles[recordType]}`}>{displayId}</span>

            {externalId && <span>-</span>}
            {externalId && (
                <a
                    className={`${styles.externalIdentifier} ${styles.externalIdentifierText}`}
                    href={`${externalUrl}${externalId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <InlineIcon icon={<ExternalLink size={18} />} iconPosition="end">
                        {" "}
                        {externalId}
                    </InlineIcon>
                </a>
            )}
        </div>
    );
};
