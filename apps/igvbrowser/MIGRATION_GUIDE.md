# GenomicsDB Service -> NIAGADS OA API Service TODOs

## next.config.js

* set up re-write rule for `/api-proxy` to the live <https://api.niagads.org>
* remove `/service` redirects
* Update `/record` redirects to remove the `/app` path when the new GenomicsDB is released

## IGVBrowser Config

* remove `searchUrl` from `IGVBrowser` component properties to allow use of the default `/api` (`FEATURE_SEARCH_URL` in the component).
