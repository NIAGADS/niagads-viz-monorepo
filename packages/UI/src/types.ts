
export type ThemeVariant = "primary" | "secondary" | "light" | "dark";

export interface StylingProps {
    colorVariant?: "primary" | "secondary" | "accent" | "default" | "transparent";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export interface AriaProps {
    role?: string;
    ariaLabel?: string;
    ariaLabeledBy?: string;
    ariaDescribedBy?: string;
}

