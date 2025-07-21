import { APITableResponse, CacheIdentifier, TableSection } from "@/lib/types";
import { Alert, LoadingSpinner } from "@niagads/ui";
import { InlineError, NoData } from "../ErrorAlerts";

import PaginationMessage from "../PaginationMessage";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";
import useSWR from "swr";

export interface RecordTableProps extends CacheIdentifier {
    tableDef: TableSection;
}

export default function RecordTable({ tableDef, ...cacheInfo }: RecordTableProps) {
    const { data, error, isLoading } = useSWR(
        `/record/${cacheInfo.recordType}/${cacheInfo.recordId}/annotation/${tableDef.endpoint}`,
        (url: string) => fetch(url).then((res) => res.json())
    );

    if (isLoading) return <LoadingSpinner />;

    if (error) return <InlineError message="Oops! An unexpected error occurred." reload={true} />;

    if (is_error_response(data)) {
        return <InlineError message={data.detail} reload={false} />;
    }

    if ((data as APITableResponse).pagination.total_num_records === 0) {
        return <NoData />;
    }

    if ((data as APITableResponse).pagination.total_num_pages > 1)
        return (
            <>
                <PaginationMessage
                    pagination={(data as APITableResponse).pagination}
                    endpoint={`/record/${cacheInfo.recordType}/${cacheInfo.recordId}${tableDef.endpoint}`}
                />
            </>
        );

    return <Alert message="hope this works" />;
}

//<Table config={tableDef} table={response.table} />
