import { PageProps, RecordType, RegionRecord } from "@/lib/types";
import { _fetch, fetchRecord } from "@/lib/route-handlers";

import { RECORD_PAGE_SECTIONS } from "../../sections";
import { RecordAnnotationSection } from "@/components/records/RecordAnnotationSection";
import { RecordOverview } from "@/components/records/RecordOverview";
import { RegionRecordOverview } from "@/components/records/region/RegionRecordOverview";
import { getRecordTypeFromPath } from "@/lib/utils";
import { headers as get_headers } from "next/headers";

export default async function RegionReport({ params }: PageProps) {
    const { id } = await params;
    const headers = await get_headers();
    const path: string = headers.get("x-current-pathname")!;
    const recordType: RecordType = getRecordTypeFromPath(path)!;
    let record: RegionRecord = (await fetchRecord(path, true)) as RegionRecord;
    Object.assign(record, { record_type: recordType });

    return (
        <>
            <RecordOverview>
                <RegionRecordOverview record={record}></RegionRecordOverview>
            </RecordOverview>

            <RecordAnnotationSection
                recordId={record.id}
                recordType={recordType}
                sections={RECORD_PAGE_SECTIONS[recordType as keyof typeof RECORD_PAGE_SECTIONS]}
            ></RecordAnnotationSection>
        </>
    );
}
