import { z } from "zod";

const resultSchema = z
    .object({
        id: z.string().min(1),
        kind: z.enum(["genes", "variants", "tracks", "associations", "structure", "operations"]),
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
        version: z.literal(1),
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
                !["genes", "associations"].includes(result.kind)
            ) {
                ctx.addIssue({ code: "custom", message: "Incompatible chart data" });
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
    const counts = new Map<string, number>();
    for (const row of result.rows) {
        const sources: string[] = [];
        if (Array.isArray(row.evidence)) {
            for (const evidence of row.evidence) {
                if (
                    evidence &&
                    typeof evidence === "object" &&
                    "data_source" in evidence &&
                    typeof evidence.data_source === "string"
                ) {
                    sources.push(evidence.data_source);
                }
            }
        }
        if (typeof row.track === "string") sources.push(row.track);
        for (const source of sources) counts.set(source, (counts.get(source) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([term, count]) => ({ term, count }));
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
