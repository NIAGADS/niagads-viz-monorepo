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
    hover: boolean;
}

export const CardBody = ({ children }: CardBodyProps) => {
    return <div className={styles["card-body"]}>{children}</div>;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
    return <h5 className={styles["card-header"]}>{children}</h5>;
};

export const Card = ({
    href,
    onClick,
    children,
    className,
    variant = "full",
    hover = false,
}: CardProps & StylingProps) => {
    const cName = [
        href || onClick ? styles.card + " " + styles["card-link"] : styles.card,
        styles[`card-${variant}`],
        className,
        hover && styles["with-hover"],
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <div className={cName}>
            {href ? (
                <a href={href}>{children}</a>
            ) : onClick ? (
                <Button onClick={onClick} variant="link">
                    <div className={styles["card-button-content"]}>{children}</div>
                </Button>
            ) : (
                children
            )}
        </div>
    );
};
