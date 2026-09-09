"use client";

import { Button, Card, CardBody, CardHeader, Footer } from "@niagads/ui";
import { APISearch } from "@niagads/ui/client";
import { Github, Twitter } from "lucide-react";
import { ResourceEcosystemViewer } from "@/components/ResourceEcosystemViewer/ResourceEcosystemViewer";
import { RESOURCES, RESOURCE_GROUPS } from "@/components/ResourceEcosystemViewer/resources";

import styles from "./home-page.module.css";

export const HomePage = () => {
    return (
        <div className={styles["home-page-content"]}>
            <div className={styles["home-page-section"]}>
                <div className={styles["home-page-heading"]}>
                    <div className={styles["home-page-title"]}>
                        The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site
                    </div>
                    <div className={styles["home-page-description"]}>
                        NIAGADS is a collaborative agreement between the National Institute on Aging and the University
                        of Pennsylvania that stores and distributes genetics and genomics data from studies on
                        Alzheimer's disease, related dementias, and aging to qualified researchers globally.
                    </div>
                    <Card>
                        <CardHeader>Search the site</CardHeader>
                        <CardBody>
                            <APISearch
                                suggestions={[]}
                                onClick={() => console.log("click search")}
                                onSearch={() => console.log("searching")}
                                onValueChange={(value) => console.log(value)}
                                error={""}
                                placeholder="This does not actually work yet..."
                            />
                        </CardBody>
                    </Card>
                </div>
                <hr />
                <div className={styles["home-page-link-buttons"]}>
                    <a href="https://dss.niagads.org/datasets/">
                        <Button className={styles["home-page-dss-link-button"]}>Browse Datasets</Button>
                    </a>
                    <a href="">
                        <Button className={styles["home-page-dss-link-button"]}>Submit Data</Button>
                    </a>
                    <div className={styles["home-page-socials"]}>
                        <Twitter href="" scale={3} />
                        <Github href="" scale={2} />
                    </div>
                </div>
            </div>
            <hr />
            <div className={styles["home-page-section"]}>
                <ResourceEcosystemViewer resources={RESOURCES} resourceGroups={RESOURCE_GROUPS} />
            </div>
            <hr />
            <div className={styles["home-page-section"]}>
                <div className={styles["home-page-signup-buttons"]}>
                    <div>
                        <div className={styles["home-page-button-label"]}>Subscribe to our newsletter</div>
                        <a href="https://dss.niagads.org/datasets/">
                            <Button className={styles["home-page-dss-link-button"]}>Subscribe</Button>
                        </a>
                    </div>
                    <div>
                        <div className={styles["home-page-button-label"]}>Sign up for Help Hours</div>
                        <a href="https://dss.niagads.org/datasets/">
                            <Button className={styles["home-page-dss-link-button"]}>Book Now</Button>
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
