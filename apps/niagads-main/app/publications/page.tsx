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
                <h1>Publications</h1>
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
