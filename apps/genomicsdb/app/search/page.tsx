import { RecordsPage } from "@/components/records/records-page";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface SearchPageProps {
    searchParams: { q?: string; type?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q || "";
    const type = searchParams.type || "all";

    // Simulate search results based on query
    const searchResults = query
        ? {
              query,
              totalResults: 156,
              type,
              records: [
                  {
                      id: "APOE",
                      type: "gene",
                      description: "Apolipoprotein E",
                      location: "chr19:44905791-44909393",
                      url: "/records/gene/APOE",
                  },
                  {
                      id: "rs429358",
                      type: "variant",
                      description: "APOE missense variant",
                      location: "chr19:44908684",
                      url: "/records/variant/rs429358",
                  },
                  {
                      id: "ADGC2019",
                      type: "study",
                      description: "Alzheimer's Disease Genetics Consortium GWAS",
                      location: "10,243 samples",
                      url: "/records/study/ADGC2019",
                  },
              ],
          }
        : undefined;

    return (
        <Suspense fallback={<LoadingSpinner message="Loading search results..." />}>
            <RecordsPage searchResults={searchResults} />
        </Suspense>
    );
}
