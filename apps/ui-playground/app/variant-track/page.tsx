import TrackDemo from "./TrackDemo";

const GENE_ID = "APOE";
const endpoint = `https://api.niagads.org/genomics/record/gene/${GENE_ID}/associations?source=GWAS`;

async function getAssociations() {
    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Failed to fetch associations: ${response.status}`);
    }

    const payload = (await response.json()) as { data?: unknown[] };
    return payload.data || [];
}

export default async function TopVariantTrack() {
    const associations = await getAssociations();

    return <TrackDemo associations={associations} />;
}
