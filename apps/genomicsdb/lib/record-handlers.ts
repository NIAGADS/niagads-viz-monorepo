// utility functions and mappings for record-type based decisions

import { RECORD_TYPES, RecordType } from "./types";

import { notFound } from "next/navigation";

// assert valid record type (since they are dynamic) and raise `not-found` if invalid
export function assertValidRecordType(type: string): RecordType {
    if ((RECORD_TYPES as readonly string[]).includes(type)) {
        return type as RecordType;
    }
    notFound();
}

// Lazy-load type-specific overviews (tree-shakable)
const RecordOverviewMap: Record<string, () => Promise<any>> = {
    gene: () => import("@/components/records/overviews/GeneRecordOverview"),
    variant: () => import("@/components/records/overviews/VariantRecordOverview"),
    structural_variant: () => import("@/components/records/overviews/VariantRecordOverview"),
    region: () => import("@/components/records/overviews/RegionRecordOverview"),
    // track: () => import("@/components/records/overviews/TrackRecordOverview"),
} as const;

export async function getOverview(recordType: RecordType) {
    const overview = await RecordOverviewMap[recordType]();
    if (!overview) {
        throw new Error(`No overview implemented for type: ${recordType}`);
    }
    return overview.default;
}
