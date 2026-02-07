import { getLoadedTracks, loadTracks, removeTrackById } from "./utils/browser";

import IGVBrowser from "./IGVBrowser";
import IGVBrowserWithSelector from "./IGVBrowserWithSelector";
import TrackSelectorTable from "./TrackSelectorTable";
import { VariantReferenceTrack } from "./config/_constants";
import { findTrackConfigs } from "./utils/track_config";
import { handleUpdateBrowserTracks } from "./utils/selector_actions";

export type { IGVBrowserProps } from "./IGVBrowser";
export type { IGVBrowserWithSelectorProps } from "./IGVBrowserWithSelector";
export type { RowSelectionState, TableProps } from "./TrackSelectorTable";
export type { IGVBrowserTrack, IGVBrowserQueryParams } from "./types/data_models";
export {
    IGVBrowser,
    VariantReferenceTrack,
    IGVBrowserWithSelector,
    getLoadedTracks,
    findTrackConfigs,
    handleUpdateBrowserTracks,
    loadTracks,
    removeTrackById,
    TrackSelectorTable,
};
