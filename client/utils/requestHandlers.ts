// request handler

import { NextRequest, NextResponse } from 'next/server'
import { backendFetch } from '@/utils/backend'
import { requestFromBrowser } from '@/validators/request'
import { headers } from 'next/headers'

export async function get_with_redirect(request: NextRequest) {
    const redirectRequestUrl = process.env.API_PUBLIC_URL
    const response = await backendFetch(request)
    if (response.hasOwnProperty('redirect')) {
        const userAgent = (await headers()).get('User-Agent')
        const validUserAgent: boolean = requestFromBrowser(userAgent!)
        if (!validUserAgent) {
            // FIXME: raise an error instead
            return Response.json({
                error: 'Invalid parameter',
                msg: 'interactive data views can only be generated if request is made in a web-browser; set `format=JSON`'
            })
        }
        const redirectEndpoint = `${response['redirect']}/${response['queryId']}`
        const redirectUrl = new URL(redirectEndpoint, redirectRequestUrl)

        return NextResponse.redirect(redirectUrl)
    }

    return Response.json(response)
} 