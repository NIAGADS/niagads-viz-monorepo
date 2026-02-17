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
