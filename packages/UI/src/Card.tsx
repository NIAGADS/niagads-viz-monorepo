import React, { ReactNode } from "react";
import { _get } from "@niagads/common";
import { Button } from "./Button";

interface CardBodyProps {
    children: ReactNode | string;
}

interface CardHeaderProps {
    children: ReactNode | string;
}

interface CardProps {
    shadow?: boolean;
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
    radius?: "none" | "sm" | "md" | "lg" | "xl";
    children: ReactNode | string;
}

export const CardBody = ({ children }: CardBodyProps) => {
    return <div className="ui-card-body">{children}</div>;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
    return <h5 className="ui-card-header">{children}</h5>;
};

export const Card = ({ shadow = false, radius = "md", href, onClick, children }: CardProps) => {
    const className = `${href || onClick ? "ui-card-link" : "ui-card"} ${shadow ? "shadow-sm" : ""} rounded-${radius}`;
    return (
        <div className={className}>
            {href ? (
                <a href={href}>{children}</a>
            ) : onClick ? (
                <Button onClick={onClick} variant="white">
                    <div className="flex col">{children}</div>
                </Button>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
};
