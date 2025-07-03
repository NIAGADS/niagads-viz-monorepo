export function ErrorPage({ status, detail }: { status: number; detail: string }) {
    let title = "Something went wrong";
    let message = detail;

    if (status === 404) {
        title = "Record Not Found";
        message = detail || "We couldn't find what you were looking for.";
    } else if (status === 429) {
        title = "Rate Limit Exceeded";
        message = "Too many requests. Please slow down and try again later.";
    } else if (status === 503) {
        title = "Service Unavailable";
        message = "The service is temporarily unavailable. Please try again later.";
    }

    return (
        <div className="error-page">
            <h1>{title}</h1>
            <p className="text-error">{message}</p>
        </div>
    );
}
