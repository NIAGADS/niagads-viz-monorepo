import { BaseRecord, RegionRecord } from "@/lib/types";
import { Card, CardBody, CardHeader, HelpIconWrapper } from "@niagads/ui";

import { ExternalUrls } from "@/lib/reference";
import { RecordActionToolbar } from "../RecordActionToolbar";
import RecordSectionUnderConstructionAlert from "../RecordSectionUnderConstructionAlert";
import { genomicLocationToSpan } from "@/lib/utils";
import { renderRecordTitle } from "./RecordOverview";
import styles from "../styles/record.module.css";

const MAX_SPAN_FOR_SMALL_VARIANTS = 50000;

const RegionRecordOverview = async ({ record }: { record: RegionRecord }) => {
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

                            <HelpIconWrapper
                                message={"number of variants overlapping or contained within this region"}
                                variant={"info"}
                            >
                                <div className={styles.attribute}>
                                    <span className={styles.infoLabel}>Small Variants:</span>{" "}
                                    {record.location.length! < MAX_SPAN_FOR_SMALL_VARIANTS
                                        ? record.num_small_variants
                                        : `Region legnth > ${MAX_SPAN_FOR_SMALL_VARIANTS.toLocaleString()}; to view counts of small variants please specify a smaller genomic reigon.`}
                                </div>
                            </HelpIconWrapper>

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
};

export default RegionRecordOverview;
