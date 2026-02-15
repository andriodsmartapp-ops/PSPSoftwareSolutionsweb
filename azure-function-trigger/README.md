# Azure Function (optional): Trigger GitHub Android build

This function receives the `psg-web2mobile-config.json` and triggers the GitHub Actions workflow `Build Android (Capacitor)`.

## Required env vars (Function App Configuration)
- `GITHUB_TOKEN` (Fine-grained or classic token with repo workflow dispatch permissions)
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_WORKFLOW_FILE` (default: `android-build.yml`)
- `GITHUB_REF` (default: `main`)

## Endpoint
POST `/api/trigger-build`
Body: JSON build config (same shape as the config downloaded from the website).
