import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export interface CachePaths {
    directory: string;
    data: string;
    revision: string;
}

interface CacheRevision {
    revision: string;
    dataHash: string;
}

/**
 * Builds fixed data and current-revision filenames for one collection under
 * CACHE_DIR, defaulting to /tmp/next-cache. Hashing the collection keeps user
 * input out of filesystem paths. The revision file stores a small JSON marker
 * containing the upstream revision and a checksum of the saved response.
 */
export const getCachePaths = (collection: string): CachePaths => {
    const directory = path.resolve(process.env.CACHE_DIR || "/tmp/next-cache");
    const key = createHash("sha256").update(collection).digest("hex");
    return {
        directory,
        data: path.join(directory, `publications-${key}.json`),
        revision: path.join(directory, `publications-${key}.current-revision`),
    };
};

const isMissingFile = (error: unknown) => error instanceof Error && "code" in error && error.code === "ENOENT";

/**
 * Reads a cache file as text. Missing files are normal cache misses; other read
 * failures are logged. Both return null so cache problems allow an upstream fetch.
 */
const readCacheFile = async (filename: string): Promise<string | null> => {
    try {
        return await readFile(filename, "utf8");
    } catch (error) {
        // A missing file is an ordinary cache miss; other failures need visibility.
        if (!isMissingFile(error)) console.warn(`Unable to read publications cache file ${filename}:`, error);
        return null;
    }
};

const dataHash = (data: string) => createHash("sha256").update(data).digest("hex");

/**
 * Returns the saved response JSON without parsing the publication rows.
 * With a revision, checks the small marker before reading data, then verifies
 * the checksum to reject mismatched files from interrupted or concurrent writes.
 * Missing, invalid, or mismatched cache entries return null for a rebuild.
 * Without a revision, reads data directly for stale fallback on upstream failure;
 * this intentionally skips revision and checksum validation.
 */
export const readCachedPublications = async (paths: CachePaths, revision?: string): Promise<string | null> => {
    // On upstream failure, the atomically saved data is usable regardless of revision.
    if (revision === undefined) return readCacheFile(paths.data);
    const marker = await readCacheFile(paths.revision);
    if (marker === null) return null;

    let cached: CacheRevision;
    try {
        cached = JSON.parse(marker);
        if (!cached || typeof cached.revision !== "string" || typeof cached.dataHash !== "string") {
            throw new Error("Invalid publications revision marker.");
        }
    } catch (error) {
        console.warn("Unable to parse the publications revision marker:", error);
        return null;
    }
    if (cached.revision !== revision) return null;
    const data = await readCacheFile(paths.data);
    if (data !== null && dataHash(data) !== cached.dataHash) {
        console.warn("Publications cache data and revision marker do not match; rebuilding.");
        return null;
    }
    return data;
};

/**
 * Cleans up a temporary file after a save attempt. A successful rename already
 * removes its temporary source, so missing files are expected; other errors log.
 */
const removeTemporaryFile = async (filename: string): Promise<void> => {
    try {
        await unlink(filename);
    } catch (error) {
        if (!isMissingFile(error)) console.warn(`Unable to remove temporary cache file ${filename}:`, error);
    }
};

/**
 * Saves serialized response data and its revision/checksum marker through unique
 * temporary files, replacing data before the marker. Each rename is atomic, but
 * the pair is not; readers use the checksum to detect an inconsistent pair.
 * Save failures are logged rather than thrown so GET can serve fetched data.
 * Temporary files are cleaned up whether the save succeeds or fails.
 */
export const writeCachedPublications = async (paths: CachePaths, revision: string, data: string): Promise<void> => {
    const suffix = `${randomUUID()}.tmp`;
    const temporaryData = `${paths.data}.${suffix}`;
    const temporaryRevision = `${paths.revision}.${suffix}`;
    try {
        await mkdir(paths.directory, { recursive: true });
        await writeFile(temporaryData, data);
        await writeFile(temporaryRevision, JSON.stringify({ revision, dataHash: dataHash(data) }));
        await rename(temporaryData, paths.data);
        // The checksum lets readers reject mismatched pairs after an interrupted
        // or concurrent write, since two separate renames cannot be atomic together.
        await rename(temporaryRevision, paths.revision);
    } catch (error) {
        console.warn("Unable to save the publications cache; serving fetched data:", error);
    } finally {
        await removeTemporaryFile(temporaryData);
        await removeTemporaryFile(temporaryRevision);
    }
};
