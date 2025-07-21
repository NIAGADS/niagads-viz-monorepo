import { AnchoredPageSection, CacheIdentifier } from "@/lib/types";

import RecordSectionHeader from "./RecordAnnotationSectionHeader";
import { RecordTableSection } from "./RecordTableSection";

export interface RecordAnnotationProps extends CacheIdentifier {
    sections: AnchoredPageSection[];
}

export function RecordAnnotationSection({ sections, ...cacheInfo }: RecordAnnotationProps) {
    return sections.map(
        (section: AnchoredPageSection) =>
            section.tables && (
                <div id={section.id}>
                    <RecordSectionHeader title={section.label} description={section.description}></RecordSectionHeader>
                    <RecordTableSection
                        recordId={cacheInfo.recordId}
                        recordType={cacheInfo.recordType}
                        sectionId={section.id}
                        sectionLabel={section.label}
                        tables={section.tables}
                    ></RecordTableSection>
                </div>
            )
    );
}
