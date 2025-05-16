// TEMPLATE route
import { backendFetchResponseHandler } from "@/utils/backend"

export async function GET(request: NextRequest) {
    return backendFetchResponseHandler(request);
} 

