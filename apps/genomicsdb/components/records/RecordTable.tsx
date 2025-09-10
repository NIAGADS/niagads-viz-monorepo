import { APIPagination, isAPIError } from "@niagads/common";
import { APITableResponse, RecordType, TableSection } from "@/lib/types";
import { InlineError, NoData } from "../ErrorAlerts";

import { LoadingSpinner } from "@niagads/ui";
import PaginationMessage from "../PaginationMessage";
import Table from "@niagads/table";
import TableWrapper from "../TableWrapper";
import { prefixClientRoute } from "@/lib/utils";
import { useEffect } from "react";
import useSWR from "swr";

export interface RecordTableProps {
    recordType: RecordType;
    recordId: string;
    tableDef: TableSection;
    onTableLoad?: (pagination: APIPagination) => void;
}

const RecordTable = ({ tableDef, recordType, recordId, onTableLoad }: RecordTableProps) => {
    const { data, error, isLoading } = useSWR(
        prefixClientRoute(`/record/${recordType}/${recordId}/annotation/${tableDef.endpoint}`),
        (url: string) => fetch(url).then((res) => res.json())
    );

    // Call onTableLoad when data is loaded and valid to return the result size
    // to the parent

    // FIXME: tie to table's onTableLoad so we don't have to have a useEffect here
    useEffect(() => {
        if (onTableLoad && data && !isLoading) {
            onTableLoad((data as APITableResponse).pagination);
        }
    }, [isLoading, data]);

    if (isLoading) return <LoadingSpinner />;

    if (error) return <InlineError message="Oops! An unexpected error occurred." reload={true} />;

    if (isAPIError(data)) {
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

//<Table config={tableDef} table={response.table} />
