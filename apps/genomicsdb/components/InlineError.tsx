import { Alert } from "@niagads/ui";

// TODO handle message which may be stringified JSON
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
                        <strong>Please try reloading the page.</strong>
                    </p>
                ) : (
                    renderTrackerMessage()
                )}
            </div>
        </Alert>
    );
}
