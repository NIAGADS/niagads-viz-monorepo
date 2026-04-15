import { chat, maxIterations, toServerSentEventsResponse } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { NextRequest } from "next/server";

import { createRAGDocRetrievalServerTool } from "../../../../../packages/AI/src/tools";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_API_KEY;

    if (!apiKey) {
        return Response.json(
            {
                error: "Set OPENAI_API_KEY for the RAGDoc chat playground. OPEN_API_KEY is also accepted as an alias.",
            },
            { status: 500 }
        );
    }

    process.env.OPENAI_API_KEY = apiKey;

    const model = body.model ?? body.data?.model ?? "gpt-5.2";
    const maxContextResults = body.maxContextResults ?? body.data?.maxContextResults ?? 3;
    const retrieveEndpoint = new URL("/api/ragdoc-retrieve", request.url).toString();

    const stream = chat({
        adapter: openaiText(model),
        messages: body.messages ?? [],
        tools: [
            createRAGDocRetrievalServerTool(retrieveEndpoint, {
                defaultLimit: maxContextResults,
                headers: {
                    "x-ragdoc-max-context-results": String(maxContextResults),
                },
            }),
        ],
        stopWhen: maxIterations(3),
        system:
            "Answer using the retrieve_ragdoc_context tool when the user asks about RAGDoc architecture, ingestion, retrieval, or deployment. Cite retrieved context in plain language.",
    });

    return toServerSentEventsResponse(stream);
}
