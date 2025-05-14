import { TableConfig, RowSelectAction, RowSelectOptions } from "@/components/Table/TableProperties";
import { Alert } from "@/components/UI/Alert";


export function getRowSelectAction(opts: RowSelectOptions): RowSelectAction | undefined {
    const rowSelectAction = opts.onRowSelectAction
    if (!rowSelectAction) {
        // FIXME: make error alert component w/url etc
        /*  return <Alert variant="danger" message="InternalServerError">
                <div>
                    <p>Please report this error to our GitHub Issue Tracker</p>
                </div>
            </Alert> */
    }
    return rowSelectAction
}