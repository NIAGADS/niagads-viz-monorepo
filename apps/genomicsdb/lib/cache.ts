import Redis from "ioredis";

const CACHEDB = new Redis(process.env.INTERNAL_CACHE_DB_URL!);

const TTL = { "10mins": 600, day: 86400, hour: 3600, "12hrs": 432000, "6hrs": 21600 };
type TTLKey = keyof typeof TTL;
const DEFAULT_TTL = (process.env.CACHEDB_TTL as TTLKey) || "hour";

// Helper to prefix key with namespace
function withNamespace(namespace: string, key: string): string {
    return `${namespace}:${key}`;
}

export async function getCache(namespace: string, key: string): Promise<string | null> {
    const exists: boolean = await cacheKeyExists(namespace, key);
    if (exists) {
        const value = await CACHEDB.get(withNamespace(namespace, key));
        return JSON.parse(value!); // no null should be stored
    }
    return null;
}

export async function setCache(namespace: string, key: string, value: any, ttl: TTLKey = DEFAULT_TTL): Promise<void> {
    await CACHEDB.set(withNamespace(namespace, key), JSON.stringify(value), "EX", TTL[ttl]);
}

// check if cache key exists
export async function cacheKeyExists(namespace: string, key: string): Promise<boolean> {
    return (await CACHEDB.exists(withNamespace(namespace, key))) === 1;
}

// extend ttl
export async function extendCacheTTL(namespace: string, key: string, TTLKey = TTL.hour) {
    if (await cacheKeyExists(namespace, key)) {
        await CACHEDB.expire(withNamespace(namespace, key), TTL[DEFAULT_TTL]);
    }
}

// Example usage in an API route
// import { getCache, setCache } from "@/lib/redisCache";

// export default async function handler(req, res) {
//     const cacheKey = "some-key";
//     const cached = await getCache(cacheKey);
//     if (cached) {
//         res.status(200).json(JSON.parse(cached));
//         return;
//     }
//     // ...fetch data...
//     await setCache(cacheKey, JSON.stringify(data));
//     res.status(200).json(data);
// }
