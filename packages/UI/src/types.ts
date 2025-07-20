export interface StylingProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

// legacy for layout & nav
export type ThemeVariant = "secondary" | "light" | "dark" | "accent";
