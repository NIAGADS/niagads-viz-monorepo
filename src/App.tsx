import React from "react";

import { MemoIGVBrowser as GenomeBrowser} from "@components/IGVBrowser"
import { FEATURE_SEARCH_ENDPOINT } from "@data/_constants"
import { config } from "../public/examples/_tracks"
import { onLocusChange, onTrackRemoved } from "./utils";

const App = () => {
  return (
    <GenomeBrowser 
    tracks={config} 
    featureSearchUrl={FEATURE_SEARCH_ENDPOINT} 
    genome="hg38"
    onTrackRemoved={onTrackRemoved}
    onLocusChange={onLocusChange}
    />
  )
}

export default App;