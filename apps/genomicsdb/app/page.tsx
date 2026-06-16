"use client";

import { BarChart3, Database, Search } from "lucide-react";
import { Button, Card, FeatureCard } from "@niagads/ui";
import { EnhancedSearch } from "@/components/EnhancedSearch";

import styles from "@/components/styles/HomePage.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import diagram from "@public/main-diagram.svg";
import KnownADGenesSection from "@/components/HomePage/KnownADGenesSection";
import QueryExploreSection from "@/components/HomePage/QueryExploreSection";
import DataAtAGlance from "@/components/HomePage/DataAtAGlance";
import ExploreBySection from "@/components/HomePage/ExploreBySection";
import GenomicsDBNumbers from "@/components/HomePage/GenomicsDBNumbers";
import GeneticEvidenceSummary from "@/components/HomePage/GeneticEvidenceSummary";
import ResearchStartersSection from "@/components/HomePage/ResearchStartersSection";



// import { EnhancedSearch } from "../EnhancedSearch";

export default function Home() {
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
            <section className={styles["hero-section"]}>
                <div className={styles["hero-grid"]}>
                    <div className={styles["hero-grid-item"]}>
                        <h1 className={styles["hero-title"]}>
                            Explore the genetics of Alzheimer's disease
                        </h1>
                          {/* <h1 className={styles["hero-title"]}>
                            The NIAGADS <br />
                            Alzheimer's Genomics Database
                        </h1> */}
                        {/* <p className={styles["hero-subtitle"]}>
                            is an interactive knowledgebase for Alzheimer's disease (AD) genetics. It provides a platform
                            for data sharing, discovery, and analysis to help advance the understanding of the complex
                            genetic underpinnings of AD neurodegeneration and accelerate the progress of research on AD and
                            AD related dementias (ADRD).
                        </p> */}
                        <p className={styles["hero-subtitle"]}>NIAGADS GenomicsDB is a comprehensive resource of GWAS summary statistics and related data to help the research community discover and interpret genetic risk for AD.</p>

                        {/* <div className={styles["hero-search"]}>
                            <EnhancedSearch
                                placeholder="Search genes, variants, or genomic regions (e.g., APOE, rs429358)"
                                autoRoute={true}
                            />
                            <div className={styles["chips"]}>
                                <span className={styles["cl"]}>Try:</span>
                                <span className={styles["chip"]}>APOE</span>
                                <span className={styles["chip"]} >TREM2</span>
                                <span className={styles["chip"]} >rs429358</span>
                                <span className={styles["chip"]} >chr19:45…</span>
                                <span className={styles["chip"]}>CSF biomarkers</span>
                            </div>
                        </div> */}
                    </div>
                    <div className={styles["hero-grid-item"]}>
                             <div className={styles["hero-graphic"]}>
                                <figure>
                                    <Image width={1000} height={500} src={diagram} alt="Niagads GenomicsDB diagram" />
                                </figure>
                             </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles["front-section"]}>
                <div className={styles["home-grid"]}>
                    <Card span={7}>
                        <QueryExploreSection />
                    </Card>
                     <Card span={5}>
                        <DataAtAGlance />
                    </Card>
                    <Card span={6}>
                        <KnownADGenesSection />
                    </Card>
                     <Card span={6}>
                        <GeneticEvidenceSummary />
                    </Card>
                   
                     {/* <Card span={6}>
                        <ExploreBySection />
                    </Card> */}
                      <Card span={12}>
                        <ResearchStartersSection />
                    </Card>
                     {/* <Card span={6}>
                        <GenomicsDBNumbers />
                    </Card> */}
                </div>    
            </section>
            <section className={styles["front-section"]}>
                <div className="text-center mb-15">
                        <h2 className="text-3xl font-bold text-primary mb-1">Powerful Research Tools</h2>
                        <p className="text-lg text-secondary max-width-600">
                            Discover insights in Alzheimer's disease genomics with our comprehensive suite of analysis
                            tools
                        </p>
                    </div>

                    <div className={styles["feature-grid"]}>
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={`feature-${index}`}
                                span={4}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            ></FeatureCard>
                        ))}
                    </div>
            </section>

            {/* Stats Section */}
            {/* <section className={styles["stats-section"]}>
                <div className="max-text-width">
                    <h2 className="text-2xl font-bold text-primary mb-15">
                        Explore AD/ADRD Genetic Evidence for AD/ADRD
                    </h2>
                    <div className={styles["section-description"]}>
                        For each dataset we provide a detailed interactive report summarizing the top risk-associated
                        variants. These variants are are annotated using the ADSP Annotation Pipeline (Butkiewicz et al.
                        Bioinformatics 2018 / PMID:{" "}
                        <a href="https://pubmed.ncbi.nlm.nih.gov/29590295/" target="_blank">
                            29590295
                        </a>
                        ) and mapped against sequence features and functional genomics data tracks to help researchers
                        explore the potential impact of risk-associated variants in a broader genomics context.
                    </div>
                    <div className={styles["main-stat-number"]}>1.3B Annotated Variants</div>
                    <div className={styles["stats-grid"]}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles["statItem"]}>
                                <div className={styles["statNumber"]}>{stat.number}</div>
                                <div className={styles["statLabel"]}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* Quick Start Section */}
            {/* <section style={{ padding: "4rem 2rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div className="text-center mb-15">
                        <h2 className="text-3xl font-bold text-primary mb-1">Get Started</h2>
                        <p className="text-lg text-secondary">
                            Begin your research journey with these popular starting points
                        </p>
                    </div>

                    <div className={styles["feature-grid"]}>
                        <Card span={4} onClick={() => router.push("/record/gene/APOE")}>
                            <div className={styles["feature-title"]}>Explore APOE</div>
                            <p className={styles["feature-description"]}>
                                Investigate the most well-known Alzheimer's risk gene and its variants
                            </p>
                        </Card>

                        <Card span={4} onClick={() => router.push("/search?q=Alzheimer's disease")}>
                            <div className={styles["feature-title"]}>AD GWAS Data</div>
                            <p className={styles["feature-description"]}>
                                Browse genome-wide association studies for Alzheimer's disease
                            </p>
                        </Card>

                        <Card span={4} hover={true} onClick={() => router.push("/record/variant/chr19:44908684")}>
                            <div className={styles["feature-title"]}>Chromosome 19</div>
                            <p className={styles["feature-description"]}>
                                Explore variants on chromosome 19, enriched for AD associations
                            </p>
                        </Card>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
