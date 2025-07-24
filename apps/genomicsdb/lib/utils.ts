import { APIErrorResponse, GenomicLocation, RecordType } from "./types";

export const genomicLocationToSpan = (location: GenomicLocation, inclStrand: boolean = false) => {
    const end = location.end === null ? location.start + location.length! : location.end;

    const region =
        location.start === location.end
            ? `${location.chr}:${location.start}`
            : `${location.chr}:${location.start}-${end}`;
    return inclStrand ? `${region}:${location.strand}` : region;
};

export const genomicLocationToRegionId = (location: GenomicLocation) => {
    return genomicLocationToSpan(location, false).replace("chr", "");
};

// extract information from request pathname
export const getRecordTypeFromPath = (pathname: string) => {
    // Example: "/record/gene/APOE" -> gene
    const match = pathname.match(/\/record\/([^/]+)/);
    return match ? (match[1] as RecordType) : null;
};

export const getRecordIdFromPath = (pathname: string) => {
    // Works for paths like "/record/gene/APOE" or "/record/gene/APOE/associations"
    const match = pathname.match(/\/record\/[^/]+\/([^/]+)/);
    return match ? match[1] : null;
};

// check to see if a response is an error response
export function isErrorAPIResponse(obj: any): obj is APIErrorResponse {
    return obj && typeof obj === "object" && typeof obj.status === "number" && typeof obj.detail === "string";
}

/**
 * Maps SO consequence terms to CSS module class names for color badges.
 * Converts spaces, hyphens, and leading numbers into valid class-safe identifiers.
 */
export function mapConsequenceToClass(term: string): string {
    const normalized = term
        .toLowerCase()
        .replace(/^5_/, "five_")
        .replace(/^3_/, "three_")
        .replace(/^5'-/, "five_")
        .replace(/^3'-/, "three_")
        .replace(/^5prime/, "five_prime")
        .replace(/^3prime/, "three_prime")
        .replace(/[^a-z0-9]/g, "_"); // Replace invalid CSS characters

    return normalized;
}

// route modifiers - even though these are technically "route-handlers",
// they cannot go in route-handlers.ts b/c otherwise client-side code
// may attempt to access they keydb store on import of the function
// leading to errors
export const getPublicUrl = (inclBasePath: boolean = false) => {
    const publicUrl = process.env.NEXT_PUBLIC_HOST_URL;
    if (!publicUrl) {
        throw new Error("RUNTIME ERROR: Must define `NEXT_PUBLIC_HOST_URL` in `.env.local");
    }
    return inclBasePath ? `${publicUrl}${getBasePath()}` : publicUrl;
};

// always returns a string
export const getBasePath = (): string => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    return basePath ? basePath : "";
};

// handles basePath prefixing for client-side fetching with a useEffect or useSWR hook
export const prefixClientRoute = (endpoint: string): string => {
    return `${getBasePath()}${endpoint}`;
};

// handles basePath removal for redirected client-side (e.g., from a route.ts to a _fetch())
export const cleanRedirect = (endpoint: string): string => {
    const basePath = getBasePath();
    if (basePath === "") {
        return endpoint;
    } else return endpoint.replace(basePath, "");
};
