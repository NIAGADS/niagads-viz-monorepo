"use client";

import { BarChart3, Database, Search } from "lucide-react";
import { Button, Card } from "@niagads/ui";

import { EnhancedSearch } from "../EnhancedSearch";
import styles from "@/components/styles/HomePage.module.css";
import { useRouter } from "next/navigation";
import { UnderConstructionPage } from "../UnderConstructionPage";

export function HomePage() {
    const router = useRouter();

    const features = [
        {
            icon: Database,
            title: "Comprehensive Data",
            description: "Access to extensive genomic datasets from multiple brain regions and cohorts",
        },
        {
            icon: Search,
            title: "Advanced Search",
            description: "Powerful search capabilities for genes, variants, and genomic regions",
        },
        {
            icon: BarChart3,
            title: "Data Visualization",
            description: "Interactive charts and plots for genomic analysis and exploration",
        },
    ];

    const stats = [
        { number: "361.5M", label: "From the ADSP" },
        { number: "476.9K", label: "With significant AD/ADRD Risk Associations" },
        { number: "30.7K", label: "Annotated Genes" },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className={styles["heroSection"]}>
                <div className="max-text-width">
                    <h1 className={styles["heroTitle"]}>
                        The NIAGADS <br />
                        Alzheimer's Genomics Database <span style={{ color: "red" }}>BETA</span>
                    </h1>
                    <UnderConstructionPage source="The NIAGADS Alzheimer's GenomicsDB"></UnderConstructionPage>
                </div>
            </section>
        </div>
    );
}
