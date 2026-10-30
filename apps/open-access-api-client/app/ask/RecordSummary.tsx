import { Card, CardBody, CardHeader } from "@niagads/ui";
import type { ResultSet } from "./contracts";
import styles from "./ask.module.css";

const fields = {
    gene: {
        id: "Gene ID",
        gene_symbol: "Symbol",
        gene_name: "Name",
        gene_type: "Gene type",
        location: "Location",
        synonyms: "Aliases",
        associated_with_known_ad_locus: "Known AD locus",
    },
    variant: {
        id: "Variant ID",
        ref_snp_id: "RefSNP ID",
        variant_class: "Variant type",
        is_adsp_variant: "Present in ADSP",
    },
    track: {
        id: "Track ID",
        name: "Name",
        label: "Label",
        description: "Description",
        genome_build: "Genome build",
        feature_type: "Feature type",
        data_source: "Data source",
        data_category: "Data category",
        is_download_only: "Download only",
    },
};

export function isSingleRecord(result: ResultSet) {
    return (
        result.annotation === "report" &&
        result.rows.length === 1 &&
        result.entity in fields &&
        !("region" in result.parameters)
    );
}

export default function RecordSummary({ result }: { result: ResultSet }) {
    const record = result.rows[0];
    const mapping = fields[result.entity as keyof typeof fields];
    const identifier = typeof record.id === "string" ? record.id : result.parameters[result.entity];
    const title = [record.gene_symbol, record.name, record.label, identifier].find(
        (value) => typeof value === "string"
    );
    return (
        <Card className={styles.recordCard}>
            <CardHeader>
                <h3>{typeof title === "string" ? title : "Record summary"}</h3>
            </CardHeader>
            <CardBody>
                <p>
                    {result.entity} · API {result.content} record
                </p>
                <dl className={styles.recordFields}>
                    {Object.entries(mapping).map(([key, label]) => {
                        const value = record[key];
                        if (!(key in record)) return null;
                        let text: string;
                        if (value === null) text = "Not reported";
                        else if (["string", "number", "boolean"].includes(typeof value)) text = String(value);
                        else if (Array.isArray(value) && value.every((item) => typeof item === "string"))
                            text = value.join(", ");
                        else return null;
                        return (
                            <div key={key}>
                                <dt>{label}</dt>
                                <dd>{text}</dd>
                            </div>
                        );
                    })}
                </dl>
                {result.entity === "variant" && record.is_adsp_variant === true && (
                    <p>ADSP membership is not evidence of disease risk.</p>
                )}
                {typeof identifier === "string" && (
                    <a
                        href={`/api/record/${result.entity}/${encodeURIComponent(identifier)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View full API record
                    </a>
                )}
            </CardBody>
        </Card>
    );
}
