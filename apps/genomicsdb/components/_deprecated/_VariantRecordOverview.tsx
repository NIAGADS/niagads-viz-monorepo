import { Badge, Card, CardBody, CardHeader } from "@niagads/ui";
import { RecordOverview, renderRecordTitle } from "./RecordOverview";

import { BadgeCheck } from "lucide-react";
import { ExternalUrls } from "@/lib/reference";
import { MostSevereConsequenceCard } from "./MostSevereConsequenceCard";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { RecordLink } from "@/components/Link";
import RecordSectionUnderConstructionAlert from "../RecordSectionUnderConstructionAlert";
// import VariantAssociationSummaryChart from "./VariantGeneticAssociationSummaryChart";
import { VariantRecord } from "@/lib/types";
import { genomicLocationToSpan } from "@/lib/utils";
import styles from "../styles/record.module.css";
import variantStyles from "../styles/variant-record.module.css";

const VariantRecordOverview = (record: VariantRecord) => {
    console.log(record);
    const span = genomicLocationToSpan(record.location, false);

    return (
        <RecordOverview>
            {/* Variant Information Card - 1/3 width */}
            <Card variant="third">
                <CardHeader>
                    {renderRecordTitle(record.id, record.ref_snp_id, ExternalUrls.DBSNP_URL, record.record_type)}
                </CardHeader>
                <CardBody>
                    {/*<div>
                        {record.variant_class && <div className={styles.description}>{record.variant_class}</div>}
                    </div>*/}
                    <div className={styles.infoContent}>
                        {record.is_adsp_variant && (
                            <>
                                <Badge icon={<BadgeCheck size={18} />} className={variantStyles.adspVariantBadge}>
                                    ADSP Variant
                                </Badge>
                            </>
                        )}
                        <div className={styles.details}>
                            {record.allele_string && (
                                <div className={styles.attribute}>
                                    <span className={styles.infoLabel}>Alleles:</span> {record.allele_string}
                                </div>
                            )}
                            <div className={styles.attribute}>
                                <span className={styles.infoLabel}>Variant Type:</span> {record.variant_class}
                            </div>
                            <div className={styles.attribute}>
                                <span className={styles.infoLabel}>Location:</span>{" "}
                                {record.is_structural_variant ? (
                                    <RecordLink recordType={"region"} recordId={span}>
                                        {span}
                                    </RecordLink>
                                ) : (
                                    span
                                )}
                            </div>
                        </div>
                    </div>
                    <RecordActionToolbar id="variant-actions" record={record} />
                </CardBody>
            </Card>

            {record.most_severe_consequence && (
                <MostSevereConsequenceCard conseq={record.most_severe_consequence}></MostSevereConsequenceCard>
            )}

            {/* Chart placeholders - 2/3 width */}
            {record.is_structural_variant !== true && (
                <Card variant="two-thirds">
                    <CardHeader>Variant Associations</CardHeader>
                    <CardBody>
                        {/*<VariantAssociationSummaryChart recordId={record.id} />*/}
                        <RecordSectionUnderConstructionAlert section={"Variant Association Overview"} />
                    </CardBody>
                </Card>
            )}
        </RecordOverview>
    );
};

export default VariantRecordOverview;
