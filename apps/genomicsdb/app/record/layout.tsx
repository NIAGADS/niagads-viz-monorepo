import "@/components/records/records-list.css";
import "@/components/records/record.css";

import { get_record_id_from_path, get_record_type_from_path } from "@/lib/utils";

import { RECORD_PAGE_SECTIONS } from "./sections";
import { RecordType } from "@/lib/types";
import Sidebar from "@/components/records/RecordSidebar";
import { headers as get_headers } from "next/headers";

export default async function RecordPageLayout({ children }: { children: React.ReactNode }) {
    const headers = await get_headers();
    const request: string = headers.get("x-current-pathname")!;
    const recordType: RecordType = get_record_type_from_path(request)!;
    const recordId = get_record_id_from_path(request);

    return (
        <div className="record-page-container capped">
            <Sidebar
                title={recordId!}
                recordType={recordType}
                items={RECORD_PAGE_SECTIONS[recordType as keyof typeof RECORD_PAGE_SECTIONS]}
            />
            <div className={`record-content`}>
                <div className="record-container">
                    <div className="record-content-section">{children}</div>
                </div>
            </div>
        </div>
    );
}
