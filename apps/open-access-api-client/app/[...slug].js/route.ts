// for non-versioned (LTS) endpoints

import { NextRequest } from "next/server";
import { backendFetchResponseHandler } from "@/utils/routeHandlers";

export async function GET(request: NextRequest) {
    return await backendFetchResponseHandler(request);
}
