import { z } from "zod";
import { ConceptCategory, Entity, GeneEvidence, GenomeBuild, LocationKind, QueryIntent } from "./types.generated.ts";

const conceptSchema = z.object({ category: z.enum(ConceptCategory), text: z.string().min(1).max(100) }).strict();

const queryPlanSchema = z
    .object({
        intent: z.enum(QueryIntent),
        goal: z.string().min(1).max(320),
        entity: z.enum(Entity).nullable().default(null),
        concepts: z.array(conceptSchema).max(6).default([]),
        constraints: z.array(z.string().min(1).max(160)).max(6).default([]),
        location: z
            .object({
                kind: z.enum(LocationKind),
                loc: z.string().min(1).max(128),
                flank_bp: z.number().int().nonnegative().nullable().default(null),
                assembly: z.enum(GenomeBuild).nullable().default(null),
            })
            .strict()
            .nullable()
            .default(null),
        clarifications: z
            .array(
                z
                    .object({
                        field: z.string().min(1).max(64),
                        question: z.string().min(1).max(160),
                    })
                    .strict()
            )
            .max(2)
            .default([]),
        exclusions: z.array(z.string().min(1).max(100)).max(4).default([]),
        gene_evidence: z.array(z.enum(GeneEvidence)).max(6).default([]),
    })
    .strict();

export type QueryPlan = z.infer<typeof queryPlanSchema>;

export function parseQueryPlan(value: unknown): QueryPlan {
    return queryPlanSchema.parse(value);
}
