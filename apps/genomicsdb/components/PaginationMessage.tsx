"use client";

import { Alert, Button, InlineIcon } from "@niagads/ui";
import React, { useId } from "react";

import { Pagination } from "@/lib/types";
import { Share2 } from "lucide-react";
import { Tooltip } from "@niagads/ui/client";
import styles from "./styles/pagination-message.module.css";

interface PaginationMessageProps {
    pagination: Pagination;
    endpoint: string;
}

const PaginationMessage = ({ pagination, endpoint }: PaginationMessageProps) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const fullUrl = apiUrl + endpoint;
    const tooltipId = useId();

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
    };

    return (
        <Alert variant="info" message={"This search returned a large result"}>
            <div className={styles.pagination}>
                Only <b>{pagination.paged_num_records.toLocaleString()}</b> out of{" "}
                <b>{pagination.total_num_records.toLocaleString()}</b> records are shown here.
                <br />
                You can retrieve the full result set directly from the NIAGADS Open Access API. See the{" "}
                <a href={`${process.env.NEXT_PUBLIC_API_URL}/docs`} target="_blank">
                    API documentation
                </a>{" "}
                for more information.
                <Tooltip content="Copied to clipboard!" anchorId={tooltipId} openOnClick={true}>
                    <Button onClick={handleCopy} title={`Get record permalink`}>
                        <InlineIcon icon={<Share2 size={16} />}>Share</InlineIcon>
                    </Button>
                </Tooltip>
            </div>
        </Alert>
    );
};

export default PaginationMessage;
