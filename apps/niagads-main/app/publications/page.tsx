import { Alert } from "@niagads/ui";
import type { PublicationCollection } from "@/components/Publications/PublicationsTabs";
import { PublicationsTabs } from "@/components/Publications/PublicationsTabs";

const getCollections = (): PublicationCollection[] =>
    (process.env.ZOTERO_COLLECTIONS || "")
        .split(",")
        .map((value) => {
            const [id, name] = value.split("|").map((part) => part.trim());
            return id ? { id, name: name || id } : null;
        })
        .filter((collection): collection is PublicationCollection => collection !== null);

export default function PublicationsPage() {
    const collections = getCollections();

    return (
        <main>
            <div className="content-section content-section-centered">
                <header className="content-header">
                    <div>
                        <h1>Publications</h1>
                        <p className="content-subtitle">
                           Explore publications highlighting NIAGADS’ contributions to Alzheimer’s disease research, from discoveries by NIAGADS investigators to studies enabled by its genomic data resources and research tools.
                        </p>
                    </div>
                </header>

                
                {collections.length === 0 ? (
                    <Alert variant="error" message="Publications are currently unavailable.">
                        The Zotero collections are not configured.
                    </Alert>
                ) : (
                    <PublicationsTabs collections={collections} />
                )}
            </div>
        </main>
    );
}
