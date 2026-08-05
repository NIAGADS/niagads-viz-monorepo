/**
 * Core type definitions for D3 chart components
 *
 * This module defines shared interfaces and types used across D3-based charts,
 * including axis configuration, display properties, and data point information.
 */

/**
 * Configuration options for chart axes
 */
export interface AxisConfig {
    /** Minimum value for the axis domain */
    min?: number;
    /** Maximum value for the axis domain */
    max?: number;
    /** Label text to display for the axis */
    label?: string;
}

/** Chart width can be specified as a pixel value or CSS string (e.g., "100%") */
export type ChartWidth = number | string;

/**
 * Display and layout configuration for charts
 */
export interface DisplayProps {
    /** Aspect ratio of the chart (used when height is not explicitly provided) */
    aspectRatio?: number;
    /** Chart height in pixels */
    height?: number;
    /** Chart margins in pixels */
    margin?: { top: number; right: number; bottom: number; left: number };
    /** Chart width in pixels or CSS width string (e.g., "100%") */
    width?: ChartWidth;
}

/**
 * Additional information for a data point displayed on mouseover/tooltip
 */
export interface DataPointInfo {
    /** Display label for the tooltip */
    label: string;
    /** The value to display in the tooltip (numeric or string representation) */
    value: string | number;
}
