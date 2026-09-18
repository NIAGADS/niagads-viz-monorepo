FROM node:24.15-bookworm-slim AS builder

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

COPY . .
COPY --from=scripts use-canary.mjs /tmp/use-canary.mjs

# 1. Tell Git to downgrade SSH requests back to HTTPS
# 2. install npm 12.0.2
# 3. substitute canary versions for @niagads packages as needed for staging 
#    or development builds (depends on BUILD_ENV value)
# 4. if not development, run production next build

RUN npm install -g npm@12.0.2 \
    && node /tmp/use-canary.mjs \
    && npm install --package-lock=false

CMD ["bash"]

FROM builder AS breakpoint

RUN if [ "$BUILD" != "development" ]; then npm run build-app && npm prune --omit=dev; fi


FROM node:24.15-bookworm-slim AS runner

ARG BUILD=production
ARG APP_NAME

WORKDIR /app

ENV LOG_FILE="/var/log/${APP_NAME}.log"
ENV BUILD_ENV=$BUILD

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

USER node

# run next dev if development, next start if 
CMD sh -c 'if [ "$BUILD_ENV" = "development" ]; then exec npm run start-dev-app; else exec npm run start-app; fi'
# CMD ["sh", "-c", "if [ \"$BUILD_ENV\" = \"development\" ]; then export NODE_ENV=development; exec npm run start-dev-app; else export NODE_ENV=production; exec npm run start-app; fi"]


