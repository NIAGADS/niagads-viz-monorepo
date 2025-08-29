import { BaseRecord, GeneRecord } from "@/lib/types";
import { Card, CardBody, CardHeader } from "@niagads/ui";
import { RecordOverview, renderRecordTitle } from "./RecordOverview";

import { ExternalUrls } from "@/lib/reference";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { RecordLink } from "../../Link";
import { RecordSectionUnderConstructionAlert } from "../RecordSectionUnderConstructionAlert";
import { genomicLocationToSpan } from "@/lib/utils";
import styles from "../styles/record.module.css";

const GeneRecordOverview = async (record: GeneRecord) => {
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
                    <RecordSectionUnderConstructionAlert section={"Gene Genetic Association Overview"} />
                    {/*<GeneAssociationSummaryChart recordId={record.id} />*/}
                </CardBody>
            </Card>
        </RecordOverview>
    );
};

export default GeneRecordOverview;
