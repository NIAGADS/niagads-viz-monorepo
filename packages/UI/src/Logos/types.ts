export interface SVGLogoProps extends React.ComponentPropsWithoutRef<"svg"> {
    width?: string | number;
    height?: string | number;
}

export type LogoVariant = "default" | "white";

export interface NIAGADSProductLogoProps extends SVGLogoProps {
    variant?: LogoVariant;
    primaryColor?: string;
    accentColor?: string;
}