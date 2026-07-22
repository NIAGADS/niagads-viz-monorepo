"use client";

import { EnhancedSearch } from "@/components/EnhancedSearch";
import styles from "./QueryExploreSection.module.css";

export type ExploreTab = "genes" | "variants" | "datasets" | "regions";

interface QueryExploreSectionProps {
    activeTab: ExploreTab;
    onTabChange: (tab: ExploreTab) => void;
}

const tabs: {
    id: ExploreTab;
    label: string;
    placeholder: string;
    helper: string;
    popularSearches: string[];
}[] = [
    {
        id: "genes",
        label: "Genes",
        placeholder: "e.g. APOE, TREM2, BIN1",
        helper: "Search genes by symbol, name, or identifier",
        popularSearches: ["APOE", "TREM2", "BIN1", "ABCA7", "CLU"],
    },
    {
        id: "variants",
        label: "Variants",
        placeholder: "e.g. rs429358",
        helper: "Search variants by rsID or genomic position",
        popularSearches: ["rs429358", "rs7412", "chr19:44908684"],
    },
    {
        id: "datasets",
        label: "Datasets",
        placeholder: "e.g. IGAP, ADGC",
        helper: "Search studies and GWAS datasets",
        popularSearches: ["IGAP", "ADGC", "UK Biobank", "ADSP"],
    },
    {
        id: "regions",
        label: "Regions",
        placeholder: "e.g. chr19:45411941-45421941",
        helper: "Search genomic regions and loci",
        popularSearches: ["chr19", "APOE locus", "TREM2 locus", "BIN1 locus"],
    },
];

export default function QueryExploreSection({ activeTab, onTabChange }: QueryExploreSectionProps) {
    const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

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
                        onClick={() => onTabChange(tab.id)}
                        className={activeTab === tab.id ? styles["tab-active"] : styles.tab}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles["search-area"]}>
                <p>{currentTab.helper}</p>
                <EnhancedSearch placeholder={currentTab.placeholder} autoRoute />
            </div>

            <div className={styles["popular-searches"]}>
                <span>Popular searches</span>

                <div className={styles["popular-search-list"]}>
                    {currentTab.popularSearches.map((item) => (
                        <button key={item} type="button" className={styles["search-chip"]}>
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
