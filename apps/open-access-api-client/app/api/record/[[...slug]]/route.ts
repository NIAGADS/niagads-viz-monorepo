import { NextRequest } from "next/server";
import { fetchApiResponse } from "../../route-handler";

export async function GET(request: NextRequest) {
    console.log("made it to route");
    return await fetchApiResponse(request);
}
