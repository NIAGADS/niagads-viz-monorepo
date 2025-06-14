# NIAGADS Front-End Visualization Monorepo

This project **will** contain React component libraries, JavaScript visualization tools, and front-end microservices powering the NIAGADS Alzheimer's Genomics Database and related NIAGADS Open Access resources.

> **WARNING: for third-party developers. This toolkit is still under development and not ready or recommended for general usage**

## Documentation

See project [storybook](https://niagads.github.io/niagads-viz-monorepo/) for documentation and usage examples.

## Packages

Components and Component Libraries.

### Published

#### Common

Common configurations and utility functions used in components and microservices.

```bash
npm i @niagads/common
```

#### UI

Component library of UI elements (e.g., buttons, dropdowns, alert boxes, etc.) and page layout templates. See the project [storybook](https://niagads.github.io/niagads-viz-monorepo/) for documentation.

```bash
npm i @niagads/ui
```

#### Table

Dynamic table component. See project [storybook](https://niagads.github.io/niagads-viz-monorepo/) for documentation and usage examples.

```bash
npm i @niagads/table
```

### Under development

#### Gosling

Components wrapping [gosling.js](https://gosling-lang.org/) genomics visualizations that pull data directly from files hosted on FILER or through data adapters that query the NIAGADS Open Access API.

#### IGVBrowser

Components wrapping a customized [igv.js](igv.js) genome browser that pull data directly from files hosted on FILER or through data adapters that query the NIAGADS Open Access API. Also includes customized track selectors and filtering using the `@niagads/table` component.

#### LocusZoom

Components wrapping a customized [locuszoom.js](https://statgen.github.io/locuszoom/) visualization that retrieve summary statistics data via custom data adapters that retrieve summary statistics and linkage calculated from ADSP samples using NIAGADS Open Access API.

## Applications

More information to be added later.

See the [for developers section](#for-developers) for information on deploying each application in a development environment. Each application is dockerized for production deployment; see application-specific Dockerfile and/or docker-compose.yaml files.

### Storybook

While developing, you can use the storybook app to see and test your changes in real time. Production storybook is available on github.io.

The following command will run storybook and automatically build packages as you change them, after following developer's instructions below to initialize your `lerna`/`nx` workspace.

```bash
npm run storybook
```

### niagads-api-client

### track-collection-microservice

### igvbrowser-microservice

## For Developers

### Initialize your workspace

The monorepo is managed using [Lerna](https://lerna.js.org/) and [nx](https://nx.dev/nx-api/node)

After cloning (or forking) the repo & checking out your development branch, run the following to install third-part dependencies:

```bash
cd niagads-viz-monorepo
npm install
```

### Building packages

You can build all packages by running the following command:

```bash
npx lerna run build --concurrency 1
```

> **Note**: The `--concurrency 1` flag is not required, but stops the lerna command from trying to build each package in parallel, avoiding race conditions and build failures when a dependent package builds faster than a dependency. This sort of race condition can occur randomly.

> **Note**: `npx` should come with `npm` 5.2+, but sometimes it does not get installed if you use `nvm` to manage node versions.  
> If you get a message that `npx` is not found, install globally with the following command: `npm i -g npx`. Depending on your system setup, you may need to use `sudo`.

### Run an app

Applications are configured to run under watch conditions so they can be hot-reloaded when dependent code changes.

#### Run Storybook

To ensure that storybook starts with `nx` watch, please run as follows:

```bash
npm run storybook
```

> **Note:** if you get a message that `nx` is not found, install globally with the following command: `npm i -g nx`. Depending on your system setup, you may need to use `sudo`.

#### Run a microservice

More information coming soon.

### Lerna package and application management

### Running lerna commands

All lerna commands should be run using `npx` as follows:

```bash
npx lerna <cmd> <options>
```

A full list of `lerna` commands is found here: <https://lerna.js.org/docs/api-reference/commands>

You can scope to a specific package using the `--scope` option, e.g.

```bash
npx lerna run build --scope=<package>
```

For example to just build the UI component library:

```bash
npx lerna run build --scope=@niagads/ui
```

Or ignore a package with the `--ignore` option, e.g.,

```bash
npx lerna run build --ignore=@niagads/ui
```

A full list of available options is found here: <https://lerna.js.org/docs/api-reference/commands#options>

### Running other commands

You can run any npm command for any package or application using lerna.
For example if a package called `foo` had a script called `bar` defined in
its package.json, you could run it using the following command:

```bash
npx lerna run bar
```

This will run the command `bar` for all packages that have it defined.
If you want to only run it for the package `foo` you can use the `--scope` argument

```bash
npx lerna run bar --scope=foo
```

### Publishing

Packages are published to the NIAGADS organization. GitHub actions will be added to automate the publication process upon PR approval.  In the meantime, to publish manually:

- login to npm

```bash
npm login
```

> on WSL2 add `--auth-type=legacy` option

- check login status with `npm whoami`

#### Initial release

- in `package.json`
  - manually set version
  - add the following:

```json
 "publishConfig": {
       "access": "public"
   }
```

- remove `"private":"true" when present

- run the build to generate dist files
- and then use `lerna publish` to make the initial commit

```bash
npx lerna run build --concurrency 1
npx lerna publish <initial_version>
```

#### Subsequent releases

- Create and publish (push) a temporary branch for the release

- Edit the `Storybook` `package.json` versions for the `@niagads` packages with new releases to match new versioning and commit. This must be done first, otherwise the old storybook `package.json` will be in the tag.

- Increment the versions using lerna

```bash
npx lerna version
```

- Rebuild the packages using lerna

```bash
npx lerna run build
```

- Publish the packages

```bash
npx lerna publish from-package
```

## Troubleshooting Lerna/NX

- "hot-reloads" not reflecting code changes

Sometimes the `watch` fails. Stop or kill the running application and then manually run the `lerna build` command to rebuild all packages.

- nx causing "Daemon is not running" error

Try removing `.nx/workspace-data/d/disabled` (<https://github.com/lerna/lerna/issues/4054#issuecomment-2378029441>)
