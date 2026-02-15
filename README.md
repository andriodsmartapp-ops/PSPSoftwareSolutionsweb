# PSG Software Solutions — Enterprise Landing (Static)

This build is a polished, enterprise SaaS-style static website:
- Hero CTAs + trust strip
- Migration image with 3D tilt/parallax + floating feature pills
- About Us (structured service blocks) + Mission/Vision cards
- Corporate org chart with animated connectors
- Contact form + support bot demo
- Azure Static Web Apps friendly config (`staticwebapp.config.json`) + `404.html`

## Run locally
Open `index.html` in a browser, or run a local server:

```bash
python -m http.server 8000
```

## Deploy to Azure Static Web Apps (recommended)
1. Push this folder to a GitHub repo (make sure `index.html` is at repo root).
2. In Azure Portal: **Static Web Apps** → **Create**
3. Source: GitHub → pick repo + branch
4. Build details:
   - **App location**: `/`
   - **Output location**: *(leave empty)*
   - **Api location**: *(leave empty)*
5. Create and wait for GitHub Action to finish → open the app URL.

## Deploy to Azure Storage Static Website (manual)
1. Create a **Storage Account**
2. Enable **Static website**
   - Index: `index.html`
   - Error: `404.html`
3. Upload all files to `$web` container (including `assets/` folder).

## Notes
- Replace the migration image at `assets/migration.png`.
- Text and services are in `index.html` under the About section.
