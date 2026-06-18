export interface AxisConfig {
    min?: number;
    max?: number;
    label?: string;
}

export type ChartWidth = number | string;

export interface DisplayProps {
    aspectRatio?: number; // used when height is not provided
    height?: number; // chart height in pixels
    margin?: { top: number; right: number; bottom: number; left: number };
    width?: ChartWidth; // chart width in pixels or CSS width string, e.g. "100%"
}