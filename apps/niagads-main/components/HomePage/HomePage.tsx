"use client";

import { Button, Card, CardBody, CardHeader, HeroSection } from "@niagads/ui";
import { RESOURCES, RESOURCE_ECOSYSTEM_OVERVIEW, RESOURCE_GROUPS } from "@/data/resources";

import { HeroSectionSearch } from "./HeroSectionSearch";
import { NewsTeaser } from "./NewsTeaser";
import { ResourceEcosystemViewer } from "@/components/ResourceEcosystemViewer/ResourceEcosystemViewer";
import styles from "./home-page.module.css";
import { useState } from "react";
import { HeroQuickLinks } from "./HeroQuickLinks";
import { HeroScrollCue } from "./HeroScrollCue";

export const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

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
                search={<HeroSectionSearch />}
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
            <hr />
            <div className={styles["home-page-section"]}>
                <div className={styles["home-page-signup-buttons"]}>
                    <div>
                        <div>Subscribe to our newsletter</div>
                        <a href="https://dss.niagads.org/datasets/">
                            <Button className={styles["home-page-hero-link-button"]}>Subscribe</Button>
                        </a>
                    </div>
                    <div>
                        <div>Sign up for Help Hours</div>
                        <a href="https://dss.niagads.org/datasets/">
                            <Button className={styles["home-page-hero-link-button"]}>Book Now</Button>
                        </a>
                    </div>
                </div>
                <hr />
                <div className={styles["home-page-rss-feed"]}>
                    <Card className={styles["home-page-rss-card"]}>
                        <CardHeader>Important Update: NIAGADS DSS Login Changes</CardHeader>
                        <CardBody className={styles["home-page-rss-card-body"]}>
                            As part of NIH's strengthened identity proofing requirements for accessing controlled-access
                            data repositories (CADRs), we are introducing an important update to the login experience.
                            This change is designed to enhance account security and ensure compliance with federal...
                            <Button>Read more...</Button>
                        </CardBody>
                    </Card>
                    <Card className={styles["home-page-rss-card"]}>
                        <CardHeader>Help Us Improve NIAGADS!</CardHeader>
                        <CardBody className={styles["home-page-rss-card-body"]}>
                            We are hosting a collaborative webinar focused on NIAGADS controlled-access datasets and
                            data interoperability across repositories and invite you to participate! This upcoming
                            session is designed specifically for investigators and research teams working with
                            controlled-access AD/ADRD genomic data. Our...
                            <Button>Read more...</Button>
                        </CardBody>
                    </Card>
                    <Card className={styles["home-page-rss-card"]}>
                        <CardHeader>ADSP Phenotype Harmonization Consortium Release 4 is Out!</CardHeader>
                        <CardBody className={styles["home-page-rss-card-body"]}>
                            The fourth release from the Alzheimer's Disease Sequencing Project Phenotype Harmonization
                            Consortium (ADSP-PHC), which includes harmonized phenotypes for ADSP participants with
                            sequencing, is available in the ADSP Umbrella Dataset (NG00067v20). Importantly, this
                            release includes harmonized diagnosis and plasma biomarkers...
                            <Button>Read more...</Button>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
