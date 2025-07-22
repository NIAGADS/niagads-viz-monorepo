// Utility functions to detect search types and route accordingly

export interface SearchRoute {
    type: "record" | "search";
    path: string;
}

// Patterns
const GENE_PATTERN = /^[A-Z][A-Z0-9-]{1,9}$/;
const REFSNP_PATTERN = /^rs\d+$/;
const GENOMIC_COORD_PATTERN = /^(chr)?([1-9]|1[0-9]|2[0-2]|X|Y):(\d+)(-\d+)?$/;
const TRACK_ID_PATTERN = /^NG\d{5}(_[A-Z0-9]+)*$/i;

// Gene + variant sets for suggestion matching
const COMMON_GENES = new Set([
    "APOE",
    "TREM2",
    "APP",
    "PSEN1",
    "PSEN2",
    "MAPT",
    "CLU",
    "CR1",
    "PICALM",
    "BIN1",
    "ABCA7",
    "CD33",
    "MS4A6A",
    "CD2AP",
    "EPHA1",
    "PTK2B",
    "SORL1",
    "HLA-DRB5",
    "INPP5D",
    "MEF2C",
    "NME8",
    "ZCWPW1",
    "CELF1",
    "FERMT2",
    "SLC24A4",
    "CASS4",
    "ECHDC3",
    "ACE",
    "ADAMTS1",
    "HESX1",
    "CLNK",
]);
const COMMON_VARIANTS = new Set(["rs429358", "rs7412", "rs75932628", "rs63750847", "rs165932"]);

export function detectSearchType(query: string): SearchRoute {
    const trimmed = query.trim();
    const upperQuery = trimmed.toUpperCase();

    if (!trimmed) return { type: "search", path: "/search" };

    if (REFSNP_PATTERN.test(trimmed)) {
        return { type: "record", path: `/record/variant/${trimmed}` };
    }

    if (GENOMIC_COORD_PATTERN.test(trimmed)) {
        const normalized = trimmed.startsWith("chr") ? trimmed : `chr${trimmed}`;
        return { type: "record", path: `/record/variant/${encodeURIComponent(normalized)}` };
    }

    if (GENE_PATTERN.test(upperQuery) && COMMON_GENES.has(upperQuery)) {
        return { type: "record", path: `/record/gene/${upperQuery}` };
    }

    if (TRACK_ID_PATTERN.test(trimmed)) {
        return { type: "record", path: `/record/track/${trimmed}` };
    }

    // Fallback: unknown/unsupported input → Search page
    return { type: "search", path: `/search?q=${encodeURIComponent(trimmed)}` };
}

// Enhanced search function that can also suggest record types
export function analyzeSearchQuery(query: string) {
    const trimmed = query.trim();
    const route = detectSearchType(query);

    const analysis = {
        query: trimmed,
        route,
        suggestions: [] as string[],
        detectedType: null as string | null,
    };

    if (REFSNP_PATTERN.test(trimmed)) {
        analysis.detectedType = "variant";
        analysis.suggestions.push("This looks like a variant ID (RefSNP)");
    } else if (GENOMIC_COORD_PATTERN.test(trimmed)) {
        analysis.detectedType = "variant";
        analysis.suggestions.push("This looks like genomic coordinates");
    } else if (GENE_PATTERN.test(trimmed.toUpperCase())) {
        analysis.detectedType = "gene";
        if (COMMON_GENES.has(trimmed.toUpperCase())) {
            analysis.suggestions.push("This looks like a gene symbol");
        } else {
            analysis.suggestions.push("This might be a gene symbol (not in our database)");
        }
    } else if (TRACK_ID_PATTERN.test(trimmed)) {
        analysis.detectedType = "track";
        analysis.suggestions.push("This looks like a track ID (summary statistics dataset)");
    }

    return analysis;
}

// Get search suggestions based on partial input
export function getSearchSuggestions(partialQuery: string, limit = 5): string[] {
    const query = partialQuery.toLowerCase();
    const suggestions: string[] = [];

    // Gene suggestions
    const geneMatches = Array.from(COMMON_GENES)
        .filter((gene) => gene.toLowerCase().includes(query))
        .slice(0, Math.floor(limit / 2));

    suggestions.push(...geneMatches);

    // Variant suggestions
    const variantMatches = Array.from(COMMON_VARIANTS)
        .filter((variant) => variant.toLowerCase().includes(query))
        .slice(0, Math.floor(limit / 2));

    suggestions.push(...variantMatches);

    // Add some example searches if no matches
    if (suggestions.length === 0 && query.length > 0) {
        const examples = ["APOE", "rs429358", "chr19:44908684", "Alzheimer's disease"].filter((example) =>
            example.toLowerCase().includes(query)
        );

        suggestions.push(...examples.slice(0, limit));
    }

    return suggestions.slice(0, limit);
}
