import { APIPagination, _isEmpty } from "@niagads/common";
import { APITableResponse, ProcessedTableResponse, TableSection } from "@/lib/types";
import { Alert, LoadingSpinner } from "@niagads/ui";
import Table, { TableOptions } from "@niagads/table";
import { useEffect, useMemo, useState } from "react";
import { PaginationMessage } from "./PaginationMessage/PaginationMessage";

import useSWR from "swr";

export interface RecordTableProps {
    tableDef: TableSection;
    recordType: string;
    recordId: string;
    onTableLoad?: (pagination: APIPagination) => void;
}

const RecordTable = ({ tableDef, recordType, recordId, onTableLoad }: RecordTableProps) => {
    const { data, error, isLoading } = useSWR<ProcessedTableResponse>(
        `/api/table/${recordType}/${recordId}/${tableDef.endpoint}`,
        (url: string) => fetch(url).then((res) => res.json())
    );

    const options: TableOptions | undefined = useMemo(() => {
        if (data && !_isEmpty(data?.table)) {
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
        <Alert variant="error" message="Error loading table">
            <div>{JSON.stringify(error)}</div>
        </Alert>
    ) : _isEmpty(data?.table) ? (
        <Alert variant="info" message="This table contains no data" />
    ) : (
        <div>
            {(data?.pagination?.total_num_pages ?? 0) > 1 && (
                <PaginationMessage
                    pagination={(data as APITableResponse).pagination}
                    endpoint={`/record/${recordType}/${recordId}${tableDef.endpoint}`}
                />
            )}

            <Table
                id={tableDef.id}
                columns={data?.table.columns || []}
                data={data?.table.data || []}
                options={options}
            />
        </div>
    );
};

export default RecordTable;
