"use client";

import Table from "@niagads/table";
import { TABLE_DEFINITION } from "./tables/association-test-table";

const TablePlayground = () => {
    return (
        <div>
            <Table 
                id="test-table"
                columns={TABLE_DEFINITION.columns}
                data={TABLE_DEFINITION.data}
            />
        </div>
    );
};

export default TablePlayground;
