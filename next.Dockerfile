# this Dockerfile uses conditional targets to build production, development, and staging deployments

FROM node:24.15-bookworm-slim AS build-tools

ARG BUILD=production

WORKDIR /app

ENV NPM_CONFIG_ALLOW_GIT=all
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_ENV=$BUILD 

# 1. force update the OS packages to pull down newest security patches to 
#    migitgate legacy CVEs since last image build
# 2. install git & ca-certificates for HTTPS (for git-based npm installs) 

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* 

RUN npm install -g npm@12.0.2

FROM build-tools AS base-builder

ARG APP_DIR

COPY apps/${APP_DIR}/ .
COPY --from=scripts use-canary.mjs /tmp/use-canary.mjs

# 1. Tell Git to downgrade SSH requests back to HTTPS
# 2. substitute canary versions for @niagads packages for staging builds

RUN node /tmp/use-canary.mjs \
    && npm install --package-lock=false

FROM build-tools AS dev-builder

ARG APP_DIR

COPY . .

RUN npm install --package-lock=false \
    && npm run build

COPY apps/${APP_DIR}/dev.build.env.local apps/${APP_DIR}/.env.local

# source files required to build source tree for next dev
# no production build is required

FROM base-builder AS prod-builder

ARG APP_DIR

COPY apps/${APP_DIR}/prod.build.env.local .env.local

RUN npm run build-app \
    && npm prune --omit=dev

FROM node:24.15-bookworm-slim AS base-runner

# 1. force update the OS packages to pull down newest security patches to 
#    migitgate legacy CVEs since last image build
RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

ARG APP_NAME
ENV LOG_FILE="/var/log/app/${APP_NAME}.log"
WORKDIR /app


FROM base-runner AS dev-runner

ARG APP_DIR

# need full code base to build dev source trees
COPY --from=dev-builder --chown=node:node /app ./

WORKDIR /app/apps/${APP_DIR}

EXPOSE 3000 

USER node

CMD sh -c 'exec npm run start-dev-app >> "$LOG_FILE" 2>&1'

FROM base-runner AS prod-runner

# only need compiled app
COPY --from=prod-builder /app/node_modules ./node_modules
COPY --from=prod-builder /app/.next ./.next
COPY --from=prod-builder /app/public ./public
COPY --from=prod-builder /app/package.json ./package.json
COPY --from=prod-builder --chown=node:node /app/.env.local ./.

EXPOSE 3000

USER node

CMD sh -c 'exec npm run start-app >> "$LOG_FILE" 2>&1'

FROM prod-runner AS staging-runner
