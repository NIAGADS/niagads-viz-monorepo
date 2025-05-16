import { NextRequest } from 'next/server'
import path from 'path'

export async function backendFetch(apiServiceUrl: string, request: NextRequest) {
    const incomingRequestUrl = new URL(request.url)
    const path = incomingRequestUrl.pathname
    const queryParams = incomingRequestUrl.search
    const requestUri:string = apiServiceUrl! + path + queryParams
    const response = await(fetch(requestUri))
    const data = await response.json()
    return data
}

export async function backendFetchFromPath(apiServiceUrl: string, path: string, relative:boolean=false) {
    const requestUri:string = apiServiceUrl + path
    const response = await(fetch(requestUri))
    const data = await response.json()
    return data
}

export async function backendFetchText(apiServiceUrl: string, request: NextRequest) {
    const incomingRequestUrl = new URL(request.url)
    const path = incomingRequestUrl.pathname
    const queryParams = incomingRequestUrl.search
    const requestUri:string = apiServiceUrl + path + queryParams
    const response = await(fetch(requestUri))
    const data = await response.text()
    return data
}
