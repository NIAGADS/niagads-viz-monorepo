import { FileFormat } from "@common/types"
import { GenericCell } from "@table/Cell"
import { GenericColumn } from "@table/Column"

export interface RowSelectOptions {
    onSelectFn: any // behavior on select
    selectType: 'highlight' | 'checkbox' // how row selection is indicated
    multiSelect?: boolean // optional: allow selection of multiple rows, false if missing
}

export interface TableConfig {
    title?: string
    id?:string // optional: internal id for the table; if not provided will be generated from title
    description?: string // optional: descriptive text describing the table for info popup
    canFilter?: boolean // optional: table can be filtered; false if misssing
    export?: FileFormat[] // optional: enable exports in the listed file formats; exports disabled if missing
    rowSelect?: RowSelectOptions // optional: enables row selection and related state change options
    columOrder?: string[] // optional: column ids listed in order in which they should be displayed; if none uses order in the column defs
}

export type TableRow = Record<string, GenericCell | GenericCell[]>
export type TableData = TableRow[]




