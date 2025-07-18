// -- genetic association summary data /record/{type}/{id}/association?content=COUNTS endoints

import { OntologyTerm } from "@/lib/types";

interface GeneticAssocationSummary {
    trait_category: string;
    trait: OntologyTerm;
    num_variants: number;
}
