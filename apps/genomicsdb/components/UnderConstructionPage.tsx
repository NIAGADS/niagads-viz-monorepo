"use client";

import { Alert } from "@niagads/ui";
import React from "react";
import { RecordLink } from "./Link";
import styles from "./styles/UnderConstruction.module.css";

export const UnderConstructionPage = ({ source }: { source: string }) => (
    <div className={styles.container}>
        <Alert variant="construction" message={`${source}: Under Construction`}>
            <div>
                <p>The new version of the NIAGADS GenomicsDB is still under development. Please check back soon. </p>
                <p>The site will continue to be updated until planned production release (September 2025).</p>
            </div>
        </Alert>
        <Alert variant="info" message="What's available?" style={{ marginTop: "2rem" }}>
            <div>
                <p>
                    <strong>Detailed Genomic Feature Reports</strong>
                </p>
                <p>Find specific genomic feature reports using the address bar search</p>
                <ul style={{ padding: "1rem" }}>
                    <li>
                        Genes, e.g.,{" "}
                        <RecordLink recordType="gene" recordId={"ENSG00000064687"}>
                            ABCA7
                        </RecordLink>
                    </li>
                    <li>
                        Variants, e.g.,{" "}
                        <RecordLink recordType={"variant"} recordId={"1:207518704:A:G"}>
                            rs6656401
                        </RecordLink>
                    </li>
                    <li>
                        Structural Variants, e.g.,{" "}
                        <RecordLink recordType={"variant"} recordId={"DUP_CHR10_2A1CEBD0"}></RecordLink>
                    </li>
                    <li>
                        Regions, e.g., <RecordLink recordType={"region"} recordId={"19:44905791-44909393"}></RecordLink>
                    </li>
                </ul>
            </div>
        </Alert>
    </div>
);
