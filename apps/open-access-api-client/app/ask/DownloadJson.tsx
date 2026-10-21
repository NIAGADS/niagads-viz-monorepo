"use client";

import { Button } from "@niagads/ui";
import { useState } from "react";

/** Download the retrieved payload independently of any presentation adapter. */
export default function DownloadJson({ value, filename }: { value: unknown; filename: string }) {
    const [failure, setFailure] = useState<string | null>(null);
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
            setFailure(error instanceof Error ? error.message : "The JSON download failed");
        }
    }
    return (
        <>
            <Button onClick={download}>Download JSON</Button>
            {failure && <p role="alert">{failure}</p>}
        </>
    );
}
