import { NextRequest, NextResponse } from "next/server";

async function _fetch_track_config(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json(
                { error: `Error accessing track configuration: failed to fetch URL: ${response.statusText}` },
                { status: response.status }
            );
        }
        // Always try to parse as JSON
        const json = await response.json();

        return NextResponse.json(json);
    } catch (err) {
        return NextResponse.json({ error: "Error fetching remote track configuration" }, { status: 500 });
    }
}

// Example: /api/track-config?name=track.config.json
//        : /api/track-config?name=https://example.com/config.json
//        : /api/track-config?name=https://api.example.com/track-config
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) {
        return NextResponse.json(
            { error: "Error accessing track configuration: missing 'name' query parameter." },
            { status: 400 }
        );
    }

    // If name is a URL, fetch it (remote JSON file or remote API endpoint)
    if (/^https?:\/\//.test(name)) {
        return _fetch_track_config(name);
    }

    // Only allow .json files for local config
    if (!/^[-\w.]+\.json$/.test(name)) {
        return NextResponse.json(
            { error: "Error accessing track configuration file: invalid file name." },
            { status: 400 }
        );
    }
    // Build the public URL for the file
    const baseUrl = req.nextUrl.origin;
    const fileUrl = `${baseUrl}/${name}`;
    return _fetch_track_config(fileUrl);
}
