# NIAGADS Open Access Client

Frontend applications, reusable genomic visualization components, UI libraries, and utilities for the [NIAGADS Open Access](https://www.niagads.org/) platform.

This monorepo contains React applications and TypeScript/JavaScript libraries used to explore, visualize, and interpret Alzheimer's disease and related dementias (AD/ADRD) genomic data. Published components can also be incorporated into independent research applications.

> **Development status:** The project is under active development. Published packages are available, but interfaces and APIs may change. Third-party developers should evaluate package stability before adopting them in production.

## Documentation

- **[Component Storybook](https://niagads.github.io/open-access-client/)**: Interactive documentation and examples for UI and visualization components.
- **[NIAGADS Open Access API](https://api.niagads.org/api/openapi)**: API specification and available operations.
- **[Published `@niagads` packages](https://www.npmjs.com/search?q=%40niagads)**: Packages available on npm.

See individual application READMEs for application-specific information.

## Packages

### Published

#### Common

Shared configurations and utility functions used by components and applications.

```bash
npm install @niagads/common
```

#### UI

Reusable UI elements, including buttons, dropdowns, alert boxes, and page layout templates. See [Storybook](https://niagads.github.io/open-access-client/) for examples.

```bash
npm install @niagads/ui
```

#### Table

Interactive table components for displaying and filtering data. See [Storybook](https://niagads.github.io/open-access-client/) for documentation and usage examples.

#### IGVBrowser

Components wrapping a customized [igv.js](https://igv.org/doc/igvjs/) genome browser. Tracks can be loaded from FILER-hosted files or through data adapters querying the NIAGADS Open Access API. Includes customized track selectors and filtering built with `@niagads/table`.

```bash
npm install @niagads/igvbrowser
```

### Under development

#### Gosling

Components wrapping [Gosling](https://gosling-lang.org/) genomic visualizations, using FILER-hosted data or NIAGADS Open Access API adapters.

#### LocusZoom

Components wrapping customized [LocusZoom](https://statgen.github.io/locuszoom/) visualizations for association summary statistics and linkage disequilibrium data retrieved through NIAGADS Open Access API adapters.

## Applications

The monorepo includes complete frontend applications built with its shared components, visualizations, and utilities. See each application's README for additional details.

### niagads-main

The main NIAGADS website and landing page. **Under development.**

### genomicsdb

The Alzheimer's GenomicsDB application for exploring AD/ADRD genomic data, variants, associations, and annotations. **Under development.**

### open-access-api-client

The Open Access API client application, including ASK NIAGADS for natural-language querying of genomic evidence.

### igv-browser

A standalone IGV-based genome browser application. **Under development; currently broken and under revision.**

## Development and Contributing

Internal contributors should see [CONTRIBUTING.md](./CONTRIBUTING.md) for environment setup, local development, builds, Storybook, package management, releases, and troubleshooting.

See [Docker deployment instructions](./DOCKER_DEPLOYMENT.md) for application deployment.

## Related Resources

- [NIAGADS](https://www.niagads.org/)
- [Open Access API](https://api.niagads.org/api/openapi)
- [Open Access Client Storybook](https://niagads.github.io/open-access-client/)
- [NIAGADS npm packages](https://www.npmjs.com/search?q=%40niagads)
- [NIAGADS GitHub organization](https://github.com/NIAGADS)
