// utility functions and mappings for record-type based decisions

import { BaseRecord, RECORD_TYPES, RecordType } from "./types";

import { RecordOverviewProps } from "@/components/records/overviews/RecordOverview";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

// assert valid record type (since they are dynamic) and raise `not-found` if invalid
export function assertValidRecordType(type: string): RecordType {
    if ((RECORD_TYPES as readonly string[]).includes(type)) {
        return type as RecordType;
    }
    notFound();
}

// Lazy-load type-specific overviews (tree-shakable)
const OVERVIEW_LOADERS: Record<string, () => Promise<any>> = {
    gene: () => import("@/components/records/overviews/GeneRecordOverview"),
    variant: () => import("@/components/records/overviews/VariantRecordOverview"),
    region: () => import("@/components/records/overviews/RegionRecordOverview"),
    // track: () => import("@/components/records/overviews/TrackRecordOverview"),
};

export function getOverview(type: RecordType) {
    const loader = OVERVIEW_LOADERS[type];
    if (!loader) {
        throw new Error(`No overview found for type: ${type}`);
    }
    return dynamic<RecordOverviewProps>(loader, { ssr: true }); // or { ssr:false } if it uses browser-only APIs
}
