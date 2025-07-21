import { getRecordIdFromPath, getRecordTypeFromPath } from "@/lib/utils";

import { RECORD_PAGE_SECTIONS } from "./sections";
import { RecordSidebar } from "@/components/records/RecordSidebar";
import { RecordType } from "@/lib/types";
import { headers as get_headers } from "next/headers";
import styles from "@/components/records/styles/record.module.css";

export default async function RecordPageLayout({ children }: { children: React.ReactNode }) {
    const headers = await get_headers();
    const request: string = headers.get("x-current-pathname")!;
    const recordType: RecordType = getRecordTypeFromPath(request)!;
    const recordId = getRecordIdFromPath(request);

    return (
        <div className={`${styles.pageContainer} ${styles.pageContainerCapped}`}>
            <RecordSidebar
                title={recordId!}
                recordType={recordType}
                items={RECORD_PAGE_SECTIONS[recordType as keyof typeof RECORD_PAGE_SECTIONS]}
            />
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.contentSection}>{children}</div>
                </div>
            </div>
        </div>
    );
}
