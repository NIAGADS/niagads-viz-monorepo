import { APITableResponse, TableSection } from "@/lib/types";

import { Card, CardBody, CardHeader, LoadingSpinner } from "@niagads/ui";
import PaginationMessage from "../PaginationMessage";
import TableWrapper from "../TableWrapper";
import { useEffect } from "react";
import useSWR from "swr";
import { APIPagination, _isEmpty } from "@niagads/common";
import { FileWarning } from "lucide-react";

export interface RecordTableProps {
    tableDef: TableSection;
    recordType: string;
    recordId: string;
    onTableLoad?: (pagination: APIPagination) => void;
}

const RecordTable = ({ tableDef, recordType, recordId, onTableLoad }: RecordTableProps) => {
    const { data, error, isLoading } = useSWR<APITableResponse>(
        `/api/table/${recordType}/${recordId}/${tableDef.endpoint}`,
        (url: string) => fetch(url).then((res) => res.json())
    );

    // Call onTableLoad when data is loaded and valid to return the result size
    // to the parent
    useEffect(() => {
        if (onTableLoad && data && !isLoading) {
            onTableLoad(data.pagination);
        }
    }, [isLoading, data]);

    if (isLoading) return <LoadingSpinner />;

    if (error) return <div>{JSON.stringify(error)}</div>;

    return _isEmpty(data?.table) ? (
        <Card variant="full">
            <CardHeader>
                <FileWarning />
            </CardHeader>
            <CardBody>This table contains no rows.</CardBody>
        </Card>
    ) : (
        <div>
            {(data as APITableResponse).pagination.total_num_pages > 1 && (
                <PaginationMessage
                    pagination={(data as APITableResponse).pagination}
                    endpoint={`/record/${recordType}/${recordId}${tableDef.endpoint}`}
                />
            )}
            <TableWrapper
                id={tableDef.id}
                columns={(data as APITableResponse).table.columns}
                data={(data as APITableResponse).table.data}
            />
        </div>
    );
};

export default RecordTable;
