import { Alert } from "@niagads/ui";

export const RecordSectionUnderConstructionAlert = ({ section }: { section: string }) => (
    <Alert
        variant="construction"
        message={`The ${section} section is under construction`}
        style={{ marginBottom: "2rem" }}
    >
        <p>This feature is still under development. Please check back soon.</p>
    </Alert>
);
