import { Alert, Checkbox, RadioButton } from "@niagads/ui";
import { Cell, TableCell } from "./Cells/types";
import {
    ColumnDef,
    ColumnFiltersState,
    Table as ReactTable,
    TableOptions as ReactTableOptions,
    Row,
    RowSelectionState,
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
import {
    ColumnFilterControls,
    booleanSort,
    globalFuzzyFilter,
    includesAnyFilter,
    neglog10Filter,
    scientificNotationSort,
} from "./ControlElements/Columns/ColumnFilters";
import { DEFAULT_NA_VALUE, TableColumn, TableData, TableOptions, TableRow } from "./types";
import { PaginationControls, TableToolbar } from "./ControlElements";
import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { _get, toTitleCase } from "@niagads/common";
import { getCellValue, renderCell, resolveCell, validateCellType } from "./Cells/utils";
import { isValidUniqueKey, limitRowSelection, resolveRowSelectionState } from "./utils/rowSelection";
import { resolveFilterFn, resolveSortingFn } from "./utils/columnDefs";

import { RowSelectionControls } from "./ControlElements/RowSelectionControls";
import TableHeader from "./TableHeader";
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
        _setInitialColumnVisibility(options?.defaultColumns, columns)
    );
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const [showColumnFilters, setShowColumnFilters] = useState<boolean | null>(null);

    const enableRowSelect = !!options?.enableRowSelect;
    const maxSelectedRows = options?.rowSelectOpts?.maxSelectedRows;
    if (maxSelectedRows !== undefined && (!Number.isInteger(maxSelectedRows) || maxSelectedRows < 1)) {
        throw new Error("maxSelectedRows must be a positive integer");
    }
    const selectedState = resolveRowSelectionState(rowSelection);
    const selectedCount = Object.values(selectedState).filter(Boolean).length;

    const handleRowSelectionChange = useCallback(
        (updater: Updater<RowSelectionState>) => {
            const next = typeof updater === "function" ? updater(resolveRowSelectionState(rowSelection)) : updater;
            const limited = limitRowSelection(selectedState, next, maxSelectedRows);
            if (limited !== selectedState) onRowSelectionChange?.(limited);
        },
        [rowSelection, onRowSelectionChange, maxSelectedRows, selectedState]
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
                    sortingFn: resolveSortingFn(col),
                    filterFn: resolveFilterFn(col),
                    enableHiding: !col.required, // if required is true, enableHiding is false
                    meta: {
                        type: col.type,
                        filterType: col.filterOpts?.filterType || undefined,
                        filterGroup: col.filterOpts?.filterGroup || "",
                        filterValueColumn: col.filterOpts?.valueColumn,
                        description: col.description,
                        naValue: col.valueDisplayOpts?.naValue || DEFAULT_NA_VALUE,
                        trueValue: col.valueDisplayOpts?.trueValue || "true",
                    },
                    cell: (props) => renderCell(props.cell.row.original[col.id] as Cell),
                })
            );
        });
        return columnDefs;
    }, [
        columns,
        enableRowSelect,
        options?.rowSelectOpts?.enableMultiSelect,
        options?.rowSelectOpts?.header,
        options?.rowSelectOpts?.description,
    ]);

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
                    const currentColumn = _getColumn(columnId, columns);
                    if (currentColumn === undefined) {
                        throw new Error("Invalid column name found in table data definition `" + columnId + "`");
                    }
                    tableRow[columnId] = _resolveCell(value, currentColumn, index);
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
            rowSelection: selectedState,
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
            globalFuzzy: globalFuzzyFilter,
            includesAny: includesAnyFilter,
            pvalue: neglog10Filter,
        },
        enableColumnResizing: true,

        _features: [
            {
                // when column is initialized, create helper functions
                createColumn: (column, table) => {
                    column.getAllValues = (filterNulls: boolean = false, naValue: string = DEFAULT_NA_VALUE) => {
                        let values: any[] = [];
                        table.getCoreRowModel().flatRows.forEach((row) => {
                            const value = row.getValue(column.columnDef.meta?.filterValueColumn ?? column.id);
                            if (typeof value === "string") {
                                // check for string lists
                                const splitValues: string[] = value.includes("//") ? value.split(" // ") : [value];
                                values.push(...splitValues);
                            } else {
                                values.push(value);
                            }
                        });
                        if (filterNulls) {
                            values = values.filter((v) => v != null && v !== naValue);
                        }
                        return values;
                    };

                    column.getFilteredValues = (filterNulls: boolean = false, naValue: string = DEFAULT_NA_VALUE) => {
                        let values: any[] = [];
                        table.getFilteredRowModel().flatRows.forEach((row) => {
                            const value = row.getValue(column.columnDef.meta?.filterValueColumn ?? column.id);
                            if (typeof value === "string") {
                                // check for string lists
                                const splitValues: string[] = value.includes("//") ? value.split(" // ") : [value];
                                values.push(...splitValues);
                            } else {
                                values.push(value);
                            }
                        });
                        if (filterNulls) {
                            values = values.filter((v) => v != null && v !== naValue);
                        }
                        return values;
                    };

                    column.getUniqueValues = () => {
                        const values = column.getAllValues(false);
                        const uniqueValues = new Map<any, number>();

                        values.forEach((value) => {
                            const count = uniqueValues.get(value) ?? 0;
                            uniqueValues.set(value, count + 1);
                        });

                        return uniqueValues;
                    };
                },
            },
        ],
    };

    if (enableRowSelect) {
        Object.assign(reactTableOptions, {
            enableMultiRowSelection: !!options?.rowSelectOpts?.enableMultiSelect,
            enableRowSelection: (row: Row<TableRow>) =>
                !options?.rowSelectOpts?.enableMultiSelect ||
                maxSelectedRows === undefined ||
                !!selectedState[row.id] ||
                selectedCount < maxSelectedRows,
            onRowSelectionChange: handleRowSelectionChange, //hoist up the row selection state to your own scope
        });

        const uniqueKey = options?.rowSelectOpts?.rowUniqueKey;
        if (!!uniqueKey) {
            if (isValidUniqueKey(resolvedData, uniqueKey)) {
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
                    filterGroupOrder={options?.filterGroupOrder}
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
                        <TableHeader headerGroups={table.getHeaderGroups()} />
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

/* wrapper to catch any errors thrown during cell type and properties validation */
const _resolveCell = (userCell: TableCell | TableCell[], column: TableColumn, rowId: number) => {
    try {
        return resolveCell(userCell, column, rowId);
    } catch (e: any) {
        throw Error(
            "Validation Error parsing field value for row " + rowId + " column `" + column.id + "`.\n" + e.message
        );
    }
};

/* set initial column visibility based on `defaultColumns` in opts*/
const _setInitialColumnVisibility = (defaultColumns: string[] | undefined, columns: TableColumn[]) =>
    defaultColumns ? Object.fromEntries(columns.map(({ id }) => [id, defaultColumns.includes(id)])) : {};

const _getColumn = (columnId: string, columns: TableColumn[]) => {
    return columns.find((col) => col.id === columnId);
};

/* overload for tan-stack/tables `getFacetedUniqueValues`
Adds: 
 - handling of lists of strings (values delimited by //)
 - inclusion of nulls and n/a (b/c tanstack-tables counts undefined as n/a, not null)

Usage : column.getFacetedUniqueValues()
*/
const getFacetedUniqueValues = (table: ReactTable<TableRow>, columnId: string): (() => Map<any, number>) => {
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
