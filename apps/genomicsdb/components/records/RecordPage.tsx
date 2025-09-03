// generic RecordPage

import { BaseRecord, EntityRecord, RecordType } from "@/lib/types";

import RecordAnnotationSection from "./RecordAnnotationSection";
import { fetchRecord } from "@/lib/route-handlers";
import { getOverview } from "@/lib/record-handlers";

const RecordPage = async ({ record_type, id }: BaseRecord) => {
    // need to fetch here b/c we need to pass the stable record.id through to sections to fetch tables
    const record: EntityRecord = (await fetchRecord(record_type, id)) as EntityRecord;

    // check for structural variant
    const recordType: RecordType =
        record.record_type === "variant" && record.is_structural_variant === true
            ? "structural_variant"
            : record.record_type;

    // determine section identities/values from record_type
    const OverviewComponent = await getOverview(recordType);

    return (
        <>
            {/*<RecordSidebar
                title={record.id}
                recordType={recordType}
            />*/}
            <OverviewComponent record={record} />
            <RecordAnnotationSection id={record.id} record_type={recordType}></RecordAnnotationSection>
        </>
    );
};

export default RecordPage;
