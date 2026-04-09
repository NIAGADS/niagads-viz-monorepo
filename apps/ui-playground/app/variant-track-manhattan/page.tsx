import { Alert } from "@niagads/ui";
import GeneVariantPValueManhattanDemo from "./GeneVariantPValueManhattanDemo";

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

export default async function VariantTrackManhattanPage() {
    const associations = await getAssociations();

    return (
        <div>
            <p style={{ padding: "24px" }}>
                Hover points to inspect the top overlapping associations at that location. Click a trait block to pin
                its highlight and filter tooltip rows to that trait; click again to clear.
            </p>
            <GeneVariantPValueManhattanDemo associations={associations} />
        </div>
    );
}
