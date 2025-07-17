import {
    AnchoredPageSection,
    APIResponse,
    APITableResponse,
    RecordType,
    SectionTableReport,
    TableAttributeReport,
    TableSection,
} from "@/lib/types";
import { getCache, setCache } from "@/lib/cache";

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

    async function loadTable(tableConfig: TableSection) {
        const namespace = `gene-record-table-${tableConfig.id}`;

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
    try {
        const response: APITableResponse = await loadTable();
        item["data"] = response;
        tables.push(item);
    } catch (error: any) {
        item["error"] = error.message;
        tables.push(item);
    }

    {
        item.error ? (
            <InlineError message={item.error} reload={false} />
        ) : item.data ? (
            item.data.pagination.total_num_records === 0 ? (
                <EmptyTableMessage></EmptyTableMessage>
            ) : (
                <Table id={item.id} columns={item.data.table.columns} data={item.data.table.data}></Table>
            )
        ) : (
            <InlineError message={"Oops! Something unexpected happened!"} reload={true} />
        );
    }

    return <RecordTableSectionClient section={tableDef} tables={tables}></RecordTableSectionClient>;
}
