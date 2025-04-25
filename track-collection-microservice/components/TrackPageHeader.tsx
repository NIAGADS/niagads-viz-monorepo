"use client";

import { cache, useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader /*Tooltip*/, Skeleton } from "@niagads/ui";
import { Tooltip } from "@niagads/ui/client";
import { BarChart } from "./BarChart";
import { GenericPlot } from "./GenericPlot";

const fetchTrackSummary = cache(async (route: string, track: string, type: string) => {
    const requestUrl = `/api/genomics/track/${track}/data/summary/${type}`;
    let data = null;
    try {
        const response: any = await fetch(requestUrl);
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error(`Error fetching track ${track} from route ${route}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        return data.response;
    }
});

const fetchTableMetadata = cache(async (route: string, track: string) => {
    const requestUrl = `/api/${route}/track/${track}?content=full`;
    let data = null;
    try {
        const response: any = await fetch(requestUrl);
        if (response.ok) {
            data = await response.json();
        } else {
            throw new Error(`Error fetching track ${track} from route ${route}`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        return data.response[0];
    }
});

interface AttributeProps {
    label: string;
    value: string | number | boolean | null;
    className?: string;
}

function Attribute({ label, value, className = "" }: AttributeProps) {
    const cName = `text_sm ${className}`;
    return (
        value && (
            <h5 className="text-sm">
                {label}: <span className="font-bold">{value}</span>{" "}
            </h5>
        )
    );
}

interface Props {
    track: string;
}

function TrackPageHeader({ track }: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [metadata, setMetadata] = useState<any>(null);
    const [summaryCounts, setSummaryCounts] = useState<any>(null);
    const [summaryTop, setSummaryTop] = useState<any>(null);
    const [countsLoading, setCountsLoading] = useState<boolean>(true);
    const [topLoading, setTopLoading] = useState<boolean>(true);

    const summaryTopCard = useMemo(() => {
        if (topLoading) {
            return <Skeleton type="card" />;
        }

        const data = summaryTop.map((item: any, index: number) => ({
            y: parseFloat(item.neg_log10_pvalue),
            name: item.variant.length > 15 ? item.ref_snp_id : item.variant, // FIXME
        }));
        const categories = summaryTop.map((item: any) => item.gene_symbol);
        const opts = {
            chartType: "line",
            title: "Top QTLs",
            xAxisLabel: "Gene",
            yAxisLabel: "-log10p",
            categories: categories,
        };
        return (
            <Card>
                <GenericPlot series={[{ data: data }]} opts={opts} />
            </Card>
        );
    }, [topLoading]);

    const summaryCountsCard = useMemo(() => {
        if (countsLoading) {
            return <Skeleton type="card" />;
        }
        //const data = summaryCounts.map((item: any) => ({ name: item.chromosome, data: [item.count] }));
        const categories = summaryCounts.map((item: any) => item.chromosome);
        const data = summaryCounts.map((item: any) => parseInt(item.count));
        const opts = {
            chartType: "column",
            title: "Target Genes per Chromosome",
            categories: categories,
            xAxisLabel: "Chromosome",
            yAxisLabel: "Number Targeted Genes",
        };
        return (
            <Card>
                <BarChart series={[{ data: data }]} opts={opts} />
            </Card>
        );
    }, [countsLoading]);

    const titleCard = useMemo(() => {
        return loading ? (
            <Skeleton type="card" />
        ) : (
            <Card>
                <CardHeader>
                    <div className="flex flex-col">
                        <p className="text-md">
                            {" "}
                            Track <span className="text-2xl font-bold">{metadata.track_id}</span>
                        </p>
                        <Attribute
                            label={metadata.data_category === "QTL" ? "QTL Type" : "Feature Type"}
                            value={metadata.feature_type}
                            className="float-end"
                        ></Attribute>
                        {metadata.data_category === "QTL" && (
                            <Attribute
                                label={"Filter"}
                                value={
                                    metadata.output_type.split("QTL ")[metadata.output_type.split("QTL ").length - 1]
                                }
                            />
                        )}
                    </div>
                </CardHeader>
                <CardBody>
                    <Attribute label="Source Repository" value={metadata.provenance.data_source} />
                    <Attribute label="Study Name" value={metadata.study_name} />
                    <Attribute label="Biosample" value={metadata.biosample_characteristics.biosample_term} />
                </CardBody>
            </Card>
        );
    }, [loading]);

    useEffect(() => {
        try {
            const [route, name] = process.env.NEXT_PUBLIC_TRACK_COLLECTION!.split(":");
            fetchTableMetadata(route, track).then((result) => setMetadata(result));
        } catch (err) {
            console.error(`Error retrieving track ${track} data`);
        }
    }, [track]);

    useEffect(() => {
        try {
            const [route, name] = process.env.NEXT_PUBLIC_TRACK_COLLECTION!.split(":");
            fetchTrackSummary(route, track, "counts").then((result) => setSummaryCounts(result));
        } catch (err) {
            console.error(`Error retrieving track ${track} data`);
        }
    }, [track]);

    useEffect(() => {
        try {
            const [route, name] = process.env.NEXT_PUBLIC_TRACK_COLLECTION!.split(":");
            fetchTrackSummary(route, track, "top").then((result) => setSummaryTop(result));
        } catch (err) {
            console.error(`Error retrieving track ${track} data`);
        }
    }, [track]);

    useEffect(() => {
        if (metadata) {
            setLoading(false);
        }
    }, [metadata]);

    useEffect(() => {
        if (summaryCounts) {
            setCountsLoading(false);
        }
    }, [summaryCounts]);

    useEffect(() => {
        if (summaryTop) {
            setTopLoading(false);
        }
    }, [summaryTop]);

    return (
        <>
            <div className="m-3 gap-2 grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
                {titleCard}
                {summaryCountsCard}
                {summaryTopCard}
            </div>
        </>
    );
}

/*   <span className="text-2xl font-bold">
                                <Tooltip content="Download track data file.">
                                <Button
                                    showAnchorIcon={true}
                                    className="text-sm"
                                    size="sm"
                                    aria-label="download track file"
                                    color="primary"
                                    as={Link}
                                    href={metadata.url}>
                                    Download File
                                </Button>
                                </Tooltip>
                            </span> */

export default TrackPageHeader;
