import { getLoadedTracks, handleUpdateBrowserTracks, loadTracks, removeTrackById } from "./utils/browser";

import IGVBrowser from "./IGVBrowser";
import IGVBrowserWithSelector from "./IGVBrowserWithSelector";
import { VariantReferenceTrack } from "./config/_constants";
import { findTrackConfigs } from "./utils/track_config";

export type { IGVBrowserProps } from "./IGVBrowser";
export type { IGVBrowserWithSelectorProps, SelectorTableProps } from "./IGVBrowserWithSelector";
export type { IGVBrowserTrack } from "./types/data_models";
export {
    findTrackConfigs,
    getLoadedTracks,
    handleUpdateBrowserTracks,
    IGVBrowser,
    IGVBrowserWithSelector,
    loadTracks,
    removeTrackById,
    VariantReferenceTrack,
};
