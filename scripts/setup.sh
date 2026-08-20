#!/usr/bin/env bash
#
# One-command setup: prepares .env with a real JWT secret and brings the stack
# up. Safe to re-run — it never overwrites an existing .env without asking.
#
#   ./scripts/setup.sh              # production-shaped, everything on :80
#   ./scripts/setup.sh dev          # development, ports published individually
#   ./scripts/setup.sh hub          # prebuilt images from Docker Hub
#   ./scripts/setup.sh --reset      # drop the database volume and reseed
#
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

MODE="nginx"
RESET=false

for arg in "$@"; do
  case "$arg" in
    dev|development)   MODE="dev" ;;
    hub|prebuilt)      MODE="hub" ;;
    nginx|prod|production) MODE="nginx" ;;
    --reset)           RESET=true ;;
    -h|--help)
      sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      echo "Unknown argument: $arg (try --help)" >&2
      exit 1 ;;
  esac
done

case "$MODE" in
  dev)   COMPOSE_FILE="docker-compose.yml"       ; URL="http://localhost:4000" ;;
  hub)   COMPOSE_FILE="docker-compose.hub.yml"   ; URL="http://localhost" ;;
  nginx) COMPOSE_FILE="docker-compose.nginx.yml" ; URL="http://localhost" ;;
esac

info()  { printf '\033[0;34m==>\033[0m %s\n' "$1"; }
ok()    { printf '\033[0;32m  ok\033[0m %s\n' "$1"; }
warn()  { printf '\033[0;33m  !!\033[0m %s\n' "$1"; }
fail()  { printf '\033[0;31m  xx\033[0m %s\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- prerequisites
info "Checking prerequisites"

command -v docker >/dev/null 2>&1 || fail "docker is not installed — https://docs.docker.com/get-started/"
docker compose version >/dev/null 2>&1 || fail "docker compose v2 is required (you may have the old docker-compose)"
docker info >/dev/null 2>&1 || fail "the Docker daemon is not running"
ok "docker $(docker version --format '{{.Server.Version}}') with compose v2"

# openssl is the nicest way to get a key; fall back to /dev/urandom.
generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 48 | tr -d '\n'
  else
    head -c 48 /dev/urandom | base64 | tr -d '\n'
  fi
}

# ------------------------------------------------------------------------- .env
info "Preparing .env"

PLACEHOLDER="your-jwt-secret-key"

if [ ! -f .env ]; then
  cp .env.example .env
  ok "created .env from .env.example"
fi

CURRENT_SECRET="$(grep -E '^SECRET=' .env | head -1 | cut -d= -f2- || true)"

if [ -z "$CURRENT_SECRET" ] || [ "$CURRENT_SECRET" = "$PLACEHOLDER" ] || [ ${#CURRENT_SECRET} -lt 32 ]; then
  SECRET="$(generate_secret)"
  # The secret contains / and +, so use a delimiter that cannot appear in base64.
  if grep -qE '^SECRET=' .env; then
    sed -i.bak "s|^SECRET=.*|SECRET=${SECRET}|" .env && rm -f .env.bak
  else
    printf 'SECRET=%s\n' "$SECRET" >> .env
  fi
  ok "generated a JWT signing key"
else
  ok "existing JWT signing key kept"
fi

warn "The MongoDB credentials in .env are public demo values. Change them before"
warn "putting this anywhere real — see SECURITY.md."

# ------------------------------------------------------------------------- reset
if [ "$RESET" = true ]; then
  info "Dropping the database volume"
  docker compose -f "$COMPOSE_FILE" down -v --remove-orphans >/dev/null 2>&1 || true
  ok "volume removed; the seed script will run again on the next start"
fi

# -------------------------------------------------------------------------- up
info "Starting the stack ($COMPOSE_FILE)"
echo

if [ "$MODE" = "hub" ]; then
  docker compose -f "$COMPOSE_FILE" up -d
else
  docker compose -f "$COMPOSE_FILE" up -d --build
fi

# ---------------------------------------------------------------------- health
echo
info "Waiting for containers to report healthy"

DEADLINE=$(( SECONDS + 180 ))
while [ $SECONDS -lt $DEADLINE ]; do
  # Any container still starting means we keep waiting.
  UNHEALTHY="$(docker compose -f "$COMPOSE_FILE" ps --format '{{.Name}} {{.Status}}' \
    | grep -Ev 'healthy' || true)"
  [ -z "$UNHEALTHY" ] && break
  sleep 3
done

docker compose -f "$COMPOSE_FILE" ps --format '  {{.Name}}\t{{.Status}}'

if [ -n "${UNHEALTHY:-}" ]; then
  echo
  warn "Not everything reached healthy within 180s."
  warn "Check the logs:  docker compose -f $COMPOSE_FILE logs"
  warn "Common causes are listed in docs/troubleshooting.md"
  exit 1
fi

# ------------------------------------------------------------------------ done
cat <<SUMMARY

  Ready.  $URL

  Log in with     nitin27may@gmail.com / P@ssword#321
  API docs        http://localhost:3000/api-docs   (development mode only)

  Stop            docker compose -f $COMPOSE_FILE down
  Reseed          ./scripts/setup.sh $MODE --reset
  Logs            docker compose -f $COMPOSE_FILE logs -f

SUMMARY
