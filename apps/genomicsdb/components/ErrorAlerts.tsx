import { Alert } from "@niagads/ui";

export const NoData = ({}) => <Alert variant="info" message="No data available." style={{ maxWidth: "25%" }}></Alert>;

// TODO handle message which may be stringified JSON
// until then not displaying message
export function InlineError({ message, reload = false }: { message: string; reload: boolean }) {
    const renderTrackerMessage = () => (
        <>
            <p>
                Please help us out by submitting a <strong>bug</strong> issue referencing this page request to:{" "}
            </p>
            <p>
                <a href={process.env.NEXT_PUBLIC_ISSUE_TRACKER} target="_blank">
                    {process.env.NEXT_PUBLIC_ISSUE_TRACKER}
                </a>
            </p>
        </>
    );

    return (
        <Alert variant="error" message="Unable to fetch annotation.">
            <div>
                {reload ? (
                    <p>
                        Oops! An unexpected error occurred. <strong>Please try reloading the page.</strong>
                    </p>
                ) : (
                    renderTrackerMessage()
                )}
            </div>
        </Alert>
    );
}
