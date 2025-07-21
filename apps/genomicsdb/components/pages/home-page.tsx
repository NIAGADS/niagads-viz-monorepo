"use client";

import { BarChart3, Database, Search } from "lucide-react";
import { Button } from "@niagads/ui";
import { EnhancedSearch } from "../EnhancedSearch";
import { useRouter } from "next/navigation";

export function HomePage() {
    const router = useRouter();
    const suggestions = ["APOE", "TREM2", "APP", "PSEN1", "MAPT", "CLU", "CR1", "PICALM", "Alzheimer's disease"];

    // const handleSearch = (query: string) => {
    //   // Navigate to search page with query parameter
    //   router.push(`/search?q=${encodeURIComponent(query)}`)
    // }

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
            <section className="hero-section">
                <div className="max-text-width">
                    <h1 className="hero-title">
                        The NIAGADS <br />
                        Alzheimer's Genomics Database
                    </h1>
                    <p className="hero-subtitle">
                        is an interactive knowledgebase for Alzheimer's disease (AD) genetics. It provides a platform
                        for data sharing, discovery, and analysis to help advance the understanding of the complex
                        genetic underpinnings of AD neurodegeneration and accelerate the progress of research on AD and
                        AD related dementias (ADRD).
                    </p>

                    <div className="hero-search">
                        <EnhancedSearch
                            placeholder="Search genes, variants, or genomic regions (e.g., APOE, rs429358)"
                            autoRoute={true}
                        />
                    </div>

                    <div className="hero-buttons">
                        <Button color="primary" onClick={() => router.push("/browse-datasets")} className="bg-primary">
                            <Search size={20} />
                            Start Exploring
                        </Button>
                        <Button onClick={() => router.push("/browse-datasets")}>
                            <Database size={20} />
                            Browse Datasets
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: "4rem 2rem" }}>
                <div className="max-text-width">
                    <div className="text-center mb-15">
                        <h2 className="text-3xl font-bold text-primary mb-1">Powerful Research Tools</h2>
                        <p className="text-lg text-secondary max-width-600">
                            Discover insights in Alzheimer's disease genomics with our comprehensive suite of analysis
                            tools
                        </p>
                    </div>

                    <div className="feature-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <feature.icon className="feature-icon" />
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="max-text-width">
                    <h2 className="text-2xl font-bold text-primary mb-15">
                        Explore AD/ADRD Genetic Evidence for AD/ADRD
                    </h2>
                    <div className="section-description">
                        For each dataset we provide a detailed interactive report summarizing the top risk-associated
                        variants. These variants are are annotated using the ADSP Annotation Pipeline (Butkiewicz et al.
                        Bioinformatics 2018 / PMID:{" "}
                        <a href="https://pubmed.ncbi.nlm.nih.gov/29590295/" target="_blank">
                            29590295
                        </a>
                        ) and mapped against sequence features and functional genomics data tracks to help researchers
                        explore the potential impact of risk-associated variants in a broader genomics context.
                    </div>
                    <div className="main-stat-number">1.3B Annotated Variants</div>
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Start Section */}
            <section style={{ padding: "4rem 2rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div className="text-center mb-15">
                        <h2 className="text-3xl font-bold text-primary mb-1">Get Started</h2>
                        <p className="text-lg text-secondary">
                            Begin your research journey with these popular starting points
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div
                            className="feature-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/records/gene/APOE")}
                        >
                            <div className="feature-title">Explore APOE</div>
                            <p className="feature-description">
                                Investigate the most well-known Alzheimer's risk gene and its variants
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/search?q=Alzheimer's disease")}
                        >
                            <div className="feature-title">AD GWAS Data</div>
                            <p className="feature-description">
                                Browse genome-wide association studies for Alzheimer's disease
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            style={{ cursor: "pointer" }}
                            onClick={() => router.push("/records/variant/chr19:44908684")}
                        >
                            <div className="feature-title">Chromosome 19</div>
                            <p className="feature-description">
                                Explore variants on chromosome 19, enriched for AD associations
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
