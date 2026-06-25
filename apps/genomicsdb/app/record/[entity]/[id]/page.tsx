import RecordPage from "@/components/records/RecordPage/RecordPage";
import { EntityRecord, RecordPageProps, RecordType } from "@/lib/types";
import { assertValidRecordType, getOverview } from "@/lib/record-handlers";
import { fetchRecord } from "@/lib/route-handlers";

const EntityPage = async ({ params }: RecordPageProps) => {
    const { id, entity } = await params;
    const recordType = assertValidRecordType(entity);

    const recordData: EntityRecord = (await fetchRecord(recordType, id)) as EntityRecord;

    const resolvedRecordType: RecordType =
        recordData.record_type === "variant" && recordData.is_structural_variant === true
            ? "structural_variant"
            : recordType;
    const OverviewComponent = await getOverview(resolvedRecordType);

    return <RecordPage 
                recordId={id} 
                recordType={recordType} 
                recordData={recordData} 
                overview={<OverviewComponent key={`${resolvedRecordType}-${id}-overview`} record={recordData} />}
            />;
};

export default EntityPage;
