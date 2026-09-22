FROM nginx:1.31-alpine

# This config replaces the whole nginx.conf, not a server block in conf.d.
COPY nginx.conf /etc/nginx/nginx.conf

# Run as the image's unprivileged nginx user. That means binding 8080 rather
# than 80 (ports below 1024 need a capability), so compose and the Kubernetes
# service publish 80 -> 8080.
RUN touch /tmp/nginx.pid \
    && chown -R nginx:nginx /tmp/nginx.pid /var/cache/nginx

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
