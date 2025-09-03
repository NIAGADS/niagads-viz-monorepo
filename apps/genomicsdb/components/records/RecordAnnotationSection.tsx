import { AnchoredPageSection, BaseRecord, RecordType } from "@/lib/types";

import RecordSectionHeader from "./RecordAnnotationSectionHeader";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import RecordTableSection from "./RecordTableSection";
import { RECORD_PAGE_SECTIONS } from "@/data/sections";

const RecordAnnotationSection = ({ id, record_type }: BaseRecord) => {
    const sections = RECORD_PAGE_SECTIONS[record_type];
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
                            recordId={id}
                            recordType={record_type}
                            tables={section.tables}
                        ></RecordTableSection>
                    )}
                </div>
            )
    );
};

export default RecordAnnotationSection;
