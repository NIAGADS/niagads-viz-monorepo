import {
    APIResponse,
    APITableResponse,
    AnchoredPageSection,
    RecordReport,
    RecordType,
    TableAttributeReport,
    TableSection,
} from "@/lib/types";
import { getCache, setCache } from "@/lib/cache";

import { RecordTableSectionClient } from "./RecordTableSectionClient";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";

interface RecordTableSectionProps {
    record_id: string;
    record_type: RecordType;
    config: AnchoredPageSection;
}

export default async function RecordTableSection({ record_id, record_type, config }: RecordTableSectionProps) {
    async function fetchTable(tableConfig: TableSection, asTable: boolean = true) {
        // we are going to fetch twice, once for the raw data for caching and once for the view
        // the second fetch will be quick b/c the API will have already cached the raw
        const endpoint = `/api/record/${record_type}/${record_id}/${tableConfig.endpoint}${asTable ? "&view=table" : ""}`;

        const response = (await _fetch(endpoint)) as APIResponse;

        if (is_error_response(response)) {
            throw new Error(JSON.stringify(response));
        }
        return response;
    }

    async function addToRecordCache(tableConfig: TableSection) {
        let tableReport: TableAttributeReport | null = null;
        let report: RecordReport = ((await getCache("gene-record", "id")) as unknown as RecordReport) || {};

        if (report.length == 0) {
            if (!report.hasOwnProperty("tables")) {
                report.tables = [];
            } else {
                // if tables is null
                if (!Array.isArray(report.tables)) {
                    report.tables = [];
                }
            }

            try {
                const dataResponse: APIResponse = await fetchTable(tableConfig, false);
                tableReport = {
                    id: config.id,
                    title: config.label,
                    description: typeof config.description === "string" ? config.description : null,
                    is_truncated: dataResponse.pagination.total_num_pages > 1,
                    data: dataResponse.data,
                };
            } catch (error: any) {
                throw error;
            }

            // won't be null at this point so can cast
            report.tables.push(tableReport as TableAttributeReport);
            await setCache("gene-record", "id", report);
        }
    }

    async function loadTable(tableConfig: TableSection) {
        const namespace = `gene-record-table-${tableConfig.id}`;

        let table: APITableResponse | null = ((await getCache(namespace, "id")) as unknown as APITableResponse) || null;
        if (!table) {
            try {
                table = (await fetchTable(tableConfig, true)) as unknown as APITableResponse;
            } catch (error: any) {
                throw error;
            }

            await setCache(namespace, "id", table);
        }

        return table;
    }

    async function fetchAllTables() {}

    if (config.tables === null) {
        return null;
    }

    let tables: TableSection[] = [];

    for (const item of config.tables as TableSection[]) {
        try {
            await addToRecordCache(item);
            const response: APITableResponse = await loadTable(item);
            item["data"] = response;
            tables.push(item);
        } catch (error: any) {
            item["error"] = error.message;
            tables.push(item);
        }
    }

    return (
        <RecordTableSectionClient
            record_id={record_id}
            record_type={record_type}
            section_id={config.id}
            tables={tables}
        ></RecordTableSectionClient>
    );
}
