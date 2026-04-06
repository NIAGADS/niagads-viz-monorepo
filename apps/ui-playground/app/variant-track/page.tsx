import ApoeVariantTrackDemo from "./ApoeVariantTrackDemo";

const APOE_ASSOCIATIONS_ENDPOINT = "http://localhost:8005/record/gene/APOE/associations?source=GWAS";

async function getApoeAssociations() {
    const response = await fetch(APOE_ASSOCIATIONS_ENDPOINT, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(`Failed to fetch APOE associations: ${response.status}`);
    }

    const payload = (await response.json()) as { data?: unknown[] };
    return payload.data || [];
}

export default async function ApoeVariantTrackPage() {
    const associations = await getApoeAssociations();

    return <ApoeVariantTrackDemo associations={associations} />;
}
