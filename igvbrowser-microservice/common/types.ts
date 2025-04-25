export interface Collection {
    route: any;
    name: string;
}

export interface CollectionMetadata {
    name: string;
    description: string;
    num_tracks: string;
}

export type RESPONSE_TYPE = "config" | "selector" | "metadata";