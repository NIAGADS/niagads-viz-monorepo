import { APITableResponse, TableSection } from "@/lib/types";
import { prefixClientRoute } from "@/lib/utils";

import { LoadingSpinner } from "@niagads/ui";
import PaginationMessage from "../PaginationMessage";
import TableWrapper from "../TableWrapper";
import { useEffect } from "react";
import useSWR from "swr";
import { APIPagination } from "@niagads/common";

export interface RecordTableProps {
    tableDef: TableSection;
    recordType: string;
    recordId: string;
    onTableLoad?: (pagination: APIPagination) => void;
}

const buildTableEndpoint = (endpoint: string) => {
    const view = endpoint.includes("?") ? "&view=table" : "?view=table";
    return `/api-proxy/record/${endpoint}${view}`;
};

const RecordTable = ({ tableDef, recordType, recordId, onTableLoad }: RecordTableProps) => {
    const { data, error, isLoading } = useSWR(
        buildTableEndpoint(`${recordType}/${recordId}/${tableDef.endpoint}`),
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

    if ((data as APITableResponse).pagination.total_num_pages > 1)
        return (
            <>
                <PaginationMessage
                    pagination={(data as APITableResponse).pagination}
                    endpoint={`/record/${recordType}/${recordId}${tableDef.endpoint}`}
                />
                <TableWrapper
                    id={tableDef.id}
                    columns={(data as APITableResponse).table.columns}
                    data={(data as APITableResponse).table.data}
                />
            </>
        );

    return (
        <TableWrapper
            id={tableDef.id}
            columns={(data as APITableResponse).table.columns}
            data={(data as APITableResponse).table.data}
        />
    );
};

export default RecordTable;
