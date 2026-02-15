import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const cfgPath = process.argv[2] || path.join(root, "build-config.json");

if (!fs.existsSync(cfgPath)) {
  console.error("Missing build config:", cfgPath);
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const url = (cfg.url || "").trim();
const appId = (cfg.packageName || "com.psg.startup.app").trim();
const appName = (cfg.appName || "PSG Web2Mobile").trim();

if (!/^https?:\/\//i.test(url)) {
  console.error("Invalid URL in config. Must start with http/https.");
  process.exit(1);
}

// Prepare minimal www that redirects to your URL (Capacitor will load this, then server.url will point to URL)
const wwwDir = path.join(root, "www");
fs.mkdirSync(wwwDir, { recursive: true });
fs.writeFileSync(path.join(wwwDir, "index.html"), `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName}</title>
  <style>body{font-family:system-ui;background:#0b1140;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0} .card{padding:22px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);max-width:560px} a{color:#b7f0ff}</style>
</head>
<body>
  <div class="card">
    <h2 style="margin:0 0 8px;">Launching…</h2>
    <p style="margin:0 0 12px;opacity:.85;">If the app doesn’t load automatically, tap the link below:</p>
    <p style="margin:0;"><a href="${url}">${url}</a></p>
  </div>
</body>
</html>`);

const capCfg = {
  appId,
  appName,
  webDir: "www",
  server: {
    url,                 // IMPORTANT: points the app to your live web app
    cleartext: false,
    androidScheme: "https"
  }
};
fs.writeFileSync(path.join(root, "capacitor.config.json"), JSON.stringify(capCfg, null, 2));

// Install deps + add android if needed
console.log("Installing dependencies…");
execSync("npm install", { stdio: "inherit" });

// Add Android platform (idempotent-ish)
if (!fs.existsSync(path.join(root, "android"))) {
  console.log("Adding Android platform…");
  execSync("npx cap add android", { stdio: "inherit" });
}

console.log("Syncing…");
execSync("npx cap sync android", { stdio: "inherit" });

console.log("Initialized Capacitor project for:", url);
