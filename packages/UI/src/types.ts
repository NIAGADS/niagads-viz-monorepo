export type ThemeVariant = "secondary" | "light" | "dark" | "accent";

export interface StylingProps {
    className?: string;
}

export interface AriaProps {
    role?: string;
    ariaLabel?: string;
    ariaLabeledBy?: string;
    ariaDescribedBy?: string;
}
