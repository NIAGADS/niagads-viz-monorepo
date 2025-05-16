// TEMPLATE route
import { backendFetchResponseHandler } from "@/utils/routeHandlers";

export async function GET(request: NextRequest) {
    return backendFetchResponseHandler(request);
}
