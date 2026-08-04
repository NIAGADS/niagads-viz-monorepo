"use client";

import { useState } from "react";
import { Card, CardBody } from "@niagads/ui";

import styles from "@/components/HomePage/HomePage.module.css";

import HeroSection from "@/components/HomePage/HeroSection";
import KnownADGenesSection from "@/components/HomePage/KnownADGenesSection";
import QueryExploreSection from "@/components/HomePage/QueryExploreSection";
import DataAtAGlance from "@/components/HomePage/DataAtAGlance";
import GenomicsDBNumbers from "@/components/HomePage/GenomicsDBNumbers";
import GeneticEvidenceSummary from "@/components/HomePage/GeneticEvidenceSummary";
import ResearchStartersSection from "@/components/HomePage/ResearchStartersSection";

type ExploreTab = "genes" | "variants" | "datasets" | "regions";

function ExploreContextPanel({ activeTab }: { activeTab: ExploreTab }) {
    if (activeTab === "genes") {
        return <KnownADGenesSection />;
    }

    if (activeTab === "variants") {
        return <GeneticEvidenceSummary />;
    }

    if (activeTab === "datasets") {
        return <GenomicsDBNumbers />;
    }

    return <DataAtAGlance />;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState<ExploreTab>("genes");

    return (
        <div>
            <HeroSection />
            <section className={styles["front-section"]}>
                <div className={styles["home-grid"]}>
                    <Card span={6} className={styles["card-accent-yellow"]}>
                        <CardBody>
                            <QueryExploreSection activeTab={activeTab} onTabChange={setActiveTab} />
                        </CardBody>
                    </Card>
                    <Card span={6} className={styles["card-accent-blue"]}>
                        <CardBody>
                            <ExploreContextPanel activeTab={activeTab} />
                        </CardBody>
                    </Card>
                    <Card span={12} className={styles["card-accent-yellow"]}>
                        <CardBody>
                            <ResearchStartersSection />
                        </CardBody>
                    </Card>
                </div>
            </section>
        </div>
    );
}
