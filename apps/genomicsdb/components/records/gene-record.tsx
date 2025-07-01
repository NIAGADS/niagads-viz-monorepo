"use client";
import { ExternalLink, Eye, Download, Share2 } from "lucide-react";
import type { GeneRecord as GeneRecordType, ContentTabType } from "./types";
import Placeholder from "./placeholder";
import "./record.css";
import "./placeholder.css";

interface GeneRecordProps {
    record: GeneRecordType;
    activeSection: string;
    activeContentTab?: ContentTabType;
    onContentTabChange: (tab: ContentTabType) => void;
}

export function GeneRecord({ record, activeSection, activeContentTab, onContentTabChange }: GeneRecordProps) {
    // Format location string as per README: chr:start-end:strand / cytogenic_location
    const formatLocation = () => {
        const { chr, start, end, strand } = record.location;
        const cytogenic = record.hgnc_annotation?.location;
        const baseLocation = `${chr}:${start.toLocaleString()}-${end.toLocaleString()}:${strand}`;
        return cytogenic ? `${baseLocation} / ${cytogenic}` : baseLocation;
    };

    // Format synonyms as comma-space delimited string
    const formatSynonyms = () => {
        if (!record.synonyms || record.synonyms.length === 0) return null;
        return record.synonyms.join(", ");
    };

    // Content tabs for each section
    const getContentTabs = (section: string) => {
        switch (section) {
            case "niagads-gwas":
                return [
                    { id: "niagads-alzheimers", label: "Alzheimer's disease" },
                    { id: "niagads-neuropathologies", label: "AD-related neuropathologies" },
                ];
            case "gwas-catalog":
                return [
                    { id: "gwas-alzheimers", label: "Alzheimer's disease" },
                    { id: "gwas-other-traits", label: "Other Traits" },
                ];
            case "link-outs":
                return [
                    { id: "related-gene-records", label: "Related Gene Records" },
                    { id: "clinical", label: "Clinical" },
                    { id: "proteins", label: "Proteins" },
                    { id: "nucleotide-sequences", label: "Nucleotide Sequences" },
                    { id: "transcripts", label: "Transcripts" },
                ];
            case "function-prediction":
                return [{ id: "gene-ontology", label: "Gene Ontology" }];
            case "pathways-interactions":
                return [{ id: "pathways", label: "Pathways" }];
            default:
                return [];
        }
    };

    const contentTabs = getContentTabs(activeSection);

    // Set default active tab if none selected
    const currentTab = activeContentTab || (contentTabs.length > 0 ? (contentTabs[0].id as ContentTabType) : undefined);

    // Get section title
    const getSectionTitle = (section: string) => {
        switch (section) {
            case "overview":
                return null; // No title for overview
            case "trait-associations":
                return "Trait Associations";
            case "niagads-gwas":
                return "NIAGADS GWAS Results";
            case "gwas-catalog":
                return "GWAS Catalog Results";
            case "link-outs":
                return "External Resources";
            case "function-prediction":
                return "Function Prediction";
            case "pathways-interactions":
                return "Pathways and Interactions";
            default:
                return null;
        }
    };

    const sectionTitle = getSectionTitle(activeSection);

    // Handle action clicks
    const handleViewInGenomeBrowser = () => {
        const { chr, start, end } = record.location;
        // Navigate to genome browser with gene coordinates
        window.open(`/genome-browser?region=${chr}:${start}-${end}&gene=${record.symbol}`, "_blank");
    };

    const handleExport = () => {
        // Navigate to export page with gene context
        window.open(`/export?type=gene&id=${record.symbol}`, "_blank");
    };

    const handleShare = () => {
        // Copy current URL to clipboard or open share dialog
        navigator.clipboard.writeText(window.location.href);
    };

    return (
        <div className="record-container">
            {/* Action Bar */}
            <div className="action-bar">
                <div className="gene-identifier">
                    <span className="gene-symbol">{record.symbol}</span>
                    {record.name && <span className="gene-name">{record.name}</span>}
                </div>

                <div className="action-buttons">
                    <button
                        className="action-button"
                        onClick={handleViewInGenomeBrowser}
                        title="View in Genome Browser"
                    >
                        <Eye size={16} />
                        View in Genome Browser
                    </button>
                    <button className="action-button" onClick={handleExport} title="Export Gene Data">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="action-button" onClick={handleShare} title="Share Gene Record">
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </div>

            {/* Section Content */}
            <div className="record-content-section">
                {/* Section Title */}
                {sectionTitle && <h2 className="section-title">{sectionTitle}</h2>}

                {/* Content Tabs (if applicable) */}
                {contentTabs.length > 0 && (
                    <div className="content-tabs">
                        {contentTabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`content-tab ${currentTab === tab.id ? "active" : ""}`}
                                onClick={() => onContentTabChange(tab.id as ContentTabType)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {activeSection === "overview" && (
                    <div className="overview-section">
                        {/* Grid layout for overview cards */}
                        <div className="overview-grid">
                            {/* Gene Information Card - 1/3 width */}
                            <div className="card card-third">
                                <h3>Gene Information</h3>
                                <div className="gene-info-content">
                                    <div className="gene-title">
                                        <span className="gene-symbol">{record.symbol}</span>
                                        {record.name && <span className="gene-name"> - {record.name}</span>}
                                    </div>

                                    <div className="gene-details">
                                        <div className="gene-id">
                                            <a
                                                href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${record.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {record.id}
                                            </a>
                                        </div>

                                        {formatSynonyms() && (
                                            <div className="gene-synonyms">
                                                <span className="info-label">Also known as:</span> {formatSynonyms()}
                                            </div>
                                        )}

                                        <div className="gene-type">
                                            <span className="info-label">Gene Type:</span>{" "}
                                            {record.hgnc_annotation?.locus_group?.replace("-", " ") || "protein coding"}
                                        </div>

                                        <div className="gene-location">
                                            <span className="info-label">Location:</span> {formatLocation()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart placeholders - 2/3 width */}
                            <div className="card card-two-thirds">
                                <h3>Expression Profile</h3>
                                <Placeholder type="chart" height={300}>
                                    <div className="placeholder-text">Gene expression chart will be displayed here</div>
                                </Placeholder>
                            </div>

                            <div className="card card-full">
                                <h3>Variant Distribution</h3>
                                <Placeholder type="chart" height={300}>
                                    <div className="placeholder-text">
                                        Variant distribution chart will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "niagads-gwas" && (
                    <div className="niagads-gwas-section">
                        {(!currentTab || currentTab === "niagads-alzheimers") && (
                            <div className="card">
                                <h3>Alzheimer's Disease Associations</h3>
                                <Placeholder type="table">
                                    <div className="placeholder-text">
                                        NIAGADS Alzheimer's disease GWAS data will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "niagads-neuropathologies" && (
                            <div className="card">
                                <h3>AD-related Neuropathologies</h3>
                                <Placeholder type="table">
                                    <div className="placeholder-text">
                                        NIAGADS AD-related neuropathology data will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "gwas-catalog" && (
                    <div className="gwas-catalog-section">
                        {(!currentTab || currentTab === "gwas-alzheimers") && (
                            <div className="card">
                                <h3>Alzheimer's Disease Associations</h3>
                                <Placeholder type="table">
                                    <div className="placeholder-text">
                                        GWAS Catalog Alzheimer's disease data will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "gwas-other-traits" && (
                            <div className="card">
                                <h3>Other Trait Associations</h3>
                                <Placeholder type="table">
                                    <div className="placeholder-text">
                                        GWAS Catalog other trait associations will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "link-outs" && (
                    <div className="link-outs-section">
                        {(!currentTab || currentTab === "related-gene-records") && (
                            <div className="card">
                                <h3>Related Gene Records</h3>
                                <Placeholder type="list">
                                    <div className="placeholder-text">Related gene records will be displayed here</div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "clinical" && (
                            <div className="card">
                                <h3>Clinical Resources</h3>
                                <Placeholder type="list">
                                    <div className="placeholder-text">
                                        Clinical database links will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "proteins" && (
                            <div className="card">
                                <h3>Protein Resources</h3>
                                <Placeholder type="list">
                                    <div className="placeholder-text">
                                        Protein database links will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "nucleotide-sequences" && (
                            <div className="card">
                                <h3>Nucleotide Sequences</h3>
                                <Placeholder type="list">
                                    <div className="placeholder-text">
                                        Nucleotide sequence links will be displayed here
                                    </div>
                                </Placeholder>
                            </div>
                        )}

                        {currentTab === "transcripts" && (
                            <div className="card">
                                <h3>Transcript Information</h3>
                                <Placeholder type="list">
                                    <div className="placeholder-text">Transcript data will be displayed here</div>
                                </Placeholder>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "function-prediction" && (
                    <div className="function-prediction-section">
                        {(!currentTab || currentTab === "gene-ontology") && (
                            <div className="card">
                                <h3>Gene Ontology Annotations</h3>
                                {record.go_annotation && record.go_annotation.length > 0 ? (
                                    <div className="go-annotations">
                                        {record.go_annotation.slice(0, 10).map((annotation, index) => (
                                            <div key={index} className="go-annotation-item">
                                                <div className="go-term">
                                                    <span className="go-id">
                                                        {annotation.go_term_id.replace("_", ":")}
                                                    </span>
                                                    <span className="go-name">{annotation.go_term}</span>
                                                </div>
                                                <div className="go-ontology">
                                                    <span
                                                        className={`ontology-badge ${annotation.ontology.toLowerCase()}`}
                                                    >
                                                        {annotation.ontology}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {record.go_annotation.length > 10 && (
                                            <div className="go-more">
                                                +{record.go_annotation.length - 10} more annotations
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Placeholder type="table">
                                        <div className="placeholder-text">No Gene Ontology annotations available</div>
                                    </Placeholder>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "pathways-interactions" && (
                    <div className="pathways-interactions-section">
                        {(!currentTab || currentTab === "pathways") && (
                            <div className="card">
                                <h3>Pathway Membership</h3>
                                {record.pathway_membership && record.pathway_membership.length > 0 ? (
                                    <div className="pathway-list">
                                        {record.pathway_membership.map((pathway, index) => (
                                            <div key={index} className="pathway-item">
                                                <div className="pathway-name">{pathway.pathway}</div>
                                                <div className="pathway-details">
                                                    <span className="pathway-id">{pathway.pathway_id}</span>
                                                    <span className="pathway-source">{pathway.pathway_source}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Placeholder type="list">
                                        <div className="placeholder-text">No pathway information available</div>
                                    </Placeholder>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
