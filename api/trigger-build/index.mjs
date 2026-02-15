export default async function (context, req) {
  try {
    const cfg = req.body;
    if (!cfg || !cfg.url) {
      context.res = { status: 400, body: { error: "Missing url in config" } };
      return;
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    const workflow = process.env.GITHUB_WORKFLOW_FILE || "android-build.yml";
    const ref = process.env.GITHUB_REF || "main";

    if (!owner || !repo || !token) {
      context.res = { status: 500, body: { error: "Missing GitHub env vars (GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN)" } };
      return;
    }

    const buildId = (globalThis.crypto?.randomUUID?.() || (Date.now() + "-" + Math.random().toString(16).slice(2)))
      .replace(/[^a-z0-9-]/gi, "");

    const payload = { ...cfg, buildId };

    const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`;
    const res = await fetch(dispatchUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ref, inputs: { config_json: JSON.stringify(payload) } })
    });

    if (!res.ok) {
      const t = await res.text();
      context.res = { status: 502, body: { error: "GitHub dispatch failed", details: t } };
      return;
    }

    context.res = { status: 200, body: { ok: true, buildId, message: "Build triggered" } };
  } catch (e) {
    context.res = { status: 500, body: { error: String(e) } };
  }
}