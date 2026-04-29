import { Color, colorscale } from "@niagads/common";

export const getRelativePositionClassName = (value: any) => {
    if (value === "in_gene") {
        return null;
    } else {
        return value;
    }
};

export const getPvalueStyle = (pvalue: number) => {
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
        neglog10p = -Math.log10(pvalue);
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
