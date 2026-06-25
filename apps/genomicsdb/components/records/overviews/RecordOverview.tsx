import { EntityRecord, RecordType } from "@/lib/types";
import { ExternalLink, Minus } from "lucide-react";
import React, { ReactNode } from "react";

import { CardGrid, InlineIcon } from "@niagads/ui";
import badgeStyles from "./record-type.module.css";
import styles from "./overview.module.css";

export interface RecordOverviewProps {
    record: EntityRecord;
}

export const RecordOverview = ({ children }: { children: ReactNode }) => {
    return (
        <div id="overview" className={styles["record-overview"]}>
            <div className={styles["section-heading"]}>Overview</div>
            <CardGrid className={[styles["card-grid"], styles["overview-grid"]].join(" ")}>
                {children}
            </CardGrid>
        </div>
    );
};

const EXTERNAL_RESOURCE_LABELS: Partial<Record<RecordType, string>> = {
    gene: "Ensembl",
    variant: "dbSNP",
    region: "Genome Browser",
    structural_variant: "External resource",
    track: "External resource",
};

export const renderRecordTitle = (displayId: string, recordType: RecordType) => {
    return (
        <span className={`${badgeStyles.recordTypeBadge} ${badgeStyles[recordType]}`}>
            {displayId}
        </span>
    );
};

export const renderExternalIdentifierLink = (
    externalId: string | null,
    externalUrl: string | null,
    recordType: RecordType
) => {
    if (!externalId || !externalUrl) {
        return null;
    }

    const resourceLabel = EXTERNAL_RESOURCE_LABELS[recordType] ?? "external resource";

    return (
        <a
            className={`${styles.externalIdentifier} ${styles.externalIdentifierText}`}
            href={`${externalUrl}${externalId}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`View ${externalId} in ${resourceLabel}`}
            aria-label={`View ${externalId} in ${resourceLabel}`}
        >
            <InlineIcon icon={<ExternalLink size={14} />} iconPosition="end">
                {externalId}
            </InlineIcon>
        </a>
    );
};
