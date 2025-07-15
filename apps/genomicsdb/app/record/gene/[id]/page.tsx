import React from "react";
import { GeneRecord, PageProps } from "@/lib/types";
import { GeneRecordOverview, RecordOverviewSection } from "@/components/records/RecordOverviewSection";

import { fetchRecord } from "@/lib/route-handlers";

export default async function GeneDetailPage({ params, searchParams }: PageProps) {
    const { id } = await params;

    const record: GeneRecord = (await fetchRecord(`/api/record/gene/${id}?content=brief`)) as GeneRecord;

    return (
        <RecordOverviewSection>
            <GeneRecordOverview record={record}></GeneRecordOverview>
        </RecordOverviewSection>
    );
}

/*
  

                      
                        <div className="niagads-gwas-section">
                            <Tabs
                                width="full"
                                tabs={[
                                    {
                                        id: "niagads-alzheimers",
                                        label: "NIAGADS Alzheimers",
                                        content: (
                                            <div className="card">
                                                <h3>Alzheimer's Disease Associations</h3>
                                                <Placeholder type="table">
                                                    <div className="placeholder-text">
                                                        NIAGADS Alzheimer's disease GWAS data will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "niagads-neuropathologies",
                                        label: "NIAGADS Neuropathologies",
                                        content: (
                                            <div className="card">
                                                <h3>AD-related Neuropathologies</h3>
                                                <Placeholder type="table">
                                                    <div className="placeholder-text">
                                                        NIAGADS AD-related neuropathology data will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                        <div className="gwas-catalog-section">
                            <Tabs
                                width="full"
                                tabs={[
                                    {
                                        id: "gwas-alzheimers",
                                        label: "GWAS Alzheimers",
                                        content: (
                                            <div className="card">
                                                <h3>Alzheimer's Disease Associations</h3>
                                                <Placeholder type="table">
                                                    <div className="placeholder-text">
                                                        GWAS Catalog Alzheimer's disease data will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "gwas-other-traits",
                                        label: "GWAS Other Traits",
                                        content: (
                                            <div className="card">
                                                <h3>Other Trait Associations</h3>
                                                <Placeholder type="table">
                                                    <div className="placeholder-text">
                                                        GWAS Catalog other trait associations will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                        <div className="link-outs-section">
                            <Tabs
                                width="full"
                                tabs={[
                                    {
                                        id: "related-gene-records",
                                        label: "Related Gene Records",
                                        content: (
                                            <div className="card">
                                                <h3>Related Gene Records</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">
                                                        Related gene records will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "clinical",
                                        label: "Clinical",
                                        content: (
                                            <div className="card">
                                                <h3>Clinical Resources</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">
                                                        Clinical database links will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "proteins",
                                        label: "Proteins",
                                        content: (
                                            <div className="card">
                                                <h3>Protein Resources</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">
                                                        Protein database links will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "nucleotide-sequences",
                                        label: "Nucleotide Sequences",
                                        content: (
                                            <div className="card">
                                                <h3>Nucleotide Sequences</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">
                                                        Nucleotide sequence links will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                    {
                                        id: "transcripts",
                                        label: "Transcripts",
                                        content: (
                                            <div className="card">
                                                <h3>Transcript Information</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">
                                                        Transcript data will be displayed here
                                                    </div>
                                                </Placeholder>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                        <div className="function-prediction-section">
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
                        </div>
                        <div className="pathways-interactions-section">
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
                        </div>
                    </div>
                </div>
            </div>
        
    );
}
*/
