// generic RecordPage

import { BaseRecord, EntityRecord, VariantRecord } from "@/lib/types";

import { RECORD_PAGE_SECTIONS } from "@/app/record/sections";
import { RecordAnnotationSection } from "./RecordAnnotationSection";
import { RecordSectionUnderConstructionAlert } from "./RecordSectionUnderConstructionAlert";
import { fetchRecord } from "@/lib/route-handlers";
import { getOverview } from "@/lib/record-handlers";

const RecordReport = async ({ record_type, id }: BaseRecord) => {
    // need to fetch here b/c we need to pass the stable record.id through to sections to fetch tables
    const record: EntityRecord = (await fetchRecord(record_type, id)) as EntityRecord;

    // dynamically load record-type dependent components
    const Overview = getOverview(record_type);

    const sections = RECORD_PAGE_SECTIONS[record_type as keyof typeof RECORD_PAGE_SECTIONS];

    return (
        <>
            <Overview record={record} /> {/* type-specific */}
            {record_type == "variant" && (record as VariantRecord).is_structural_variant !== true ? (
                <RecordAnnotationSection
                    recordId={record.id}
                    recordType={record_type}
                    sections={sections}
                ></RecordAnnotationSection>
            ) : (
                <RecordSectionUnderConstructionAlert section="Structural Variant Annotations"></RecordSectionUnderConstructionAlert>
            )}
        </>
    );
};

export default RecordReport;
