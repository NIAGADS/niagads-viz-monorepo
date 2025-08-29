import { Badge, Card, CardBody, CardHeader, HelpIcon, InlineIcon } from "@niagads/ui";
// import VariantAssociationSummaryChart from "./VariantGeneticAssociationSummaryChart";
import { BaseRecord, VariantRecord } from "@/lib/types";

import { BadgeCheck } from "lucide-react";
import { ExternalUrls } from "@/lib/reference";
import { HelpIconWrapper } from "@niagads/ui";
import { MostSevereConsequenceCard } from "./MostSevereConsequenceCard";
import Placeholder from "../placeholder";
import { RecordActionToolbar } from "../RecordActionToolbar";
import { RecordLink } from "@/components/Link";
import { RecordSectionUnderConstructionAlert } from "../RecordSectionUnderConstructionAlert";
import { fetchRecord } from "@/lib/route-handlers";
import { genomicLocationToSpan } from "@/lib/utils";
import { renderRecordTitle } from "./RecordOverview";
import styles from "../styles/record.module.css";
import variantStyles from "../styles/variant-record.module.css";

const VariantRecordOverview = async (record: VariantRecord) => {
    const span = genomicLocationToSpan(record.location, false);

    return (
        <>
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
                                <HelpIconWrapper
                                    message="This variant was present in ADSP samples and passed ADSP quality checks."
                                    variant={"info"}
                                >
                                    <Badge icon={<BadgeCheck size={18} />} className={variantStyles.adspVariantBadge}>
                                        ADSP Variant
                                    </Badge>
                                </HelpIconWrapper>
                                {/*<HelpIcon message={undefined} variant={"shield"}></HelpIcon>*/}
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
                    <RecordActionToolbar id="gene-actions" record={record} />
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
        </>
    );
};

export default VariantRecordOverview;
