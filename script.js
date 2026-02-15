// PWA: register service worker for better mobile experience
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

/* Stars background, mobile nav, fake form submit, support bot, and 3D tilt animation. */
(() => {
  // ----- Stars canvas -----
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  let stars = [];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const count = Math.floor((w * h) / 14000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 0.02 + 0.003
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // stars
    for (const s of stars) {
      s.a += s.tw;
      if (s.a > 0.95 || s.a < 0.12) s.tw *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();

  // ----- Mobile nav -----
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");

  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // ----- Contact form (demo) -----
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    note.textContent = `Thanks ${name || "there"}! Your message has been queued (demo).`;
    form.reset();
    setTimeout(() => (note.textContent = ""), 4200);
  });

  // ----- Chat widget (demo bot) -----
  const launcher = document.getElementById("chatLauncher");
  const widget = document.getElementById("chatWidget");
  const closeBtn = document.getElementById("chatClose");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");

  const openChat = () => {
    widget.classList.add("is-open");
    widget.setAttribute("aria-hidden", "false");
    setTimeout(() => chatInput?.focus(), 50);
  };
  const closeChat = () => {
    widget.classList.remove("is-open");
    widget.setAttribute("aria-hidden", "true");
  };

  const addMsg = (who, text) => {
    const wrap = document.createElement("div");
    wrap.className = `chatMsg chatMsg--${who}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const botReply = (userText) => {
    const t = userText.toLowerCase();
    if (t.includes("price") || t.includes("cost") || t.includes("quote")) {
      return "Sure — tell me a bit about your project scope and timeline, and I can help you prepare a quote.";
    }
    if (t.includes("cloud") || t.includes("devops")) {
      return "We can help with cloud migration, CI/CD, and infrastructure automation. What stack are you using today?";
    }
    if (t.includes("ai") || t.includes("chatbot") || t.includes("automation")) {
      return "Nice — we build chatbots, analytics, and automation workflows. Are you targeting customer support or internal operations?";
    }
    if (t.includes("hello") || t.includes("hi")) {
      return "Hi! What are you looking to build — an app, a platform, or an AI workflow?";
    }
    return "Got it. Share a little more detail and I'll point you to the right service and next steps.";
  };

  const toggleFromKeyboard = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openChat();
    }
  };

  launcher?.addEventListener("click", openChat);
  launcher?.addEventListener("keydown", toggleFromKeyboard);
  closeBtn?.addEventListener("click", closeChat);

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (chatInput.value || "").trim();
    if (!text) return;
    addMsg("user", text);
    chatInput.value = "";
    setTimeout(() => addMsg("bot", botReply(text)), 450);
  });

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) closeChat();
  });

  // Service card clicks (tiny delight)
  document.querySelectorAll(".serviceCard").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.querySelector("h3")?.textContent?.trim() || "Service";
      addToast(`${title} selected`);
    });
  });

  // Toast
  let toastTimer = null;
  function addToast(text){
    let el = document.getElementById("toast");
    if(!el){
      el = document.createElement("div");
      el.id = "toast";
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "90px";
      el.style.transform = "translateX(-50%)";
      el.style.padding = "10px 12px";
      el.style.borderRadius = "14px";
      el.style.background = "rgba(10,12,40,.60)";
      el.style.border = "1px solid rgba(255,255,255,.14)";
      el.style.backdropFilter = "blur(14px)";
      el.style.color = "rgba(255,255,255,.88)";
      el.style.fontWeight = "750";
      el.style.fontSize = "13px";
      el.style.boxShadow = "0 18px 60px rgba(0,0,0,.55)";
      el.style.zIndex = "80";
      el.style.opacity = "0";
      el.style.transition = "opacity .18s ease, transform .18s ease";
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = "1";
    el.style.transform = "translateX(-50%) translateY(-4px)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(6px)";
    }, 1600);
  }

  // ----- 3D tilt on migration card -----
  const card = document.getElementById("tiltCard");
  if(card){
    const media = card.querySelector(".migration__media");
    const pills = Array.from(card.querySelectorAll(".pill"));

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function onMove(e){
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;  // 0..1

      const rotY = clamp((x - 0.5) * 18, -12, 12);
      const rotX = clamp((0.5 - y) * 16, -10, 10);

      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      // subtle parallax for inner elements
      media && (media.style.transform = `translateZ(16px) scale(1.01) translateX(${(x-0.5)*6}px) translateY(${(y-0.5)*6}px)`);

      pills.forEach((p, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        p.style.transform = `translate3d(${(x-0.5)*10*sign}px, ${(y-0.5)*10*-sign}px, 34px)`;
      });
    }

    function reset(){
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
      media && (media.style.transform = "translateZ(14px)");
      pills.forEach(p => (p.style.transform = "translate3d(0,0,30px)"));
    }

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);

    // touch: gentle auto-tilt
    let t = 0;
    function auto(){
      if(window.matchMedia("(hover: none)").matches){
        t += 0.012;
        const rotY = Math.sin(t) * 6;
        const rotX = Math.cos(t * 0.9) * 5;
        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
      requestAnimationFrame(auto);
    }
    auto();
  }
})();


  // ----- Web-to-Mobile Builder (demo) -----
  const stepTabs = Array.from(document.querySelectorAll(".stepTab"));
  const panes = Array.from(document.querySelectorAll(".stepPane"));
  const urlInput = document.getElementById("builderUrl");
  const iframe = document.getElementById("sitePreview");
  const overlay = document.getElementById("previewOverlay");
  const note = document.getElementById("iframeNote");
  const featCount = document.getElementById("featCount");
  const pkgNameEl = document.getElementById("pkgName");
  const statusEl = document.getElementById("buildStatus");
  const prog = document.getElementById("buildProgress");
  const btnPreview = document.getElementById("btnPreview");
  const btnNext1 = document.getElementById("btnNext1");
  const btnNext2 = document.getElementById("btnNext2");
  const btnBack2 = document.getElementById("btnBack2");
  const btnBack3 = document.getElementById("btnBack3");
  const btnBuild = document.getElementById("btnBuild");
  const btnDownloadCfg = document.getElementById("btnDownloadConfig");
  const btnDownloadApk = document.getElementById("btnDownloadApk");

  function setStep(n){
    stepTabs.forEach(t => t.classList.toggle("is-active", t.dataset.step === String(n)));
    panes.forEach(p => p.classList.toggle("is-active", p.dataset.step === String(n)));
  }
  stepTabs.forEach(t => t.addEventListener("click", () => setStep(t.dataset.step)));

  function normalizeUrl(u){
    const s = (u || "").trim();
    if(!s) return "";
    if(/^https?:\/\//i.test(s)) return s;
    return "https://" + s;
  }

  function selectedFeatures(){
    return Array.from(document.querySelectorAll('.checkItem input[type="checkbox"]:checked')).map(i => i.value);
  }

  function refreshFeatureCount(){
    const n = selectedFeatures().length;
    if(featCount) featCount.textContent = `${n} selected`;
  }
  document.querySelectorAll('.checkItem input[type="checkbox"]').forEach(i => i.addEventListener("change", refreshFeatureCount));
  refreshFeatureCount();

  function preview(){
    const u = normalizeUrl(urlInput?.value);
    if(!u){
      if(note) note.textContent = "Please enter a valid URL.";
      return;
    }
    if(note) note.textContent = "Loading preview…";
    if(overlay) overlay.style.display = "none";
    if(iframe) iframe.src = u;

    setTimeout(() => {
      try{
        // Access may throw if blocked
        iframe?.contentWindow?.location?.href;
        if(note) note.textContent = "Preview loaded. If it stays blank, the site may block embedding.";
      }catch(e){
        if(overlay) overlay.style.display = "grid";
        if(note) note.textContent = "Preview blocked by the website (X-Frame-Options). Use Open URL to test in your browser.";
      }
    }, 800);
  }

  btnPreview?.addEventListener("click", preview);
  btnNext1?.addEventListener("click", () => { preview(); setStep(2); });
  btnBack2?.addEventListener("click", () => setStep(1));
  btnNext2?.addEventListener("click", () => setStep(3));
  btnBack3?.addEventListener("click", () => setStep(2));

  function makePackageName(u){
    try{
      const host = new URL(u).hostname.replace(/^www\./,'').toLowerCase();
      const parts = host.split('.').filter(Boolean);
      const core = parts.slice(0, -1).join('.') || parts[0] || "startup";
      const safe = core.replace(/[^a-z0-9.]/g,'');
      return `com.psg.${safe.replace(/\.+/g,'.')}.app`;
    }catch{
      return "com.psg.startup.app";
    }
  }

  let lastBuildConfig = null;

  function downloadText(filename, data, mime="application/octet-stream"){
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);

    // Mobile Chrome can be picky; dispatch a real click event
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));

    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 1500);
  }

  btnBuild?.addEventListener("click", async () => {
    const u = normalizeUrl(urlInput?.value);
    if(!u){
      if(note) note.textContent = "Please enter a URL first.";
      setStep(1);
      return;
    }

    const feats = selectedFeatures();
    const pkg = makePackageName(u);
    if(pkgNameEl) pkgNameEl.textContent = pkg;

    if(statusEl) statusEl.textContent = "Building (demo)…";
    if(btnBuild) btnBuild.disabled = true;
    if(btnDownloadCfg) btnDownloadCfg.disabled = true;
    if(btnDownloadApk) btnDownloadApk.disabled = true;

    if(prog) prog.style.width = "0%";
    for(let i=1;i<=10;i++){
      await new Promise(r => setTimeout(r, 180));
      if(prog) prog.style.width = `${i*10}%`;
    }

    const buildId = Math.random().toString(16).slice(2,10);
    lastBuildConfig = {
      buildId,
      createdAt: new Date().toISOString(),
      url: u,
      packageName: pkg,
      features: feats,
      notes: "Demo config generated from landing page builder. For a real signed APK/AAB, PSG will run CI/CD and deliver artifacts."
    };

    if(statusEl) statusEl.textContent = "Build ready (demo)";
    if(btnBuild) btnBuild.disabled = false;
    if(btnDownloadCfg) btnDownloadCfg.disabled = false;
    if(btnDownloadApk) btnDownloadApk.disabled = false;

    if(typeof addToast === "function") addToast("Build ready (demo)");
  });

  btnDownloadCfg?.addEventListener("click", () => {
    if(!lastBuildConfig){
      if(typeof addToast === "function") addToast("Build first");
      return;
    }
    downloadText("psg-web2mobile-config.json", JSON.stringify(lastBuildConfig, null, 2), "application/json");
  });

  btnDownloadApk?.addEventListener("click", () => {
    if(!lastBuildConfig){
      if(typeof addToast === "function") addToast("Build first");
      return;
    }
    const apkNote = `PSG DEMO APK (PLACEHOLDER)\n\nBuild ID: ${lastBuildConfig.buildId}\nURL: ${lastBuildConfig.url}\nPackage: ${lastBuildConfig.packageName}\nFeatures: ${lastBuildConfig.features.join(", ")}\n\nThis file is a placeholder created by the website demo.\nFor a real signed APK/AAB, contact PSG at +91 8266 7922 or gangadharpola9182@gmail.com.`;
    downloadText("psg-demo.apk", apkNote, "application/vnd.android.package-archive");
  });


  // Extra: open preview URL in new tab (recommended when X-Frame-Options blocks iframe preview)
  const btnOpenUrl = document.getElementById("btnOpenUrl");
  btnOpenUrl?.addEventListener("click", () => {
    const u = normalizeUrl(urlInput?.value);
    if(!u){
      if(note) note.textContent = "Please enter a URL first.";
      return;
    }
    window.open(u, "_blank", "noopener,noreferrer");
    if(typeof addToast === "function") addToast("Opened URL in new tab");
  });



  // ----- Real build + automatic download (SWA backend) -----
  let currentBuildId = null;
  const realStatus = document.getElementById("realBuildStatus");

  async function triggerRealBuild(cfg){
    const r = await fetch("/api/trigger-build", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(cfg) });
    if(!r.ok) throw new Error(await r.text());
    return await r.json();
  }

  async function pollBuild(buildId){
    const r = await fetch(`/api/build-status?buildId=${encodeURIComponent(buildId)}`);
    if(!r.ok) throw new Error(await r.text());
    return await r.json();
  }

  // Hook Build button: trigger backend
  btnBuild?.addEventListener("click", async () => {
    const u = normalizeUrl(urlInput?.value);
    if(!u){ if(note) note.textContent = "Please enter a URL first."; setStep(1); return; }

    const feats = selectedFeatures();
    const pkg = makePackageName(u);
    if(pkgNameEl) pkgNameEl.textContent = pkg;

    lastBuildConfig = { createdAt: new Date().toISOString(), url: u, packageName: pkg, appName: "PSG Web2Mobile", features: feats };

    btnBuild.disabled = true;
    btnDownloadCfg.disabled = true;
    btnDownloadApk.disabled = true;
    if(statusEl) statusEl.textContent = "Triggering CI…";
    if(realStatus) realStatus.textContent = "";

    try{
      const resp = await triggerRealBuild(lastBuildConfig);
      currentBuildId = resp.buildId;
      if(realStatus) realStatus.textContent = `Build started • ID: ${currentBuildId}`;

      // poll until done or download available
      for(let i=0;i<60;i++){
        await new Promise(r => setTimeout(r, 2000));
        const st = await pollBuild(currentBuildId);
        if(st.apkUrl){
          if(statusEl) statusEl.textContent = "Build complete • Download ready";
          if(realStatus) realStatus.textContent = "Build complete • Download ready";
          btnDownloadCfg.disabled = false;
          btnDownloadApk.disabled = false;
          return;
        }
        if(st.runUrl && realStatus) realStatus.textContent = `Building… • Run: ${st.runUrl}`;
        if(st.status === "completed"){
          if(statusEl) statusEl.textContent = `Build completed • ${st.conclusion || "unknown"}`;
          btnDownloadCfg.disabled = false;
          return;
        }
      }
      if(realStatus) realStatus.textContent = "Still building… please retry shortly.";
    }catch(e){
      if(statusEl) statusEl.textContent = "Build trigger failed";
      if(realStatus) realStatus.textContent = String(e);
      btnDownloadCfg.disabled = false;
    } finally {
      btnBuild.disabled = false;
    }
  }, { once: true });

  // Download real APK automatically (from SAS link)
  btnDownloadApk?.addEventListener("click", async () => {
    if(!currentBuildId){ alert("Build not started yet."); return; }
    try{
      const st = await pollBuild(currentBuildId);
      if(st.apkUrl){
        window.location.href = st.apkUrl;
        if(typeof addToast === "function") addToast("Downloading APK…");
        return;
      }
      alert("APK not ready yet. Please wait.");
    }catch(e){
      alert("Could not get download link: " + String(e));
    }
  });
