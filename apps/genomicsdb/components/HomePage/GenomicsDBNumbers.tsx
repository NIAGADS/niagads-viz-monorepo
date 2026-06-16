import styles from "./GenomicsDBNumbers.module.css";

const metrics = [
    {
        label: "GWAS Studies",
        value: "1,125",
    },
    {
        label: "Samples",
        value: "1.24M",
    },
    {
        label: "Significant Variants",
        value: "18,932",
    },
    {
        label: "Genes",
        value: "2,846",
    },
    {
        label: "Fine-mapped Loci",
        value: "243",
    },
    {
        label: "Annotations",
        value: "45.7M",
    },
];

export default function GenomicsDBNumbers() {
    return (
        <div className={styles["genomicsdb-numbers"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Platform coverage</p>
                <h2>GenomicsDB by the numbers</h2>
            </div>

            <div className={styles["metrics-grid"]}>
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className={styles["metric-item"]}
                    >
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}