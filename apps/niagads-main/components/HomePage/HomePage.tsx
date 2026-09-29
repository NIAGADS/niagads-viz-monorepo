"use client";

import { BlueSkyIcon, Button, Card, CardBody, CardHeader, HeroSection, XTwitterIcon } from "@niagads/ui";
import { RESOURCES, RESOURCE_ECOSYSTEM_OVERVIEW, RESOURCE_GROUPS } from "@/data/resources";

import { HeroSectionSearch } from "./HeroSectionSearch";
import { NewsTeaser } from "./NewsTeaser";
import { ResourceEcosystemViewer } from "@/components/ResourceEcosystemViewer/ResourceEcosystemViewer";
import styles from "./home-page.module.css";
import { useState } from "react";

export const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const renderHeroSectionContents = () => (
        <div className={styles["home-page-hero-panel"]}>
            <div className={styles["home-page-link-buttons"]}>
                <a href="https://adsp-data.niagads.org/">
                    <Button title="" className={styles["home-page-hero-link-button"]} disabled>
                        ADSP Data
                    </Button>
                </a>
                <a href="https://dss.niagads.org/datasets/">
                    <Button
                        title="Search, apply for and get controlled access data"
                        className={styles["home-page-hero-link-button"]}
                    >
                        Browse Datasets
                    </Button>
                </a>
                <a href="">
                    <Button
                        title="Submit data to the NIAGADS repository"
                        className={styles["home-page-hero-link-button"]}
                    >
                        Submit Data
                    </Button>
                </a>
            </div>
            <div className={styles["home-page-news-column"]}>
                <NewsTeaser />
                <div className={styles["home-page-socials"]}>
                    <XTwitterIcon scale={3} />
                    <BlueSkyIcon scale={2} />
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles["home-page-content"]}>
            <HeroSection
                title="National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site"
                subtitle={`Advancing Alzheimer’s and related dementias research through
                    genomic data generation, sharing, resources, and discovery.`}
                search={<HeroSectionSearch />}
                children={renderHeroSectionContents()}
            ></HeroSection>
            <hr />
            <div className={styles["home-page-section"]}>
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
