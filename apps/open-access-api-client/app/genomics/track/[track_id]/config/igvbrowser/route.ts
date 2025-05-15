// TEMPLATE route
import { NextRequest } from 'next/server'
import { get_with_redirect } from "@/utils/requestHandlers"

export async function GET(request: NextRequest) {
    return get_with_redirect(request);
} 

