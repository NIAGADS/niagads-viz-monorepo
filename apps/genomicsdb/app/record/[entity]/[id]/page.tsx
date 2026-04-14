import RecordPage from "@/components/records/RecordPage";
import { EntityRecord, RecordPageProps } from "@/lib/types";
import { assertValidRecordType } from "@/lib/record-handlers";
import { fetchRecord } from "@/lib/route-handlers";

const EntityPage = async ({ params }: RecordPageProps) => {
    const { id, entity } = await params;
    const recordType = assertValidRecordType(entity);

    const recordData: EntityRecord = (await fetchRecord(recordType, id)) as EntityRecord;

    return <RecordPage recordId={id} recordType={recordType} recordData={recordData} />;
};

export default EntityPage;
