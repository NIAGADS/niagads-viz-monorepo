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
- **KeyDB** - memory cache

## Next.js Local Environment

Copy `sample.env.local` to `.env.local`

```cp sample.env.local .env.local```

and edit as necessary for your environment:

- **NEXT_PUBLIC_HOST_URL**: the "public" url on the host (in development, that is likely `http://localhost:3000`)
- **INTERNAL_CACHE_DB_URL**: the url for the KeyDB datastore (in development, that is likely `http://localhost:6379`)
- **INTERNAL_BACKEND_SERVICE_URL**: the url for the backend service (in development, that is likely `http://localhost:8005`)
- **CACHEDB_TTL**: time to life for caching; see `cache.ts` for allowable values

There is likely no need to change the following:

- **NEXT_PUBLIC_API_URL**: for generating links to calls to fetch additional data from the public API
- **NEXT_PUBLIC_ISSUE_TRACKER**: for informative error messages

## Docker Deployment

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

To deploy the docker container, run the following

```docker compose up -d genomicsdb-client-cachedb```

