import { Alert, Checkbox, RadioButton } from "@niagads/ui";
import { Cell, CellType, TableCell } from "./Cells/types";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFnOption,
    HeaderGroup,
    Table as ReactTable,
    TableOptions as ReactTableOptions,
    RowSelectionState,
    SortingFnOption,
    SortingState,
    Updater,
    VisibilityState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ColumnFilterType, DEFAULT_NA_VALUE, TableColumn, TableData, TableOptions, TableRow } from "./types";
import { PaginationControls, TableToolbar } from "./ControlElements";
import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { _get, toTitleCase } from "@niagads/common";
import { booleanSort, scientificNotationSort } from "./ControlElements/Columns/sortingFunctions";
import { getCellValue, renderCell, resolveCell, validateCellType } from "./Cells/utils";
import {
    globalFuzzyFilter,
    includesAnyFilter,
    includesFilter,
    neglog10Filter,
} from "./ControlElements/Columns/filterFunctions";

import { ColumnFilterControls } from "./ControlElements/Columns/ColumnFilterControls";
import { NUMERIC_CELL_TYPES } from "./ControlElements/Columns/Filters/FilterUI";
import { RowSelectionControls } from "./ControlElements/RowSelectionControls";
import { TableColumnHeader } from "./TableColumnHeader";
import styles from "./styles/table.module.css";

export interface TableProps {
    id: string;
    options?: TableOptions;
    columns: TableColumn[];
    data: TableData;
    rowSelection?: RowSelectionState | string[];
    onRowSelectionChange?: (state: RowSelectionState) => void;
}

// TODO: use table options to initialize the state (e.g., initial sort, initial filter)
const Table = ({ id, columns, data, options, rowSelection, onRowSelectionChange }: TableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        __setInitialColumnVisibility(options?.defaultColumns, columns)
    );
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const [showColumnFilters, setShowColumnFilters] = useState<boolean | null>(null);

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
            const multiSelect: boolean = !!options?.rowSelectOpts?.enableMultiSelect;
            columnDefs.push({
                id: "select-col",
                header: ({ table }) => options?.rowSelectOpts?.header,
                enableHiding: false,
                enableSorting: false,
                meta: { description: options?.rowSelectOpts?.description, type: "abstract" },
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

        columns.forEach((col: TableColumn) => {
            try {
                col.type = validateCellType(col.type as string);
            } catch (e: any) {
                throw Error("Error processing column definition for `" + col.id + "`.\n" + e.message);
            }
            columnDefs.push(
                columnHelper.accessor((row) => getCellValue(row[col.id as keyof typeof row] as Cell), {
                    id: col.id,
                    header: _get("header", col, toTitleCase(col.id)),
                    enableColumnFilter: !col.disableColumnFilter,
                    enableGlobalFilter: !col.disableGlobalFilter,
                    enableSorting: !col.disableSorting,
                    sortingFn: __resolveSortingFn(col),
                    filterFn: __resolveFilterFn(col),
                    enableHiding: !col.required, // if required is true, enableHiding is false
                    meta: {
                        type: col.type,
                        filterType: col.filterOpts?.filterType || __resolveFilterType(col.type),
                        description: col.description,
                        naValue: col.valueDisplayOpts?.naValue || DEFAULT_NA_VALUE,
                        trueValue: col.valueDisplayOpts?.trueValue || "true",
                    },
                    cell: (props) => renderCell(props.cell.row.original[col.id] as Cell),
                })
            );
        });
        return columnDefs;
    }, [columns]);

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
                    const currentColumn = __getColumn(columnId, columns);
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
    }, [columns, data]);

    // build table options conditionally
    // cannot memoize this b/c it depends on the state;
    // doing so leads to very slow rerenders
    const reactTableOptions: ReactTableOptions<TableRow> = {
        data: resolvedData,
        columns: resolvedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues, // custom, see def at end
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        globalFilterFn: "globalFuzzy",
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
        sortingFns: { boolean: booleanSort, scientific: scientificNotationSort },
        filterFns: {
            includes: includesFilter,
            globalFuzzy: globalFuzzyFilter,
            includesAny: includesAnyFilter,
            pvalue: neglog10Filter,
        },
        enableColumnResizing: true,

        _features: [
            {
                // when column is initialized, create this function
                createColumn: (column, table) => {
                    column.getAllValues = (filterNulls: boolean = false, naValue: string = DEFAULT_NA_VALUE) => {
                        let values = table.getCoreRowModel().flatRows.map((row) => row.getValue(column.id));
                        if (filterNulls) {
                            values = values.filter((v) => v != null && v !== naValue);
                        }
                        return values;
                    };
                },
            },
        ],
    };

    if (enableRowSelect) {
        Object.assign(reactTableOptions, {
            enableMultiRowSelection: !!options?.rowSelectOpts?.enableMultiSelect,
            onRowSelectionChange: handleRowSelectionChange, //hoist up the row selection state to your own scope
        });

        const uniqueKey = options?.rowSelectOpts?.rowUniqueKey;
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
        if (table) {
            if (options?.onTableLoad) {
                options.onTableLoad(table);
            }
            setShowColumnFilters(
                !!options?.enableColumnFilters && table.getAllColumns().some((col) => col.columnDef.enableColumnFilter)
            );
        }
    }, [options, table]);

    return showColumnFilters !== null && table ? (
        <div className={styles["table-outer-container"]}>
            {showColumnFilters && (
                <ColumnFilterControls
                    filterableColumns={table.getAllColumns().filter((x) => x.columnDef.enableColumnFilter)}
                    activeFilters={columnFilters}
                    coreRowCount={table.getCoreRowModel().rows.length}
                    onRemoveAll={() => setColumnFilters([])}
                    onRemoveFilter={(filter) => {
                        setColumnFilters((prev) => prev.filter((f) => f !== filter));
                    }}
                />
            )}
            <div className={styles["table-controls-container"]}>
                <TableToolbar table={table} tableId={id} enableExport={!!options?.enableExport} />
                <PaginationControls id={id} table={table} />
            </div>
            {enableRowSelect && (
                <div>
                    <RowSelectionControls
                        selectedRows={table.getSelectedRowModel().rows}
                        displayColumn={options.rowSelectOpts?.rowUniqueKey!} // if row select is enabled, rowId must be defined
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
            <div className={styles["table-container"]}>
                {rowModel.rows.length > 0 ? (
                    <table className={`${styles["table-layout"]} ${styles["table-border"]} ${styles["table-text"]}`}>
                        {__renderTableHeader(table.getHeaderGroups())}
                        <tbody>
                            {rowModel.rows.map((row) => (
                                <tr key={row.id} className={styles["table-dtr"]}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td className={styles["table-td"]} key={`${row.id}-${cell.id}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext()) as ReactNode}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : columnFilters.length > 0 || globalFilter.length > 0 ? (
                    <Alert variant="info" message="No rows meet the selected search or filter criteria.">
                        <span>
                            Unfiltered table contains {data.length} rows. Remove or adjust filter/search criteria to
                            view.
                        </span>
                    </Alert>
                ) : (
                    <Alert variant="info" message="This table contains no rows." />
                )}
            </div>
        </div>
    ) : (
        <div>No data</div>
    );
};

const __resolveFilterType = (cellType: CellType): ColumnFilterType => {
    if (NUMERIC_CELL_TYPES.includes(cellType)) {
        return "histogram";
    }
    if (cellType === "boolean") {
        return "boolean";
    }

    return "select";
};

const __resolveSortingFn = (col: TableColumn): SortingFnOption<TableRow> => {
    if (col.sortingFn) {
        return col.sortingFn;
    }

    if (col.type === "boolean") {
        return "boolean";
    }
    if (col.type === "float") {
        return "scientific";
    }
    return "alphanumeric";
};

// FIXME: boolean?
const __resolveFilterFn = (col: TableColumn): FilterFnOption<TableRow> => {
    if (col.filterOpts?.filterType === "multiselect") {
        return "includesAny"; // multiselect & text lists
    }

    if (col.filterOpts?.filterFn) {
        return col.filterOpts.filterFn;
    }

    if (col.type === "pvalue") {
        return "pvalue";
    }

    if (col.type === "float" || col.type === "integer") {
        return "inNumberRange"; // FIXME: not really implemented yet
    }
    if (col.type === "boolean") {
        return "equals";
    }

    // text field filtering; handles text lists
    return "includes";
};

// wrapper to catch any errors thrown during cell type and properties validation so that
// user can more easily identify the problematic table cell by row/column
const __resolveCell = (userCell: TableCell | TableCell[], column: TableColumn, rowId: number) => {
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
const __setInitialColumnVisibility = (defaultColumns: string[] | undefined, columns: TableColumn[]) => {
    const visibility: VisibilityState = {};
    if (defaultColumns) {
        columns.forEach((col) => {
            visibility[col.id] = defaultColumns.includes(col.id);
        });
    }
    return visibility;
};

export const __getColumn = (columnId: string, columns: TableColumn[]) => {
    return columns.find((col) => col.id === columnId);
};

/* custom getFacetedUniqueValues
 ** handles lists (delimited by //)
 ** counts nulls and n/a (b/c tanstack-tables counts undefined as n/a, not null)
 */
const getFacetedUniqueValues = (table: ReactTable<TableRow>, columnId: string): (() => Map<any, number>) => {
    // The returned function is what actually gets called by column.getFacetedUniqueValues()
    return () => {
        const uniqueValueMap = new Map<any, number>();

        // Access the rows that have passed through previous filters
        const facetedRows = table.getColumn(columnId)!.getFacetedRowModel().flatRows;

        facetedRows.forEach((row: any) => {
            const value = row.getValue(columnId);
            if (typeof value === "string") {
                // check for string lists
                const values: string[] = value.includes("//") ? value.split(" // ") : [value];
                values.forEach((v: string) => {
                    const count = uniqueValueMap.get(v) ?? 0;
                    uniqueValueMap.set(v, count + 1);
                });
            } else {
                const count = uniqueValueMap.get(value) ?? 0;
                uniqueValueMap.set(value, count + 1);
            }
        });

        return uniqueValueMap;
    };
};

export default Table;
