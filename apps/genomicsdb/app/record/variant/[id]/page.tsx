import { PageProps, RecordType, VariantRecord } from "@/lib/types";
import { _fetch, fetchRecord } from "@/lib/route-handlers";

import { RECORD_PAGE_SECTIONS } from "../../sections";
import { RecordAnnotationSection } from "@/components/records/RecordAnnotationSection";
import { RecordOverview } from "@/components/records/RecordOverview";
import { VariantRecordOverview } from "@/components/records/variant/VariantRecordOverview";
import { getRecordTypeFromPath } from "@/lib/utils";
import { headers as get_headers } from "next/headers";
import { RecordSectionUnderConstructionAlert } from "@/components/records/RecordSectionUnderConstructionAlert";

export default async function VariantReport({ params }: PageProps) {
    const { id } = await params;
    const headers = await get_headers();
    const path: string = headers.get("x-current-pathname")!;
    const recordType: RecordType = getRecordTypeFromPath(path)!;

    let record: VariantRecord = (await fetchRecord(path, false)) as VariantRecord;
    Object.assign(record, { record_type: recordType });

    let sections = RECORD_PAGE_SECTIONS[recordType as keyof typeof RECORD_PAGE_SECTIONS];

    return (
        <>
            <RecordOverview>
                <VariantRecordOverview record={record}></VariantRecordOverview>
            </RecordOverview>

            {record.is_structural_variant !== true ? (
                <RecordAnnotationSection
                    recordId={record.id}
                    recordType={recordType}
                    sections={sections}
                ></RecordAnnotationSection>
            ) : (
                <RecordSectionUnderConstructionAlert section="Structural Variant Annotations"></RecordSectionUnderConstructionAlert>
            )}
        </>
    );
}
