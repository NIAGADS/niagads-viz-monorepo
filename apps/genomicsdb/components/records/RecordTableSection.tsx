import {
    APIResponse,
    APITableResponse,
    AnchoredPageSection,
    RecordType,
    SectionTableReport,
    TableAttributeReport,
    TableSection,
} from "@/lib/types";
import TabbedTableGroup, { TableTab } from "../TabbedTableGroup";
// import TabbedTableGroup, { TableTab } from "../TabbedTableGroup";
import { getCache, setCache } from "@/lib/cache";

import RecordSectionHeader from "./RecordSectionHeader";
import { _fetch } from "@/lib/route-handlers";
import { is_error_response } from "@/lib/utils";

export interface RecordTableSectionProps {
    recordId: string;
    recordType: RecordType;
    section: AnchoredPageSection;
}

export default async function RecordTableSection({ recordId, recordType, section }: RecordTableSectionProps) {
    async function fetchTable(tableDef: TableSection, asTable: boolean = true) {
        // we are going to fetch twice, once for the raw data for caching and once for the view
        // the second fetch will be quick b/c the API will have already cached the raw
        const endpoint = `/api/record/${recordType}/${recordId}/${tableDef.endpoint}${asTable ? "&view=table" : ""}`;

        const response = (await _fetch(endpoint)) as APIResponse;

        if (is_error_response(response)) {
            throw new Error(JSON.stringify(response));
        }
        return response;
    }

    async function addTableDataToRecordCache() {
        // want to cache the raw-formatted data
        // but grouped as a section

        const namespace = `gene-record-section-${section.id}`;
        let cachedSection: SectionTableReport | null =
            ((await getCache(namespace, recordId)) as unknown as SectionTableReport) || null;

        if (!cachedSection && section.tables) {
            let tableReports: TableAttributeReport[] = await Promise.all(
                section.tables.map(async (table: TableSection) => {
                    try {
                        const dataResponse: APIResponse = await fetchTable(table, false);
                        return {
                            id: table.id,
                            title: `${section.label}: ${table.label}`,
                            is_truncated: dataResponse.pagination.total_num_pages > 1,
                            data: dataResponse.data,
                        };
                    } catch (error: any) {
                        return {
                            id: table.id,
                            title: `${table.label}: ${table.label}`,
                            is_truncated: false,
                            data: `ERROR retrieving table data; please report to our issue tracker: ${process.env.NEXT_PUBLIC_ISSUE_TRACKER}`,
                        };
                    }
                })
            );

            await setCache(namespace, recordId, { [section.id]: tableReports });
        }
    }

    async function loadTable(tableDef: TableSection) {
        const namespace = `gene-record-table-${tableDef.id}`;

        let table: APITableResponse | null =
            ((await getCache(namespace, recordId)) as unknown as APITableResponse) || null;
        if (!table) {
            try {
                table = (await fetchTable(tableDef, true)) as unknown as APITableResponse;
                await setCache(namespace, recordId, table);
            } catch (error: any) {
                return error.message;
            }
        }

        return table;
    }

    if (section.tables === null) {
        return null;
    }

    await addTableDataToRecordCache();

    const tabs = section.tables
        ? await Promise.all(
              section.tables.map(async (table) => {
                  // Fetch your data for this table (from Redis, DB, etc)
                  const response = await loadTable(table);
                  const isError = typeof response === "string";

                  return {
                      config: table,
                      data: isError ? null : response,
                      error: isError ? (response as string) : null,
                  };
              })
          )
        : null;

    return (
        <div id={section.id}>
            <RecordSectionHeader title={section.label} description={section.description}></RecordSectionHeader>
            <TabbedTableGroup tables={tabs as TableTab[]} />
        </div>
    );
}
