"use client";

import "./record.css";

interface VariantRecordProps {
    record: any;
    activeSection: string;
}

export function VariantRecord({ record, activeSection }: VariantRecordProps) {
    return (
        <div className="record-container">
            <div className="record-header">
                <h1 className="record-title">
                    <span className="variant-id">{record.id}</span>
                </h1>
                <p className="record-description">
                    {record.type === "RefSNP" ? "Reference SNP" : "Genomic Location"} on chromosome {record.chromosome}
                </p>
            </div>

            <div className="record-metadata">
                <div className="metadata-group">
                    <div className="metadata-label">Location</div>
                    <div className="metadata-value">
                        Chr {record.chromosome}:{record.position}
                    </div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Alleles</div>
                    <div className="metadata-value">
                        {record.reference}/{record.alternate}
                    </div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Genes</div>
                    <div className="metadata-value">{record.genes.join(", ")}</div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Consequence</div>
                    <div className="metadata-value">{record.consequence}</div>
                </div>
            </div>

            <div className="record-content-section">
                {activeSection === "overview" && (
                    <div className="overview-section">
                        <h2>Variant Overview</h2>
                        <div className="card">
                            <h3>Summary</h3>
                            <p>
                                {record.id} is a {record.consequence} variant located on chromosome {record.chromosome}{" "}
                                at position {record.position}. It has a minor allele frequency of {record.maf} and is
                                associated with {record.phenotypes.join(", ")}.
                            </p>
                        </div>

                        <div className="card">
                            <h3>Functional Impact</h3>
                            <div className="impact-badge impact-{record.impact.toLowerCase()}">{record.impact}</div>
                            <p>
                                This variant is predicted to have a {record.impact.toLowerCase()} impact on gene
                                function.
                            </p>
                        </div>
                    </div>
                )}

                {activeSection === "population" && (
                    <div className="population-section">
                        <h2>Population Frequencies</h2>
                        <div className="card">
                            <h3>Allele Frequencies</h3>
                            <div className="placeholder-chart">
                                <div className="placeholder-text">Population frequency data will be displayed here</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "functional" && (
                    <div className="functional-section">
                        <h2>Functional Impact</h2>
                        <div className="card">
                            <h3>Predicted Effects</h3>
                            <div className="placeholder-table">
                                <div className="placeholder-text">Functional impact data will be displayed here</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "associations" && (
                    <div className="associations-section">
                        <h2>Disease Associations</h2>
                        <div className="card">
                            <h3>Associated Phenotypes</h3>
                            <div className="placeholder-list">
                                <div className="placeholder-text">Disease association data will be displayed here</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "linkage" && (
                    <div className="linkage-section">
                        <h2>Linkage Disequilibrium</h2>
                        <div className="card">
                            <h3>LD Plot</h3>
                            <div className="placeholder-chart">
                                <div className="placeholder-text">
                                    Linkage disequilibrium data will be displayed here
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
