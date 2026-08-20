# Stage 1: build the Angular application
FROM node:24-alpine AS builder

# corepack ships with Node and pins pnpm to the version in package.json, so the
# image does not depend on whatever pnpm happens to be latest at build time.
RUN corepack enable

WORKDIR /app

# Dependencies install from the lockfile on their own layer, so a source change
# does not reinstall them. --frozen-lockfile fails rather than silently
# resolving something new, which is what makes the build reproducible.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Which API origin the browser bundle talks to: "/api" behind the nginx load
# balancer, or an absolute URL when the API is published separately.
ARG API_URL="/api"
RUN sed -i "s|apiEndpoint: '[^']*'|apiEndpoint: '$API_URL'|g" src/environments/environment.ts

RUN pnpm run build

# Stage 2: serve the static bundle
FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/contacts/browser /usr/share/nginx/html

# Run as the image's unprivileged nginx user. Port 4000 is above 1024, so no
# capability is needed to bind it.
RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

USER nginx

EXPOSE 4000

# 127.0.0.1, not localhost: nginx listens on IPv4 only here and localhost
# resolves to ::1 first, which would fail against a healthy container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:4000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
