"use client";

import { Card, CardBody, CardHeader } from "@niagads/ui";
import { RecordOverview, renderRecordTitle } from "./RecordOverview";
import { ExternalUrls } from "@/data/reference";
import { GeneRecord } from "@/lib/types";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { RecordLink } from "../../Link";
import { genomicLocationToSpan } from "@/lib/utils";
import styles from "../styles/record.module.css";
import { AssociationSummaryChart } from "@niagads/charts";
import { GWAS_ASSOC_SECTION } from "@/data/sections";
import { getUrlParam } from "@niagads/common";

const GeneRecordOverview = ({ record }: { record: GeneRecord }) => {
    // Format location string: chr:start-end:strand / cytogenic_location
    const region = genomicLocationToSpan(record.location);
    const location = genomicLocationToSpan(record.location, true);

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");

    return (
        <RecordOverview>
            {/* Gene Information Card - 1/3 width */}
            <Card variant="third">
                <CardHeader>
                    {renderRecordTitle(record.symbol, record.id, ExternalUrls.ENSEMBL_GENE_URL, record.record_type)}
                </CardHeader>
                <CardBody>
                    <div>{record.name && <div className={styles.description}>{record.name}</div>}</div>
                    <div className={styles.infoContent}>
                        <div className={styles.details}>
                            {synonyms && (
                                <div className={styles.attribute}>
                                    <span className={styles.infoLabel}>Also known as:</span> {synonyms}
                                </div>
                            )}
                            <div className={styles.attribute}>
                                <span className={styles.infoLabel}>Gene Type:</span> {record.type}
                            </div>
                            <div className={styles.attribute}>
                                <span className={styles.infoLabel}>Location:</span>{" "}
                                <RecordLink recordType={"region"} recordId={region}>
                                    {location}
                                </RecordLink>
                                <span>{` / ${record.cytogenic_location}`}</span>
                            </div>
                        </div>
                    </div>
                    <RecordActionToolbar id="gene-actions" record={record} />
                </CardBody>
            </Card>

            {/* Chart placeholders - 2/3 width */}
            <Card variant="two-thirds">
                <CardHeader>Genetic Associations</CardHeader>
                <CardBody>
                    <div className="flex" style={{ height: "100%", width: "100%" }}>
                        {GWAS_ASSOC_SECTION.tables!.map((tableDef) => (
                            <div key={tableDef.id} style={{ height: "100%", width: "100%" }}>
                                <AssociationSummaryChart
                                    id={tableDef.id}
                                    base_url={`/api/record/${record.record_type}/${record.id}/associations`}
                                    trait={getUrlParam(tableDef.endpoint, "trait")!}
                                    source={getUrlParam(tableDef.endpoint, "source")!}
                                />
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </RecordOverview>
    );
};

export default GeneRecordOverview;
