import React, { ReactNode } from "react";

import { Button } from "./Button";
import { StylingProps } from "./types";
import { _get } from "@niagads/common";
import styles from "./styles/card.module.css";

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
    return <div className={styles["ui-card-body"]}>{children}</div>;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
    return <h5 className={styles["ui-card-header"]}>{children}</h5>;
};

export const Card = ({ href, onClick, children, className, variant = "full" }: CardProps & StylingProps) => {
    const cName = [
        href || onClick ? styles["ui-card"] + " " + styles["ui-card-link"] : styles["ui-card"],
        styles[`ui-card-${variant}`],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <div className={cName}>
            {href ? (
                <a href={href}>{children}</a>
            ) : onClick ? (
                <Button onClick={onClick} variant="white">
                    <div className={styles["ui-card-button-content"]}>{children}</div>
                </Button>
            ) : (
                children
            )}
        </div>
    );
};
