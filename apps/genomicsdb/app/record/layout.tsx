export default async function RecordPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="page-container page-container-capped">
            <div className="content">
                <div className="content-section">{children}</div>
            </div>
        </div>
    );
}
