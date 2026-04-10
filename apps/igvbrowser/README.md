# NIAGADS IGV Genome Browser

> **Note**: this application is not yet production ready; README is out of date

A stand-alone genome browser application for NIAGADS, based on IGV. This app provides the complete functionality of the IGV browser, customized for integration with NIAGADS services and NIAGADS hosted data, including variants and annotations from the Alzhemier's Disease Sequencing Project (ADSP):

## Reference Tracks

* Reference annotated ADSP variant track
* Ensembl Gene reference track

## Custom Track displays

* xQTL track (for QTL data in hipFG-normalized BED file formats)
* GWAS summary statistics (**NOTE** currently requires input from a web-service; file-data adapte underdevelopment).  Please reach out to us on the NIAGADS IGV Browser [issue tracker](https://github.com/NIAGADS/igvbrowser-microservice/issues) if you are interested in utilizing this track type in your own stand-a-lone application.

## Getting Help

If you have questions, encounter issues, or would like to request new features, please open an issue on the official [NIAGADS IGV Browser issue tracker](https://github.com/NIAGADS/igvbrowser-microservice/issues). Our team monitors this tracker and will respond as promptly as possible.

## Production Docker Build

> **NOTE**: Production Docker Build is not yet available.

### 1. Checkout the IGV Browser Code

```bash
git clone --filter=blob:none --sparse https://github.com/NIAGADS/niagads-viz-monorepo.git
cd niagads-viz-monorepo
git sparse-checkout set apps/igvbrowser
```

### 2.Configure the application

#### Docker ENV

Copy `docker.env.sample` to `docker.env` and edit as needed:

```bash
cp docker.env.sample docker.env
```

* `PORT`: Port to expose the app (default: 3000)
* `APPLICATION_DIR`: Full path to the project directory containing the application code

> **Note:** The applciation code lives on the host to minimize the size of the container.  This also allows hot-reloads, when updates are pulled from the repo (as long as the update does not involve updating third-party dependencies).

Copy `custom/browser.config.sample` to `custom/browser.config` and edit as needed:

##### Application ENV

```bash
cp custom/browser.config.sample custom/browser.config
```

Public facing environment:

* `NEXT_PUBLIC_BASE_URL`: Base URL for the browser (default: <http://localhost:3000>)
* `NEXT_PUBLIC_NAME`: Display name for the browser
* `NEXT_PUBLIC_DESCRIPTION`: Description or link
* `NEXT_PUBLIC_LOGO`: Path or URL to logo
* `NEXT_PUBLIC_HOME`: Home page URL

Browser Configuration:

* `INCL_TRACK_SELECTOR`: Show track selector (TRUE/FALSE).  Defaults to TRUE.
* `INCL_VARIANT_REFERENCE`: Include the variant reference track (TRUE/FALSE). Defaults to TRUE.
* `HIDE_NAVIGATION`: Hide the browser navigation controls (TRUE/FALSE). Defaults to FALSE.
* `INITIAL_LOCUS`: Initial locus or gene to display.  Defaults to ABCA7.
* `TRACK_CONFIG`: file name or URL target for track configuration (maybe a .json file or an API endpoint that serves configuration JSON)

### Docker Configuration

To build and run the NIAGADS IGV Genome Browser application:

```bash
docker compose up build -d
```

Adjust the port and environment variables as needed for your deployment.

For more details, see the [IGVBrowser Microservice documentation](https://github.com/NIAGADS/igvbrowser-microservice).

## For Developers

Follow instructions in the main project README for [initializing the monorepo](../../README.md#initialize-your-workspace) and [building the package dependencies](../../README.md#building-packages).

To deploy, without linking hot reloads to the `packages` (e.g. `@niagads/ui`, `@niagads/table` etc), you can just deploy as a standard next.js app in the application director (`/apps/igvbrowser`) by doing the following

Copy the `browser.config.sample` to `.env.local` and configure for your application.

```bash
cp custom/browser.config.sample ../.env.local
```

See [Application ENV](#application-env) section for details on configuration options. A locally hosted track-configuration file is `test-track-config.json` is available in the `public` directory.  By default the application will look for a locally hosted file there, with the name determined by the `TRACK_CONFIG` environmental setting.

```bash
cd apps/igvbrowser
npm run dev
```

To link hot reloads to the `packages`, first make sure you are in the project (mono-repo) root, and then run:

```bash
npm run genomicsdb
```

There is troubleshooting information for `nx` in the mono-repo README.

Follow instructions from main project README for [building](../../README.md#igvbrowser)
