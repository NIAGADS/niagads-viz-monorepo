export const COLOR_BLIND_FRIENDLY_PALETTES = {
    PuBlRd: ["#601A4A", "#EE442F", "#63ACBE"],
    RdBlPu: ["#EE442F", "#601A4A", "#63ACBE"],
    eight_color: ["#332288", "#117733", "#44AA99", "#88CCEE", "#DDCC77", "#CC6677", "#AA4499", "#882255"],
};

type RGB = `rgb(${number},${number},${number})` | `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number},${number},${number},${number})` | `rgba(${number}, ${number}, ${number}, ${number})`;
type HSL = `hsl(${number},${number}%,${number}%)` | `hsl(${number}, ${number}%, ${number}%)`;
type HEX = `#${string}`;
type STANDARD_COLORS = "red" | "blue" | "green" | "gold" | "grey" | "black" | "white";

export type Color = RGB | RGBA | HSL | HEX | STANDARD_COLORS;

export type ColorScale = (value: number) => Color;

/** Existing table-example significance colors, shared by table consumers. */
export const getPvalueStyle = (pvalue: number | string) => {
    const strValue = String(pvalue);
    let neglog10p = undefined;
    if (strValue.includes("e-")) {
        const parts = strValue.split("e-");
        const exponent = parseInt(parts[1]);
        if (exponent > 50) {
            neglog10p = 50;
        }
    }
    if (!neglog10p) {
        neglog10p = -Math.log10(Number(pvalue));
    }
    const scale = colorscale({
        thresholds: [0.3, 3, 6, 7.3, 50],
        colors: [
            "rgba(60,80,100,1)",
            "rgb(254,220,220)",
            "rgb(252,140,140)",
            "rgb(255,200,120)",
            "rgb(150,230,150)",
            "rgb(150,210,255)",
        ],
    });
    const bgColor: Color = scale(neglog10p);

    return { backgroundColor: bgColor };
};

/**
 * Color scale configuration for mapping numeric values to colors.
 * Colors array must have one more element than thresholds array.
 * Optionally applies a transform function to values before comparing against thresholds.
 *
 * @example
 * ```tsx
 * // Without transformation
 * const scale = colorscale({
 *   thresholds: [0.3, 3, 6, 7.3, 10],
 *   colors: [
 *     "rgb(227,238,249)",
 *     "rgb(251,170,170)",
 *     "rgb(245, 12, 12)",
 *     "rgb(255,166,0)",
 *     "rgb(20, 186, 59)",
 *     "rgb(16,151,230)",
 *   ],
 * });
 * scale(0.5)   // returns "rgb(227,238,249)"
 * scale(12)    // returns "rgb(16,151,230)"
 *
 * // With -log10 transformation
 * const log10Scale = colorscale({
 *   transform: (value: number) => -Math.log10(value),
 *   thresholds: [2, 4, 6, 8],
 *   colors: [
 *     "rgb(227,238,249)",
 *     "rgb(251,170,170)",
 *     "rgb(245, 12, 12)",
 *     "rgb(255,166,0)",
 *     "rgb(20, 186, 59)",
 *   ],
 * });
 * log10Scale(0.01)   // -log10(0.01) = 2, returns colors[1]
 * log10Scale(1e-10)  // -log10(1e-10) = 10, returns colors[4]
 * ```
 */
export function colorscale({
    transform,
    thresholds,
    colors,
}: {
    transform?: (value: number) => number;
    thresholds: readonly number[];
    colors: readonly Color[];
}): ColorScale {
    if (colors.length !== thresholds.length + 1) {
        throw new Error(
            `colorscale: colors array must have one more element than thresholds. ` +
                `Got ${thresholds.length} thresholds and ${colors.length} colors.`
        );
    }

    return (value: number): Color => {
        const transformedValue = transform ? transform(value) : value;
        for (let i = 0; i < thresholds.length; i++) {
            if (transformedValue < thresholds[i]) {
                return colors[i];
            }
        }
        return colors[colors.length - 1];
    };
}
