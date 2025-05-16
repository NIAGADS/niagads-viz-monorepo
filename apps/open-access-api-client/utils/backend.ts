import { NextRequest, NextResponse } from 'next/server'
import { backendFetchFromRequest, userAgentIsBrowser } from "@niagads/common"

import { headers } from 'next/headers'

export async function backendFetchResponseHandler(request: NextRequest, apiServiceUrl: string | undefined = process.env.API_SERVICE_URL) {
    const incomingRequestUrl = new URL(request.url)
    const queryParams = incomingRequestUrl.search
    const response = await backendFetchFromRequest(request, apiServiceUrl)
    if (queryParams.includes('view')) {
        const userAgent = (await headers()).get('User-Agent')
        const validUserAgent: boolean = userAgentIsBrowser(userAgent!)
        if (!validUserAgent) {
            // FIXME: raise an error instead
            return Response.json({
                error: 'Invalid parameter',
                msg: 'interactive data views can only be generated if request is made in a web-browser; set `format=JSON`'
            })
        }

        return Response.json({
            error: 'Not Yet Implemented',
            msg: 'interactive data views are currently being updated.  Please check back soon.'
        })
        /*
        // extract view type from query params and build the redirect URL
        // below is the old code
        const redirectEndpoint = `${response['redirect']}/${response['queryId']}`
        const redirectUrl = new URL(redirectEndpoint, redirectRequestUrl)

        return NextResponse.redirect(redirectUrl)
        */
    }
    else {
        return Response.json(response)
    }
} 