import { NextRequest, NextResponse } from "next/server";

const MOCK_CHUNKS = [
    {
        chunk_metadata_id: 1,
        document_id: 101,
        document_section: "Admin ingestion",
        chunk_index: 0,
        chunk_text:
            "The admin service queues URL ingestion jobs and displays job status without importing embedding or transformer dependencies.",
        url: "https://example.org/ragdoc/admin",
        score: 0.94,
    },
    {
        chunk_metadata_id: 2,
        document_id: 102,
        document_section: "Ingestion worker",
        chunk_index: 1,
        chunk_text:
            "The ingestion worker polls pending jobs, scrapes in-scope pages, chunks informative content, and stores embeddings in the RAG document database.",
        url: "https://example.org/ragdoc/worker",
        score: 0.89,
    },
    {
        chunk_metadata_id: 3,
        document_id: 103,
        document_section: "Retrieval API",
        chunk_index: 2,
        chunk_text:
            "The retrieval API accepts a query, generates a query embedding, and returns nearest document chunks with citation-ready metadata.",
        url: "https://example.org/ragdoc/api",
        score: 0.86,
    },
];

export async function POST(request: NextRequest) {
    const body = await request.json();
    const limit = typeof body.limit === "number" ? body.limit : MOCK_CHUNKS.length;

    return NextResponse.json({
        query: body.query ?? "",
        results: MOCK_CHUNKS.slice(0, limit),
    });
}
