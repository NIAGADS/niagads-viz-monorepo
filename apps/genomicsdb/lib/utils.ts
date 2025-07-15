import { GenomicLocation, RecordType } from "./types";

export const genomic_location_to_span = (location: GenomicLocation) => {
    const end = location.end === null ? location.start + location.length! : location.end;

    return `${location.chr}:${location.start}-${end}`;
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
