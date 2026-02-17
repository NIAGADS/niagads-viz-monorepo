import { Cell, GenericCell, getCellValue, renderCell, resolveCell, validateCellType } from "./Cell";
import { Checkbox, RadioButton } from "@niagads/ui";
import {
    ColumnDef,
    ColumnFiltersState,
    HeaderGroup,
    RowSelectionState,
    SortingFnOption,
    SortingState,
    TableOptions,
    Updater,
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
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { TableConfig, TableData, TableRow } from "./TableProperties";
import { _get, _hasOwnProperty, toTitleCase } from "@niagads/common";

import { CustomSortingFunctions } from "./TableSortingFunctions";
import { RowSelectionControls } from "./ControlElements/RowSelectionControls";
import { TableColumnHeader } from "./TableColumnHeader";
import styles from "./styles/table.module.css";
import { ColumnFilterControls } from "./ControlElements/ColumnFilterControls";

const __resolveSortingFn = (col: GenericColumn) => {
    if (col.type === "boolean") {
        return "boolean";
    }
    if (col.type === "float") {
        return "scientific";
    }
    return "alphanumeric";
};

const __resolveFilterFn = (col: GenericColumn) => {
    if (col.type === "float" || col.type === "p_value") {
        return "inNumberRange";
    }
    return "includesString";
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
const __renderTableHeader = (hGroups: HeaderGroup<TableRow>[]) => (
    <thead>
        {hGroups.map((headerGroup: HeaderGroup<TableRow>) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return <TableColumnHeader key={header.id} header={header} />;
                })}
            </tr>
        ))}
    </thead>
);

// checks to see if a field contains a unique value for each row in the table
// allowing it to be used as a valid "primary key" or row_id for row selection
const __isValidUniqueKey = (data: TableData, columnId: string) => {
    const values = data.map((row) => getCellValue(row[columnId as keyof typeof row] as Cell));
    return Array.from(new Set(values)).length == data.length;
};

// builds data structure to initialize row selection state
const __resolveRowSelectionState = (state: RowSelectionState | string[] | undefined): RowSelectionState => {
    if (state) {
        if (Array.isArray(state)) {
            if (state.length > 0) {
                return Object.fromEntries(state.map((rowId) => [rowId, true])) as RowSelectionState;
            }
            return {} as RowSelectionState;
        }
        return state as RowSelectionState;
    }

    return {};
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
    rowSelection?: RowSelectionState | string[];
    onRowSelectionChange?: (state: RowSelectionState) => void;
}

// TODO: use table options to initialize the state (e.g., initial sort, initial filter)
const Table: React.FC<TableProps> = ({ id, columns, data, options, rowSelection, onRowSelectionChange }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        __setInitialColumnVisibility(options?.defaultColumns, columns)
    );
    const [showOnlySelected, setShowOnlySelected] = useState(false);

    const enableRowSelect = !!options?.enableRowSelect;

    const handleRowSelectionChange = useCallback(
        (updater: Updater<RowSelectionState>) => {
            const next = typeof updater === "function" ? updater(__resolveRowSelectionState(rowSelection)) : updater;
            onRowSelectionChange && onRowSelectionChange(next);
        },
        [rowSelection, onRowSelectionChange]
    );

    // Translate GenericColumns provided by user into React Table ColumnDefs
    // also adds in checkbox column if rowSelect options are set for the table
    const resolvedColumns = useMemo<ColumnDef<TableRow>[]>(() => {
        const columnHelper = createColumnHelper<TableRow>();
        const columnDefs: ColumnDef<TableRow>[] = [];
        if (enableRowSelect) {
            const multiSelect: boolean = !!options?.rowSelectColumn?.enableMultiSelect;
            columnDefs.push({
                id: "select-col",
                header: ({ table }) => options?.rowSelectColumn?.header,
                enableHiding: false,
                enableSorting: false,
                meta: { description: options?.rowSelectColumn?.description },
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
                    enableColumnFilter: _get("canFilter", col, true) && !options?.disableColumnFilters,
                    enableGlobalFilter: !col.disableGlobalFilter,
                    enableSorting: !col.disableSorting,
                    sortingFn: __resolveSortingFn(col) as SortingFnOption<TableRow>,
                    filterFn: __resolveFilterFn(col),
                    enableHiding: !_get("required", col, false), // if required is true, enableHiding is false
                    meta: {
                        description: _get("description", col),
                        type: _get("type", col),
                        filterType: _get("filterType", col)
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
            rowSelection: __resolveRowSelectionState(rowSelection),
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
        Object.assign(reactTableOptions, {
            enableMultiRowSelection: !!options?.rowSelectColumn?.enableMultiSelect,
            onRowSelectionChange: handleRowSelectionChange, //hoist up the row selection state to your own scope
        });

        const uniqueKey = options?.rowSelectColumn?.rowUniqueKey;
        if (!!uniqueKey) {
            if (__isValidUniqueKey(resolvedData, uniqueKey)) {
                Object.assign(reactTableOptions, {
                    getRowId: (row: TableRow) => getCellValue(row[uniqueKey as keyof typeof row] as Cell),
                });
            } else {
                throw Error(
                    `The field ${uniqueKey} does not contain a unique value for each row. ` +
                        `It cannot be used as the 'unique key' for the rowSelect callback.`
                );
            }
        }
    }

    const table = useReactTable(reactTableOptions);

    const rowModel = showOnlySelected ? table.getSelectedRowModel() : table.getRowModel();

    useLayoutEffect(() => {
        if (table && options?.onTableLoad) {
            options.onTableLoad(table);
        }
    }, [table]);

    return table ? (
        <div className={styles["table-outer-container"]}>
            <div className={styles["table-controls-container"]}>
                <TableToolbar
                    table={table}
                    tableId={id}
                    enableExport={!!!options?.disableExport}
                />
                <PaginationControls id={id} table={table} />
            </div>
            {enableRowSelect && (
                <div>
                    <RowSelectionControls
                        selectedRows={table.getSelectedRowModel().rows}
                        displayColumn={options.rowSelectColumn?.rowUniqueKey!} // if row select is enabled, rowId must be defined
                        onToggleSelectedFilter={(isFiltered: boolean) => {
                            if (isFiltered) {
                                setColumnFilters([]);
                            }
                            setShowOnlySelected(isFiltered);
                        }}
                        onRemoveAll={() => {
                            table.resetRowSelection(true);
                        }}
                    />
                </div>
            )}
            {table.getAllColumns().some(x => x.columnDef.enableColumnFilter) && (
                <ColumnFilterControls
                    filterableColumns={table.getAllColumns().filter(x => x.columnDef.enableColumnFilter)}
                    activeFilters={columnFilters}
                    onRemoveAll={() => setColumnFilters([])}
                    onRemoveFilter={(filter) => setColumnFilters((prev) => prev.filter((f) => f !== filter))}
                />
            )}
            <div className={styles["table-container"]}>
                <table className={`${styles["table-layout"]} ${styles["table-border"]} ${styles["table-text"]}`}>
                    {__renderTableHeader(table.getHeaderGroups())}
                    <tbody>
                        {rowModel.rows.map((row) => (
                            <tr key={row.id} className={styles["table-dtr"]}>
                                {row.getVisibleCells().map((cell) => (
                                    <td className={styles["table-td"]} key={`${row.id}-${cell.id}`}>
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
