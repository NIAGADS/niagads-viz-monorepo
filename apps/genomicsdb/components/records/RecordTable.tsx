import { APITableResponse, CacheIdentifier, Pagination, TableSection } from "@/lib/types";
import { Alert, LoadingSpinner } from "@niagads/ui";
import { InlineError, NoData } from "../ErrorAlerts";

import PaginationMessage from "../PaginationMessage";
import Table from "@niagads/table";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";
import useSWR from "swr";

export interface RecordTableProps extends CacheIdentifier {
    tableDef: TableSection;
    onTableLoad?: (pagination: Pagination) => void;
}

export default function RecordTable({ tableDef, onTableLoad, ...cacheInfo }: RecordTableProps) {
    const { data, error, isLoading } = useSWR(
        `/record/${cacheInfo.recordType}/${cacheInfo.recordId}/annotation/${tableDef.endpoint}`,
        (url: string) => fetch(url).then((res) => res.json())
    );

    if (isLoading) return <LoadingSpinner />;

    if (error) return <InlineError message="Oops! An unexpected error occurred." reload={true} />;

    if (is_error_response(data)) {
        return <InlineError message={data.detail} reload={false} />;
    }

    // Call onTableLoad when data is loaded and valid to return the result size
    // to the parent
    if (onTableLoad && data) {
        onTableLoad((data as APITableResponse).pagination);
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
                <Table
                    id={tableDef.id}
                    columns={(data as APITableResponse).table.columns}
                    data={(data as APITableResponse).table.data}
                />
            </>
        );

    return (
        <Table
            id={tableDef.id}
            columns={(data as APITableResponse).table.columns}
            data={(data as APITableResponse).table.data}
        />
    );
}

//<Table config={tableDef} table={response.table} />
