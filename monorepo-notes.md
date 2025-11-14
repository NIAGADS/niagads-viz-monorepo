# Notes for developing the monorepo

## package.json

### LocusZoom

- locuszoom

### IGVBrowser

- requires ambient_types
- lodash.get, lodash.merge, lodash.noop, lodash.find (& @types for each)
- igv: `https://github.com/NIAGADS/igv.js.git#NIAGADS`

#### TODO - igv-microservice

- broke when IGV Browser implemented moved to @niagads/igv -- needs to be revisited, but is not essential

### Gosling

- react 18 (unsure about 19 support)
- higlass
- gosling.js
- pixi.js

### Table

- export-from-json (also referenced in common/types, but probably should just be moved to Table)
- @tanstack/react-table

### Charting

- highcharts? TBD

## Considerations

## next.js 'client' components

- should we put in `"use client"` directive or should we assume that anyone doing next-js development will wrap the component? will the directive be problematic for rollup/eslinting outside of next-js? seems OK in the storybook
- may need to remove from components (e.g., table, igvbrowser) reimported from niagads-api-client

## Tasks / Issues to create (notes for EGA)

## IGVBRowser

- `FEATURE_INFO_BASE_URL` will need to be set as IGVBrowser component property and passed into the browser config so that it can be accessed by the track parsers and renderers
- ditto for `FEATURE_SEARCH_ENDPOINT`
- `url` and `indexURL` for `Ensembl Gene track` need to be updated; maybe put GenomicsDB raw file in FILER?
- review functions exported in each file
- there are some serious issues w/the IGVBrowser component now that development branch was merged in. Review and clean up
- search for `FIXME` notes
