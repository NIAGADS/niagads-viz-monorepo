import { GeneRecord, PageProps } from "@/lib/types";
import { _fetch, fetchRecord } from "@/lib/route-handlers";
import { getCache, setCache } from "@/lib/cache";

import { GeneRecordOverview } from "@/components/records/gene/GeneRecordOverview";
import { RECORD_PAGE_SECTIONS } from "../../sections";
import { RecordAnnotationSection } from "@/components/records/RecordAnnotationSection";
import { RecordOverview } from "@/components/records/RecordOverview";

export default async function GeneDetailPage({ params }: PageProps) {
    const { id } = await params;

    let record: GeneRecord = (await getCache("gene-record", id)) as unknown as GeneRecord;
    if (!record) {
        record = (await fetchRecord(`/api/record/gene/${id}`, true)) as GeneRecord;
        Object.assign(record, { record_type: "gene" });
        await setCache("gene-record", id, record); // cache on path ID, which might be an alias
    }

    const test = RECORD_PAGE_SECTIONS.gene[1];
    const tt = test.tables!;
    return (
        <>
            <RecordOverview>
                <GeneRecordOverview record={record}></GeneRecordOverview>
            </RecordOverview>

            <RecordAnnotationSection
                recordId={record.id}
                recordType={"gene"}
                sections={RECORD_PAGE_SECTIONS.gene}
            ></RecordAnnotationSection>
        </>
    );
}
