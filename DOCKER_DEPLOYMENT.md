# Docker Deployment Guide

## Overview

This repository uses a shared multi-stage Dockerfile and Docker Compose configuration to build and run its Next.js applications. Deployment mode is controlled by the `BUILD` value in the Compose environment file.

Each service image is built from its own application context. The Dockerfile selects the appropriate build and runner stages for the requested mode.

## Deployment modes

- `production` builds with the versions of `@niagads/*` packages declared in `package.json` and runs in the production Node environment.

- `staging` builds with canary versions of `@niagads/*` packages when available and runs in the production Node environment.

- `development` builds with canary versions of `@niagads/*` packages when available and runs in the development Node environment.

## Environment configuration and secrets

Configuration is separated by lifecycle:

| File | Purpose |
| --- | --- |
| `.env` | Compose-level deployment settings, including ports, log location, group ID, and `BUILD` |
| `build.env` | Application values needed during image creation, copied into image as `.env.local` |
| `runtime.env` | Values supplied when the container starts, including credentials and other secrets |

Create deployment configuration by copying the sample files; do not rename or modify the sample files:

```sh
cp sample.docker.env .env
cp apps/<application>/sample.build.env apps/<application>/.env.local
cp apps/<application>/sample.runtime.env apps/<application>/runtime.env
```

Never commit populated deployment configuration or secrets to this repository. Sample `runtime.env` configurations (placeholders only), including database credentials, Cognito configuration, and related settings, are maintained in the private [NIAGADS/oa-web-env-template](https://github.com/NIAGADS/oa-web-env-template) Docker repository.

For automated staging and production builds, the content of `runtime.env` is left blank during image generation. The populated runtime file is supplied only when the pre-built application image is deployed with `docker run --env-file`.  For local, non-automated docker-deployments, if users do not have access to the private repository, comments in the application's `sample.env.local` file indicate runtime-values that should be copied into `runtime.env`.

## Compose deployment

Set the copied configuration values and ensure the host log directory exists with the required group write permissions.

Build one service image:

```sh
docker compose build <service>
```

Start the service after its image has been built:

```sh
docker compose up -d <service>
```

The Compose build target is derived from the deployment mode. Development selects the development runner; staging and production select production-style runners.

## Deploying a pre-built image

Pre-built images can be run directly on a deployment host. Supply the runtime configuration, host log volume, network, webmaster group id, and published port at container creation time:

```sh
docker run -d \
  --name <application>-client \
  --restart unless-stopped \
  --network oa-network \
  -p <host-port>:3000 \
  --group-add <webmaster-gid>
  --env-file <secure-path>/runtime.env \
  -v <host-log-directory>:/var/log/app \
  <image>:<tag>
```

Use the image tag appropriate to the intended mode. `runtime.env` must be secured on the deployment host and must not be incorporated into the image. Use separate container names and host ports where environments coexist on one host. The default container naming convention is `<application>-client`.

If `oa-network` does not already exist, create it before running the container:

```sh
docker network create oa-network
```

## Logging

Application output is written to `/var/log/app/<application>.log` in the container. Mount `/var/log/app` to a host-managed log directory and manage retention and rotation on the host.

The container runs as the unprivileged `node` user. The mounted log directory must be writable by that user through the configured group (webmaster) membership.
