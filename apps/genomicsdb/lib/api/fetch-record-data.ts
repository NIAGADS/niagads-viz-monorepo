import type { RecordType, GeneRecord, VariantRecord, SpanRecord, TrackRecord } from "@/components/records/types";

export interface ApiError {
    status: number;
    detail: string;
}

export async function fetchRecordData(type: string, id: string): Promise<RecordType | ApiError> {
    try {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 300));

        if (id === "trigger-422") {
            return { status: 422, detail: "Invalid input ID format" };
        }
        if (id === "trigger-503") {
            throw new Error("Simulated network/database failure");
        }

        // === Mock Data ===
        if (type === "gene") {
            return {
                id: "ENSG00000130203",
                type: "gene",
                symbol: id.toUpperCase(),
                name: "Apolipoprotein E",
                location: {
                    chr: "chr19",
                    start: 44905791,
                    end: 44909393,
                    strand: "+",
                },
                hgnc_annotation: {
                    hgnc_id: "HGNC:613",
                    symbol: id.toUpperCase(),
                    name: "Apolipoprotein E",
                    location: "19q13.32",
                    status: "Approved",
                },
            } as GeneRecord;
        }

        if (type === "variant") {
            return {
                id,
                type: "variant",
                chromosome: "19",
                position: "44908684",
                reference: "T",
                alternate: "C",
                genes: ["APOE"],
                consequence: "missense_variant",
                impact: "MODERATE",
                maf: "0.1525",
                phenotypes: ["Alzheimer's disease"],
            } as VariantRecord;
        }

        if (type === "span") {
            return {
                id,
                type: "span",
                chromosome: "19",
                start: 44900000,
                end: 44950000,
                length: 50000,
                spanType: "enhancer",
                description: "Regulatory region with enhancers",
                genes: ["APOE"],
                features: ["enhancer", "promoter"],
                datasets: ["ENCODE"],
                annotations: {
                    conservation: 0.82,
                    accessibility: 0.91,
                },
            } as SpanRecord;
        }

        if (type === "track") {
            return {
                id,
                type: "track",
                name: "NG00056_GRCh38_ALL",
                description: "AD GWAS summary statistics (mock)",
                genome_build: "GRCh38",
                feature_type: "variant",
                is_download_only: false,
                cohorts: ["IGAP"],
                provenance: {
                    data_source: "NIAGADS DSS",
                    accession: "NG00056",
                },
                file_properties: {
                    file_name: "track.vcf.gz",
                    file_format: "vcf",
                },
                biosample_characteristics: {
                    tissue: ["Brain"],
                },
            } as TrackRecord;
        }

        return {
            status: 404,
            detail: `Record type "${type}" not recognized.`,
        };
    } catch (e) {
        return {
            status: 503,
            detail: "Service is currently unavailable. Please try again later.",
        };
    }
}
