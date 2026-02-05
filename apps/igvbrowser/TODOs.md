# IGV Browser TODOs

* coordinate track deselect in track selector table when removed from browser (currently broken)
* update production docker build
  * challenge: track config copy
  
## URL params

* handle highlights, regions of interest
* catch file errors?

## session management

* very basic: back button/ save session
* advance: download and load session

## Migrate from GenomicsDB Service -> NIAGADS OA API Service (when live)

## next.config.js

* set up re-write rule for `/api-proxy` to the live <https://api.niagads.org>
* remove `/service` redirects
* Update `/record` redirects to remove the `/app` path when the new GenomicsDB is released

## IGVBrowser Config

* remove `searchUrl` from `IGVBrowser` component properties to allow use of the default `/api` (`FEATURE_SEARCH_URL` in the component).
