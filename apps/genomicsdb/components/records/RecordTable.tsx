import {
    APIResponse,
    APITableResponse,
    RecordType,
    SectionTableReport,
    TableAttributeReport,
    TableSection,
} from "@/lib/types";
import { getCache, setCache } from "@/lib/cache";

import { EmptyTableMessage } from "../Messages";
import { InlineError } from "../InlineError";
import Table from "@niagads/table";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";

export interface RecordTableProps {
    recordId: string;
    recordType: RecordType;
    sectionId: string;
    tableDef: TableSection;
}

export default async function RecordTable({ recordId, recordType, sectionId, tableDef }: RecordTableProps) {
    async function fetchTable(asTable: boolean = true) {
        // we are going to fetch twice, once for the raw data for caching and once for the view
        // the second fetch will be quick b/c the API will have already cached the raw
        const endpoint = `/api/record/${recordType}/${recordId}/${tableDef.endpoint}${asTable ? "&view=table" : ""}`;

        const response = (await _fetch(endpoint)) as APIResponse;

        if (is_error_response(response)) {
            throw new Error(JSON.stringify(response));
        }
        return response;
    }

    async function cacheTableData() {
        const namespace = `gene-record-${sectionId}-${tableDef.id}`;
        let section: SectionTableReport | null =
            ((await getCache(namespace, recordId)) as unknown as SectionTableReport) || null;

        if (!section) {
            let report: TableAttributeReport | null = null;

            try {
                const dataResponse: APIResponse = await fetchTable(false);
                report = {
                    id: tableDef.id,
                    title: `${tableDef.label}: ${tableDef.label}`,
                    is_truncated: dataResponse.pagination.total_num_pages > 1,
                    data: dataResponse.data,
                };
            } catch (error: any) {
                report = {
                    id: tableDef.id,
                    title: `${tableDef.label}: ${tableDef.label}`,
                    is_truncated: false,
                    data: `ERROR retrieving table data; please report to our issue tracker: ${process.env.NEXT_PUBLIC_ISSUE_TRACKER}`,
                };
            }

            await setCache(namespace, recordId, report);
        }
    }

    async function loadTable() {
        const namespace = `gene-record-table-${tableDef.id}`;

        let table: APITableResponse | null =
            ((await getCache(namespace, recordId)) as unknown as APITableResponse) || null;
        if (!table) {
            try {
                table = (await fetchTable(true)) as unknown as APITableResponse;
            } catch (error: any) {
                throw error;
            }

            await setCache(namespace, recordId, table);
        }

        return table;
    }

    await cacheTableData();

    let tables: TableSection[] = [];
    const TableComponent: any = null;
    try {
        const response: APITableResponse = await loadTable();
        if (response.pagination.total_num_records == 0) {
            return <EmptyTableMessage></EmptyTableMessage>;
        }
        return <Table id={tableDef.id} columns={response.table.columns} data={response.table.data}></Table>;
    } catch (error: any) {
        return <InlineError message={error.message} reload={false} />;
    }
}
