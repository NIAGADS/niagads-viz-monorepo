import React, { useState, useMemo } from "react"

import { Table as ReactTable } from "@tanstack/react-table"
import range from "lodash.range"
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

import { Select, Button } from "@bug_sam/ui"

interface PaginationControlsProps {
    table: ReactTable<any>
}

const __generatePageSizeOptions = (nRows: number) => {
    const nearestTenth = Math.ceil(nRows / 10) * 10

    if (nearestTenth >= 500)
        return [10, 20, 30, 40, 50, 100, 500]
    else if (nearestTenth >= 100)
        return [10, 20, 30, 40, 50, 100]
    else if (nearestTenth >= 50)
        return [10, 20, 30, 40, 50, nRows] // range is up to but not including end
    else if (nearestTenth >= 10 && nRows >= 10) {
        const options = range(10, nearestTenth + 10, 10)
        options.push(nRows)
        return options
    }

    return [nRows]
}

export const PaginationControls = ({ table }: PaginationControlsProps) => {
    const [pageSize, setPageSize] = useState<number>(table.getState().pagination.pageSize)
    const nRows = table.getPrePaginationRowModel().rows.length;
    const pageSizeOptions = useMemo(() => (__generatePageSizeOptions(nRows)), [nRows])

    const minDisplayedRow = table.getState().pagination.pageIndex * pageSize + 1
    let maxDisplayedRow = minDisplayedRow + pageSize - 1
    if (maxDisplayedRow > nRows) maxDisplayedRow = nRows

    const onChangePageSize = (pSize: number) => {
        table.setPageSize(pSize)
        setPageSize(pSize)
    }

    return <>
        <div className="flex flex-row gap-4" aria-label="pagination">
            <Select defaultValue={pageSize.toString()} fields={pageSizeOptions}
                onChange={(e: any) => { onChangePageSize(Number(e.target.value)) }}
                label="Results per page" id="pages" inline variant='plain' />
            <div className="self-center text-sm text-gray-900 px-2">{minDisplayedRow} - {maxDisplayedRow} of {nRows}</div>
            <Button variant="white" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeftIcon className={`icon-button stroke-1 ${!table.getCanPreviousPage() ? 'icon-disabled' : 'stroke-black'}`}></ChevronLeftIcon>
            </Button>
            <Button variant="white" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRightIcon className={`icon-button stroke-1 ${!table.getCanNextPage() ? 'icon-disabled' : 'stroke-black'}`}></ChevronRightIcon>
            </Button>
        </div>
    </>
}


