#!/usr/bin/env bash
set -euo pipefail

# Securely add/update Vercel environment variables without placing secrets in Git.
# Usage: ./scripts/configure-vercel-env.sh [production|preview|development]

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is required. Install it with: npm install --global vercel" >&2
  exit 1
fi

ENVIRONMENT="${1:-}"
if [[ -z "$ENVIRONMENT" ]]; then
  read -r -p "Vercel environment (production, preview, or development): " ENVIRONMENT
fi

case "$ENVIRONMENT" in
  production|preview|development) ;;
  *)
    echo "Invalid environment: $ENVIRONMENT" >&2
    echo "Use production, preview, or development." >&2
    exit 1
    ;;
esac

# These are the names used by the application or reserved for the publishing
# adapters. Values are entered through Vercel's prompt and are never echoed.
VARIABLES=(
  CONVEX_DEPLOY_KEY
  ANTHROPIC_API_KEY
  RESEND_API_KEY
  X_CLIENT_ID
  X_CLIENT_SECRET
  LINKEDIN_CLIENT_ID
  LINKEDIN_CLIENT_SECRET
  META_APP_ID
  META_APP_SECRET
)

echo "Adding variables to Vercel environment: $ENVIRONMENT"
echo "The values are entered into Vercel's secure prompt; do not paste them into chat or commit them."
echo

for name in "${VARIABLES[@]}"; do
  read -r -p "Add $name? [y/N] " answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    vercel env add "$name" "$ENVIRONMENT"
  fi
done

echo
echo "Environment setup complete. Verify names only with: vercel env ls"
