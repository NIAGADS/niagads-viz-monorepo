"use client";

import Table, { GenericColumn, TableConfig, TableProps } from "@niagads/table";

export default function TableWrapper({ id, data, columns }: TableProps) {
    const defaultColumns = columns.map((c, index) => {
        if (index < 8 || c["id"].startsWith("num_") || c["id"] === "url") return c["id"];
    }).filter(id => id !== undefined);

    const options: TableConfig = { disableColumnFilters: true, defaultColumns: defaultColumns };

    return (
        <Table id={id} data={data} columns={columns} options={options} />
    );
}
