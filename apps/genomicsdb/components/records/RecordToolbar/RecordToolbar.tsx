import { Button } from "@niagads/ui";

import styles from "./record-toolbar.module.css";

interface RecordToolbarProps {
    id: string;
    title: string;
    subtitle?: string;
}

const RecordToolbar = ({ id, subtitle, title }: RecordToolbarProps) => {
    const handleViewInGenomeBrowser = () => {
        alert("This button will open this record in the genome browser!");
    };
    const handleExport = () => {
        alert("This button would handle exporting the current record!");
    };
    const handleShare = () => {
        alert("This button would handle sharing this record!");
    };

    return (
        <div className={styles["page-header"]}>
            <div className={styles["page-header-left"]}>
                <div className={styles["page-title"]}>{title}</div>
                <div className={styles["page-subtitle"]}>
                    <span>{id}</span>
                    {subtitle && <span> - {subtitle}</span>}
                </div>
            </div>
            <div className={styles["page-actions"]}>
                <Button onClick={() => handleViewInGenomeBrowser()}>View in Genome Browser</Button>
                <Button onClick={() => handleExport()}>Export</Button>
                <Button onClick={() => handleShare()}>Share</Button>
            </div>
        </div>
    );
};

export default RecordToolbar;
