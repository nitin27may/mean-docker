# Stage 1: compile TypeScript
FROM node:24-alpine AS builder

WORKDIR /app

# Dependencies are installed from the lockfile on their own layer so a source
# change does not invalidate the install.
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: runtime — production dependencies and compiled output only
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Drop privileges: the node image ships an unprivileged "node" user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const p=process.env.PORT||3000;fetch('http://localhost:'+p+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
