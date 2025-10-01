# NIAGADS GenomicsDB

A comprehensive genomics data portal for Alzheimer's disease research, built with Next.js and pure CSS.

> NOTE: Not a stand-alone microservice

## Features

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Pure CSS** - Custom design system with CSS variables
- **Lucide React** - Icon library (only external dependency)
- **@niagads/table**
- **@niagads/ui**

## Next.js Local Environment

Copy `sample.env.local` to `.env.local`

```cp sample.env.local .env.local```

and edit as necessary for your environment:

- **NEXT_PUBLIC_HOST_URL**: the "public" url on the host (in development, that is likely `http://localhost:3000`)
- **INTERNAL_CACHE_DB_URL**: the url for the KeyDB datastore (in development, that is likely `http://localhost:6379`) - **deprectate**
- **INTERNAL_BACKEND_SERVICE_URL**: the url for the backend service (in development, that is likely `http://localhost:8005`)
- **CACHEDB_TTL**: time to life for caching; see `cache.ts` for allowable values - **deprecated**

There is likely no need to change the following:

- **NEXT_PUBLIC_API_URL**: for generating links to calls to fetch additional data from the public API
- **NEXT_PUBLIC_ISSUE_TRACKER**: for informative error messages

## Backend Service

The GenomicsDB backend service is an independent application.  If you are a backend developer then follow project instructions to deploy the `genomicsdb-api` service on port `8005` for consistency with the production environment.

If you are a front-end developer, you can tunnel the current production version of the service from the production web server.  Instruction are found on a snippet in the lab slack channel.  If you need a development version of the service, speak with backend developers to arrange.

## Development Deployment

To deploy, without linking hot reloads to the `packages` (e.g. `@niagads/ui`, `@niagads/table` etc), you can just deploy as a standard next.js app in the application director (`/apps/genomicsdb`)

```bash
npm run dev
```

To link hot reloads to the `packages`, first make sure you are in the project (mono-repo) root, and then run:

```bash
npm run genomicsdb
```
There is troubleshooting information for `nx` in the mono-repo README.

## Docker Deployment

**KeyDB Caching has been removed from the project; the Docker deployment has not yet been updated.  Do not USE for now**

> NOTE: temporary **beta** instructions: will change when packages are published and can do a sparse checkout

> NOTE: temporary **beta** instruction: will change when `npm run genomicsdb-build` runs successfuly (when all broken or dead code is removed)

For now: the `docker-compose.yaml`, `genomicsdb.Dockerfile`, and `genomicsdb.docker.env.sample` have been **moved to the root monorepo directory**, so that the Docker container can be deployed despite the broken build

* rename `genomicsdb.docker.env.sample`  to `.env` and follow the instructions as in the [Environment Section](#environment).

### Environment

Rename `docker.env.sample` to `.env`

```cp docker.env.sample .env```

and edit as necessary for your envronment:

- **HOST_KEYDB_PORT**: forward to this port access the `KeyDB` cache via `localhost` on the host machine
- **HOST_CLIENT_PORT**: forward to this port access the client application via `localhost` on the host machine
- **KEYDB_DATA_DIR**: cache data is not stored in the docker container, please provide the full path to the data storage location on the host machine

> Create the parent directories for the KEYDB_DATA_DIR only; Docker will create the target directory.  i.e., if your KEYDB_DATA_DIR is `/data/cache/keydb`, create the `/data/cache` parent directories only.


### Deployment

> NOTE: currently the docker container only deploys the cache database service.  Application service will be added soon.

To deploy the cache, run the following

```docker compose up -d genomicsdb-cachedb```

To deploy the client, run the following:

```docker compose up -d genomicsdb-app```