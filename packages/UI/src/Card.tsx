import { AriaProps, StylingProps } from "./types";
import React, { ReactNode } from "react";

import styles from "./styles/card.module.css";

interface CardBodyProps {
    children: ReactNode;
}

interface CardHeaderProps {
    children: ReactNode;
}

type CardVariant = "half" | "third" | "two-thirds" | "full";

interface CardProps {
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | null;
    children: ReactNode;
    variant: CardVariant;
    hover?: boolean;
}

export const CardBody = ({ children }: CardBodyProps) => <div className={styles["card-body"]}>{children}</div>;
export const CardHeader = ({ children }: CardHeaderProps) => <div className={styles["card-header"]}>{children}</div>;

export const Card = ({
    href,
    onClick,
    children,
    className,
    variant = "full",
    hover = false,
    role,
}: CardProps & StylingProps & AriaProps) => {
    const isClickable = href || onClick;
    const useHoverStyles = hover || isClickable;
    const classes = [
        styles.card,
        styles[`card-${variant}`],
        isClickable && styles["card-link"],
        useHoverStyles && styles["with-hover"],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (href) {
            window.location.href = href;
        } else if (onClick) {
            onClick(event as any);
        }
        // else do nothing
    };

    return (
        <div className={classes} role={role} onClick={isClickable ? handleClick : undefined}>
            {children}
        </div>
    );
};

interface FeatureCardProps extends Omit<CardProps, "children">, StylingProps, AriaProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

// note: this assumes the `icon` is a lucide-react icon
export const FeatureCard = ({ icon, title, description, className, ...cardProps }: FeatureCardProps) => {
    const Icon = icon;
    return (
        <Card {...cardProps} className={[className, styles["feature-card"]].filter(Boolean).join(" ")}>
            <Icon className={styles["feature-icon"]} size={48} />
            <h3 className={styles["feature-title"]}>{title}</h3>
            <p className={styles["feature-description"]}>{description}</p>
        </Card>
    );
};
