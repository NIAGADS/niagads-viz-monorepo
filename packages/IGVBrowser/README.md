# NIAGADS React IGV Browser

Embedabble react component wrapping an [_igv.js_](https://github.com/igvteam/igv.js/) genome browser customized by the National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site ([NIAGADS](https://www.niagads.org)). This package provides the complete functionality of the IGV browser, customized for integration with NIAGADS services and NIAGADS hosted data, including variants and annotations from the Alzhemier's Disease Sequencing Project ([ADSP](https://adsp.niagads.org)).

## Installation

```bash
npm install @niagads/igvbrowser
```

## Usage

### React Components

The package provides two React components.

#### IGVBrowser

Embeddable React component that renders an interactive _igv.js_ genome browser. Includes custom tracks, reference tracks, navigation, and browser event callbacks. Use for standalone genome visualization.
  
#### IGVBrowserWithSelector

React component combining IGVBrowser with a track selector table. Lets users browse and add/remove tracks interactively. Use for applications needing dynamic track selection alongside genome visualization.

#### Component Props

Both components take the following (optional) properties.

| Name            | Description                                                                                                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| genome          | Genome assembly ID. Example: `GRCh38` (GRCh38 with Ensembl Gene Reference), `GRCh38_refseq` (GRCh38 with RefSeq Gene Reference). **Default**: `GRCh38`                                                                                                             |
| searchUrl       | URL for feature search (gene or SNP lookup). Configured by default to use an NIAGADS API endpoint. See _igv.js_ [browser configuration](https://igv.org/doc/igvjs/#Browser-Creation/#search-object-details) documentation to bypass and provide your own endpoint. |
| trackConfig     | Array of [track configurations](#generating-track-configurations). Optional if loading from files.                                                                                                                                                                 |
| referenceTracks | Reference tracks; often set to be non-removable in their track configuration. Array of IDs or config objects. Default: [ADSP Variant Reference](#predefined-tracks).                                                                                               |
| defaultTracks   | Tracks enabled by default. Can be provided as array of either track configurations or unique track ids (if a `trackConfig` is also specified).                                                                                                                     |
| files           | Object with `urls` (array of file URLs) and a flag, `indexed`, indicating if the files have a paired index file (assumes tabix: `.tbi`).                                                                                                                           |
| locus           | Initial locus to display. Gene symbol, refSnpID, or coordinates (e.g., `ABCA7` or `chr1:100000-200000`). **Default**: `ABCA7`                                                                                                                                      |
| hideNavigation  | If true, hides the browser navigation UI.                                                                                                                                                                                                                          |
| onBrowserLoad   | Callback function called that returns the browser instance after it loads.                                                                                                                                                                                         |
| onTrackRemoved  | Callback function called that returns the ID of a track when it is removed.                                                                                                                                                                                        |
| onLocusChanged  | Callback function called that returns the new locus when the visible region changes.                                                                                                                                                                               |
| selectorTable   | **`IGVBrowserWithSelector` component only**; custom track selector table definition following specification of a `@niagads/table` Table object                                                                                                                     |

## Adding and Configuring Track Displays

The following properties allow you to control which tracks are displayed on the genome browser. If none of these are provided the browser will render with only the reference genome and reference gene tracks.  

`referenceTracks`
`defaultTracks`
`trackConfig`
`files`

### File (URL) Support

To display tracks without generating track configurations, you can use the `files` option to provide an array of file URLs.  The genome browser will display any file type supported by _igv.js_, but will make display assumptions based on the file extension (i.e., `bed` -> basic annotation track).

Example Usage:

```tsx
import { IGVBrowser } from "@niagads/igvbrowser";

<IGVBrowser files={{
  urls: [
    "https://mysite.org/Amygdala_eQTL_GTEx_signif_SNP.bed.gz"
  ],
  indexed: true
}}/>;
```

### Track Configurations

#### Supported Track Types

This browser supports all track types natively supported by _igv.js_. For supported track types and instructions on configuring tracks, see the _igv.js_ [documentation](https://igv.org/doc/igvjs/#tracks/Tracks/).

This implementation also supports the following custom tracks:

##### GWAS Summary Statistics

> Currently depends on custom-service endpoints; please reach out to us on our [IGV Browser issue tracker](https://github.com/NIAGADS/igvbrowser-microservice/issues) if interested.  A file-based reader is under development.

##### QTL Summary Statistics

For displaying [hipFG](https://bitbucket.org/wanglab-upenn/hipFG) standardized xQTL track data.

Track configuration should follow the guidelines in the IGV documentation for `qtl` tracks, with the following exceptions:

- `autoscale`: `true`
- `format`: `bed6+14`

Our custom QTL tracks support hipFG standardized that are sharded by chromosome.  If the files are shareded, substitute `$CHR` for the chromosome number (not a `chr` prefix, just the number) in the templated file name.

#### Custom Track Configuration Options

##### `infoURL`

Feature metadata including references to genes or variants can be linked out when features are clicked on the browser (e.g., the variant associated with a p-value or the target gene of a eQTL).  To configure the link-outs, specify `infoURL` in your track config.  This can be set to `/record` to link genes or variants automatically to NIAGADS GenomicsDB records.  

To set an alternative target, the browser expects that that the targeted resource will have templated URLS and will tack `/gene/<ensembl_id>` on to gene link outs and `/variant/<variant_id>` (where variant_id = refSNP id or positional identifer - chr:pos:ref:alt) to variant link outs.

#### `metadata`

If you are using the `IGVBrowserWithSelector` component, you can add an additional property to your track configuration called `metadata`.  This should be a set of key-value pairs mapping to additional columns in the track selector table. See the [example track configuration](#example-track-configuration) provided below.

#### Example Track Configuration

Example track QTL track configuration with `metadata` and `infoURL`, for chromosome-shareded files.

```json
  {
        "id": "NGFGXQTL0002",
        "name": "Knight-ADRC-mQTL-PC",
        "url": "https://mysite.org/Knight-ADRC.mQTL.PC.NGFGXQTL0002_v1_$CHR_snp_qsig.SNP_qvalue_significant.20250901.bed.gz",
        "description": "Example ADSP xQTL Track (sharded by chr)",
        "infoURL": "/record",
        "format": "bed6+14",
        "type": "qtl",
        "indexURL": "https://mysite.org/Knight-ADRC.mQTL.PC.NGFGXQTL0002_v1_$CHR_snp_qsig.SNP_qvalue_significant.20250901.bed.gz.tbi",
        "autoscale": true,
        "metadata": {
            "cell_type": "PC",
            "tissue_category": "Brain",
            "data_source": "ADSP FunGen",
            "data_category": "mQTL"
        }
  }
```

## API

- `findTrackConfigs` — Find track config objects by ID
- `getLoadedTracks` — Get currently loaded tracks (except for those that are not removable) from browser instance
- `handleUpdateBrowserTracks` — call back allowing you to trigger the loaded tracks based on user interaction in parent component

### Types

- `IGVBrowserProps` — Props for IGVBrowser
- `IGVBrowserWithSelectorProps` — Props for IGVBrowserWithSelector
- `SelectorTableProps` — Props for selector table (see @niagads/table package for more information)
- `IGVBrowserTrack` — Track config type

### Predefined Tracks

- `VariantReferenceTrack` — ADSP variant reference track config.  Current for [ADSP Release 4](https://dss.niagads.org/datasets/ng00067/) (~36k genomes across 40 chorots).  This is set as the default value for the `referenceTracks` prop.
