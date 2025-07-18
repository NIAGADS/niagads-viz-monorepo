const RecordSectionHeader = ({ title, description }: { title: string; description: string | React.ReactNode }) => {
    console.log("enter header");
    return (
        <div className="record-section-header">
            <div className="record-section-title">{title}</div>
            <div className="record-section-description">
                {typeof description === "string" ? <div className="">{description}</div> : description}
            </div>
        </div>
    );
};

export default RecordSectionHeader;
