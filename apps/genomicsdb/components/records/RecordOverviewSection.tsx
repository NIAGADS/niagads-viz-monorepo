import React, { ReactNode } from "react";

import { ExternalLink } from "lucide-react";
import { ExternalUrls } from "@/lib/reference";
import { GeneRecord } from "@/lib/types";
import { GenomicFeatureActionToolbar } from "./ActionToolbar";
import Placeholder from "./placeholder";
import { genomic_location_to_span } from "@/lib/utils";

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

export const GeneRecordOverview = ({ record }: { record: GeneRecord }) => {
    // Format location string: chr:start-end:strand / cytogenic_location
    const span = genomic_location_to_span(record.location, true);
    const location = record.cytogenic_location ? `${span} / ${record.cytogenic_location}` : span;

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");

    return (
        <>
            {/* Gene Information Card - 1/3 width */}
            <div className="card card-third">
                <h3 className="record-title">
                    <span className="record-type-badge gene">{record.symbol}</span>
                    {record.name && <span className="record-description"> - {record.name}</span>}
                    <a
                        className="record-external-identifier record-external-identifier-text"
                        href={`${ExternalUrls.ENSEMBL_GENE_URL}${record.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {record.id}{" "}
                        <ExternalLink className="record-external-identifier record-external-identifier-icon"></ExternalLink>
                    </a>
                </h3>
                <div className="record-info-content mb-15">
                    <div className="record-details">
                        {synonyms && (
                            <div className="record-attribute">
                                <span className="info-label">Also known as:</span> {synonyms}
                            </div>
                        )}
                        <div className="record-attribute">
                            <span className="info-label">Gene Type:</span> {record.type}
                        </div>
                        <div className="record-attribute">
                            <span className="info-label">Location:</span> {location}
                        </div>
                    </div>
                </div>
                <GenomicFeatureActionToolbar id="gene-actions" record={record} />
            </div>
            {/* Chart placeholders - 2/3 width */}

            <div className="card card-two-thirds">
                <h3>Variant Distribution</h3>
                <Placeholder type="chart" height={300}>
                    <div className="placeholder-text">Variant distribution chart will be displayed here</div>
                </Placeholder>
            </div>
        </>
    );
};
