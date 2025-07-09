"use client";

import { RecordType } from "./types";
import { Eye, Download, Share2 } from "lucide-react";

interface ActionBarProps {
    record: RecordType;
    id?: string;
}

export const ActionBar = ({ record, id }: ActionBarProps) => {
    const handleViewInGenomeBrowser = () => {
        const { chr, start, end } = record.location;
        // Navigate to genome browser with gene coordinates
        window.open(`/genome-browser?region=${chr}:${start}-${end}&gene=${record.symbol}`, "_blank");
    };

    const handleExport = () => {
        // Navigate to export page with gene context
        window.open(`/export?type=gene&id=${record.symbol}`, "_blank");
    };

    const handleShare = () => {
        // Copy current URL to clipboard or open share dialog
        navigator.clipboard.writeText(window.location.href);
    };

    return (
        <div id={id} className="action-bar">
            <div className="gene-identifier">
                <span className="gene-symbol">{record.symbol}</span>
                {record.name && <span className="gene-name">{record.name}</span>}
            </div>
            <div className="action-buttons">
                <button className="action-button" onClick={handleViewInGenomeBrowser} title="View in Genome Browser">
                    <Eye size={16} />
                    View in Genome Browser
                </button>
                <button className="action-button" onClick={handleExport} title="Export Gene Data">
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
