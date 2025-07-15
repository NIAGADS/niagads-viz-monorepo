import { APIErrorResponse, GenomicLocation, RecordType } from "./types";

export const genomic_location_to_span = (location: GenomicLocation, inclStrand: boolean = false) => {
    const end = location.end === null ? location.start + location.length! : location.end;

    const span = `${location.chr}:${location.start}-${end}`;
    return inclStrand ? `${span}:${location.strand}` : span;
};

// extract information from request pathname
export const get_record_type_from_path = (pathname: string) => {
    // Example: "/record/gene/APOE" -> gene
    const match = pathname.match(/\/record\/([^/]+)/);
    return match ? (match[1] as RecordType) : null;
};

export const get_record_id_from_path = (pathname: string) => {
    // Works for paths like "/record/gene/APOE" or "/record/gene/APOE/associations"
    const match = pathname.match(/\/record\/[^/]+\/([^/]+)/);
    return match ? match[1] : null;
};

export const get_public_url = () => {
    const publicUrl = process.env.NEXT_PUBLIC_HOST_URL;
    if (!publicUrl) {
        throw new Error("RUNTIME ERROR: Must define `NEXT_PUBLIC_HOST_URL` in `.env.local");
    }
    return publicUrl;
};

export const get_internal_url = () => {
    const publicUrl = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;
    console.log(publicUrl);
    if (!publicUrl) {
        throw new Error("RUNTIME ERROR: Must define `NEXT_PUBLIC_BACKEND_SERVICE_URL` in `.env.local");
    }
    return publicUrl;
};

// check to see if a response is an error response
export function is_error_response(obj: any): obj is APIErrorResponse {
    return obj && typeof obj === "object" && typeof obj.status === "number" && typeof obj.detail === "string";
}
