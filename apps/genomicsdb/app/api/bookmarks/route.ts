import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/valkey";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authConfig";

export const GET = async (request: NextRequest) => {
    const res = await getCache("test", "key");
    return Response.json(res);
}

export const POST = async (request: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { 'Content-Type': 'application/api+json' } }
        );
    }

    const body = await request.json();

    const res = await addBookmark(session.email, body["recordId"], body["name"])

    return Response.json(res);
}

export const addBookmark = async (userId: string, recordId: string, bookmarkName: string) => {
    const key = `${userId}:${crypto.randomUUID()}`;

    const value = {
        recordId: recordId,
        name: bookmarkName,
    }

    const res = await setCache("test", key, value, "hour");
}



