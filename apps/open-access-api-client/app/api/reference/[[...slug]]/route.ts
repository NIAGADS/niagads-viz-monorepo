import { NextRequest } from "next/server";
import { fetchApiResponse } from "../../route-handler";

export async function GET(request: NextRequest) {
    return await fetchApiResponse(request);
}
