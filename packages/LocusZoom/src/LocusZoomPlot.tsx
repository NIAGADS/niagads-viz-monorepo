import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

import { useWindowSize } from "@uidotdev/usehooks";

import { initialize } from "./plot";
import config from "./config";

import "locuszoom/dist/locuszoom.css";

export const DEFAULT_FLANK = 100000;

interface LocusZoomPlotState {
    chr?: string;
    start?: number;
    end?: number;
    ldrefvar?: string;
    build?: string;
}

interface LocusZoomPlotProps {
    chromosome?: string;
    end?: number;
    maxWidthAsRatioToBody?: number;
    population: string;
    variant: string;
    genomeBuild: string;
    divId?: string;
    start?: number;
    span?: string;
    flank?: number;
    track: string;
    setPlotState?: any;
    className?: string;
    serviceBaseUrl: string;
}

export const LocusZoomPlot: React.FC<LocusZoomPlotProps> = ({
    chromosome,
    end,
    maxWidthAsRatioToBody,
    population,
    variant,
    divId,
    start,
    track,
    span,
    flank,
    genomeBuild,
    setPlotState,
    className,
    serviceBaseUrl,
}) => {
    const [plot, setPlot] = useState<any>(null);
    //const interval: NodeJS.Timeout = useRef().current;
    const layoutRendered = useRef(false);

    const size = useWindowSize();
    //@ts-ignore -- ignore size.width might be null
    const width = size.width * (maxWidthAsRatioToBody || 0.5);

    useLayoutEffect(() => {
        initializeLocusZoomPlot();
        layoutRendered.current = true;
    }, []);

    useEffect(() => {
        plot && setPlot(plot);
    }, [plot]);

    function initializeLocusZoomState() {
        if (chromosome && start && end) {
            return {
                chr: chromosome.includes("chr") ? chromosome : "chr" + chromosome,
                start: start,
                end: end,
                ldrefvar: variant,
                population: population,
                build: genomeBuild,
            };
        }

        return initializeLocusZoomStateFromSpan(span ? span : variant, flank, variant);
    }

    const initializeLocusZoomStateFromSpan = (span: string, flank: number | undefined, variant: string) => ({
        chr: "chr" + span.split(":")[0],
        start: parseInt(span.split(":")[1]) - (flank ? flank : config.DEFAULT_FLANK),
        end: parseInt(span.split(":")[1]) + (flank ? flank : config.DEFAULT_FLANK),
        ldrefvar: variant,
        build: genomeBuild,
    });

    const initializeLocusZoomPlot = () => {
        const lzState = initializeLocusZoomState();
        const plot = initialize(divId ? divId : "locus-zoom", lzState, track, serviceBaseUrl, width, genomeBuild);
        setPlot(plot);
    };

    return <div id={divId ? divId : "locus-zoom"} className={className ? className : undefined} />;
};

export const MemoLocusZoomPlot = React.memo(LocusZoomPlot);
