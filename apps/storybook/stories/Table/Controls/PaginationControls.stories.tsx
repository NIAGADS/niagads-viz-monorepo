import React, { useMemo, useState } from "react";

import { PaginationControls } from "@niagads/table";

export default {
    title: "Table/Controls/PaginationControls",
    component: PaginationControls,
};

// Mock table instance for Storybook
const data = Array.from({ length: 123 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` }));
const columns = [
    { id: "id", header: "ID", accessorKey: "id" },
    { id: "name", header: "Name", accessorKey: "name" },
];

// You need to provide a mock table instance compatible with @tanstack/react-table
// This is a minimal mock for Storybook demonstration
function useMockTable() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const totalRows = data.length;
    const pageCount = Math.ceil(totalRows / pageSize);
    const rows = useMemo(
        () => data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize),
        [pageIndex, pageSize]
    );

    return {
        getState: () => ({ pagination: { pageIndex, pageSize } }),
        getPrePaginationRowModel: () => ({ rows: data }),
        setPageSize: (size: number) => {
            setPageSize(size);
            setPageIndex(0);
        },
        previousPage: () => setPageIndex((i) => Math.max(i - 1, 0)),
        nextPage: () => setPageIndex((i) => Math.min(i + 1, pageCount - 1)),
        getCanPreviousPage: () => pageIndex > 0,
        getCanNextPage: () => pageIndex < pageCount - 1,
    };
}

export const Default = () => {
    const table = useMockTable();
    return <div>Coming soon</div>; /*<PaginationControls table={table} />*/
};
