import { z } from "zod";
import { AnnotationKind, Entity, ResponseContent, sourceChartTypes } from "./types.generated.ts";

const associationSummaryRowSchema = z.object({
    track: z.string().min(1),
    num_associations: z.number().int().nonnegative(),
});

const resultSchema = z
    .object({
        id: z.string().min(1),
        entity: z.enum(Entity),
        annotation: z.enum(AnnotationKind).nullable(),
        content: z.enum(ResponseContent).default(ResponseContent.FULL),
        rows: z.array(z.record(z.string(), z.unknown())).max(100),
        page: z.number().int().min(1),
        limit: z.number().int().min(1).max(100),
        has_more: z.boolean(),
        sources: z.array(z.string()).max(100),
        parameters: z.record(z.string(), z.unknown()),
        warnings: z.array(z.string()),
    })
    .strict();

const envelopeSchema = z
    .object({
        version: z.literal(2),
        status: z.enum([
            "ok",
            "empty",
            "clarification",
            "unsupported",
            "retrieval_error",
            "provider_error",
            "invalid_presentation",
        ]),
        results: z.array(resultSchema).max(12),
        presentation: z
            .array(
                z
                    .object({
                        component: z.enum(["table", "association_source_bar"]),
                        result_id: z.string().min(1),
                        title: z.string().max(160),
                        slot: z.enum(["primary", "secondary"]),
                    })
                    .strict()
            )
            .max(6),
        warnings: z.array(z.string()),
    })
    .strict()
    .superRefine((value, ctx) => {
        const ids = new Set(value.results.map((r) => r.id));
        if (ids.size !== value.results.length) ctx.addIssue({ code: "custom", message: "Duplicate result IDs" });
        value.presentation.forEach((p) => {
            const result = value.results.find((r) => r.id === p.result_id);
            if (!result) ctx.addIssue({ code: "custom", message: "Unknown result reference" });
            if (
                p.component === "association_source_bar" &&
                result &&
                (result.content !== ResponseContent.SUMMARY || !sourceChartTypes.some(
                    (type) => type.entity === result.entity && type.annotation === result.annotation
                ))
            ) {
                ctx.addIssue({ code: "custom", message: "Association chart requires summary content" });
            } else if (p.component === "association_source_bar" && result) {
                if (!result.rows.every((row) => associationSummaryRowSchema.safeParse(row).success)) {
                    ctx.addIssue({ code: "custom", message: "Association summary requires track identifiers and nonnegative integer counts" });
                }
            }
        });
    });

export type ResultSet = z.infer<typeof resultSchema>;
export type AskEnvelope = z.infer<typeof envelopeSchema>;

export function parseEnvelope(value: unknown): AskEnvelope {
    return envelopeSchema.parse(value);
}

export function textHistory<
    T extends {
        id: string;
        role: string;
        parts: readonly { type: string; text?: unknown }[];
    },
>(messages: readonly T[]) {
    return messages
        .slice(-12)
        .map((message) => ({
            id: message.id,
            role: message.role,
            parts: message.parts.flatMap((part) =>
                part.type === "text" && typeof part.text === "string"
                    ? [{ type: "text" as const, text: part.text }]
                    : []
            ),
        }))
        .filter((message) => message.parts.length > 0);
}

export function sourceCounts(result: ResultSet): { term: string; count: number }[] {
    return result.rows.map((row) => {
        const summary = associationSummaryRowSchema.parse(row);
        return { term: summary.track, count: summary.num_associations };
    });
}

export function tableData(result: ResultSet) {
    const keys = [...new Set(result.rows.flatMap(Object.keys))].slice(0, 12);
    return {
        columns: keys.map((id) => ({ id, header: id.replaceAll("_", " "), type: "text" as const })),
        data: result.rows.map((row) =>
            Object.fromEntries(
                keys.map((key) => [
                    key,
                    row[key] == null
                        ? ""
                        : typeof row[key] === "string"
                          ? (row[key] as string)
                          : JSON.stringify(row[key]),
                ])
            )
        ),
    };
}
