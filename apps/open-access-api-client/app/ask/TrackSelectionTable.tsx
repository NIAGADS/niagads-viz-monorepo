"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@niagads/ui";
import type { TableConfig, RowSelectionState } from "@niagads/table";
import ComponentBoundary from "./ComponentBoundary";
import { useAskSession } from "./AskSessionProvider";
import { errorMessage, fetchAsk } from "./errors";
import {
    assembleTrackData,
    MAX_SELECTED_TRACKS,
    trackBatchSchema,
    trackSelectionSchema,
    type TrackDataBatch,
} from "./track-data.ts";
import styles from "./ask.module.css";

const EvidenceTable = dynamic(() => import("@niagads/table"), { ssr: false });

function FetchedTrackData({ batch, id }: { batch: TrackDataBatch; id: string }) {
    const successful = batch.tracks.filter((track) => track.status === "ok");
    return (
        <section className={styles.panel}>
            <h4>Data from selected tracks</h4>
            <p>Returned records from each track, independent of the track-list filters.</p>
            <ul>
                {batch.tracks.map((track) => (
                    <li key={track.track_id}>
                        <strong>{track.track_id}</strong>
                        {": "}
                        {track.status === "error" ? (
                            <span role="alert">
                                {track.http_status ? `HTTP ${track.http_status}: ` : ""}
                                {errorMessage(new Error(track.message))}
                                {track.request_id ? ` Reference: ${track.request_id}.` : ""}
                            </span>
                        ) : (
                            <span>
                                {track.response.data.length} returned records.
                                {track.response.pagination
                                    ? ` API page ${track.response.pagination.page} of ${track.response.pagination.total_pages}.${track.response.pagination.total_pages > track.response.pagination.page ? " More records are available; this is not the complete track data." : ""}`
                                    : " Pagination was not reported; completeness is unknown."}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            {successful.length > 0 && (
                <ComponentBoundary
                    fallback={
                        <p role="alert">
                            The combined table could not be displayed.
                        </p>
                    }
                >
                    <CombinedTrackTable batch={batch} id={id} />
                </ComponentBoundary>
            )}
        </section>
    );
}

function CombinedTrackTable({ batch, id }: { batch: TrackDataBatch; id: string }) {
    const config = assembleTrackData(batch, id);
    return (
        <div
            className={styles.table}
            role="region"
            tabIndex={0}
            aria-label="Selected track data; scroll horizontally on narrow screens"
        >
            <div className={styles.tableContent}>
                <EvidenceTable {...config} />
            </div>
        </div>
    );
}

export default function TrackSelectionTable({ config }: { config: TableConfig }) {
    const [selection, setSelection] = useState<RowSelectionState>({});
    const [fetching, setFetching] = useState(false);
    const [failure, setFailure] = useState<string | null>(null);
    const { trackBatches, addTrackBatch } = useAskSession();
    const batches = trackBatches[config.id] ?? [];
    const controller = useRef<AbortController | null>(null);
    useEffect(() => () => controller.current?.abort(), []);
    const selectedTracks = Object.keys(selection).filter((id) => selection[id]);
    const options = {
        ...config.options,
        enableRowSelect: true,
        rowSelectOpts: {
            header: "Select tracks",
            description: `Select up to ${MAX_SELECTED_TRACKS} tracks to fetch their data`,
            enableMultiSelect: true,
            rowUniqueKey: "id",
            maxSelectedRows: MAX_SELECTED_TRACKS,
        },
    };

    async function fetchSelected() {
        if (controller.current) return;
        const pending = new AbortController();
        controller.current = pending;
        setFetching(true);
        setFailure(null);
        try {
            const selection = trackSelectionSchema.parse({ track_ids: selectedTracks });
            const response = await fetchAsk("/api/track-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selection),
                signal: pending.signal,
            });
            const batch = trackBatchSchema.parse(await response.json());
            addTrackBatch(config.id, batch);
        } catch (error) {
            if (!pending.signal.aborted)
                setFailure(error instanceof Error ? errorMessage(error) : "Track data request failed");
        } finally {
            if (!pending.signal.aborted) setFetching(false);
            if (controller.current === pending) controller.current = null;
        }
    }

    return (
        <>
            <div
                className={styles.table}
                role="region"
                tabIndex={0}
                aria-label="Select tracks; scroll horizontally on narrow screens"
            >
                <div className={styles.tableContent}>
                    <EvidenceTable
                        {...config}
                        options={options}
                        rowSelection={selection}
                        onRowSelectionChange={setSelection}
                    />
                </div>
            </div>
            <p role="status">
                {selectedTracks.length} of {MAX_SELECTED_TRACKS} tracks selected.{" "}
                {fetching ? "Fetching track data…" : ""}
            </p>
            <Button
                disabled={fetching || selectedTracks.length === 0 || selectedTracks.length > MAX_SELECTED_TRACKS}
                onClick={() => {
                    void fetchSelected();
                }}
            >
                Fetch selected track data
            </Button>
            {failure && <p role="alert">{failure}</p>}
            {batches.map(({ id, batch }) => (
                <FetchedTrackData key={id} batch={batch} id={id} />
            ))}
        </>
    );
}
