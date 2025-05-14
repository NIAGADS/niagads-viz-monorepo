import { NextRequest, NextResponse } from 'next/server'
import { backendFetchText } from '@/utils/backend'

export async function GET(request: NextRequest) {
    const response = await backendFetchText(request)
    return new NextResponse(response, {
        status: 200,
        headers: {
            'Content-Type': 'text/yaml',
        },
    });
}