import { Button, Checkbox, RadioButton } from "@niagads/ui";
import { Cell, GenericCell, getCellValue, renderCell, resolveCell, validateCellType } from "./Cell";
import {
    ColumnDef,
    ColumnFiltersState,
    HeaderGroup,
    RowSelectionState,
    SortingFnOption,
    SortingState,
    TableOptions,
    VisibilityState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { GenericColumn, getColumn } from "./Column";
import { PaginationControls, TableToolbar } from "./ControlElements";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { TableConfig, TableData, TableRow } from "./TableProperties";
import { _get, _hasOwnProperty, toTitleCase } from "@niagads/common";

import { CustomSortingFunctions } from "./TableSortingFunctions";
import { RowSelectionControls } from "./ControlElements/RowSelectionControls";
import { TableColumnHeader } from "./TableColumnHeader";
import { Tooltip } from "@niagads/ui/client";
import { TrashIcon } from "@heroicons/react/24/outline";

const __resolveSortingFn = (col: GenericColumn) => {
    if (col.type === "boolean") {
        return "boolean";
    }
    if (col.type === "float") {
        return "scientific";
    }
    return "alphanumeric";
};

// wrapper to catch any errors thrown during cell type and properties validation so that
// user can more easily identify the problematic table cell by row/column
const __resolveCell = (userCell: GenericCell | GenericCell[], column: GenericColumn, rowId: number) => {
    try {
        return resolveCell(userCell, column, rowId);
    } catch (e: any) {
        throw Error(
            "Validation Error parsing field value for row " + rowId + " column `" + column.id + "`.\n" + e.message
        );
    }
};

// TODO: (maybe?) catch hidden to skip during rendering
// NOTE: according to documentation https://tanstack.com/table/latest/docs/guide/column-visibility#column-visibility-state
// the HeaderGroup API will take column visibility into account

// render the table header
const __renderTableHeader = (hGroups: HeaderGroup<TableRow>[], tableId: string) => (
    <thead>
        {hGroups.map((headerGroup: HeaderGroup<TableRow>) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return <TableColumnHeader key={header.id} header={header} tableId={tableId} />;
                })}
            </tr>
        ))}
    </thead>
);

// checks to see if a field contains a unique value for each row in the table
// allowing it to be used as a valid "primary key" or row_id for row selection
const __isValidRowId = (data: TableData, columnId: string) => {
    const values = data.map((row) => getCellValue(row[columnId as keyof typeof row] as Cell));
    return Array.from(new Set(values)).length == data.length;
};

// builds data structure to initialize row selection state
const __setInitialRowSelection = (columnIds: string[] | undefined) => {
    const rSelection: RowSelectionState = {};
    if (columnIds) {
        columnIds.forEach((colId) => {
            rSelection[colId] = true;
        });
    }
    return rSelection;
};

// builds data structure to initialize row selection state
const __setInitialColumnVisibility = (defaultColumns: string[] | undefined, columns: GenericColumn[]) => {
    const visibility: VisibilityState = {};
    if (defaultColumns) {
        columns.forEach((col) => {
            visibility[col.id] = defaultColumns.includes(col.id);
        });
    }
    return visibility;
};

export interface TableProps {
    id: string;
    options?: TableConfig;
    columns: GenericColumn[];
    data: TableData;
}

// TODO: use table options to initialize the state (e.g., initial sort, initial filter)
const Table: React.FC<TableProps> = ({ id, columns, data, options }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
        __setInitialRowSelection(options?.rowSelect?.selectedValues)
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        __setInitialColumnVisibility(options?.defaultColumns, columns)
    );
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const initialRender = useRef(true); // to regulate callbacks affected by the initial state
    const enableRowSelect = !!options?.rowSelect;
    const disableColumnFilters = !!options?.disableColumnFilters;

    // Translate GenericColumns provided by user into React Table ColumnDefs
    // also adds in checkbox column if rowSelect options are set for the table
    const resolvedColumns = useMemo<ColumnDef<TableRow>[]>(() => {
        const columnHelper = createColumnHelper<TableRow>();
        const columnDefs: ColumnDef<TableRow>[] = [];
        if (enableRowSelect) {
            const multiSelect: boolean = !!options?.rowSelect?.enableMultiRowSelect;
            columnDefs.push({
                id: "select-col",
                header: ({ table }) =>
                    multiSelect ? (
                        <div className="inline-flex">
                            <div className="group relative inline-block bottom-[2px]">
                                <Tooltip anchorId={`${id}-select-col-button}`} content="Reset selected rows">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        disabled={
                                            Object.keys(table.getState().rowSelection).length === 0
                                            // FIXME: !table.getIsSomeRowsSelected() - not working in next.js
                                        }
                                        onClick={() => {
                                            table.resetRowSelection(true);
                                        }}
                                    >
                                        <TrashIcon className="icon-button"></TrashIcon>
                                    </Button>
                                </Tooltip>
                            </div>
                            <span className="ml-4">{options?.rowSelect?.header}</span>
                        </div>
                    ) : (
                        options?.rowSelect?.header
                    ),
                enableHiding: false,
                enableSorting: true, // FIXME: enable sorting doesn't seem to work / header.canSort() returns false
                meta: { description: options?.rowSelect?.description },
                cell: ({ row }) =>
                    multiSelect ? (
                        <Checkbox
                            variant="default"
                            name={`checkbox_r${row.id}`}
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            alignCenter={true}
                        />
                    ) : (
                        <RadioButton
                            variant="default"
                            name={`radiobox r${row.id}`}
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            alignCenter={true}
                        />
                    ),
            });
        }

        columns.forEach((col: GenericColumn) => {
            try {
                col.type = validateCellType(col.type as string);
            } catch (e: any) {
                throw Error("Error processing column definition for `" + col.id + "`.\n" + e.message);
            }

            columnDefs.push(
                columnHelper.accessor((row) => getCellValue(row[col.id as keyof typeof row] as Cell), {
                    id: col.id,
                    header: _get("header", col, toTitleCase(col.id)),
                    enableColumnFilter: _get("canFilter", col, true) && !disableColumnFilters,
                    enableGlobalFilter: !col.disableGlobalFilter,
                    enableSorting: !col.disableSorting,
                    sortingFn: __resolveSortingFn(col) as SortingFnOption<TableRow>,
                    enableHiding: !_get("required", col, false), // if required is true, enableHiding is false
                    meta: {
                        description: _get("description", col),
                        type: _get("type", col),
                    },
                    cell: (props) => renderCell(props.cell.row.original[col.id] as Cell),
                })
            );
        });
        return columnDefs;
    }, []);

    const resolvedData = useMemo<TableData>(() => {
        const tableData: TableData = [];
        const enFields = columns.length; // expected number of fields
        try {
            data.forEach((row: TableRow, index: number) => {
                // validate expected number of fields per row observed
                const onFields = Object.keys(row).length; // observed number of fields
                if (onFields > enFields) {
                    throw new Error(
                        `Too many values detected in row ${index}: expected ${enFields}; found ${onFields}`
                    );
                }
                if (onFields < enFields) {
                    throw new Error(`Missing columns in row ${index}: each row must provide a value for every column`);
                }

                const tableRow: TableRow = {};
                for (const [columnId, value] of Object.entries(row)) {
                    const currentColumn = getColumn(columnId, columns);
                    if (currentColumn === undefined) {
                        throw new Error("Invalid column name found in table data definition `" + columnId + "`");
                    }
                    tableRow[columnId] = __resolveCell(value, currentColumn, index);
                }
                tableData.push(tableRow);
            });
        } catch (e: any) {
            throw Error(e.message);
        }
        return tableData;
    }, [columns]);

    // build table options conditionally
    // cannot memoize this b/c it depends on the state;
    // doing so leads to very slow rerenders
    const reactTableOptions: TableOptions<TableRow> = {
        data: resolvedData,
        columns: resolvedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            rowSelection,
            globalFilter,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        sortingFns: CustomSortingFunctions,
        enableColumnResizing: true,
    };

    if (enableRowSelect) {
        const enableMultiRowSelect = !!options?.rowSelect?.enableMultiRowSelect;
        Object.assign(reactTableOptions, {
            enableMultiRowSelection: enableMultiRowSelect,
            onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
        });

        const rowIdColumn = options?.rowSelect?.rowId;
        if (!!rowIdColumn) {
            // -@ts-expect-error: useMemo used conditionally
            // const isValidRowId = useMemo(() => __isValidRowId(resolvedData, rowIdColumn), [rowIdColumn]);
            const isValidRowId = __isValidRowId(resolvedData, rowIdColumn);
            if (isValidRowId) {
                Object.assign(reactTableOptions, {
                    getRowId: (row: TableRow) => getCellValue(row[rowIdColumn as keyof typeof row] as Cell),
                });
            } else {
                throw Error(
                    `The field ${rowIdColumn} does not contain a unique value for each row.  It cannot be used as the 'rowId' for the rowSelect callback.`
                );
            }
        }
    }

    const table = useReactTable(reactTableOptions);

    const rowModel = showOnlySelected ? table.getSelectedRowModel() : table.getRowModel();

    useLayoutEffect(() => {
        if (options?.onTableLoad) {
            // TODO: if (initialRender.current)  // not sure if necessary - initialRender is a useRef / from GenomicsDB code; has to do w/pre-selected rows
            if (table) {
                options.onTableLoad(table);
            }
        }
    }, [table]);

    useEffect(() => {
        if (initialRender.current) {
            // necessary to prevent actions on pre-selected rows
            initialRender.current = false;
            return;
        }
        options?.rowSelect?.onRowSelect(rowSelection);
    }, [rowSelection]);

    return table ? (
        <div className="table-container">
            <div className="flex justify-between items-center">
                <TableToolbar table={table} tableId={id} enableExport={!!!options?.disableExport} />
                <PaginationControls table={table} />
            </div>
            {enableRowSelect && (
                <div>
                    <RowSelectionControls
                        selectedRows={table.getSelectedRowModel().rows}
                        displayColumn={options.rowSelect?.rowId!} // if row select is enabled, rowId must be defined
                        onToggleShowSelected={() => {
                            if (showOnlySelected) {
                                setColumnFilters([]);
                            }
                            setShowOnlySelected(!showOnlySelected);
                        }}
                    />
                </div>
            )}
            <div className="overflow-auto">
                <table className="table-layout table-border table-text">
                    {__renderTableHeader(table.getHeaderGroups(), id)}
                    <tbody>
                        {rowModel.rows.map((row) => (
                            <tr key={row.id} className="table-dtr">
                                {row.getVisibleCells().map((cell) => (
                                    <td className="table-td" key={`${row.id}-${cell.id}`}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <div>No data</div>
    );
};

export default Table;
