import styles from "./hero-quick-links.module.css";
import { Database, Dna, Upload } from "lucide-react";

export const HeroQuickLinks = () => {
    return (
        <div className={styles["hero-quick-links"]}>
            <a
                href="https://dss.niagads.org/datasets/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["hero-quick-link"]}
            >
                <span className={styles["hero-quick-link-icon"]} aria-hidden="true">
                    <Database />
                </span>
                <span className={styles["hero-quick-link-title"]}>Browse Datasets</span>
                <span className={styles["hero-quick-link-arrow"]}>→</span>
            </a>
            <a href="https://niagads.scrollhelp.site/support/data-submission" target="_blank" rel="noopener noreferrer" className={styles["hero-quick-link"]}>
                <span className={styles["hero-quick-link-icon"]} aria-hidden="true">
                    <Upload />
                </span>
                <span className={styles["hero-quick-link-title"]}>Submit Data</span>
                <span className={styles["hero-quick-link-arrow"]}>→</span>
            </a>
            {/* <a
                href="https://adsp-data.niagads.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["hero-quick-link"]}
            >
                <span className={styles["hero-quick-link-icon"]} aria-hidden="true">
                    <Dna />
                </span>
                <span className={styles["hero-quick-link-title"]}>ADSP Data</span>
                <span className={styles["hero-quick-link-arrow"]}>→</span>
            </a> */}
        </div>
    );
};
