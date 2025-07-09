import { fetchRecordData, ApiError } from "@/lib/api/fetch-record-data";
import { Sidebar, SidebarItem } from "@/components/sidebar";
import { GeneRecord } from "@/components/records/types";
import Placeholder from "@/components/records/placeholder";
import { Tabs } from "@/lib/client-wrapper";
import { ActionBar } from "@/components/records/ActionBar";

import "@/components/records/record-sidebar.css";
import "@/components/records/record.css";

interface RecordPageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
}

const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Overview", icon: "home" },
    {
        id: "trait-associations",
        label: "Trait associations",
        icon: "barChart",
        children: [
            { id: "niagads-gwas", label: "NIAGADS GWAS", icon: "database" },
            { id: "gwas-catalog", label: "GWAS Catalog", icon: "database" },
        ],
    },
    { id: "link-outs", label: "Link outs", icon: "link" },
    { id: "function-prediction", label: "Function prediction", icon: "file" },
    { id: "pathways", label: "Pathways and interactions", icon: "gitBranch" },
    { id: "genetic-variation", label: "Genetic variation", icon: "barChart" },
];


export default async function RecordDetailPage({ params, searchParams }: RecordPageProps) {
    const { id } = await params;

    const fetch = async () => {
        const result = await fetchRecordData("gene", id);
        return result as GeneRecord;
    };

    const record = await fetch();

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

    return (
        <div className="record-page-container capped">
            <Sidebar title={id} sidebarConfig={sidebarItems} />
            <div className={`record-content`}>
                <ActionBar id="action-bar" record={record}/>
                <div className="record-container">
                    <div className="record-content-section">
                        <h2 className="section-title">Test</h2>
                        <div id="overview" className="overview-section">
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
                                        )
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
                                        )
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
                                        )
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
                                        )
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
                                                    <div className="placeholder-text">Related gene records will be displayed here</div>
                                                </Placeholder>
                                            </div>
                                        )
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
                                        )
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
                                        )
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
                                        )
                                    },
                                    {
                                        id: "transcripts",
                                        label: "Transcripts",
                                        content: (
                                            <div className="card">
                                                <h3>Transcript Information</h3>
                                                <Placeholder type="list">
                                                    <div className="placeholder-text">Transcript data will be displayed here</div>
                                                </Placeholder>
                                            </div>
                                        )
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
        </div>
    );
}
