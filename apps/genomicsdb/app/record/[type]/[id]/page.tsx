import { assertValidRecordType, getOverview } from "@/lib/record-handlers";

import RecordReport from "@/components/records/RecordReport";

const EntityPage = ({ params }: { params: { type: string; id: string } }) => {
    const recordType = assertValidRecordType(params.type);
    return <RecordReport id={params.id} record_type={recordType} />;
};

export default EntityPage;
