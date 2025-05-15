
export function requestFromBrowser(userAgent: string):boolean {
    // checks if the user-agent for the request was a web browser
    const browsers = ['Mozilla', 'Safari', 'Edge', 'Chrome']
    return userAgent !== null && browsers.some(value => userAgent.includes(value))
}