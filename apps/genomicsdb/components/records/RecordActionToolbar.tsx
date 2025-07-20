"use client";

import { ActionToolbar, Button, ButtonGroup, InlineIcon } from "@niagads/ui";
import { Download, Eye, Share2 } from "lucide-react";
import { GenomicFeatureRecord, Record, TrackRecord } from "@/lib/types";

import { Tooltip } from "@niagads/ui/client";
import { genomic_location_to_span } from "@/lib/utils";

interface ActionToolbarProps {
    id: string;
    record: Record;
}

export const RecordActionToolbar = ({ id, record }: ActionToolbarProps) => {
    const isFeatureRecord: boolean = "location" in record;
    const span = isFeatureRecord ? genomic_location_to_span((record as GenomicFeatureRecord).location) : false;

    const handleViewInGenomeBrowser = () => {
        // Navigate to genome browser with gene coordinates
        span && window.open(`/genome-browser?loc=${span}`, "_blank");
    };

    const handleExport = () => {
        // Navigate to export page with gene context
        window.open(`/export?type=gene&id=${record.id}`, "_blank");
    };

    const handleShare = () => {
        // create permalink and copy to clipboard
        const permalink = `${process.env.NEXT_PUBLIC_HOST_URL}/record/${record.record_type}/${record.id}`;
        navigator.clipboard.writeText(permalink);
    };

    // FIXME: hide or give different behavior, like a dropdown form, for View in Genome Browser for tracks and listings
    return (
        <>
            <ActionToolbar>
                <ButtonGroup>
                    <Button onClick={handleViewInGenomeBrowser} title={`View genomic location on genome browser`}>
                        <InlineIcon icon={<Eye size={16} />}>View in Genome Browser</InlineIcon>
                    </Button>
                    <Button onClick={handleExport} title={`Export annotated record`}>
                        <InlineIcon icon={<Download size={16} />}>Export</InlineIcon>
                    </Button>

                    <Tooltip content="Copied to clipboard!" anchorId="record-share" openOnClick={true}>
                        <Button onClick={handleShare} title={`Get record permalink`}>
                            <InlineIcon icon={<Share2 size={16} />}>Share</InlineIcon>
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </ActionToolbar>
        </>
    );
};
