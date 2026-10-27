import { z } from "zod";

// Display policy belongs to the frontend; it is independent of the API contract.
export const MAX_BAR_CATEGORIES = z.coerce
    .number()
    .int()
    .positive()
    .parse(process.env.NEXT_PUBLIC_ASK_MAX_BAR_CATEGORIES ?? "7");
