"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@niagads/ui";
import type { TableConfig, RowSelectionState } from "@niagads/table";
import ComponentBoundary from "./ComponentBoundary";
import ErrorAlert from "./ErrorAlert";
import { useAskSession } from "./AskSessionProvider";
import { errorMessage, fetchAsk } from "./errors";
import {
    assembleTrackData,
    GENOMIC_LOCATION_PATTERN,
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
                {successful.map((track) => (
                    <li key={track.track_id}>
                        <strong>{track.track_id}</strong>
                        {": "}
                        <span>{track.response.data.length} returned records.</span>
                    </li>
                ))}
            </ul>
            {batch.tracks.map((track) => {
                if (track.status !== "error") return null;
                const error = new Error(track.message);
                return (
                    <ErrorAlert
                        key={track.track_id}
                        error={error}
                        message={`${track.track_id}: ${track.http_status ? `HTTP ${track.http_status}: ` : ""}${errorMessage(error)}`}
                    >
                        {track.request_id && <p>Request reference: {track.request_id}.</p>}
                    </ErrorAlert>
                );
            })}
            {successful.length > 0 && (
                <ComponentBoundary fallback={<p>The combined table could not be displayed.</p>}>
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
    const regionId = useId();
    const [selection, setSelection] = useState<RowSelectionState>({});
    const [region, setRegion] = useState("");
    const [fetching, setFetching] = useState(false);
    const [failure, setFailure] = useState<Error | null>(null);
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

    async function fetchSelected(event: FormEvent) {
        event.preventDefault();
        if (controller.current) return;
        const parsed = trackSelectionSchema.safeParse({ track_ids: selectedTracks, region });
        if (!parsed.success) {
            setFailure(new Error(parsed.error.issues.map((issue) => issue.message).join(" ")));
            return;
        }
        const pending = new AbortController();
        controller.current = pending;
        setFetching(true);
        setFailure(null);
        try {
            const response = await fetchAsk("/api/track-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
                signal: pending.signal,
            });
            const batch = trackBatchSchema.parse(await response.json());
            addTrackBatch(config.id, batch);
        } catch (error) {
            if (!pending.signal.aborted) setFailure(error instanceof Error ? error : new Error(String(error)));
        } finally {
            if (!pending.signal.aborted) setFetching(false);
            if (controller.current === pending) controller.current = null;
        }
    }

    return (
        <>
            <form onSubmit={fetchSelected} className={styles.trackDataForm} aria-busy={fetching}>
                <p>
                    Select up to {MAX_SELECTED_TRACKS} tracks in the table below to retrieve track data in the specified
                    region.
                </p>
                <div className={styles.trackDataControls}>
                    <label htmlFor={regionId}>Region</label>
                    <input
                        id={regionId}
                        name="region"
                        type="text"
                        required
                        pattern={GENOMIC_LOCATION_PATTERN}
                        title="Enter a genomic region as chrN:start-end, for example chr19:44900000-45900000."
                        value={region}
                        placeholder="chr19:44900000-45900000"
                        aria-describedby={`${regionId}-help`}
                        disabled={fetching}
                        onChange={(event) => setRegion(event.target.value)}
                    />
                    <Button
                        disabled={
                            fetching ||
                            !region.trim() ||
                            selectedTracks.length === 0 ||
                            selectedTracks.length > MAX_SELECTED_TRACKS
                        }
                    >
                        {fetching ? "Fetching track data…" : "Fetch selected track data"}
                    </Button>
                </div>
                <p id={`${regionId}-help`}>Enter a region as chrN:start-end (1-based, inclusive).</p>
            </form>
            {failure && <ErrorAlert error={failure} />}
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
            {batches.map(({ id, batch }) => (
                <FetchedTrackData key={id} batch={batch} id={id} />
            ))}
        </>
    );
}
