import { z } from "zod";
import type { TableConfig } from "@niagads/table";
import type { PresentationData } from "./translators/registry.ts";
import { translateTable } from "./translators/index.ts";

export const MAX_SELECTED_TRACKS = 5;
// RegularExpressions.GENOMIC_LOCATION in niagads/utils/regular_expressions.py.
export const GENOMIC_LOCATION_PATTERN = String.raw`^(chr)?(?:MT|[1-9]|1[0-9]|2[0-2]|X|Y|M)[:\-](\d+)[\-:](\d+)$`;
const trackIdSchema = z
    .string()
    .min(1)
    .refine((value) => value !== "." && value !== ".." && !/[\\/?#]/.test(value), "Invalid track path identifier");
export const trackSelectionSchema = z
    .object({
        region: z
            .string()
            .trim()
            .regex(new RegExp(GENOMIC_LOCATION_PATTERN), "Enter a region as chrN:start-end.")
            .refine((value) => {
                const [, start, end] = value.split(/[:-]/).map(Number);
                return Number.isSafeInteger(start) && start >= 1 && Number.isSafeInteger(end) && end >= start;
            }, "Region coordinates must be positive integers with start less than or equal to end.")
            .transform((value) => {
                const [chromosome, start, end] = value.split(/[:-]/);
                return `${chromosome}:${start}-${end}`;
            }),
        track_ids: z
            .array(trackIdSchema)
            .min(1)
            .max(MAX_SELECTED_TRACKS)
            .refine((ids) => new Set(ids).size === ids.length, "Track IDs must be unique"),
    })
    .strict();

export const trackResponseSchema = z
    .object({
        data: z.array(z.record(z.string(), z.unknown())),
        pagination: z
            .object({
                page: z.number().int().positive(),
                total_pages: z.number().int().nonnegative(),
            })
            .passthrough()
            .nullable()
            .optional(),
    })
    .passthrough();

export const trackBatchSchema = z
    .object({
        tracks: z
            .array(
                z.discriminatedUnion("status", [
                    z
                        .object({
                            track_id: trackIdSchema,
                            status: z.literal("ok"),
                            request_id: z.string().nullable(),
                            response: trackResponseSchema,
                        })
                        .strict(),
                    z
                        .object({
                            track_id: trackIdSchema,
                            status: z.literal("error"),
                            request_id: z.string().nullable(),
                            http_status: z.number().int().nullable(),
                            message: z.string(),
                        })
                        .strict(),
                ])
            )
            .min(1)
            .max(MAX_SELECTED_TRACKS),
    })
    .strict();
export type TrackDataBatch = z.infer<typeof trackBatchSchema>;

/** Combine this action's returned pages without applying ASK's LLM-envelope row cap. */
export function assembleTrackData(batch: TrackDataBatch, id: string): TableConfig {
    const rows = batch.tracks.flatMap((track) =>
        track.status === "ok" ? track.response.data.map((row) => ({ ...row, requested_track: track.track_id })) : []
    );
    const result: PresentationData = {
        id,
        entity: "track",
        annotation: "associations",
        content: "full",
        rows,
    };
    const table = translateTable(result);
    table.columns.unshift({
        id: "requested_track",
        header: "Requested track ID",
        type: "text",
        required: true,
        filterOpts: { filterType: "pie" },
    });
    table.data = table.data.map((row, i) => ({ requested_track: rows[i].requested_track, ...row }));
    return table;
}
