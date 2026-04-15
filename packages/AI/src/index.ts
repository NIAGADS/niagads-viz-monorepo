/**
 * @fileoverview NIAGADS AI Package - TanStack AI Integration
 *
 * This package provides a complete example of integrating TanStack AI for RAG (Retrieval-Augmented Generation)
 * document querying. It demonstrates:
 *
 * - **RAGDocChat**: A React component that manages chat UI with streaming responses
 * - **retrieval**: Server-side utility for fetching relevant document context
 * - **tools**: TanStack AI tool definitions for model-driven document retrieval
 * - **types**: TypeScript interfaces for retrieval requests/responses
 *
 * The component handles message streaming, tool execution visibility, and thinking/reasoning output from the model.
 */

export * from "./RAGDocChat";
export * from "./retrieval";
export * from "./tools";
export * from "./types";
