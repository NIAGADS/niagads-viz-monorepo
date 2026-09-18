FROM node:24.15-bookworm-slim AS builder

ARG BUILD=production

WORKDIR /app

ENV NODE_ENV=$BUILD
ENV NPM_CONFIG_ALLOW_GIT=all
ENV NEXT_TELEMETRY_DISABLED=1


# 1. force update the OS packages to pull down newest security patches to 
#    migitgate legacy CVEs since last image build
# 2. install git & ca-certificates for HTTPS (for git-based npm installs) 

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* 

COPY . .
COPY --from=scripts use-canary.mjs /tmp/use-canary.mjs

# 1. Tell Git to downgrade SSH requests back to HTTPS
# 2. install npm 12.0.2
# 3. substitute canary versions for @niagads packages as needed for staging 
#    or development builds
# 4. run the build

RUN npm install -g npm@12.0.2
RUN node /tmp/use-canary.mjs 
# && \
RUN npm install --package-lock=false

RUN npm run build-app
RUN npm prune --omit=dev


FROM node:24.15-bookworm-slim AS runner

ARG BUILD=production
ARG APP_NAME

WORKDIR /app

ENV NODE_ENV=$BUILD
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

CMD sh -c 'npm run start-app 2>&1 | tee -a "$LOG_FILE"'

# CMD ["sh", "-c", "npm start 2>&1 | tee -a \"$LOG_FILE\""]

