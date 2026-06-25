"use client";

import { Card, CardBody, CardHeader } from "@niagads/ui";
import { RecordOverview, renderExternalIdentifierLink, renderRecordTitle } from "./RecordOverview";

import AssociationSummaryChart from "../../charts/AssociationSummaryChart";
import { ExternalUrls } from "@/data/reference";
import { GWAS_ASSOC_SECTION } from "@/data/sections";
import { GeneRecord } from "@/lib/types";
import { RecordLink } from "../../Link";
import { genomicLocationToSpan } from "@/lib/utils";

import styles from "./overview.module.css";

const GeneRecordOverview = ({ record }: { record: GeneRecord }) => {
    // Format location string: chr:start-end:strand / cytogenic_location
    const region = genomicLocationToSpan(record.location);
    const location = genomicLocationToSpan(record.location, true);

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");
    
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
                   <div>
                        <div className={styles["card-title"]}>Gene Information</div>
                        <div className={styles["card-subtitle"]}>
                            {renderRecordTitle(record.symbol, record.record_type)}
                            {record.name ? ` — ${record.name}` : ""}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className={styles["gene-info-rows"]}>
                        <div className={styles["gene-info-row"]}>
                            <span className={styles["gene-info-label"]}>Ensembl ID</span>
                            <span className={`${styles["gene-info-value"]} ${styles.mono}`}>
                                {renderExternalIdentifierLink(record.id, ExternalUrls.ENSEMBL_GENE_URL, record.record_type)}
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
                    </div>
                </CardBody>
            </Card>

            <Card span={7}>
                <CardHeader>
                    <div>
                        <div className={styles["card-title"]}>Annotation Summary</div>
                        <div className={styles["card-subtitle"]}>Generated from curated gene annotations and association evidence</div>
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

            <Card span={12}>
                <CardHeader>Genetic Associations</CardHeader>
                <CardBody>
                    <div className="flex" style={{ height: "100%" }}>
                        {GWAS_ASSOC_SECTION.tables!.map((tableDef) => (
                            <AssociationSummaryChart key={tableDef.id} record={record} endpoint={tableDef.endpoint} />
                        ))}
                    </div>
                </CardBody>
            </Card>
        </RecordOverview>
    );
};

export default GeneRecordOverview;
