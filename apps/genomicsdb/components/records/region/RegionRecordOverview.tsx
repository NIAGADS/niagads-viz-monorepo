import { Card, CardBody, CardHeader, HelpIconWrapper } from "@niagads/ui";

import { ExternalUrls } from "@/lib/reference";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { RecordSectionUnderConstructionAlert } from "../RecordSectionUnderConstructionAlert";
import { RegionRecord } from "@/lib/types";
import { genomicLocationToSpan } from "@/lib/utils";
import { renderRecordTitle } from "../RecordOverview";
import styles from "../styles/record.module.css";

export function RegionRecordOverview({ record }: { record: RegionRecord }) {
    // Format location string: chr:start-end:strand / cytogenic_location
    // const location = record.id;

    return (
        <>
            {/* Gene Information Card - 1/3 width */}
            <Card variant="third">
                <CardHeader>{renderRecordTitle(record.id, null, null, record.record_type)}</CardHeader>
                <CardBody>
                    <div className={styles.infoContent}>
                        <div className={styles.details}>
                            <div className={styles.attribute}>
                                <span className={styles.infoLabel}>Length:</span> {record.location.length}
                            </div>
                            <HelpIconWrapper
                                message={"number of genes overlapping or contained within this region"}
                                variant={"info"}
                            >
                                <div className={styles.attribute}>
                                    <span className={styles.infoLabel}>Genes:</span> {record.num_genes}
                                </div>
                            </HelpIconWrapper>
                            {record.location.length! < 50000 && (
                                <HelpIconWrapper
                                    message={"number of variants overlapping or contained within this region"}
                                    variant={"info"}
                                >
                                    <div className={styles.attribute}>
                                        <span className={styles.infoLabel}>Small Variants:</span>{" "}
                                        {record.num_small_variants}
                                    </div>
                                </HelpIconWrapper>
                            )}
                            <HelpIconWrapper
                                message={"number of structural variants overlapping or contained within this region"}
                                variant={"info"}
                            >
                                <div className={styles.attribute}>
                                    <span className={styles.infoLabel}>Structural Variants:</span>{" "}
                                    {record.num_structural_variants}
                                </div>
                            </HelpIconWrapper>
                        </div>
                    </div>
                    <RecordActionToolbar id="region-actions" record={record} />
                </CardBody>
            </Card>

            {/* Chart placeholders - 2/3 width */}
        </>
    );
}
