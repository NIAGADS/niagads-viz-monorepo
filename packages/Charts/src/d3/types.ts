export interface AxisConfig {
    min?: number;
    max?: number;
    label?: string;
}

export interface DisplayProps {
    width?: number;
    height?: number;
    aspectRatio?: number; // height = width * aspectRatio
    margin?: { top: number; right: number; bottom: number; left: number };
}
