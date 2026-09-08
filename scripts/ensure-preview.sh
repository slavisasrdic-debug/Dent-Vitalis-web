#!/usr/bin/env bash
# Idempotent Codespaces startup; only the approved development port is public.
set -euo pipefail

preview_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd -- "$preview_root"
preview_state="$preview_root/.astro/preview"
mkdir -p -- "$preview_state"

fail() {
  printf '[preview] ERROR: %s\n' "$*" >&2
  exit 1
}

for preview_tool in node npm curl ss flock timeout; do
  command -v "$preview_tool" >/dev/null || fail "Missing $preview_tool. Use the project dev container."
done

# postStart, postAttach and manual recovery may overlap. The kernel releases this
# lock on exit/restart; detached children must not inherit file descriptor 9.
exec 9>"$preview_state/start.lock"
flock -w 120 9 || fail 'Another preview startup is still running; see .astro/preview/ logs.'

node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 24 ? 0 : 1)' \
  || fail 'Node.js 24+ is required.'
[[ -f node_modules/astro/package.json ]] || fail 'Dependencies are missing. Run npm ci, then npm run preview:ensure.'

listening() {
  [[ -n "$(ss -H -ltn "sport = :$1")" ]]
}

dentvitalis_ready() {
  local preview_status
  preview_status="$(curl --silent --show-error --max-time 8 \
    --output "$preview_state/health.html" --write-out '%{http_code}' \
    "$1" 2>"$preview_state/health-error.log")" || return 1
  [[ "$preview_status" == 200 ]] \
    && grep -qi '<title>DentVitalis' "$preview_state/health.html" \
    && grep -q 'noindex, nofollow' "$preview_state/health.html"
}

if ! listening 4321; then
  printf '[preview] Starting Astro on 0.0.0.0:4321…\n'
  nohup npm run dev -- --host 0.0.0.0 --port 4321 \
    </dev/null >>"$preview_state/astro.log" 2>&1 9>&- &
else
  printf '[preview] Port 4321 already has a listener; checking it without starting another server.\n'
fi

preview_ready=false
for ((preview_attempt = 0; preview_attempt < 20; preview_attempt++)); do
  if dentvitalis_ready 'http://127.0.0.1:4321/'; then
    preview_ready=true
    break
  fi
  sleep 1
done
[[ "$preview_ready" == true ]] \
  || fail 'Port 4321 is not serving the DentVitalis noindex homepage. No process was killed and no alternate port was started. Check .astro/preview/astro.log and health-error.log.'
ss -H -ltn 'sport = :4321' | grep -Eq '0\.0\.0\.0:4321|\*:4321|\[::\]:4321' \
  || fail 'DentVitalis is only bound to loopback. Restart its server on 0.0.0.0:4321; this script will not kill an existing process.'
printf '[preview] Local DentVitalis HTTP 200: http://localhost:4321/\n'

if [[ "${CODESPACES:-}" != true || -z "${CODESPACE_NAME:-}" ]]; then
  printf '[preview] Outside Codespaces: public forwarding skipped.\n'
  exit 0
fi

for preview_tool in gh jq; do
  command -v "$preview_tool" >/dev/null || fail "Missing $preview_tool; local preview works, but public forwarding cannot be verified."
done

read_ports() {
  timeout 15s gh codespace ports -c "$CODESPACE_NAME" \
    --json sourcePort,visibility,browseUrl \
    >"$preview_state/ports.json" 2>"$preview_state/ports-error.log"
}

port_registered() {
  jq -e 'any(.[]; .sourcePort == 4321)' "$preview_state/ports.json" >/dev/null
}

read_ports || fail 'Cannot list Codespaces ports; check gh authentication and .astro/preview/ports-error.log. Local preview remains running.'

if ! port_registered; then
  # The IDE may not yet be attached. A detached CLI forward registers the remote
  # port in that case. Its local helper port is never marked public.
  listening 14321 && fail 'Forwarding helper port 14321 is occupied but 4321 is not registered. Inspect the existing forward; no process was replaced.'
  printf '[preview] Registering Codespaces port 4321…\n'
  nohup gh codespace ports forward 4321:14321 -c "$CODESPACE_NAME" \
    </dev/null >>"$preview_state/forward.log" 2>&1 9>&- &
  preview_forward_pid=$!
  for ((preview_attempt = 0; preview_attempt < 10; preview_attempt++)); do
    if read_ports && port_registered; then
      break
    fi
    kill -0 "$preview_forward_pid" 2>/dev/null \
      || fail 'The forwarding process exited. See .astro/preview/forward.log.'
    sleep 2
  done
  port_registered || fail 'Port registration timed out. See .astro/preview/forward.log.'
fi

# Explicit user approval in AGENTS.md applies to 4321 only. Never change global
# port visibility, other Codespaces, production hosting or DNS.
if ! jq -e 'any(.[]; .sourcePort == 4321 and .visibility == "public")' "$preview_state/ports.json" >/dev/null; then
  timeout 20s gh codespace ports visibility 4321:public -c "$CODESPACE_NAME" \
    >"$preview_state/visibility.log" 2>&1 \
    || fail 'Could not make 4321 public. Check GitHub permissions/policy and .astro/preview/visibility.log.'
fi
read_ports || fail 'Cannot verify port visibility. See .astro/preview/ports-error.log.'
jq -e 'any(.[]; .sourcePort == 4321 and .visibility == "public")' "$preview_state/ports.json" >/dev/null \
  || fail 'Codespaces did not report port 4321 as public.'

preview_url="$(jq -r '.[] | select(.sourcePort == 4321) | .browseUrl' "$preview_state/ports.json")"
[[ "$preview_url" == "https://$CODESPACE_NAME-4321.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}" ]] \
  || fail 'Codespaces returned an unexpected preview URL; refusing to report it as healthy.'
for ((preview_attempt = 0; preview_attempt < 10; preview_attempt++)); do
  if dentvitalis_ready "$preview_url/"; then
    printf '[preview] Public DentVitalis HTTP 200: %s/\n' "$preview_url"
    exit 0
  fi
  sleep 2
done
fail 'Public port exists but the external URL is not serving the DentVitalis noindex homepage. See .astro/preview/health-error.log; no successful preview was assumed.'
