"use client";

import { Download, Eye, Share2 } from "lucide-react";
import { GenomicFeatureRecord, Record, TrackRecord } from "@/lib/types";

import { genomic_location_to_span } from "@/lib/utils";
import { toTitleCase } from "@niagads/common";

interface ActionToolbarProps {
    id: string;
    record: Record;
}

export const GenomicFeatureActionToolbar = ({ id, record }: ActionToolbarProps) => {
    const span = genomic_location_to_span((record as GenomicFeatureRecord).location);

    const handleViewInGenomeBrowser = () => {
        // Navigate to genome browser with gene coordinates
        window.open(`/genome-browser?loc=${span}`, "_blank");
    };

    const handleExport = () => {
        // Navigate to export page with gene context
        window.open(`/export?type=gene&id=${record.id}`, "_blank");
    };

    const handleShare = () => {
        // Copy current URL to clipboard or open share dialog
        navigator.clipboard.writeText(window.location.href);
    };

    return (
        <div id={id} className="action-bar">
            <div className="action-buttons">
                <button className="action-button" onClick={handleViewInGenomeBrowser} title="View in Genome Browser">
                    <Eye size={16} />
                    View in Genome Browser
                </button>
                <button
                    className="action-button"
                    onClick={handleExport}
                    title={`Export ${toTitleCase(record.type)} Data`}
                >
                    <Download size={16} />
                    Export
                </button>
                <button className="action-button" onClick={handleShare} title="Share Gene Record">
                    <Share2 size={16} />
                    Share
                </button>
            </div>
        </div>
    );
};
