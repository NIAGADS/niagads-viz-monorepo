export default interface IGVBrowserTrack {
    // required properties from user
    id: string;
    type: string;
    name: string;
    description: string;
    format: string;
    url: string;
    indexURL?: string;
    indexed?: boolean;
    removable?: boolean;
    reader?: any;
    decode?: any;

    infoURL?: string;

    // optional from user for custom rendering
    height?: string;
    visibilityWindow?: number;
    oauthToken?: any;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
    order?: number;
    color?: string; //if a function, don't export 

    queryable?: boolean
}

