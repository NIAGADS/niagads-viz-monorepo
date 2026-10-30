# Contributing to NIAGADS Open Access Client

Internal developer instructions for the `open-access-client` monorepo, including workspace setup, application development, builds, package management, releases, and troubleshooting.

For project and package information, see [README.md](./README.md). For component documentation, see [Storybook](https://niagads.github.io/open-access-client/). For production deployment, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md).

## Prerequisites

### Node

- Node >24.15, <25
- npm 12.0.2

The project is configured to work with [nvm](https://github.com/nvm-sh/nvm).  Once nvm is installed, run `nvm use` in the project root. If the required version of `Node` is not installed, it will give prompt you install the required version.  If it is installed, nvm, will switch to the expected Node version.

> NOTE: `npm` is set to `engine-strict=true` and will raise an `Unsupported Engine` error if the Node or NPM version does not match the engine defined in the root `package.json`.

## Workspace Setup and Development

### Initialize your workspace

The monorepo is managed using [Lerna](https://lerna.js.org/) and [nx](https://nx.dev/nx-api/node)

After cloning (or forking) the repo & checking out your development branch, run the following to install third-part dependencies:

```bash
cd open-access-client
npm install
```

### Building packages

You can build all packages by running the following command:

```bash
npx lerna run build --concurrency 1
```

or in short-hand:

```bash
npm run build
```

> **Note**: The `--concurrency 1` flag is not required, but stops the lerna command from trying to build each package in parallel, avoiding race conditions and build failures when a dependent package builds faster than a dependency. This sort of race condition can occur randomly.

### Run an app

Applications are configured to run under watch conditions so they can be hot-reloaded when dependent code changes.

#### Run Application

see README in the relevant application directory.

### Lerna Package and Application Management

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

## Application Environment Configuration

Applications provide separate environment-file samples for Docker and non-Docker use:

| File | Purpose |
| --- | --- |
| `dev.build.env.local` | Docker build-time configuration for `dev` builds. **Also used by PR actions to test for broken dependencies**. These values are available while the application image is built and may be incorporated into the generated application output. |
| `prod.build.env.local` | Docker build-time configuration for `staging` and `prod` builds. These values are available while the application image is built and may be incorporated into the generated application output. |
| `sample.runtime.env` | Docker runtime configuration, including secrets. This file is supplied when the container is deployed and is not included in the image. |
| `sample.env.local` | Complete configuration for a non-Docker deployment. It combines the build-time and runtime values required by the application and is copied to `.env.local`. |

Use the Docker-specific samples when building and deploying an image. Use `sample.env.local` only when running the application outside Docker.

### Developing with Storybook

While developing, you can use the storybook app to see and test your changes in real time. Production storybook is available on github.io.

The following command will run storybook and automatically build packages as you change them, after following developer's instructions below to initialize your `lerna`/`nx` workspace.

```bash
npm run storybook
```

> **DEVELOPERS NOTE**: to "hide" a story from the published storybook, add the 'dev' tag to your story defintion.  For example:

```javascript
export const MyStory: StoryObj<typeof Component> = {
    args: {
        // story arguments
    },
    render: (args) => <Component {...args} />,
    tags: ["dev"], // hide in production
};
```

## Publishing

Packages are published to the NIAGADS organization. For manual publishing:

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

For subsequent releases, you can run a script to handle all steps required for building and releasing packages.

```bash
./scripts/release.sh
```

Alternatively, you can do the release manually by running each command in that script.

Below is an overview of each step in the script:

- Create and publish (push) a temporary git branch for the release

```bash
git checkout -b release/<mm-dd-yyyy>
git push --set-upstream origin release/<mm-dd-yyyy>
```

- Clean up all old `dist` folders and rebuild the packages using our npm script

```bash
npm run build-fresh
```

- Increment the versions using lerna

```bash
npx lerna version --no-private
```

- Publish the packages

```bash
npx lerna publish from-package
```

#### Manual canary releases

Use [manual-canary-release.sh](./scripts/manual-canary-release.sh) to publish a canary release from the current commit. From the repository root, with npm publishing credentials configured (`npm login`), run:

```bash
bash scripts/manual-canary-release.sh
```

Commit the changes you want to release first; the script uses the committed `HEAD` tree and excludes uncommitted changes. The local `main` branch must exist, and the worktree location required by the release script must be available.

The script creates a temporary commit with `main` as its parent, adds a detached worktree at `.worktrees/oa-api-canary`, installs dependencies with `npm ci`, builds the packages, and publishes with `lerna publish --canary --dist-tag canary`. Published packages use the npm `canary` tag.

## Troubleshooting Lerna/Nx

- "hot-reloads" not reflecting code changes

Sometimes the `watch` fails. Stop or kill the running application and then manually run the `lerna build` command to rebuild all packages.

- nx causing "Daemon is not running" error

Try removing `.nx/workspace-data/d/disabled` (<https://github.com/lerna/lerna/issues/4054#issuecomment-2378029441>)
