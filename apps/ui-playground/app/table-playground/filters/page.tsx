"use client";

import Table from "@niagads/table";
import { TABLE_DEFINITION as table } from "../../../../storybook/examples/tables/table_large_numeric_values";

const TablePlayground = () => {
    return (
        <div style={{ padding: "1rem" }}>
            <Table id="test-table" columns={table.columns} data={table.data} options={table.options} />
        </div>
    );
};

export default TablePlayground;
