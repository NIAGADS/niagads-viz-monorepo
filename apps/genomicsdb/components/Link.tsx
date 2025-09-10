import { getBasePath, getPublicUrl } from "@/lib/utils";

import Link from "next/link";
import React from "react";
import { RecordType } from "@/lib/types";

interface LinkWrapperProps {
    href?: string;
    children?: string;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any; // Allow additional props
}

export const AbsoluteRouterLink = ({ href, children, className = "", style = {}, ...props }: LinkWrapperProps) => {
    const prefix = getPublicUrl(true); // get url and basePath
    const prefixedHref = `${prefix}/${href}`;
    return (
        <Link href={`${prefixedHref}`} className={className} style={style} {...props}>
            {children ? children : `${prefixedHref}`}
        </Link>
    );
};

export const RouterLink = ({ href, children, className = "", style = {}, ...props }: LinkWrapperProps) => {
    const prefix = getBasePath(); // get url and basePath
    const prefixedHref = `${prefix}/${href}`;
    return (
        <Link href={`${prefixedHref}`} className={className} style={style} {...props}>
            {children ? children : `${prefixedHref}`}
        </Link>
    );
};

interface RecordLinkProps extends LinkWrapperProps {
    recordType: RecordType;
    recordId: string;
}

/**
 * Renders either a Next.js <Link> or returns a string URL for a record page.
 * If asComponent is false, returns a string
 * If routerLink returns a relative link
 */
export const RecordLink = ({ recordType, recordId, children, ...props }: RecordLinkProps) => {
    const prefix = getBasePath(); // get url and basePath
    const href = `${prefix}/record/${recordType}/${recordId}`;

    return (
        <Link href={href} {...props}>
            {children ? children : recordId}
        </Link>
    );
};
