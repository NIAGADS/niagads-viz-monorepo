import { z } from "zod";

export const modelStatusSchema = z
    .object({
        state: z.enum(["requesting", "waiting", "retrying", "failed"]),
        attempt: z.number().int().min(1).max(5),
        waitSeconds: z.number().finite().min(0),
    })
    .strict();

export type ModelStatus = z.infer<typeof modelStatusSchema> & { receivedAt: number };
export const MODEL_BUSY_MESSAGE = "OpenRouter could not complete the request. Please try again later.";
