# syntax=docker/dockerfile:1

FROM node:20.18.0-bullseye-slim as builder

ARG GIT_DEPENDENCIES

RUN if [ ${GIT_DEPENDENCIES} = 1 ]; then apt-get update && apt-get install -y git; fi

WORKDIR /src

# node modules installed in parent directory;
# see https://github.com/Kartikdot/TS-Node-Docker-Starter/tree/main
COPY package.json ./
RUN npm install  && npm cache clean --force
# --legacy-peer-deps --loglevel verbose --force && npm cache clean --force
ENV PATH=/src/node_modules/.bin:$PATH

# this is separated to take advantage of caching unless package.json / package-lock.json changes
# need to copy everything into docker to build and then can do a multi-stage docker build
WORKDIR /src
COPY . .
COPY .env.local .
COPY .env .

FROM node:20.18.0-bullseye-slim AS runner

ARG BUILD

WORKDIR /app
COPY --from=builder /src/node_modules node_modules

ENV BUILD_ENV=${BUILD}
EXPOSE 3000
CMD npm run ${BUILD_ENV}
