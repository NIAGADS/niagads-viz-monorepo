import styles from "./styles/record.module.css";

const RecordAnnotationSectionHeader = ({
    title,
    description,
}: {
    title: string;
    description: string | React.ReactNode;
}) => {
    return (
        <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>{title}</div>
            <div className={styles.sectionDescription}>
                {typeof description === "string" ? <div>{description}</div> : description}
            </div>
        </div>
    );
};

export default RecordAnnotationSectionHeader;
