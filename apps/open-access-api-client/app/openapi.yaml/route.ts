import { NextRequest } from "next/server";
import { backendFetchResponseHandler } from "@/utils/routeHandlers";

export async function GET(request: NextRequest) {
    return await backendFetchResponseHandler(request, true, {
        "Content-Type": "text/yaml",
    });
}
