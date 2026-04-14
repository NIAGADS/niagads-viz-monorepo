import { APIPagination, _isEmpty } from "@niagads/common";
import { APITableResponse, ProcessedTableResponse, TableSection, TableType } from "@/lib/types";
import { Alert, Card, LoadingSpinner } from "@niagads/ui";
import { ThresholdSelectHistogram as Histogram, PieChart, PieChartDataRow } from "@niagads/charts";
import Table, { TableConfig } from "@niagads/table";
import { useEffect, useMemo, useState } from "react";

import PaginationMessage from "../PaginationMessage";
import useSWR from "swr";
import { getTable } from "@/app/actions/TableActions";

export interface RecordTableProps {
    tableType: TableType;
    tableDef: TableSection;
    recordType: string;
    recordId: string;
    onTableLoad?: (pagination: APIPagination) => void;
}

const RecordTable = ({tableDef, recordType, recordId, onTableLoad }: RecordTableProps) => {
    const [externalFilters, setExternalFilters] = useState<any[]>([]);

    const { data, error, isLoading } = useSWR<ProcessedTableResponse>(
        `test`,
        async () => await getTable(tableDef.tableType, recordType, recordId, tableDef.endpoint)
    );

    const options: TableConfig | undefined = useMemo(() => {
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
            {data?.pagination.total_num_pages ||
                (0 > 1 && (
                    <PaginationMessage
                        pagination={(data as APITableResponse).pagination}
                        endpoint={`/record/${recordType}/${recordId}${tableDef.endpoint}`}
                    />
                ))}
            {tableDef.tableType === "associations" && (
                <AssociationsTableFilters
                    pValues={data?.extraData.negLog10PValues}
                    populationData={data?.extraData.populationData}
                    onExternalFilterChange={(colName, value) =>
                        setExternalFilters((prev) => {
                            const i = prev.findIndex((x) => x.id === colName);

                            if (i >= 0) {
                                const copy = [...prev];
                                copy[i].value = value;
                                return copy;
                            }

                            return [...prev, { id: colName, value: value }];
                        })
                    }
                />
            )}
            <Table
                id={tableDef.id}
                columns={data?.table.columns || []}
                data={data?.table.data || []}
                options={options}
                externalColumnFilters={externalFilters}
            />
        </div>
    );
};

export default RecordTable;

interface AssociationsTableFiltersProps {
    onExternalFilterChange: (colName: string, value: any) => void;
    pValues: number[];
    populationData: PieChartDataRow[];
}

const AssociationsTableFilters = ({
    onExternalFilterChange,
    pValues,
    populationData,
}: AssociationsTableFiltersProps) => {
    return (
        <Card variant="full">
            <div style={{ display: "flex", height: "100%", minHeight: "200px" }}>
                <Histogram
                    data={pValues}
                    numBins={50}
                    max={50}
                    label="-log10 pvalue"
                    limit={7}
                    limitType="max"
                    onRangeSelect={(range) =>
                        onExternalFilterChange("neg_log10_pvalue", range ? [range.min, range.max] : [0, 7])
                    }
                />
                {/* <PieChart id={"popPie"} data={populationData} onClick={(key) => onExternalFilterChange("population", key)} /> */}
            </div>
            <div>
                <PieChart
                    id={"traitPie"}
                    data={populationData}
                    onClick={(key) => onExternalFilterChange("trait_category", key)}
                />
            </div>
        </Card>
    );
};
