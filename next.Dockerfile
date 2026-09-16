FROM node:24.15-bookworm-slim AS builder

WORKDIR /app

# install git support (for git-based npm installs) 
# and force update the OS packages to pull down newest security patches 
# to migitgate legacy CVEs
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

# bring over .env.local from the app
COPY .env.local .env.local

ENV NPM_CONFIG_ALLOW_GIT=all

RUN npm run next start && next build
RUN npm prune --omit=dev


FROM node:24.15-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
