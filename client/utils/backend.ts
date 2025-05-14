import { NextRequest } from 'next/server'

export async function backendFetch(request: NextRequest) {
    const incomingRequestUrl = new URL(request.url)
    const path = incomingRequestUrl.pathname
    const queryParams = incomingRequestUrl.search
    const requestUri:string = process.env.API_SERVICE_URL! + path + queryParams
    const response = await(fetch(requestUri))
    const data = await response.json()
    return data
}

export async function backendFetchFromPath(path: string, relative:boolean=false) {
    const requestUri:string = process.env.API_SERVER_URL! + path
    const response = await(fetch(requestUri))
    const data = await response.json()
    return data
}

export async function backendFetchText(request: NextRequest) {
    const incomingRequestUrl = new URL(request.url)
    const path = incomingRequestUrl.pathname
    const queryParams = incomingRequestUrl.search
    const requestUri:string = process.env.API_SERVICE_URL! + path + queryParams
    const response = await(fetch(requestUri))
    const data = await response.text()
    return data
}
