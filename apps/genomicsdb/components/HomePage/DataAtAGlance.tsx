// DataAtAGlance.tsx
import styles from "./DataAtAGlance.module.css";

const items = [
    {
        value: "40+",
        label: "Consortia & studies",
    },
    {
        value: "Millions",
        label: "Variants & annotations",
    },
    {
        value: "Curated",
        label: "Standards-based data resources",
    },
];

export default function DataAtAGlance() {
    return (
        <div className={styles["data-at-a-glance"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Resource overview</p>
                <h2>Data at a glance</h2>
            </div>

            <div className={styles["glance-list"]}>
                {items.map((item) => (
                    <div
                        key={item.label}
                        className={styles["glance-item"]}
                    >
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}