"use client";

import { useState } from "react";
import { EnhancedSearch } from "@/components/EnhancedSearch";
import styles from "./QueryExploreSection.module.css";

const tabs = [
    {
        id: "genes",
        label: "Genes",
        placeholder: "e.g. APOE, TREM2, BIN1",
        helper: "Search genes by symbol, name, or identifier",
    },
    {
        id: "variants",
        label: "Variants",
        placeholder: "e.g. rs429358",
        helper: "Search variants by rsID or genomic position",
    },
    {
        id: "datasets",
        label: "Datasets",
        placeholder: "e.g. IGAP, ADGC",
        helper: "Search studies and GWAS datasets",
    },
    {
        id: "regions",
        label: "Regions",
        placeholder: "e.g. chr19:45411941-45421941",
        helper: "Search genomic regions and loci",
    },
];

const popularSearches = [
    "APOE",
    "TREM2",
    "BIN1",
    "ABCA7",
    "rs429358",
];

export default function QueryExploreSection() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className={styles["query-explore"]}>
            <div className={styles.header}>
                <p className={styles.kicker}>Search & discovery</p>
                <h2>Query & Explore</h2>
            </div>

            <div className={styles["tab-list"]}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={
                            activeTab.id === tab.id
                                ? styles["tab-active"]
                                : styles.tab
                        }
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles["search-area"]}>
                <p>{activeTab.helper}</p>

                <EnhancedSearch
                    placeholder={activeTab.placeholder}
                    autoRoute
                />
            </div>

            <div className={styles["popular-searches"]}>
                <span>Popular searches</span>

                <div className={styles["popular-search-list"]}>
                    {popularSearches.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={styles["search-chip"]}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}