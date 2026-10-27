import { Alert } from "@niagads/ui";
import type { ReactNode } from "react";
import { errorDetails, errorMessage } from "./errors";
import styles from "./ask.module.css";

export default function ErrorAlert({
    error,
    message,
    children,
}: {
    error: Error;
    message?: string;
    children?: ReactNode;
}) {
    const diagnostics = errorDetails(error);
    return (
        <Alert variant="error" message={message ?? errorMessage(error)}>
            {children}
            <details>
                <summary>Error details to include in your report</summary>
                <pre className={styles.errorDetails}>{diagnostics.response}</pre>
            </details>
            {diagnostics.stackTrace && (
                <details>
                    <summary>Stack trace</summary>
                    <pre className={styles.errorDetails}>{diagnostics.stackTrace}</pre>
                </details>
            )}
        </Alert>
    );
}
