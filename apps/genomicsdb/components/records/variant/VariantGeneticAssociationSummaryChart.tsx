// -- genetic association summary data /record/{type}/{id}/association?content=COUNTS endpoints

import { OntologyTerm } from "@/lib/types";

interface GeneticAssociationSummary {
    trait_category: string;
    trait: OntologyTerm;
    num_variants: number;
}
