# NIAGADS Visualization Toolkit

React Component Library for NIAGADS Visualizations: including Tanstack React-Tables with GUI-driven filtering and custom adapters for LocusZoom.js that query NIAGADS APIs

> **WARNING: for third-party developers. This toolkit is still under development and not ready or recommended for general usage**

> **NOTE: until `Material-UI` is removed, `npm install` must be run with the `--legacy-peer-deps` option.**

## Developing

While developing, you can use the storybook app to see and test your changes in real time.

The following command will run storybook and automatically build packages as you change them:

```bash
npm run storybook
```

## Managing the monorepo using Lerna

### List all packages

```bash
npx lerna list
```

### Building packages

You can build all packages by running the following command:

```bash
npx lerna run build
```

You can also scope to a specific package using the `--scope` argument

```bash
npx lerna run build --scope=<package>
```

### Running other commands

You can run any npm command for any package using lerna.
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

## Publishing

Right now, packages are published to sam's personal npm repo.
In the future we will set up a niagads npm organization and publish there instead.

* login to npm

```bash
npm login
```
> on WSL2 add `--auth-type=legacy` option

* check login status with `npm whoami`

### Initial release

* in `package.json`
  * manually set version
  * add the following:
 
 ```json
  "publishConfig": {
        "access": "public"
    }
 ```

 * remove `"private":"true" when present

* run the build to generate dist files
* and then use `lerna publish` to make the initial commit 
```bash
npx lerna run build --concurrency 1
npx lerna publish <initial_version>
```

### Subsequent releases

* Create and publish (push) a temporary branch for the release

To publish first increment the versions using lerna

```bash
npx lerna version
```

Then rebuild the packages using lerna

```bash
npx lerna run build
```

Then you can publish the packages

```bash
npx lerna publish
```

### Troubleshooting Lerna/NX

- nx causing "Daemon is not running" error

Try removing `.nx/workspace-data/d/disabled` (<https://github.com/lerna/lerna/issues/4054#issuecomment-2378029441>)
