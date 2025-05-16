import { NextRequest, NextResponse } from "next/server";
import { backendFetchFromRequest, userAgentIsBrowser } from "@niagads/common";

export async function backendFetchResponseHandler(
    request: NextRequest,
    asText: boolean = false,
    headers: any | undefined = null
) {
    const incomingRequestUrl = new URL(request.url);
    const queryParams = incomingRequestUrl.search;
    const response = await backendFetchFromRequest(request, process.env.API_SERVICE_URL, asText);

    if (queryParams.includes("view") && !asText) {
        /*
        // FIXME: does this matter anymore? just return the JSON for the view
        const userAgent = (await headers()).get("User-Agent");
        const validUserAgent: boolean = userAgentIsBrowser(userAgent!);
        if (!validUserAgent) {
            return NextResponse.json(
                {
                    error: "Invalid parameter",
                    msg: "interactive data views can only be generated if request is made in a web-browser; set `view=DEFAULT` and resubmit query",
                },
                { status: 422 }
            );
        } */

        return Response.json(
            {
                error: "Not Yet Implemented",
                msg: "interactive data views are currently being updated.  Please check back soon.",
            },
            { status: 501 }
        );
        /*
        // extract view type from query params and build the redirect URL
        // below is the old code
        const redirectEndpoint = `${response['redirect']}/${response['queryId']}`
        const redirectUrl = new URL(redirectEndpoint, redirectRequestUrl)

        return NextResponse.redirect(redirectUrl)
        */
    } else {
        if (asText) {
            return new NextResponse(response, {
                status: 200,
                headers: headers
                    ? headers
                    : {
                          "Content-Type": "text/plain",
                      },
            });
        }

        return new NextResponse(response, { status: 200 });
    }
}
