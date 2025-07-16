import { Alert } from "@niagads/ui";

// TODO handle message which may be stringified JSON
export function InlineError({ message }: { message: string }) {
    return (
        <Alert variant="danger" message="Unable to retrieve annotation.">
            <div>
                <p>
                    An unexpected error occurred. Please help us out by submitting a `bug` GitHub issue referencing the
                    page request to:{" "}
                </p>
                <p>
                    <a href={process.env.NEXT_PUBLIC_ISSUE_TRACKER} target="_blank">
                        {process.env.NEXT_PUBLIC_ISSUE_TRACKER}
                    </a>
                </p>
            </div>
        </Alert>
    );
}
