export { getPvalueStyle } from "@niagads/common";

export const getRelativePositionClassName = (value: any) => {
    // if (value === "in_gene") {
    //     return null;
    // } else {
    //     return value;
    // }
    return value;
};

export const getImpactClassName = (value: any) => {
    return value?.toLowerCase() ?? null;
};
