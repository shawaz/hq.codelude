# Vercel environment variables

Use the repository helper to add secrets directly to Vercel without putting them in Git:

```bash
chmod +x scripts/configure-vercel-env.sh
./scripts/configure-vercel-env.sh preview
```

Run it separately for `production` when the preview build has been verified:

```bash
./scripts/configure-vercel-env.sh production
```

The script uses the Vercel CLI's secure prompts. It does not print, write, or commit secret values.

## Variables

| Variable | Used for | Required now? |
|---|---|---:|
| `CONVEX_DEPLOY_KEY` | Convex deployment during Vercel builds | Yes for Preview and Production builds |
| `ANTHROPIC_API_KEY` | Server-side Anthropic features | Only if those features are enabled |
| `RESEND_API_KEY` | Server-side email sending | Only if email sending is enabled |
| `X_CLIENT_ID` | Future X OAuth publishing adapter | Not until X OAuth is implemented |
| `X_CLIENT_SECRET` | Future X OAuth publishing adapter | Not until X OAuth is implemented |
| `LINKEDIN_CLIENT_ID` | Future LinkedIn OAuth publishing adapter | Not until LinkedIn OAuth is implemented |
| `LINKEDIN_CLIENT_SECRET` | Future LinkedIn OAuth publishing adapter | Not until LinkedIn OAuth is implemented |
| `META_APP_ID` | Future Meta/Instagram publishing adapter | Not until Meta OAuth is implemented |
| `META_APP_SECRET` | Future Meta/Instagram publishing adapter | Not until Meta OAuth is implemented |

Never use `NEXT_PUBLIC_` for secrets. Never place API keys in Convex content records, browser code, GitHub, or chat. OAuth access and refresh tokens should be encrypted or managed by the selected provider once the publishing adapters are added.

## Verify safely

This only displays variable names and environments, not values:

```bash
vercel env ls
```
