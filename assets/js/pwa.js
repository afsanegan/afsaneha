// PWA registration + Guaranteed First-Visit compact install popup
(function () {
  const SEEN_KEY = "afsaneha_pwa_seen_v2";
  const prefix = (window.__LEGEND__ && window.__LEGEND__.prefix) ? window.__LEGEND__.prefix : "";

  // 1. Register Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(prefix + "sw.js").catch(() => {});
    });
  }

  // 2. Skip if already running as installed standalone app
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    return;
  }

  // 3. Check if user already saw/dismissed the first-visit popup
  let alreadySeen = false;
  try { alreadySeen = localStorage.getItem(SEEN_KEY) === "1"; } catch {}

  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  let deferredPrompt = null;
  let popupShown = false;

  function getLang() {
    try { return localStorage.getItem("afsaneha_lang") || "fa"; } catch { return "fa"; }
  }

  function copyFor(lang) {
    if (lang === "en") {
      return {
        title: "📲 Install Afsaneha App",
        desc: isIos
          ? "Tap Share in Safari's bar, then choose «Add to Home Screen» for offline reading."
          : "Install Afsaneha on your device for instant access and offline reading of Iran's legends.",
        install: "Install App",
        manualHint: "Open browser menu (⋮) and tap «Install app» or «Add to Home screen».",
        later: "Not now",
        close: "Close"
      };
    }
    return {
      title: "📲 نصب اپلیکیشن «افسانه‌ها»",
      desc: isIos
        ? "برای نصب روی آیفون، دکمه Share در نوار مرورگر را بزنید و «Add to Home Screen» را انتخاب کنید."
        : "اپلیکیشن افسانه‌ها را روی گوشی یا سیستم خود نصب کنید تا همیشه و حتی بدون اینترنت به قصه‌ها دسترسی داشته باشید.",
      install: "نصب اپلیکیشن",
      manualHint: "از منوی سه‌نقطه بالای مرورگر (⋮) گزینه «Install app» یا «افزودن به صفحه اصلی» را بزنید.",
      later: "بعداً",
      close: "بستن"
    };
  }

  function ensurePopupElement() {
    let pop = document.getElementById("pwaInstallPop");
    if (!pop) {
      pop = document.createElement("aside");
      pop.id = "pwaInstallPop";
      pop.className = "pwa-pop";
      pop.setAttribute("role", "dialog");
      pop.setAttribute("aria-live", "polite");
      pop.innerHTML =
        '<button type="button" class="pwa-close" id="pwaCloseBtn" aria-label="بستن">✕</button>' +
        '<div class="pwa-head">' +
          '<img class="pwa-icon" src="' + prefix + 'assets/img/logo-amber.png" alt="افسانه‌ها">' +
          '<div class="pwa-info">' +
            '<div class="pwa-title" id="pwaTitle"></div>' +
            '<p class="pwa-desc" id="pwaDesc"></p>' +
          '</div>' +
        '</div>' +
        '<div class="pwa-actions">' +
          '<button type="button" class="btn primary" id="pwaInstallAction"></button>' +
          '<button type="button" class="btn" id="pwaLaterBtn"></button>' +
        '</div>';
      document.body.appendChild(pop);
    }

    const txt = copyFor(getLang());
    const tEl = pop.querySelector("#pwaTitle");
    const dEl = pop.querySelector("#pwaDesc");
    const iBtn = pop.querySelector("#pwaInstallAction");
    const lBtn = pop.querySelector("#pwaLaterBtn");
    const cBtn = pop.querySelector("#pwaCloseBtn");

    if (tEl) tEl.textContent = txt.title;
    if (dEl) dEl.textContent = txt.desc;
    if (lBtn) lBtn.textContent = txt.later;
    if (cBtn) cBtn.setAttribute("aria-label", txt.close);

    if (iBtn) {
      if (isIos) {
        iBtn.style.display = "none";
      } else {
        iBtn.style.display = "";
        iBtn.textContent = txt.install;
      }
    }
    return pop;
  }

  function markSeenAndHide() {
    try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    const pop = document.getElementById("pwaInstallPop");
    if (pop) pop.classList.remove("show");
  }

  function showFirstVisitPopup() {
    if (alreadySeen || popupShown) return;
    popupShown = true;
    window.__AFSAN_PWA_ACTIVE = true;

    const pop = ensurePopupElement();
    requestAnimationFrame(() => pop.classList.add("show"));

    pop.querySelector("#pwaCloseBtn")?.addEventListener("click", markSeenAndHide);
    pop.querySelector("#pwaLaterBtn")?.addEventListener("click", markSeenAndHide);

    pop.querySelector("#pwaInstallAction")?.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch {}
        deferredPrompt = null;
        const headerBtn = document.getElementById("installBtn");
        if (headerBtn) headerBtn.style.display = "none";
        markSeenAndHide();
      } else {
        // Fallback hint if browser blocked native prompt
        const txt = copyFor(getLang());
        const dEl = pop.querySelector("#pwaDesc");
        const iBtn = pop.querySelector("#pwaInstallAction");
        if (dEl) dEl.textContent = txt.manualHint;
        if (iBtn) iBtn.style.display = "none";
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && pop.classList.contains("show")) {
        markSeenAndHide();
      }
    });

    document.getElementById("langBtn")?.addEventListener("click", () => {
      setTimeout(() => ensurePopupElement(), 0);
    });
  }

  // 4. Capture native install prompt when ready
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;

    const headerBtn = document.getElementById("installBtn");
    if (headerBtn) {
      headerBtn.style.display = "inline-flex";
      headerBtn.onclick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch {}
        deferredPrompt = null;
        headerBtn.style.display = "none";
        markSeenAndHide();
      };
    }

    if (!alreadySeen) {
      showFirstVisitPopup();
    }
  });

  // 5. Trigger first-visit popup after 1.5s even if beforeinstallprompt hasn't fired yet
  if (!alreadySeen) {
    const schedule = () => setTimeout(showFirstVisitPopup, 1500);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", schedule);
    } else {
      schedule();
    }
  }

  // 6. Cleanup on successful install
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    const headerBtn = document.getElementById("installBtn");
    if (headerBtn) headerBtn.style.display = "none";
    markSeenAndHide();
  });
})();
