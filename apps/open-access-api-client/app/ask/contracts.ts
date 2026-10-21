import { z } from "zod";
import { issueSchema } from "./errors.ts";
import { AnnotationKind, Entity, ResponseContent } from "./types.generated.ts";

export const feedbackSchema = z
    .object({
        reference: z.string().regex(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01\.[0-9a-f]{64}$/),
        rating: z.union([z.literal(0), z.literal(1)]),
        comment: z.string().max(2000).nullable().optional(),
    })
    .strict();

export const presentationSchema = z
    .object({
        result_id: z.string().min(1),
        view: z.enum(["auto", "table", "plot"]).default("auto"),
        title: z.string().max(160).default("Retrieved evidence"),
        plot_type: z.string().min(1).nullable().default(null),
        group_by: z.string().min(1).nullable().default(null),
        x: z.string().min(1).nullable().default(null),
        y: z.string().min(1).nullable().default(null),
    })
    .strict();
export type PresentationIntent = z.infer<typeof presentationSchema>;

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
        issues: z.array(issueSchema).default([]),
        version: z.literal(4),
        feedback_reference: z.string().max(120).nullable().optional(),
        status: z.enum([
            "ok",
            "empty",
            "clarification",
            "unsupported",
            "retrieval_error",
            "provider_error",
            "token_limit",
        ]),
        results: z.array(resultSchema).max(12),
        presentation: z.array(presentationSchema).max(6),
        warnings: z.array(z.string()),
    })
    .strict()
    .superRefine((value, ctx) => {
        const ids = new Set(value.results.map((r) => r.id));
        if (ids.size !== value.results.length) ctx.addIssue({ code: "custom", message: "Duplicate result IDs" });
        value.presentation.forEach((p) => {
            const result = value.results.find((r) => r.id === p.result_id);
            if (!result) ctx.addIssue({ code: "custom", message: "Unknown result reference" });
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
