import {
    ArrowRightLeft,
    CheckCircle,
    ChevronsRight,
    CircleSlash,
    Code,
    ExternalLink,
    SplinePointer,
    Split,
} from "lucide-react";
import { Badge, Card, CardBody, CardHeader, InlineIcon } from "@niagads/ui";

import { ExternalUrls } from "@/lib/reference";
import { PredictedConsequence } from "@/lib/types";
import React from "react";
import conseqStyles from "../styles/consequence.module.css";
import { mapConsequenceToClass } from "@/lib/utils";
import styles from "../styles/most-severe-consequence-card.module.css";

export const MostSevereConsequenceCard = ({ conseq }: { conseq: PredictedConsequence }) => {
    const {
        consequence_terms,
        impact,
        is_coding,
        impacted_gene,
        impacted_transcript,
        codon_change,
        amino_acid_cahnge,
    } = conseq;

    const impactClass = {
        HIGH: styles.high,
        MODERATE: styles.moderate,
        LOW: styles.low,
        MODIFIER: styles.modifier,
    }[impact];

    const numTerms = consequence_terms.length;

    return (
        <Card variant="third">
            <CardHeader>Most Severe Predicted Consequence</CardHeader>
            <CardBody>
                <>
                    <div>
                        <div>
                            <h2 className={styles.title}></h2>
                            {impacted_gene && (
                                <>
                                    <p className={styles.gene}>
                                        Gene: <span className={styles.geneName}>{impacted_gene.symbol}</span>
                                    </p>
                                    <p className={styles.subtext}>Ensembl: {impacted_gene.id}</p>
                                </>
                            )}
                        </div>
                        <div>
                            <div className={styles.label}>
                                <InlineIcon icon={<SplinePointer size={15} />}>Impact</InlineIcon>
                            </div>
                            <Badge variant="pill" className={`${styles.badge} ${impactClass}`}>
                                {impact}{" "}
                            </Badge>
                        </div>
                    </div>
                    <div className={styles.infoGrid}>
                        {numTerms > 0 && (
                            <div>
                                <div className={styles.label}>
                                    <InlineIcon icon={<Split size={15} />}>Consequence</InlineIcon>
                                </div>
                                {consequence_terms.slice(0, 3).map((term, i) => (
                                    <div
                                        key={`term-${i}`}
                                        className={`${styles.badge} ${conseqStyles[mapConsequenceToClass(term)]}`}
                                    >
                                        {term.replace("_", " ")}
                                    </div>
                                ))}
                                {numTerms > 5 && <span className={`${styles.badge}`}>{`+ ${numTerms - 3} more`}</span>}
                            </div>
                        )}

                        {impacted_transcript && (
                            <div>
                                <div className={styles.label}>
                                    <InlineIcon icon={<Code size={15} />}>Transcript</InlineIcon>
                                </div>

                                <a
                                    href={`${ExternalUrls.ENSEMBL_TRANSCRIPT_URL}${impacted_transcript}`}
                                    target="_blank"
                                >
                                    <InlineIcon iconPosition="end" icon={<ExternalLink size={12}></ExternalLink>}>
                                        {impacted_transcript}
                                    </InlineIcon>
                                </a>
                            </div>
                        )}

                        <div>
                            <div className={styles.label}>
                                <InlineIcon icon={<ChevronsRight size={15} />}>Coding Change?</InlineIcon>
                            </div>

                            {is_coding === true ? (
                                <div className={styles.coding}>
                                    <InlineIcon icon={<CheckCircle size={12} />}>Yes</InlineIcon>
                                </div>
                            ) : (
                                (is_coding === false || is_coding === null) && (
                                    <InlineIcon icon={<CircleSlash size={12} color="red"></CircleSlash>}>No</InlineIcon>
                                )
                            )}
                        </div>

                        <div>
                            <div className={styles.label}>
                                <InlineIcon icon={<ChevronsRight size={15} />}>Codon Change</InlineIcon>
                            </div>
                            <div className={styles.codonChange}>
                                {codon_change ?? <span className={styles.italic}>Not available</span>}
                            </div>
                        </div>

                        <div className={styles.fullWidth}>
                            <div className={styles.label}>
                                <InlineIcon icon={<ArrowRightLeft size={15} />}>Amino Acid Change</InlineIcon>
                            </div>
                            <div className={styles.italic}>{amino_acid_cahnge ?? "Not available"}</div>
                        </div>
                    </div>
                </>
            </CardBody>
        </Card>
    );
};
