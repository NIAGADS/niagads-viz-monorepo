export interface AxisConfig {
    min?: number;
    max?: number;
    label?: string;
}

export interface DisplayProps {
    aspectRatio?: number; // height = width * aspectRatio
    margin?: { top: number; right: number; bottom: number; left: number };
    width?: number; // chart width in pixels
}
