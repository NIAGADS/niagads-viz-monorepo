import React, { ReactNode } from "react";

import { Button } from "./Button";
import { StylingProps } from "./types";
import { _get } from "@niagads/common";

interface CardBodyProps {
    children: ReactNode | string;
}

interface CardHeaderProps {
    children: ReactNode | string;
}

type CardVariant = "half" | "third" | "two-thirds" | "full";

interface CardProps {
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
    children: ReactNode | string;
    variant: CardVariant;
}

export const CardBody = ({ children }: CardBodyProps) => {
    return <div className="ui-card-body">{children}</div>;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
    return <h5 className="ui-card-header">{children}</h5>;
};

export const Card = ({ href, onClick, children, className, variant = "full" }: CardProps & StylingProps) => {
    const cName = `${href || onClick ? "ui-card ui-card-link" : "ui-card"} ui-card-${variant} ${className}`;
    return (
        <div className={cName}>
            {href ? (
                <a href={href}>{children}</a>
            ) : onClick ? (
                <Button onClick={onClick} variant="white">
                    <div className="ui-card-button-content">{children}</div>
                </Button>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
};
