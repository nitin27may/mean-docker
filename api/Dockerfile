# Stage 1: compile TypeScript
FROM node:26-alpine AS builder

# corepack ships with Node and pins pnpm to the version in package.json, so the
# image does not depend on whatever pnpm happens to be latest at build time.
RUN corepack enable

WORKDIR /app

# Dependencies install from the lockfile on their own layer, so a source change
# does not invalidate the install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: runtime — production dependencies and compiled output only
FROM node:26-alpine

RUN corepack enable

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod && pnpm store prune

COPY --from=builder /app/dist ./dist

# Drop privileges: the node image ships an unprivileged "node" user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const p=process.env.PORT||3000;fetch('http://127.0.0.1:'+p+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
