
import { APITableResponse, TableSection } from "@/lib/types";
import { Alert, Card, CardBody, CardHeader, LoadingSpinner } from "@niagads/ui";
import PaginationMessage from "../PaginationMessage";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { APIPagination, _isEmpty } from "@niagads/common";
import Table, { TableConfig } from "@niagads/table";
import { Histogram } from "@niagads/charts";

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

    const options: TableConfig | undefined = useMemo(() => {
        if (data) {
            const defaultColumns = data.table.columns.map((c: any, index) => {
                if (index < 8 || c["id"].startsWith("num_") || c["id"] === "url") return c["id"];
            });

            return {
                defaultColumns: defaultColumns,
            };
        }
    }, [data]);

    // Call onTableLoad when data is loaded and valid to return the result size
    // to the parent
    useEffect(() => {
        if (onTableLoad && data && !isLoading) {
            onTableLoad(data.pagination);
        }
    }, [isLoading, data]);

    return isLoading ? (
        <LoadingSpinner />
    ) : error ? (
        <Alert variant="error" message="Error fetching table data">
            <div>
                {JSON.stringify(error)}
            </div>
        </Alert>
    ) : _isEmpty(data?.table) ? (
        <Alert variant="info" message="This table contains no data" />
    ) : (
        <div>
            {(data as APITableResponse).pagination.total_num_pages > 1 && (
                <PaginationMessage
                    pagination={(data as APITableResponse).pagination}
                    endpoint={`/record/${recordType}/${recordId}${tableDef.endpoint}`}
                />
            )}
            <Card variant="full">
                <div></div>
            </Card>
            <Table
                id={tableDef.id}
                columns={(data as APITableResponse).table.columns}
                data={(data as APITableResponse).table.data}
                options={options}
                externalColumnFilters={}
            />
        </div>
    );
};

export default RecordTable;

interface AssociationsTableFiltersProps {

}

const AssociationsTableFilters = ({}: AssociationsTableFiltersProps) => {

    return (
    )
};
