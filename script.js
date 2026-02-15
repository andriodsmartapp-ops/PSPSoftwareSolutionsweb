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
