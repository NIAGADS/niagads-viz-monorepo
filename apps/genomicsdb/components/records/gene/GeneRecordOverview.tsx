import { ExternalUrls } from "@/lib/reference";
import { GeneRecord } from "@/lib/types";
import { genomic_location_to_span } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@niagads/ui";
import { GenomicFeatureActionToolbar } from "../ActionToolbar";
import Placeholder from "../placeholder";
import { renderRecordTitle } from "../RecordOverviewSection";

export const GeneRecordOverview = ({ record }: { record: GeneRecord }) => {
    // Format location string: chr:start-end:strand / cytogenic_location
    const span = genomic_location_to_span(record.location, true);
    const location = record.cytogenic_location ? `${span} / ${record.cytogenic_location}` : span;

    // Format synonyms as comma-space delimited string
    const synonyms = !record.synonyms || record.synonyms.length === 0 ? null : record.synonyms.join(", ");

    return (
        <>
            {/* Gene Information Card - 1/3 width */}
            <Card variant="third">
                <CardHeader>
                    {renderRecordTitle(record.symbol, record.id, ExternalUrls.ENSEMBL_GENE_URL, "gene")}
                </CardHeader>
                <CardBody>
                    <div>{record.name && <div className="record-description">{record.name}</div>}</div>
                    <div className="record-info-content mb-15">
                        <div className="record-details">
                            {synonyms && (
                                <div className="record-attribute">
                                    <span className="info-label">Also known as:</span> {synonyms}
                                </div>
                            )}
                            <div className="record-attribute">
                                <span className="info-label">Gene Type:</span> {record.type}
                            </div>
                            <div className="record-attribute">
                                <span className="info-label">Location:</span> {location}
                            </div>
                        </div>
                    </div>
                    <GenomicFeatureActionToolbar id="gene-actions" record={record} />
                </CardBody>
            </Card>

            {/* Chart placeholders - 2/3 width */}
            <Card variant="two-thirds">
                <CardHeader>Genetic Associations</CardHeader>
                <CardBody>
                    <Placeholder type="chart" height={300}>
                        <div className="placeholder-text">Variant distribution chart will be displayed here</div>
                    </Placeholder>
                </CardBody>
            </Card>
        </>
    );
};
