import RecordPage from "@/components/records/RecordPage";
import { RecordPageProps } from "@/lib/types";
import { assertValidRecordType } from "@/lib/record-handlers";

const EntityPage = async ({ params }: RecordPageProps) => {
    const { id, entity } = await params;
    const recordType = assertValidRecordType(entity);
    return <RecordPage id={id} record_type={recordType} />;
};

export default EntityPage;
