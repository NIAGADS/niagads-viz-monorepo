import { EntityRecord, RecordType } from "@/lib/types";
import { ExternalLink, Minus } from "lucide-react";
import React, { ReactNode } from "react";

import { InlineIcon } from "@niagads/ui";
import badgeStyles from "./styles/record-type.module.css";
import styles from "./styles/record.module.css";

export interface RecordOverviewProps {
    record: EntityRecord;
}

export const RecordOverview = ({ children }: { children: ReactNode }) => {
    return (
        <div id="overview" className={styles.overviewGrid}>
            {children}
        </div>
    );
};

export const renderRecordTitle = (
    displayId: string,
    externalId: string | null,
    externalUrl: string | null,
    recordType: RecordType
) => {
    // TODO: title for the link indicating which external resource (depending on record type) this will take you to
    return (
        <div className={styles.title}>
            <span className={`${badgeStyles.recordTypeBadge} ${badgeStyles[recordType]}`}>{displayId}</span>

            {externalId && <Minus size={12} className={styles.minusIcon} />}
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
