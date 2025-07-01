"use client";

import type { SpanRecord as SpanRecordType } from "./types";
import Placeholder from "./placeholder";
import "./record.css";
import "./placeholder.css";

interface SpanRecordProps {
    record: SpanRecordType;
    activeSection: string;
}

export function SpanRecord({ record, activeSection }: SpanRecordProps) {
    return (
        <div className="record-container">
            <div className="record-header">
                <h1 className="record-title">
                    <span className="span-id">{record.id}</span>
                </h1>
                <p className="record-description">{record.description}</p>
            </div>

            <div className="record-metadata">
                <div className="metadata-group">
                    <div className="metadata-label">Location</div>
                    <div className="metadata-value">
                        Chr {record.chromosome}:{record.start.toLocaleString()}-{record.end.toLocaleString()}
                    </div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Length</div>
                    <div className="metadata-value">{record.length.toLocaleString()} bp</div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Type</div>
                    <div className="metadata-value">{record.spanType.replace("_", " ")}</div>
                </div>
                <div className="metadata-group">
                    <div className="metadata-label">Genes</div>
                    <div className="metadata-value">{record.genes.join(", ") || "None"}</div>
                </div>
            </div>

            <div className="record-content-section">
                {activeSection === "overview" && (
                    <div className="overview-section">
                        <h2>Region Overview</h2>
                        <div className="card">
                            <h3>Summary</h3>
                            <p>
                                This {record.spanType.replace("_", " ")} spans {record.length.toLocaleString()} base
                                pairs on chromosome {record.chromosome}
                                from position {record.start.toLocaleString()} to {record.end.toLocaleString()}.
                                {record.genes.length > 0 &&
                                    ` It overlaps with ${record.genes.length} gene(s): ${record.genes.join(", ")}.`}
                            </p>
                        </div>

                        <div className="card">
                            <h3>Features</h3>
                            <div className="features-list">
                                {record.features.map((feature, index) => (
                                    <span key={index} className="feature-badge">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "features" && (
                    <div className="features-section">
                        <h2>Genomic Features</h2>
                        <div className="card">
                            <h3>Feature Annotations</h3>
                            <Placeholder type="table">
                                <div className="placeholder-text">Genomic features table will be displayed here</div>
                            </Placeholder>
                        </div>
                    </div>
                )}

                {activeSection === "genes" && (
                    <div className="genes-section">
                        <h2>Overlapping Genes</h2>
                        <div className="card">
                            <h3>Gene List</h3>
                            <Placeholder type="table">
                                <div className="placeholder-text">Overlapping genes table will be displayed here</div>
                            </Placeholder>
                        </div>
                    </div>
                )}

                {activeSection === "regulatory" && (
                    <div className="regulatory-section">
                        <h2>Regulatory Elements</h2>
                        <div className="card">
                            <h3>Regulatory Annotations</h3>
                            <Placeholder type="chart">
                                <div className="placeholder-text">Regulatory element data will be displayed here</div>
                            </Placeholder>
                        </div>
                    </div>
                )}

                {activeSection === "conservation" && (
                    <div className="conservation-section">
                        <h2>Conservation</h2>
                        <div className="card">
                            <h3>Conservation Scores</h3>
                            <Placeholder type="chart">
                                <div className="placeholder-text">
                                    Conservation score visualization will be displayed here
                                </div>
                            </Placeholder>
                        </div>
                    </div>
                )}

                {activeSection === "datasets" && (
                    <div className="datasets-section">
                        <h2>Associated Datasets</h2>
                        <div className="card">
                            <h3>Available Data</h3>
                            <Placeholder type="list">
                                <div className="placeholder-text">Associated datasets will be displayed here</div>
                            </Placeholder>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
