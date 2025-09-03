// generic RecordPage

import { BaseRecord, EntityRecord } from "@/lib/types";

import { RECORD_PAGE_SECTIONS } from "@/app/record/sections";
import RecordAnnotationSection from "./RecordAnnotationSection";
import RecordSectionUnderConstructionAlert from "./RecordSectionUnderConstructionAlert";
import { fetchRecord } from "@/lib/route-handlers";
import { getOverview } from "@/lib/record-handlers";

const RecordPage = async ({ record_type, id }: BaseRecord) => {
    // need to fetch here b/c we need to pass the stable record.id through to sections to fetch tables
    const record: EntityRecord = (await fetchRecord(record_type, id)) as EntityRecord;
    // determine section identities/values from record_type
    const OverviewComponent = await getOverview(record_type);
    const sections = RECORD_PAGE_SECTIONS[record_type as keyof typeof RECORD_PAGE_SECTIONS];
    console.log(sections);
    return (
        <>
            <OverviewComponent record={record} />

            <RecordAnnotationSection
                recordId={record.id}
                recordType={record_type}
                sections={sections}
            ></RecordAnnotationSection>
        </>
    );
};

export default RecordPage;
