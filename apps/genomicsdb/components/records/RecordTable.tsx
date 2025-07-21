import { APITableResponse, CacheIdentifier, Pagination, TableSection } from "@/lib/types";
import { InlineError, NoData } from "../ErrorAlerts";

import { LoadingSpinner } from "@niagads/ui";
import PaginationMessage from "../PaginationMessage";
import Table from "@niagads/table";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";
import { useEffect } from "react";
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

    // Call onTableLoad when data is loaded and valid to return the result size
    // to the parent
    useEffect(() => {
        if (onTableLoad && data && !isLoading) {
            onTableLoad((data as APITableResponse).pagination);
        }
    }, [isLoading, data]);

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
