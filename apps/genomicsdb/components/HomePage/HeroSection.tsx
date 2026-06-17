import Image from "next/image";
import diagram from "@public/niagads_genomicsdb-diagram_white.svg";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
    return (
            <section className={styles["hero-section"]}>
                <div className={styles["hero-grid"]}>
                    <div className={styles["hero-grid-item"]}>
                        <h1 className={styles["hero-title"]}>
                            Explore the genetics of Alzheimer's disease
                        </h1>
                        <p className={styles["hero-subtitle"]}>NIAGADS GenomicsDB is a comprehensive resource of GWAS summary statistics and related data to help the research community discover and interpret genetic risk for AD.</p>
                    </div>
                    <div className={styles["hero-grid-item"]}>
                        <div className={styles["hero-graphic"]}>
                            <Image
                                src={diagram}
                                alt="Diagram showing the relationship between genetic variants, genes, and Alzheimer's disease"
                                width={650}
                                // height={300}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>
    );
}            