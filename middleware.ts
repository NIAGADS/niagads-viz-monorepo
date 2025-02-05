// middleware.ts

import { NextRequest, NextResponse } from "next/server";

export const config = {
    // matcher: ["/api/:path*", "/auth/:path*"],
    matcher: ["/api/:path*"],
};

// b/c the API URL changes from dev to production but can't use the it in next.config.ts rewrites, 
// have to use a middleware solution: https://stackoverflow.com/a/76568780
export function middleware(request: NextRequest) {
    return NextResponse.rewrite(
        new URL(
            `${process.env.NIAGADS_API_URL}${request.nextUrl.pathname}${request.nextUrl.search}`
        ),
        { request }
    );
}