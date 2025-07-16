import { AssociationSummaryBarChart } from "@niagads/charts";
import { OntologyTerm } from "@/lib/types";
import { _fetch } from "@/lib/route-handlers";

type RelativePosition = "in gene" | "upstream" | "downstream";
type AssociationTraitCategory = "biomarker" | "ad" | "adrd" | "other" | "all_ad" | "all";
type AssociationTraitSource = "gwas" | "curated" | "all";

interface GeneticAssocationSummary {
    trait_category: string;
    trait: OntologyTerm;
    //num_variants: RelativePositionCount;
}

interface AssociationSummaryChartProps {
    recordId: string;
    source: AssociationTraitSource;
    traitCategory: AssociationTraitCategory;
}

/* chart config:
series; summary data
*/
export const GeneAssociationSummaryChart = ({
    recordId,
    source = "all",
    traitCategory = "all",
}: AssociationSummaryChartProps) => {
    const associationSummary = _fetch(
        `/api/record/${recordId}/association?source=${source}&category=${traitCategory}&content=counts`
    );

    console.log(associationSummary);

    return <div>test</div>;
};

//<AssociationSummaryBarChart config={}></AssociationSummaryBarChart>;
