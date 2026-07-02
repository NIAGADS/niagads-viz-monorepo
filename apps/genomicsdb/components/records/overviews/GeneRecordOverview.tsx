"use client";

import { Card, CardBody, CardHeader, InlineIcon } from "@niagads/ui";
import { ExternalLink } from "lucide-react";
import { RecordOverview, renderExternalIdentifierLink, renderRecordTitle } from "./RecordOverview";

import AssociationSummaryChart from "@/components/charts/AssociationSummaryChart";
import { ExternalUrls } from "@/data/reference";
import { GeneRecord } from "@/lib/types";
import { RecordLink } from "@/components/Link";
import { genomicLocationToSpan } from "@/lib/utils";

import styles from "./overview.module.css";

// FIXME: this needs to be moved to types; part of the gene record definition

type KnownGeneEvidence = {
    data_source: string;
    confidence?: string;
    evidence_type?: string;
};

type DiseaseAssociation = {
    disease_name: string;
    disease_id: string;
    evidence?: KnownGeneEvidence[];
};

type KnownAdGeneExtension = {
    is_known_ad_gene?: boolean;
    disease_associations?: DiseaseAssociation[];
};

// FIXME: no hard-coded URLs -> need to pull lookup from API.
const getKnownGeneSourceUrl = (source?: string) => {
    switch (source) {
        case "ADSP GVC":
            return "https://topgenes.niagads.org/";
        case "AD Knowledge Portal":
            return "https://adknowledgeportal.synapse.org/";
        case "Open Targets":
            return "https://platform.opentargets.org/";
        default:
            return null;
    }
};

const GeneRecordOverview = ({ record }: { record: GeneRecord }) => {
    // Format location string: chr:start-end:strand / cytogenic_location
    const region = genomicLocationToSpan(record.location);
    const location = genomicLocationToSpan(record.location, true);

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");

    // // Known AD gene evidence, if available
    // const knownGeneData = record as GeneRecord & KnownAdGeneExtension;

    // const adDiseaseAssociation = knownGeneData.is_known_ad_gene
    //     ? knownGeneData.disease_associations?.find(
    //         (association) =>
    //             association.disease_name.toLowerCase().includes("alzheimer") ||
    //             association.disease_id === "MONDO:0004975"
    //     )
    //     : null;

    // const primaryAdEvidence = adDiseaseAssociation?.evidence?.[0] ?? null;
    // const primaryAdEvidenceUrl = getKnownGeneSourceUrl(primaryAdEvidence?.data_source);

    // Temporary preview only
    const adDiseaseAssociation = {
        disease_name: "Alzheimer's disease",
        disease_id: "MONDO:0004975",
        evidence: [
            {
                data_source: "ADSP GVC",
                confidence: "Tier 1",
                evidence_type: "Genetic evidence",
            },
        ],
    };
    const primaryAdEvidence = adDiseaseAssociation.evidence[0];
    const primaryAdEvidenceUrl = getKnownGeneSourceUrl(primaryAdEvidence.data_source);

    // AI Generated summary of genetic associations for this gene, if available
    // const annotationSummary = record.annotation_summary ?? null;
    const annotationSummary =
        "annotation_summary" in record && typeof record.annotation_summary === "string"
            ? record.annotation_summary
            : null;

    return (
        <RecordOverview>
            {/* Gene Information Card - 1/3 width */}
            <Card span={5}>
                <CardHeader>
                    <div className={styles["gene-info-header"]}>
                        <div>
                            <div className={styles["card-title"]}>Gene Information</div>
                            <div className={styles["card-subtitle"]}>
                                {renderRecordTitle(record.symbol, record.record_type)}
                                {record.name ? ` — ${record.name}` : ""}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className={styles["gene-info-rows"]}>
                        <div className={styles["gene-info-row"]}>
                            <span className={styles["gene-info-label"]}>Ensembl ID</span>
                            <span className={`${styles["gene-info-value"]} ${styles.mono}`}>
                                {renderExternalIdentifierLink(
                                    record.id,
                                    ExternalUrls.ENSEMBL_GENE_URL,
                                    record.record_type
                                )}
                            </span>
                        </div>

                        {synonyms && (
                            <div className={styles["gene-info-row"]}>
                                <span className={styles["gene-info-label"]}>Also known as</span>
                                <span className={styles["gene-info-value"]}>{synonyms}</span>
                            </div>
                        )}

                        <div className={styles["gene-info-row"]}>
                            <span className={styles["gene-info-label"]}>Gene Type</span>
                            <span className={styles["gene-info-value"]}>
                                <span className={styles.tag}>{record.type}</span>
                            </span>
                        </div>

                        <div className={styles["gene-info-row"]}>
                            <span className={styles["gene-info-label"]}>Location</span>
                            <span className={`${styles["gene-info-value"]} ${styles.mono}`}>
                                <RecordLink recordType="region" recordId={region}>
                                    {location}
                                </RecordLink>
                            </span>
                            <span className={styles["gene-info-muted"]}>{record.cytogenic_location}</span>
                        </div>

                        {primaryAdEvidence && (
                            <div className={styles["gene-info-row"]}>
                                <span className={styles["gene-info-label"]}>Known AD Gene</span>

                                <div className={styles["known-ad-gene-inline"]}>
                                    {primaryAdEvidence.confidence && (
                                        <span className={styles["known-ad-gene-confidence"]}>
                                            {primaryAdEvidence.confidence}
                                        </span>
                                    )}

                                    {primaryAdEvidence.evidence_type && (
                                        <span className={styles["known-ad-gene-evidence-text"]}>
                                            {primaryAdEvidence.evidence_type}
                                        </span>
                                    )}
                                    {primaryAdEvidenceUrl ? (
                                        <a
                                            className={styles["known-ad-gene-source-link"]}
                                            href={primaryAdEvidenceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`View source: ${primaryAdEvidence.data_source}`}
                                            aria-label={`View source: ${primaryAdEvidence.data_source}`}
                                        >
                                            <InlineIcon icon={<ExternalLink size={12} />} iconPosition="end">
                                                <span className={styles["known-ad-gene-source"]}>
                                                    {primaryAdEvidence.data_source}
                                                </span>
                                            </InlineIcon>
                                        </a>
                                    ) : (
                                        <span className={styles["known-ad-gene-source"]}>
                                            {primaryAdEvidence.data_source}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            <Card span={7}>
                <CardHeader>
                    <div>
                        <div className={styles["card-title"]}>Annotation Summary</div>
                        <div className={styles["card-subtitle"]}>
                            Generated from curated gene annotations and association evidence
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className={styles["summary-text-card"]}>
                        {annotationSummary ? (
                            <p>{annotationSummary}</p>
                        ) : (
                            <p className={styles["summary-placeholder"]}>
                                Summary will appear here once AI-generated annotation text is available for this record.
                            </p>
                        )}
                    </div>
                </CardBody>
            </Card>
            <Card span={8}>
                <CardHeader>
                    <div>
                        <div className={styles["card-title"]}>Genetic Associations Summary</div>
                        <div className={styles["card-subtitle"]}>Upstream · In-gene · Downstream</div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className={styles["association-summary-chart-container"]}>
                        <AssociationSummaryChart recordId={record.id} recordType={record.record_type} />
                    </div>
                </CardBody>
            </Card>
        </RecordOverview>
    );
};

export default GeneRecordOverview;
