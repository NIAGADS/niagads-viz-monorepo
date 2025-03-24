import React from "react";
import { FallbackProps } from "react-error-boundary";

export function errorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p>Something went wrong:</p>
            <pre className="text-wrap">{error.message}</pre>
        </div>
    );
}
