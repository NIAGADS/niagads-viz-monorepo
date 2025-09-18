"use server";

import { APIPagination } from "@niagads/common";
import { RecordType, TableSection } from "@/lib/types";

import { _fetch, fetchTable } from "@/lib/route-handlers";
import { ReactNode } from "react";
import TableWrapper from "../TableWrapper";

export interface RecordTableProps {
    recordType: RecordType;
    recordId: string;
    tableDef: TableSection;
    onTableLoad?: (pagination: APIPagination) => void;
    children?: ReactNode;
}

const RecordTable = async ({ tableDef, recordType, recordId }: RecordTableProps) => {
    const data = await fetchTable(`/record/${recordType}/${recordId}/${tableDef.endpoint}`);
    return <TableWrapper id={data.table.id} data={data.table.data} columns={data.table.columns} />;
};

export default RecordTable;
