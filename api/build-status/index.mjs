import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from "@azure/storage-blob";

function parseConnString(cs) {
  const parts = Object.fromEntries(cs.split(";").filter(Boolean).map(kv => {
    const [k, ...rest] = kv.split("=");
    return [k, rest.join("=")];
  }));
  return { accountName: parts.AccountName, accountKey: parts.AccountKey };
}

function sasUrl(accountName, accountKey, containerName, blobName, hours = 24) {
  const sharedKey = new StorageSharedKeyCredential(accountName, accountKey);
  const expiresOn = new Date(Date.now() + hours * 60 * 60 * 1000);
  const sas = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"),
    expiresOn
  }, sharedKey).toString();
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(blobName)}?${sas}`;
}

export default async function (context, req) {
  try {
    const buildId = (req.query?.buildId || "").trim();
    if (!buildId) {
      context.res = { status: 400, body: { error: "Missing buildId" } };
      return;
    }

    // If Azure Storage configured, prefer returning direct download links
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const resultsContainer = process.env.APK_RESULTS_CONTAINER || "apk-results";
    const artifactsContainer = process.env.APK_ARTIFACTS_CONTAINER || "apk-artifacts";

    if (conn) {
      const blobService = BlobServiceClient.fromConnectionString(conn);
      const results = blobService.getContainerClient(resultsContainer);
      const resultBlob = results.getBlobClient(`${buildId}.json`);
      if (await resultBlob.exists()) {
        const dl = await resultBlob.download();
        const txt = await new Response(dl.readableStreamBody).text();
        const result = JSON.parse(txt);

        const { accountName, accountKey } = parseConnString(conn);
        const apkBlob = result.apkBlob || `${buildId}/app-release.apk`;
        const aabBlob = result.aabBlob || `${buildId}/app-release.aab`;

        context.res = {
          status: 200,
          body: {
            ok: true,
            status: "completed",
            conclusion: "success",
            buildId,
            apkUrl: sasUrl(accountName, accountKey, artifactsContainer, apkBlob, 24),
            aabUrl: sasUrl(accountName, accountKey, artifactsContainer, aabBlob, 24),
            message: "Signed artifacts ready (links valid ~24h)."
          }
        };
        return;
      }
    }

    // Fallback: GitHub run status
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    const workflow = process.env.GITHUB_WORKFLOW_FILE || "android-build.yml";

    if (!owner || !repo || !token) {
      context.res = { status: 200, body: { ok: true, status: "queued", message: "Waiting for build (configure GitHub + Azure vars for automatic downloads)." } };
      return;
    }

    const listUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?per_page=10`;
    const r = await fetch(listUrl, { headers: { "Authorization": `Bearer ${token}`, "Accept": "application/vnd.github+json" } });
    const data = await r.json();
    const latest = (data.workflow_runs || [])[0];
    if (!latest) {
      context.res = { status: 200, body: { ok: true, status: "queued" } };
      return;
    }
    context.res = { status: 200, body: { ok: true, status: latest.status, conclusion: latest.conclusion, runUrl: latest.html_url } };
  } catch (e) {
    context.res = { status: 500, body: { error: String(e) } };
  }
}