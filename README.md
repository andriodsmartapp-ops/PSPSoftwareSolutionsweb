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


## Web App to Mobile (demo builder)
The page includes a **Web-to-Mobile** demo wizard that:
- captures a customer URL
- selects feature checkboxes
- generates a build request JSON
- provides a placeholder APK download

For a real signed Android **APK/AAB**, connect it to a build pipeline (Capacitor/Cordova/Flutter wrapper, or native).
This demo is mainly for requirement capture and preview.

## Contact
- Phone: +91 8266 7922
- Email: gangadharpola9182@gmail.com


## Android build pipeline (REAL APK/AAB) — Capacitor + GitHub Actions
The website builder collects a config. To generate a **real installable** APK/AAB you must build and sign it.

### 1) Generate a build config
Use the Web-to-Mobile builder on the site → **Build** → **Download Config**.

### 2) Run locally (Android Studio)
From `psg-website/android-build`:
```bash
npm run init -- build-config.json
# then open android/ in Android Studio and build Release, or:
npm run build:apk
npm run build:aab
```

### 3) CI build (GitHub Actions)
Workflow: `.github/workflows/android-build.yml` (workflow_dispatch)

You must add these repo secrets (Settings → Secrets and variables → Actions):
- `ANDROID_KEYSTORE_BASE64` (base64 of your `.jks`/`.keystore`)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Trigger the workflow manually and paste the config JSON into the input.

### About iframe preview limitations
Some websites send `X-Frame-Options` or `CSP frame-ancestors` headers that **block iframes**.  
When blocked, use **Open URL** to test in your normal browser.

### About installing APK on mobile
You can only install a **real signed APK** built via the pipeline above. The “demo APK” on the landing page is not a real Android package.


## Fully automatic “Download Real APK”
This project supports **automatic APK download** after CI build by uploading artifacts to **Azure Blob Storage** and returning a
short-lived **SAS URL** via `/api/build-status`.

### Create Azure Storage containers
Create these containers (private is recommended):
- `apk-artifacts`
- `apk-results`

### GitHub Secrets (CI upload)
Add:
- `AZURE_STORAGE_CONNECTION_STRING`

### Azure Static Web App Configuration (API generates SAS)
Set:
- `AZURE_STORAGE_CONNECTION_STRING`
- `APK_ARTIFACTS_CONTAINER=apk-artifacts`
- `APK_RESULTS_CONTAINER=apk-results`

Then your website will show **Download Real APK** and it will download the signed release APK automatically.
