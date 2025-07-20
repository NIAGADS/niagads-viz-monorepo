export interface StylingProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

export interface AriaProps {
    role?: string;
    ariaLabel?: string;
    ariaLabeledBy?: string;
    ariaDescribedBy?: string;
}

// legacy for layout & nav
export type ThemeVariant = "secondary" | "light" | "dark" | "accent";
