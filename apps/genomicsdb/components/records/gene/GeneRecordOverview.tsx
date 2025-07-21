import { Card, CardBody, CardHeader } from "@niagads/ui";

import { ExternalUrls } from "@/lib/reference";
import { GeneAssociationSummaryChart } from "./GeneGeneticAssociationSummaryChart";
import { GeneRecord } from "@/lib/types";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { genomicLocationToSpan } from "@/lib/utils";
import { renderRecordTitle } from "../RecordOverview";
import styles from "../styles/record.module.css";

export function GeneRecordOverview({ record }: { record: GeneRecord }) {
    // Format location string: chr:start-end:strand / cytogenic_location
    const span = genomicLocationToSpan(record.location, true);
    const location = record.cytogenic_location ? `${span} / ${record.cytogenic_location}` : span;

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");

    return (
        <>
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
                                <span className={styles.infoLabel}>Location:</span> {location}
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
                    <GeneAssociationSummaryChart recordId={record.id} />
                </CardBody>
            </Card>
        </>
    );
}
