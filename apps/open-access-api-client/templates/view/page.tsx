// TEMPLATE /viewredirect endpoint

import { jsonSyntaxHighlight } from "@/common/utils";
import { Alert } from "@/components/UI/Alert";
import { getJsonValueFromCache } from "@/utils/cache";

type props = { params: any };
export default async function Page({ params }: props) {
    const { queryId } = await params;
    const response = await getJsonValueFromCache(queryId, "VIEW");
    const originatingRequest = await getJsonValueFromCache(`${queryId}_request`, "VIEW");

    const page = originatingRequest?.pagination?.page;
    const totalNpages = originatingRequest?.pagination?.total_num_pages;
    const showPaginationWarning = page !== null && totalNpages > 1;
    return (
        <main>
            {showPaginationWarning && (
                <Alert variant="danger" message="Server-side pagination of full result set not yet implemented.">
                    <div>
                        <p>
                            Displaying page <span className="underline font-medium">{page}</span> out of{" "}
                            <span className="font-medium underline">{totalNpages}</span>.
                        </p>
                        <p>
                            To explore additional pages of the response data, update the value for{" "}
                            <span className="font-bold underline">page</span> in your original request (below table) and
                            resubmit to the API. We apologize for the inconvenience.
                        </p>
                    </div>
                </Alert>
            )}
            {response ? (
                <Alert variant="danger" message="View not yet implemented"></Alert>
            ) : (
                <Alert variant="warning" message="Original response not found">
                    <div>
                        <p>Cached query responses expire after one hour.</p>
                        <p>To regenerate this view, please re-run your original API request.</p>
                    </div>
                </Alert>
            )}
            {originatingRequest && (
                <Alert variant="default" message="Originating request  ">
                    <pre
                        className="json"
                        dangerouslySetInnerHTML={{
                            __html: jsonSyntaxHighlight(JSON.stringify(originatingRequest, undefined, 4)),
                        }}
                    ></pre>
                </Alert>
            )}
        </main>
    );
}

//
