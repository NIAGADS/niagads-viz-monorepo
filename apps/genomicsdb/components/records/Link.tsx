import Link from "next/link";
import React from "react";
import { RecordType } from "@/lib/types";
import { getPublicUrl } from "@/lib/utils";

interface LinkProps {
    displayText?: string;
    routerLink?: boolean;
    className?: string;
    [key: string]: any;
}

interface RecordLinkProps extends LinkProps {
    recordType: RecordType;
    recordId: string;
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
    displayText,
    className = "",
    style = {},
    ...props
}: RecordLinkProps) => {
    const prefix = getPublicUrl(true); // get url and basePath
    const href = `${prefix}/record/${recordType}/${recordId}`;

    return (
        <Link href={href} className={className} style={style} {...props}>
            {displayText ? displayText : recordId}
        </Link>
    );
};

interface RouterLinkProps extends LinkProps {
    path: string;
}

export const RouterLink = ({ path, displayText, className = "", style = {}, ...props }: RouterLinkProps) => {
    const prefix = getPublicUrl(true); // get url and basePath
    const href = `${prefix}/${path}`;

    return (
        <Link href={href} className={className} style={style} {...props}>
            {displayText ? displayText : href}
        </Link>
    );
};

interface LinkWrapperProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any; // Allow additional props
}

export const PrefixedRouterLink = ({ href, children, className = "", style = {}, ...props }: LinkWrapperProps) => {
    const prefix = getPublicUrl(true); // get url and basePath

    return (
        <Link href={`${prefix}/${href}`} className={className} style={style} {...props}>
            {children}
        </Link>
    );
};
