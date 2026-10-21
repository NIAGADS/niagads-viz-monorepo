import { z } from "zod";
import {
    BooleanOperator,
    ConceptCategory,
    Entity,
    GeneEvidence,
    GenomeBuild,
    LocationKind,
    QueryIntent,
} from "./types.generated.ts";

type Concept = { category: (typeof ConceptCategory)[keyof typeof ConceptCategory]; text: string };
type Expression =
    | Concept
    | {
          operator: (typeof BooleanOperator)[keyof typeof BooleanOperator];
          operands: Expression[];
      };

const expressionSchema: z.ZodType<Expression> = z.lazy(() =>
    z.union([
        z.object({ category: z.enum(ConceptCategory), text: z.string().min(1) }).strict(),
        z.object({ operator: z.enum(BooleanOperator), operands: z.array(expressionSchema).min(1) }).strict(),
    ])
);

const queryPlanSchema = z
    .object({
        intent: z.enum(QueryIntent),
        entity: z.enum(Entity).nullable().default(null),
        selection: expressionSchema.nullable().default(null),
        location: z
            .object({
                kind: z.enum(LocationKind),
                loc: z.string().min(1),
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
                        field: z.string().min(1),
                        question: z.string().min(1),
                    })
                    .strict()
            )
            .default([]),
        exclusions: z.array(z.string()).default([]),
        gene_evidence: z.array(z.enum(GeneEvidence)).default([]),
    })
    .strict();

export type QueryPlan = z.infer<typeof queryPlanSchema>;

export function parseQueryPlan(value: unknown): QueryPlan {
    return queryPlanSchema.parse(value);
}
