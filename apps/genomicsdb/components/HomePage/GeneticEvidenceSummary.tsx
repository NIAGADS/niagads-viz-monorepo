// GeneticEvidenceSummary.tsx
import Link from "next/link";
import styles from "./GeneticEvidenceSummary.module.css";

const stats = [
    {
        value: "361.5M",
        label: "From the ADSP",
    },
    {
        value: "476.9K",
        label: "With significant AD/ADRD risk associations",
    },
    {
        value: "30.7K",
        label: "Annotated genes",
    },
];

export default function GeneticEvidenceSummary() {
    return (
        <div className={styles["genetic-evidence-summary"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Data coverage</p>
                <h2>Explore AD/ADRD genetic evidence</h2>
            </div>

            <p className={styles.description}>
                For each dataset, GenomicsDB provides a detailed interactive
                report summarizing the top risk-associated variants. These
                variants are annotated using the{" "}
                <strong>ADSP Annotation Pipeline</strong>{" "}
                <Link href="https://pubmed.ncbi.nlm.nih.gov/29590295/" target="_blank">
                    PMID: 29590295
                </Link>{" "}
                and mapped against sequence features and functional genomics
                data tracks.
            </p>

            <div className={styles["main-stat"]}>
                <strong>1.3B</strong>
                <span>Annotated Variants</span>
            </div>

            <div className={styles["stat-list"]}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles["stat-item"]}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}