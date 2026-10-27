"use client";

import { Button } from "@niagads/ui";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";

/** Download the retrieved payload independently of any presentation adapter. */
export default function DownloadJson({ value, filename }: { value: unknown; filename: string }) {
    const [failure, setFailure] = useState<Error | null>(null);
    function download() {
        setFailure(null);
        try {
            const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            setFailure(error instanceof Error ? error : new Error(String(error)));
        }
    }
    return (
        <>
            <Button onClick={download}>Download JSON</Button>
            {failure && <ErrorAlert error={failure} />}
        </>
    );
}
