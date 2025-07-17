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

import { RecordTableSectionClient } from "./RecordTableSectionClient";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";

export interface RecordTableSectionProps {
    recordId: string;
    recordType: RecordType;
    config: AnchoredPageSection;
}

export default async function RecordTableSection({ recordId, recordType, config }: RecordTableSectionProps) {
    async function fetchTable(tableConfig: TableSection, asTable: boolean = true) {
        // we are going to fetch twice, once for the raw data for caching and once for the view
        // the second fetch will be quick b/c the API will have already cached the raw
        const endpoint = `/api/record/${recordType}/${recordId}/${tableConfig.endpoint}${asTable ? "&view=table" : ""}`;

        const response = (await _fetch(endpoint)) as APIResponse;

        if (is_error_response(response)) {
            throw new Error(JSON.stringify(response));
        }
        return response;
    }

    async function addTableDataToRecordCache() {
        // want to cache the raw-formatted data
        // but grouped as a section
        const namespace = `gene-record-section-${config.id}`;
        let section: SectionTableReport | null =
            ((await getCache(namespace, recordId)) as unknown as SectionTableReport) || null;

        if (!section) {
            let tableReports: TableAttributeReport[] = [];
            for (const item of config.tables as TableSection[]) {
                try {
                    const dataResponse: APIResponse = await fetchTable(item, false);
                    tableReports.push({
                        id: item.id,
                        title: `${config.label}: ${item.label}`,
                        is_truncated: dataResponse.pagination.total_num_pages > 1,
                        data: dataResponse.data,
                    });
                } catch (error: any) {
                    tableReports.push({
                        id: item.id,
                        title: `${config.label}: ${item.label}`,
                        is_truncated: false,
                        data: `ERROR retrieving table data; please report to our issue tracker: ${process.env.NEXT_PUBLIC_ISSUE_TRACKER}`,
                    });
                }
            }

            await setCache(namespace, recordId, { [config.id]: tableReports });
        }
    }

    async function loadTable(tableConfig: TableSection) {
        const namespace = `gene-record-table-${tableConfig.id}`;

        let table: APITableResponse | null =
            ((await getCache(namespace, recordId)) as unknown as APITableResponse) || null;
        if (!table) {
            try {
                table = (await fetchTable(tableConfig, true)) as unknown as APITableResponse;
            } catch (error: any) {
                throw error;
            }

            await setCache(namespace, recordId, table);
        }

        return table;
    }

    if (config.tables === null) {
        return null;
    }

    await addTableDataToRecordCache();

    let tables: TableSection[] = [];
    let tableReports: TableAttributeReport[] = [];
    for (const item of config.tables as TableSection[]) {
        try {
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
            recordId={recordId}
            recordType={recordType}
            sectionId={config.id}
            tables={tables}
        ></RecordTableSectionClient>
    );
}
