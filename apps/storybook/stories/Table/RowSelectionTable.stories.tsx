import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useState, useEffect } from "react";

import Table from "@niagads/table";
import { TABLE_DEFINTION as table } from "../../examples/tables/table_filer";

const meta: Meta<typeof Table> = {
    title: "Table/RowSelection Table",
    component: Table,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "fullscreen",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

const ControlledSelection: Story = {
    render: () => {
        const [selectedRows, setSelectedRows] = useState<string[] | undefined>([]);

        const handleTrackSelectionChange = (state: any) => {
            setSelectedRows(Object.keys(state));
        };

        useEffect(() => {
            if ((selectedRows || []).length > 0) alert(JSON.stringify(selectedRows));
        }, [selectedRows]);

        return (
            <Table
                id={table.id}
                columns={table.columns}
                options={table.options}
                data={table.data}
                rowSelection={selectedRows}
                onRowSelectionChange={handleTrackSelectionChange}
            />
        );
    },
};

export const Default = ControlledSelection;
