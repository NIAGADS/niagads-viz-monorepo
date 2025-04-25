import { Collection } from "@/common/types";
import { cache } from "react";

export const parseCollectionList = cache((collections: string) => {
    let c: Collection[] = [];
    try {
        c = collections!.split(",").map((pair) => {
            const [route, name] = pair.split(":");
            return { route: route, name: name } as Collection;
        });
    } catch (err) {
        console.error(
            `Error parsing track collections: ${collections}$; 'NEXT_PUBLIC_TRACK_COLLECTIONS' in '.env.local' should be set to a comma separated list of API route:collection_name pairs.`
        );
    } finally {
        return c;
    }
});