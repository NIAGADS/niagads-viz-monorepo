"use client";

import { ActionToolbar, Button, ButtonGroup, InlineIcon } from "@niagads/ui";
import { Download, Eye, Share2 } from "lucide-react";
import { EntityRecord, GenomicFeatureRecord, TrackRecord } from "@/lib/types";
import { genomicLocationToSpan, getPublicUrl } from "@/lib/utils";

import { TooltipClient } from "@niagads/ui/client";

interface ActionToolbarProps {
    id: string;
    record: EntityRecord;
}

export const RecordActionToolbar = ({ id, record }: ActionToolbarProps) => {
    const isFeatureRecord: boolean = "location" in record;
    const span = isFeatureRecord ? genomicLocationToSpan((record as GenomicFeatureRecord).location) : false;

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
        const permalink = `${getPublicUrl(true)}/record/${record.record_type}/${record.id}`;
        navigator.clipboard.writeText(permalink);
    };

    // FIXME: hide or give different behavior, like a dropdown form, for View in Genome Browser for tracks and listings
    return (
        <>
            <ActionToolbar>
                <ButtonGroup>
                    {/*<Button onClick={handleViewInGenomeBrowser} title={`View genomic location on genome browser`}>
                        <InlineIcon icon={<Eye size={16} />}>View in Genome Browser</InlineIcon>
                    </Button>
                    <Button onClick={handleExport} title={`Export annotated record`}>
                        <InlineIcon icon={<Download size={16} />}>Export</InlineIcon>
                    </Button>*/}

                    <TooltipClient content="Copied to clipboard!" openOnClick={true}>
                        <Button onClick={handleShare} title={`Get record permalink`}>
                            <InlineIcon icon={<Share2 size={16} />}>Share</InlineIcon>
                        </Button>
                    </TooltipClient>
                </ButtonGroup>
            </ActionToolbar>
        </>
    );
};
