import IGVBrowser, { IGVBrowserProps } from "./IGVBrowser";
import React, { useEffect, useMemo, useState } from "react";
import Table, { TableProps } from "@niagads/table";
import { findTrackConfigs, resolveTrackIds } from "./utils/track_config";

import { IGVBrowserTrack } from "./types/data_models";
import { Skeleton } from "@niagads/ui";
import { handleUpdateBrowserTracks } from "./utils/browser";
import styles from "./styles/TrackSelectorSection.module.css";

export type { TableProps as SelectorTableProps };

export interface IGVBrowserWithSelectorProps extends IGVBrowserProps {
    selectorTable?: TableProps;
    trackConfig: IGVBrowserTrack[]; // make required
}

export default function IGVBrowserWithSelector({
    selectorTable,
    trackConfig,
    defaultTracks,
    ...restBrowserProps
}: IGVBrowserWithSelectorProps) {
    const [selectedTracks, setSelectedTracks] = useState<string[]>(defaultTracks ? resolveTrackIds(defaultTracks) : []);
    const [browser, setBrowser] = useState<any>(null);

    const handleTrackRemovedFromBrowser = (trackId: string) => {
        setSelectedTracks((tracks) => tracks.filter((id) => id !== trackId));
    };

    // if a selectorTable definition is provided, use that
    // otherwise build one from the trackConfig
    const trackSelectorTable = useMemo(() => {
        if (selectorTable) return selectorTable;

        // flatten metadata and join with name, description
        const data = trackConfig.map(({ id, name, description, metadata }) => ({
            id,
            name,
            description,
            ...(metadata ? metadata : {}),
        }));

        // get unique fields across all the data rows
        // need to iterate over all rows b/c metadata objects may be inconsistent
        const uniqueFieldNames = Array.from(
            data.reduce((set, obj) => {
                Object.keys(obj).forEach((k) => set.add(k));
                return set;
            }, new Set<string>())
        );

        // Order columns: id, name, description, then the rest alphabetically
        const priority = ["id", "name", "description"];
        const rest = uniqueFieldNames
            .filter((k) => !priority.includes(String(k)))
            .map(String)
            .sort();
        const orderedFields = [...priority.filter((k) => uniqueFieldNames.includes(k)), ...rest];

        // generate columns, w/header being the proper case of the snake case id
        const columns = orderedFields.map((id) => ({
            id,
            header: id
                .replace(/_/g, " ")
                .replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()),
        }));

        // Ensure every record has all fields, filling missing with null
        const normalizedData = data.map((row) => {
            const filled: Record<string, any> = {};
            for (const field of uniqueFieldNames) {
                const key = String(field);
                filled[key] = key in row ? row[key] : null;
            }
            return filled;
        });

        // if more than 8 columns, set to show only the first 8
        const defaultColumns = columns.length > 8 ? columns.slice(0, 8).map((col) => col.id) : undefined;

        return {
            id: "track-selector",
            columns: columns,
            data: normalizedData,
            options: defaultColumns ? { defaultColumns: defaultColumns } : {},
        };
    }, [selectorTable, trackConfig]);

    useEffect(() => {
        if (browser) {
            const selectedTrackConfigs = findTrackConfigs(trackConfig!, selectedTracks);
            handleUpdateBrowserTracks(browser, selectedTrackConfigs);
        }
    }, [selectedTracks, browser, trackConfig]);

    const handleTrackSelectionChange = (state: any) => {
        setSelectedTracks(Object.keys(state));
    };

    const { onBrowserLoad, onTrackRemoved, ...filteredBrowserProps } = restBrowserProps;
    return (
        <>
            <IGVBrowser
                trackConfig={trackConfig}
                onBrowserLoad={setBrowser}
                onTrackRemoved={handleTrackRemovedFromBrowser}
                {...filteredBrowserProps}
            />

            <div className={styles.trackSelectorSection}>
                <div className={styles.trackSelectorSectionTitle}>Select Tracks</div>

                {!browser ? (
                    <Skeleton type="table"></Skeleton>
                ) : (
                    <Table
                        id={trackSelectorTable.id}
                        columns={trackSelectorTable.columns}
                        data={trackSelectorTable.data}
                        rowSelection={selectedTracks}
                        onRowSelectionChange={handleTrackSelectionChange}
                        options={{
                            ...(trackSelectorTable.options || {}),
                            enableRowSelect: true,
                            rowSelectColumn: {
                                header: "",
                                description: "Select tracks to display in the Genome Browser",
                                enableMultiSelect: true,
                                rowUniqueKey: "id",
                            },
                            disableExport: true,
                            disableColumnFilters: true,
                        }}
                    ></Table>
                )}
            </div>
        </>
    );
}
