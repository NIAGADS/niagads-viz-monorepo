FROM node:24.15-bookworm-slim AS builder

ARG APP_ENV=production
ARG APP_NAME

WORKDIR /app

ENV NODE_ENV=$APP_ENV
ENV NPM_CONFIG_ALLOW_GIT=all

# install git support (for git-based npm installs) 
# and force update the OS packages to pull down newest security patches 
# to migitgate legacy CVEs since last image build
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY --from=scripts use-canary.mjs ./tmp/use-canary.mjs

RUN node /tmp/use-canary.mjs && \
    npm install --package-lock=false

COPY .env.local ./

RUN npm run build
RUN npm prune --omit=dev


FROM node:24.15-bookworm-slim AS runner

ARG APP_ENV=production

WORKDIR /app

ENV NODE_ENV=$APP_ENV
ENV LOG_FILE="/var/log/${APP_NAME}.log"

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

USER node

CMD sh -c 'npm start 2>&1 | tee -a "$LOG_FILE"'

# CMD ["sh", "-c", "npm start 2>&1 | tee -a \"$LOG_FILE\""]

