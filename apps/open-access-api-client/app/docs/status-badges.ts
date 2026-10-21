const STATUS_BADGES = new Map([
    ["alpha", { name: "Alpha", color: "#ff9500" }],
    ["planned", { name: "Planned", color: "#0066ff" }],
]);

export const statusBadgeCss = Array.from(STATUS_BADGES.values(), ({ name, color }) => {
    const badge = `.badge[style*="--badge-color: ${color}"]`;
    const operation = `.section-content:has(> .flex > .flex > ${badge})`;

    return `
        ${operation} > .flex > .flex > ${badge} {
            display: none;
        }
        ${operation} > .operation-layout > .operation-title .section-header-label::after {
            content: "${name}";
            display: inline-block;
            margin-inline-start: 0.75rem;
            padding: 0.3rem 0.8rem;
            border-radius: 0.5rem;
            background: ${color};
            color: ${name === "Alpha" ? "#111111" : "#ffffff"};
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.4;
            vertical-align: middle;
            white-space: nowrap;
        }
    `;
}).join("\n");

/** Add presentation metadata only to the OpenAPI document loaded by Scalar. */
export const fetchDocumentation: typeof fetch = async (input, init) => {
    const response = await fetch(input, init);
    const requestUrl = input instanceof Request ? input.url : input.toString();

    if (!response.ok || new URL(requestUrl, window.location.href).pathname !== "/api/openapi") {
        return response;
    }

    const document: { paths?: Record<string, Record<string, unknown>> } = await response.json();
    for (const path of Object.values(document.paths ?? {})) {
        for (const operation of Object.values(path)) {
            if (typeof operation !== "object" || operation === null || !("x-status" in operation)) {
                continue;
            }
            const badge =
                typeof operation["x-status"] === "string" ? STATUS_BADGES.get(operation["x-status"]) : undefined;
            if (badge) {
                const badges =
                    "x-badges" in operation && Array.isArray(operation["x-badges"]) ? operation["x-badges"] : [];
                Object.assign(operation, { "x-badges": [...badges, badge] });
            }
        }
    }

    return Response.json(document, { status: response.status, headers: response.headers });
};
