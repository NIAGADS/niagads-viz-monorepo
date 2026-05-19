import { NextRequest } from "next/server";
import { getCache, setCache } from "@/lib/valkey";

export const GET = async (request: NextRequest) => {
    const res = await getCache("test", "key");
    return Response.json(res);
}

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const res = await setCache("test", "key", body["bookmark"])
    return Response.json(res);
}



