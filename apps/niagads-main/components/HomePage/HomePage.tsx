"use client";

import { HeroSection } from "@niagads/ui";
import { RESOURCES, RESOURCE_ECOSYSTEM_OVERVIEW, RESOURCE_GROUPS } from "@/data/resources";

// import { HeroSectionSearch } from "./HeroSectionSearch";
import { NewsTeaser } from "./NewsTeaser";
import { ResourceEcosystemViewer } from "@/components/ResourceEcosystemViewer/ResourceEcosystemViewer";
import styles from "./home-page.module.css";
// import { useState } from "react";
import { HeroQuickLinks } from "./HeroQuickLinks";
import { HeroScrollCue } from "./HeroScrollCue";
import { HomePageMission } from "./HomePageMission";

export const HomePage = () => {
    // const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className={styles["home-page-content"]}>
            <HeroSection
                title={
                    <>
                        National Institute on Aging
                        <br />
                        Genetics of Alzheimer's Disease
                        <br />
                        Data Storage Site
                    </>
                }
                subtitle={`Advancing Alzheimer’s and related dementias research through
                    genomic data generation, sharing, resources, and discovery.`}
                // search={<HeroSectionSearch />}
                belowSearch={<HeroQuickLinks />}
                scrollCue={<HeroScrollCue href="#ecosystem" label="Explore NIAGADS" />}
                className={styles["niagads-hero-section"]}
                classNames={{
                    grid: styles["niagads-hero-grid"],
                    content: styles["niagads-hero-content"],
                    title: styles["niagads-hero-title"],
                    subtitle: styles["niagads-hero-subtitle"],
                    search: styles["niagads-hero-search"],
                    rightPanel: styles["niagads-hero-right-panel"],
                }}
            >
                <div className={styles["home-page-hero-panel"]}>
                    <div className={styles["home-page-news-column"]}>
                        <NewsTeaser />
                    </div>
                </div>
            </HeroSection>

            <div id="ecosystem" className={styles["home-page-section"]}>
                <ResourceEcosystemViewer
                    overview={RESOURCE_ECOSYSTEM_OVERVIEW}
                    resources={RESOURCES}
                    resourceGroups={RESOURCE_GROUPS}
                />
            </div>
            <HomePageMission />
        </div>
    );
};
