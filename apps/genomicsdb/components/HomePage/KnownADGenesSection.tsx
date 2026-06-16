// KnownADGenesSection.tsx
import Link from "next/link";
import styles from "./KnownADGenesSection.module.css";

const genes = [
    { symbol: "APOE", name: "Apolipoprotein E", evidence: 9 },
    { symbol: "BIN1", name: "Bridging Integrator 1", evidence: 8 },
    { symbol: "CLU", name: "Clusterin", evidence: 7 },
    { symbol: "PICALM", name: "Phosphatidylinositol Binding Clathrin Assembly Protein", evidence: 6 },
    { symbol: "CR1", name: "Complement Receptor 1", evidence: 6 },
];

const evidenceTypes = [
    { label: "GWAS Association", className: "gwas" },
    { label: "eQTL", className: "eqtl" },
    { label: "pQTL", className: "pqtl" },
    { label: "Protein Function", className: "protein" },
    { label: "Pathway / Reactome", className: "pathway" },
];

export default function KnownADGenesSection() {
    return (
        <div className={styles["known-ad-genes"]}>
            <div className={styles.header}>
                <div>
                    <p className={styles.kicker}>Curated knowledge</p>
                    <h2>Known Alzheimer's disease genes</h2>
                    <p>
                        Genetic evidence curated with reference to the{" "}
                        <Link href="https://topgenes.niagads.org/" target="_blank">
                            ADSP Gene Verification Committee
                        </Link>
                        .
                    </p>
                </div>

                {/* <Link className={styles["view-all"]} href="/genes">
                    View all genes →
                </Link> */}
            </div>

            <div className={styles.table}>
                <div className={styles["row-head"]}>
                    <span>Gene</span>
                    <span>Evidence summary</span>
                    <span>Evidence types</span>
                </div>

                {genes.map((gene) => (
                    <div className={styles.row} key={gene.symbol}>
                        <div>
                            <Link className={styles.gene} href={`/gene/${gene.symbol}`}>
                                {gene.symbol}
                            </Link>
                            <p>{gene.name}</p>
                        </div>

                        <div className={styles.dots} aria-label={`${gene.evidence} evidence points`}>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={i < gene.evidence ? styles["dot-active"] : styles.dot}
                                />
                            ))}
                        </div>

                        <div className={styles.types}>
                            {evidenceTypes.slice(0, 4).map((type) => (
                                <span
                                    key={type.label}
                                    className={`${styles["type-dot"]} ${styles[type.className]}`}
                                    title={type.label}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
                {evidenceTypes.map((type) => (
                    <span key={type.label}>
                        <i className={`${styles["type-dot"]} ${styles[type.className]}`} />
                        {type.label}
                    </span>
                ))}
            </div>
        </div>
    );
}