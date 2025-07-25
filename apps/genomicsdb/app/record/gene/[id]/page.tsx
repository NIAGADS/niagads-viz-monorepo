import { GeneRecord, PageProps, RecordType } from "@/lib/types";
import { _fetch, fetchRecord } from "@/lib/route-handlers";

import { GeneRecordOverview } from "@/components/records/gene/GeneRecordOverview";
import { RECORD_PAGE_SECTIONS } from "../../sections";
import { RecordAnnotationSection } from "@/components/records/RecordAnnotationSection";
import { RecordOverview } from "@/components/records/RecordOverview";
import { getRecordTypeFromPath } from "@/lib/utils";
import { headers as get_headers } from "next/headers";

export default async function GeneReport({ params }: PageProps) {
    const { id } = await params;
    const headers = await get_headers();
    const path: string = headers.get("x-current-pathname")!;
    const recordType: RecordType = getRecordTypeFromPath(path)!;
    let record: GeneRecord = (await fetchRecord(path, true)) as GeneRecord;
    Object.assign(record, { record_type: recordType });

    return (
        <>
            <RecordOverview>
                <GeneRecordOverview record={record}></GeneRecordOverview>
            </RecordOverview>

            <RecordAnnotationSection
                recordId={record.id}
                recordType={recordType}
                sections={RECORD_PAGE_SECTIONS[recordType as keyof typeof RECORD_PAGE_SECTIONS]}
            ></RecordAnnotationSection>
        </>
    );
}
