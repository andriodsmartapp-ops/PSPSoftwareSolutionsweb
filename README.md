# PSG Software Solutions — Landing Page (Static)

Enhancements added:
- **Migration image included** in the center panel (`assets/migration.png`)
- **3D tilt / parallax** on the migration panel (move mouse over it)
- **4 floating icon pills** (Push Notifications, GPS & Maps, Easy Backlinks, SEO Optimization) with motion animations
- Overall UI polish (better cards, glows, separators)

## Run locally
Open `index.html` in your browser.

Recommended (local server):
- Python: `python -m http.server 8000`
- Visit: http://localhost:8000

## Replace the migration image
Swap `assets/migration.png` with your own image (keep the same filename), or update the path in `index.html`.

## Customize animations
- Floating pills: `@keyframes pillFloat*` in `styles.css`
- 3D tilt: tilt logic in `script.js` (`// 3D tilt on migration card`)
