import Link from "next/link";
import styles from "./ResearchStartersSection.module.css";

const starters = [
    {
        title: "Explore APOE",
        description:
            "Investigate the most well-known Alzheimer's disease risk gene and its associated variants.",
        href: "/record/gene/APOE",
    },
    {
        title: "AD GWAS Data",
        description:
            "Browse genome-wide association studies and summary statistics for Alzheimer's disease.",
        href: "/datasets",
    },
    {
        title: "Chromosome 19",
        description:
            "Explore a genomic region enriched for Alzheimer's disease risk associations.",
        href: "/region/chr19",
    },
];

export default function ResearchStartersSection() {
    return (
        <div className={styles["research-starters"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Get started</p>
                <h2>Popular starting points</h2>
                <p className={styles.description}>
                    Begin your research journey with commonly explored genes,
                    datasets, and genomic regions.
                </p>
            </div>

            <div className={styles["starter-list"]}>
                {starters.map((starter) => (
                    <Link
                        key={starter.title}
                        href={starter.href}
                        className={styles["starter-item"]}
                    >
                        <div>
                            <h3>{starter.title}</h3>
                            <p>{starter.description}</p>
                        </div>

                        <span aria-hidden="true">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}