import { IGVBrowserTrack } from "@niagads/igv";

/**
 * Fetches the track configuration from the API route using the TRACK_CONFIG environment variable.
 * Throws an error if TRACK_CONFIG is not set or the fetch fails.
 * @returns {Promise<any>} The parsed track configuration JSON.
 */
export default async function fetchTrackConfig() {
    const endpoint = process.env.TRACK_CONFIG;
    if (!endpoint) {
        throw new Error("TRACK_CONFIG is not set; cannot load track configurations.");
    }
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/track-config?name=${encodeURIComponent(endpoint)}`
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch track config: ${res.statusText}`);
    }
    return res.json();
}

/**
 * Builds a normalized table structure for track selection from an array of IGVBrowserTrack objects.
 * Flattens metadata into top-level fields, ensures all records have all unique fields (missing fields set to null),
 * and generates column definitions with proper-case headers.
 *
 * @param config Array of IGVBrowserTrack objects
 * @returns An object with id, columns (id/header), and normalized data rows
 */
export function buildTrackSelectorTable(config: IGVBrowserTrack[]) {
    // flatten metadata and join with name, description
    const data = config.map(({ id, name, description, metadata }) => ({
        id,
        name,
        description,
        ...(metadata && typeof metadata === "object" ? metadata : {}),
    }));

    // get unique fields across all the data rows
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

    // if more than 5 columns, set to show only the first 8
    const defaultColumns = columns.length > 8 ? columns.slice(0, 8).map((col) => col.id) : undefined;

    return {
        id: "track-selector",
        columns: columns,
        data: normalizedData,
        options: defaultColumns ? { defaultColumns: defaultColumns } : {},
    };
}
