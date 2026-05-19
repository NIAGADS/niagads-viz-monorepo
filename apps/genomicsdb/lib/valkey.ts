import Redis from "ioredis";

export const client = new Redis({
    port: 6369,
    host: "127.0.0.1",
})

const TTL = { 
    "10mins": 600,
    "hour": 3600,
    "6hrs": 21600,
    "12hrs": 43200,
    "day": 86400,
    "month": 2592000,
    "forever": 0,
};

type TTLKey = keyof typeof TTL;

const DEFAULT_TTL = (process.env.CACHEDB_TTL as TTLKey) || "hour";

// Helper to prefix key with namespace
function withNamespace(namespace: string, key: string): string {
    return `${namespace}:${key}`;
}

export async function getCache(namespace: string, key: string): Promise<string | null> {
    const exists: boolean = await cacheKeyExists(namespace, key);
    if (exists) {
        const value = await client.get(withNamespace(namespace, key));
        return JSON.parse(value!); // no null should be stored
    }
    return null;
}

export async function setCache(namespace: string, key: string, value: any, ttl: TTLKey = DEFAULT_TTL): Promise<void> {
    await client.set(withNamespace(namespace, key), JSON.stringify(value), "EX", TTL[ttl]);
}

// check if cache key exists
export async function cacheKeyExists(namespace: string, key: string): Promise<boolean> {
    return (await client.exists(withNamespace(namespace, key))) === 1;
}

// extend ttl
export async function extendCacheTTL(namespace: string, key: string, TTLKey = TTL.hour) {
    if (await cacheKeyExists(namespace, key)) {
        await client.expire(withNamespace(namespace, key), TTL[DEFAULT_TTL]);
    }
}
