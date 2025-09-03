import styles from "@/components/records/styles/record.module.css";

export default async function RecordPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${styles.pageContainer} ${styles.pageContainerCapped}`}>
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.contentSection}>{children}</div>
                </div>
            </div>
        </div>
    );
}
