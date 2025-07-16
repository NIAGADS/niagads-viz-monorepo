import { AnchoredPageSection, GeneRecord, PageProps, RecordReport } from "@/lib/types";
import { _fetch, fetchRecord } from "@/lib/route-handlers";
import { getCache, setCache } from "@/lib/cache";

import { GeneRecordOverview } from "@/components/records/gene/GeneRecordOverview";
import { RECORD_PAGE_SECTIONS } from "../../sections";
import { RecordOverviewSection } from "@/components/records/RecordOverviewSection";
import RecordTableSection from "@/components/records/RecordTableSection";

export default async function GeneDetailPage({ params, searchParams }: PageProps) {
    const { id } = await params;

    let report: RecordReport = (await getCache("gene-record", id)) as unknown as RecordReport;
    if (!report) {
        const record: GeneRecord = (await fetchRecord(`/api/record/gene/${id}`, true)) as GeneRecord;
        Object.assign(record, { record_type: "gene" });
        report = { id: record.id, record: record };
        await setCache("gene-record", id, report);
    }

    return (
        <>
            <RecordOverviewSection>
                <GeneRecordOverview record={report.record}></GeneRecordOverview>
            </RecordOverviewSection>
            {RECORD_PAGE_SECTIONS.gene.map((section: AnchoredPageSection) => {
                if (section.id !== "overview") {
                    return (
                        <RecordTableSection
                            record_id={report.id}
                            record_type="gene"
                            key={`table-section-${section.id}`}
                            config={section}
                        ></RecordTableSection>
                    );
                }
            })}
        </>
    );
}
