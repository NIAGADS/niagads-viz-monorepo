import { NextRequest, NextResponse } from "next/server";
import { backendFetchFromRequest, caseInsensitiveIncludes } from "@niagads/common";

const TEXT_RESPONSES: string[] = ['TEXT', 'VCF', 'BED'];

export async function backendFetchResponseHandler(
    request: NextRequest,
    headers: any | undefined = null
) {

    let asText = false; // default to expect JSON response
    const incomingRequestUrl = new URL(request.url);

    const queryParams = Object.fromEntries(incomingRequestUrl.searchParams.entries());
    if (queryParams.hasOwnProperty('format')) {
        if (caseInsensitiveIncludes(TEXT_RESPONSES, queryParams['format'])) {
            asText = true;
        }
    }

    // handle yaml files
    if (incomingRequestUrl.pathname.endsWith('yaml')) {
        headers = {
            "Content-Type": "text/yaml",
        }
        asText = true;
    }

    const response = await backendFetchFromRequest(request, process.env.API_INTERNAL_URL, asText);

    if (queryParams.hasOwnProperty('view')) {
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

        return NextResponse.json(response, { status: 200 });
    }
}
