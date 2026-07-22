// ExploreBySection.tsx
import Link from "next/link";
import styles from "./ExploreBySection.module.css";

const items = [
    {
        title: "Genes",
        description: "Explore genes and their associations",
        href: "/genes",
    },
    {
        title: "Variants",
        description: "Investigate variants and genomic regions",
        href: "/variants",
    },
    {
        title: "Traits",
        description: "Browse traits and phenotypes",
        href: "/traits",
    },
    {
        title: "Datasets",
        description: "Access curated studies and data",
        href: "/datasets",
    },
];

export default function ExploreBySection() {
    return (
        <div className={styles["explore-by"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Start exploring</p>
                <h2>Explore by</h2>
            </div>

            <div className={styles["explore-list"]}>
                {items.map((item) => (
                    <Link key={item.title} href={item.href} className={styles["explore-item"]}>
                        <div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>

                        <span aria-hidden="true">→</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
