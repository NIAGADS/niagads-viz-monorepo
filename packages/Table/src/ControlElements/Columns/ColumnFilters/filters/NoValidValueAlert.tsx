import { Alert } from "@niagads/ui";
import React from "react";

export const NoValidValueAlert = ({ columnName }: { columnName: string }) => (
    <Alert variant="info" message={columnName}>
        <p>Cannot filter on this column: all values are N/A.</p>
    </Alert>
);
