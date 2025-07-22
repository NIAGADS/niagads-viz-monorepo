import Link from "next/link";
import React from "react";
import { RecordType } from "@/lib/types";
import { getPublicUrl } from "@/lib/utils";

interface RecordLinkProps {
    recordType: RecordType;
    recordId: string;
    displayId?: string;
    asText?: boolean;
    routerLink?: boolean;
    className?: string;
    [key: string]: any;
}

/**
 * Renders either a Next.js <Link> or returns a string URL for a record page.
 * If asComponent is false, returns a string
 * If routerLink returns a relative link
 */
export const RecordLink = ({
    recordType,
    recordId,
    displayId,
    asText = false,
    routerLink = true,
    className = "",
    style = {},
    ...props
}: RecordLinkProps) => {
    const prefix = routerLink ? "" : getPublicUrl(true); // get url and basePath
    const href = `${prefix}/record/${recordType}/${recordId}`;

    return asText ? (
        href
    ) : (
        <Link href={href} className={className} style={style} {...props}>
            {displayId ? displayId : recordId}
        </Link>
    );
};
