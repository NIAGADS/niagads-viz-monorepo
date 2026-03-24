import { APITableResponse, TableType } from "@/lib/types";
import AssociationProcessor from "./AssociationProcessor";

export const resolveProcessor = (tableType: TableType) => {
    switch (tableType) {
        case "associations":
            return AssociationProcessor;
        default:
            return (rawTable: APITableResponse) => rawTable;
    }
};
