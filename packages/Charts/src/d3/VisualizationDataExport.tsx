import { ActionButton } from "@niagads/ui";
import React from "react";
import exportFromJSON from "export-from-json";

export type VisualizationExportData = object[];

export interface VisualizationDataExportProps {
    /** Returns the rows to include in the CSV export. */
    getExportData: () => VisualizationExportData;
    /** Download filename. The `.csv` extension is supplied by export-from-json. */
    filename?: string;
}

const ExportDataIcon = () => (
    <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
    </svg>
);

/**
 * Shared control for exporting a visualization's tabular data as CSV.
 *
 * Each visualization provides its own data callback so it can decide whether
 * export reflects raw, filtered, or aggregated data.
 */
const VisualizationDataExport = ({ getExportData, filename = "visualization-data" }: VisualizationDataExportProps) => {
    const exportData = (): void => {
        exportFromJSON({
            data: getExportData(),
            fileName: filename,
            exportType: "csv",
            extension: "txt",
            delimiter: "\t",
            withBOM: true,
        });
    };

    return (
        <ActionButton icon={<ExportDataIcon />} title="Export visible chart data" onClick={exportData}>
            Export Data
        </ActionButton>
    );
};

export default VisualizationDataExport;
