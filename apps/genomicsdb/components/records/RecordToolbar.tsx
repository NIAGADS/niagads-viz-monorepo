import { Button } from "@niagads/ui";
import styles from "./styles/record-toolbar.module.css";

interface RecordToolbarProps {
    id: string;
    title: string;
    subtitle?: string;
}

const RecordToolbar = ({id, subtitle, title}: RecordToolbarProps) => {
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
                <Button>View in Genome Browser</Button>
                <Button>Export</Button>
                <Button>Share</Button>
            </div>
        </div>
    )

}

export default RecordToolbar;
