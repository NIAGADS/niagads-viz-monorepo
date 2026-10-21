import DownloadJson from "./DownloadJson";
import styles from "./ask.module.css";

export default function RetrievedData({ value, filename }: { value: unknown; filename: string }) {
    return (
        <div className={styles.retrievedData}>
            <div className={styles.actions}>
                <span>Retrieved data and provenance</span>
                <DownloadJson value={value} filename={filename} />
            </div>
            <p>
                Contains the retrieved records and reported page information, not necessarily the complete result set.
            </p>
            <details>
                <summary>Full retrieved records and provenance</summary>
                <pre className={styles.raw}>{JSON.stringify(value, null, 2)}</pre>
            </details>
        </div>
    );
}
