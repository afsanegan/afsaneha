// Runtime for pre-rendered static story pages (window.__LEGEND__).
import { STR, getLang, setLang, getTheme, setTheme, applyI18n } from "./i18n.js";
import { recordView } from "./views.js";
import { getSeasonPref, applySeason } from "./season.js";

const L = window.__LEGEND__ || { prefix:"", slug:"", hasEn:false, minsFa:1, minsEn:null };
const P = L.prefix || "";

// theme
const root = document.documentElement;
function updateLogo(k){
  const logo = document.querySelector(".brand-logo");
  if(logo) logo.src = P + "assets/img/" + (k === "light" ? "logo-purple.png" : "logo-amber.png");
}
const initTheme = getTheme();
setTheme(initTheme);
updateLogo(initTheme);
document.getElementById("themeBtn")?.addEventListener("click", () => {
  const n = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(n);
  updateLogo(n);
});

// season
try { applySeason(getSeasonPref()); } catch {}

// language & i18n
let lang = getLang();
function toFa(n){ return String(n).replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]); }

function updateShareLinks(){
  const url = location.href;
  const ttlTxt = document.getElementById("ttl")?.textContent || document.title;
  const tg = document.getElementById("tg");
  const wa = document.getElementById("wa");
  if(tg) tg.href = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(ttlTxt);
  if(wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(ttlTxt + " " + url);
}

function applyLang(){
  applyI18n(lang);
  const s = STR[lang] || STR.fa;
  const fa = document.querySelector(".body-fa"), en = document.querySelector(".body-en");
  const ttl = document.getElementById("ttl");
  const isEn = lang === "en" && L.hasEn;

  if(ttl){
    const v = ttl.getAttribute(isEn ? "data-en" : "data-fa");
    if(v) ttl.textContent = v;
  }
  if(fa) fa.style.display = isEn ? "none" : "";
  if(en) en.style.display = isEn ? "" : "none";

  const notice = document.getElementById("noEnNotice");
  if(notice) notice.style.display = (lang === "en" && !L.hasEn) ? "" : "none";

  document.documentElement.lang = isEn ? "en" : "fa";
  document.documentElement.dir = isEn ? "ltr" : "rtl";

  // reading time
  const rt = document.getElementById("readTime");
  const mins = isEn ? (L.minsEn || L.minsFa) : L.minsFa;
  if(rt) rt.textContent = "⏱ " + (isEn ? (mins + " " + s.readingTime) : (toFa(mins) + " " + s.readingTime));

  // exit reading button label
  const exit = document.getElementById("readingExit");
  if(exit) exit.textContent = "✕ " + s.exitReading;

  // lang button
  const lb = document.getElementById("langBtn");
  if(lb) lb.textContent = s.langBtn;

  updateShareLinks();
}

applyLang();
document.getElementById("langBtn")?.addEventListener("click", () => {
  lang = lang === "fa" ? "en" : "fa";
  setLang(lang);
  applyLang();
});

// reading mode
const readBtn = document.getElementById("readBtn");
const exitBtn = document.getElementById("readingExit");
function setReading(on){
  document.body.classList.toggle("reading", on);
  const s = STR[lang] || STR.fa;
  if(exitBtn) exitBtn.textContent = "✕ " + s.exitReading;
}
readBtn?.addEventListener("click", () => setReading(!document.body.classList.contains("reading")));
exitBtn?.addEventListener("click", () => setReading(false));
document.addEventListener("keydown", e => {
  if(e.key === "Escape" && document.body.classList.contains("reading")) setReading(false);
});

// share menu & copy link (with HTTP / WebView fallback)
const share = document.getElementById("share");
const shareBtn = document.getElementById("shareBtn");
const shareMenu = share?.querySelector(".share-menu");
const copyBtn = document.getElementById("copyLink");

async function copyText(text){
  if(navigator.clipboard && window.isSecureContext){
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

shareBtn?.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  updateShareLinks();
  const isOpen = share?.classList.toggle("open");
  shareBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
shareMenu?.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", () => {
  share?.classList.remove("open");
  shareBtn?.setAttribute("aria-expanded", "false");
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape" && share?.classList.contains("open")){
    share.classList.remove("open");
    shareBtn?.setAttribute("aria-expanded", "false");
  }
});

copyBtn?.addEventListener("click", async e => {
  e.stopPropagation();
  const s = STR[lang] || STR.fa;
  const ok = await copyText(location.href);
  if(ok){
    copyBtn.textContent = "✅ " + s.copied;
    setTimeout(() => {
      const cur = STR[lang] || STR.fa;
      copyBtn.innerHTML = '🔗 <span data-i18n="copyLink">' + cur.copyLink + '</span>';
      share?.classList.remove("open");
    }, 1200);
  }
});

// views
try { if(L.slug) recordView(L.slug); } catch {}

// giscus comments
(async () => {
  try {
    const cfg = await (await fetch(P + "config.json")).json();
    const g = cfg.giscus || {};
    if(g.enabled && g.repo && g.repoId){
      const sc = document.createElement("script");
      sc.src = "https://giscus.app/client.js";
      sc.async = true;
      sc.crossOrigin = "anonymous";
      sc.setAttribute("data-repo", g.repo);
      sc.setAttribute("data-repo-id", g.repoId);
      sc.setAttribute("data-category", g.category || "Announcements");
      sc.setAttribute("data-category-id", g.categoryId || "");
      sc.setAttribute("data-mapping", "pathname");
      sc.setAttribute("data-reactions-enabled", "1");
      sc.setAttribute("data-theme", root.getAttribute("data-theme") === "light" ? "light" : "dark_dimmed");
      sc.setAttribute("data-lang", lang === "en" ? "en" : "fa");
      document.getElementById("giscus")?.appendChild(sc);
    } else {
      const c = document.getElementById("comments");
      if(c) c.style.display = "none";
    }
  } catch {
    const c = document.getElementById("comments");
    if(c) c.style.display = "none";
  }
})();

// register service worker
if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register(P + "sw.js").catch(() => {}));
}
