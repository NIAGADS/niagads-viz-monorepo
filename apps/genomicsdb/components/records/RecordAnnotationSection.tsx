import { AnchoredPageSection, CacheIdentifier } from "@/lib/types";

import RecordSectionHeader from "./RecordAnnotationSectionHeader";
import { RecordSectionUnderConstructionAlert } from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";

export interface RecordAnnotationProps extends CacheIdentifier {
    sections: AnchoredPageSection[];
}

export function RecordAnnotationSection({ sections, ...cacheInfo }: RecordAnnotationProps) {
    return sections.map(
        (section: AnchoredPageSection) =>
            section.tables && (
                <div id={section.id} key={section.id}>
                    <RecordSectionHeader
                        key={`${section.id}-header`}
                        title={section.label}
                        description={section.description}
                    ></RecordSectionHeader>
                    {section.underConstruction ? (
                        <RecordSectionUnderConstructionAlert section={section.label} />
                    ) : (
                        <RecordTableSection
                            key={`${section.id}-tables`}
                            recordId={cacheInfo.recordId}
                            recordType={cacheInfo.recordType}
                            sectionId={section.id}
                            sectionLabel={section.label}
                            tables={section.tables}
                        ></RecordTableSection>
                    )}
                </div>
            )
    );
}
