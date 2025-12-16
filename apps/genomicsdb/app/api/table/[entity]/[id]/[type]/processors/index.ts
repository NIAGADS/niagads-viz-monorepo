import { APITableResponse } from "@/lib/types";
import AssociationProcessor from "./AssociationProcessor";

export type TableTypes = "associations" | "genes" | "variants" | "function" | "pathways" | "frequencies";

export const resolveProcessor = (tableType: TableTypes) => {
    switch (tableType) {
        case "associations": 
            return AssociationProcessor
        default:
            return (rawTable: APITableResponse) => rawTable.table;
    }
}
