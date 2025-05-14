// adapted from: https://makerkit.dev/blog/tutorials/nextjs-redis
import Redis, { RedisOptions } from 'ioredis';

function getCacheConfig(): {
    port: number;
    host: string;
    //password: Maybe<string>;
} {
    const url = new URL(process.env.API_CACHEDB_URL as string)
    return { port: parseInt(url.port), host: url.hostname}
}

export function getCache(
    config = getCacheConfig()
) {
    try {
        const options: RedisOptions = {
            host: config.host,
            lazyConnect: true,
            showFriendlyErrorStack: true,
            enableAutoPipelining: true,
            maxRetriesPerRequest: 0,
            retryStrategy: (times: number) => {
                if (times > 3) {
                    throw new Error(`[Redis] Could not connect after ${times} attempts`);
                }

                return Math.min(times * 200, 1000);
            },
        };

        if (config.port) {
            options.port = config.port;
        }

        const cache = new Redis(options);

        cache.on('error', (error: unknown) => {
            console.warn('[KeyDB] Error connecting', error);
        });

        return cache;
    } catch (e) {
        throw new Error(`[KeyDB] Could not create a Redis instance`);
    }
}

export async function getJsonValueFromCache(key: string, cacheNamespace: string | null=null) {
    const cache = getCache();
    const cacheKey = (cacheNamespace) ? `${cacheNamespace}:${key}` : key
    const storedValue = await cache.get(cacheKey);
    if (storedValue) {
        return JSON.parse(storedValue as string)
    }
    else {
        return null //throw Error(`Unable to retrieve record for ${key}. Either the queryId in the URL is incorrect or it is likely that the time-to-live (1 hr) has expired.` )
    }
}