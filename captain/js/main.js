/* =====================================================================
   CaPtain project page
   ---------------------------------------------------------------------
   LINKS: replace the "#" placeholders below with the real URLs.
   Every element with data-link="<key>" picks up LINKS[<key>].
   Links that are still "#" get a small "soon" badge.
   ===================================================================== */
const LINKS = {
  paper: "assets/paper/CaPtain.pdf",
  code: "https://github.com/waltstephen/CaPtain",
  models: "https://huggingface.co/YijiaFan/CaPtain-4B",
  data: "https://huggingface.co/datasets/YijiaFan/CaPtain-SFT-Data",
  video: "https://youtu.be/KMy-Bx5HXsg",
  harness: "https://github.com/waltstephen/CaPtain-Harness",
  training: "https://github.com/waltstephen/CaPtain",
  model4b: "https://huggingface.co/YijiaFan/CaPtain-4B",
  model4bsft: "https://huggingface.co/YijiaFan/CaPtain-4B-SFT",
  sftdata: "https://huggingface.co/datasets/YijiaFan/CaPtain-SFT-Data"
};
/* ===================================================================== */

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EP = window.CAPTAIN_EPISODES || { libero: [], real: [], transfer: [] };
  const TB = window.CAPTAIN_TABLES || { main: { rows: [] }, boards: [] };

  /* ---------------- links ---------------- */
  $$("[data-link]").forEach((a) => {
    const url = LINKS[a.dataset.link];
    if (url === "") { a.style.display = "none"; return; }
    if (url && url !== "#") { a.href = url; }
    else {
      a.href = "#"; a.classList.add("placeholder"); a.removeAttribute("target");
      a.addEventListener("click", (e) => e.preventDefault());
      a.title = "Link coming soon";
      const go = a.querySelector(".go"); if (go) go.innerHTML = go.textContent.replace("→", "") + ' <span class="soon">soon</span>';
    }
  });
  $$(".oss a.placeholder").forEach((b) => b.classList.remove("placeholder")); // badge shown inside the card instead

  /* ---------------- theme ---------------- */
  $("#themeToggle").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("captain-theme", t); } catch (e) {}
  });

  /* ---------------- top bar + active section ---------------- */
  const topbar = $("#topbar");
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const navLinks = $$(".topnav a").filter((a) => (a.getAttribute("href") || "").startsWith("#"));
  const secIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => { const s = $(a.getAttribute("href")); if (s) secIO.observe(s); });

  /* ---------------- reveal + counters ---------------- */
  const revIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      revIO.unobserve(en.target);
      $$("[data-count]", en.target).forEach(countUp);
      en.target.dispatchEvent(new CustomEvent("revealed"));
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  const observeReveal = (root = document) => $$(".reveal:not(.in)", root).forEach((e) => revIO.observe(e));
  observeReveal();

  function countUp(node) {
    if (node.dataset.done) return; node.dataset.done = 1;
    const to = parseFloat(node.dataset.count), dec = parseInt(node.dataset.dec || "0", 10);
    if (reduceMotion) { node.textContent = to.toFixed(dec); return; }
    const dur = 1000, t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = (to * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else {
        node.textContent = to.toFixed(dec);
        // comic "POW": punch the starburst once the number lands
        const box = node.closest(".num");
        if (box) { box.classList.remove("pow"); void box.offsetWidth; box.classList.add("pow"); }
      }
    };
    requestAnimationFrame(step);
  }

  /* ---------------- tooltip ---------------- */
  const tip = $("#tip");
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-tip]"); if (!t) return;
    tip.textContent = t.dataset.tip; tip.classList.add("show");
    const r = t.getBoundingClientRect();
    const w = Math.min(340, window.innerWidth - 20);
    tip.style.maxWidth = w + "px";
    const x = Math.max(10, Math.min(window.innerWidth - w - 10, r.left + r.width / 2 - 150));
    tip.style.left = x + "px";
    const below = r.top < 120;
    tip.style.top = (below ? r.bottom + 8 : r.top - tip.offsetHeight - 8) + "px";
  });
  document.addEventListener("mouseout", (e) => { if (e.target.closest("[data-tip]")) tip.classList.remove("show"); });
  window.addEventListener("scroll", () => tip.classList.remove("show"), { passive: true });

  /* ---------------- lightbox ---------------- */
  const lb = $("#lightbox");
  function openLightbox(node) { lb.innerHTML = ""; lb.appendChild(node); lb.classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeLightbox() { lb.classList.remove("show"); lb.innerHTML = ""; document.body.style.overflow = ""; }
  lb.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  document.addEventListener("click", (e) => {
    const img = e.target.closest("img.zoomable"); if (!img) return;
    const big = new Image(); big.src = img.currentSrc || img.src; big.alt = img.alt; openLightbox(big);
  });

  /* ---------------- figure tabs ---------------- */
  $$("#figTabs .chip").forEach((b) => b.addEventListener("click", () => {
    $$("#figTabs .chip").forEach((x) => x.classList.toggle("on", x === b));
    $$("#figStack figure").forEach((f) => { f.hidden = f.dataset.fig !== b.dataset.fig; });
  }));

  /* ---------------- BibTeX copy ---------------- */
  $("#copyBib").addEventListener("click", async () => {
    const txt = $("#bibText").textContent, lab = $("#copyBib span");
    try { await navigator.clipboard.writeText(txt); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) {} ta.remove();
    }
    lab.textContent = "Copied!"; setTimeout(() => (lab.textContent = "Copy"), 1600);
  });

  /* =====================================================================
     Python syntax highlighter (tiny, dependency-free)
     ===================================================================== */
  const KW = new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "));
  const BI = new Set("print len range dict list max min abs open float int str round sorted any all zip enumerate isinstance sum tuple set map filter getattr hasattr type repr bool image".split(" "));
  const TOKRE = /(#[^\n]*)|([rRbBfFuU]{0,2}"""[\s\S]*?(?:"""|$)|[rRbBfFuU]{0,2}'''[\s\S]*?(?:'''|$))|([rRbBfFuU]{0,2}"(?:[^"\\\n]|\\.)*(?:"|(?=\n)|$)|[rRbBfFuU]{0,2}'(?:[^'\\\n]|\\.)*(?:'|(?=\n)|$))|(\b\d+\.?\d*(?:[eE][-+]?\d+)?\b|\.\d+(?:[eE][-+]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  function tokenize(code) {
    const out = []; let m, last1 = "", last2 = "";
    TOKRE.lastIndex = 0;
    while ((m = TOKRE.exec(code)) !== null) {
      if (m[0] === "") { TOKRE.lastIndex++; continue; }
      let cls = "";
      if (m[1]) cls = "tok-com";
      else if (m[2] || m[3]) cls = "tok-str";
      else if (m[4]) cls = "tok-num";
      else if (m[5]) {
        const w = m[5], callNext = /^\s*\(/.test(code.slice(TOKRE.lastIndex, TOKRE.lastIndex + 8));
        if (last1 === "." && last2 === "robot") cls = "tok-api";
        else if (w === "True" || w === "False" || w === "None") cls = "tok-num";
        else if (KW.has(w)) cls = "tok-kw";
        else if (w === "robot") cls = "tok-self";
        else if (BI.has(w) && last1 !== ".") cls = "tok-bi";
        else if (callNext) cls = "tok-fn";
      }
      if (!m[6]) { last2 = last1; last1 = m[0]; }
      out.push([cls, m[0]]);
    }
    return out;
  }
  /* render the first n characters of a token list as numbered lines */
  function renderTokens(toks, n, caret) {
    let html = "", left = n === undefined ? Infinity : n, line = "";
    const flush = () => { html += '<span class="ln">' + (line || " ") + "</span>"; line = ""; };
    for (const [cls, text] of toks) {
      if (left <= 0) break;
      const t = text.length > left ? text.slice(0, left) : text; left -= t.length;
      const parts = t.split("\n");
      parts.forEach((p, i) => {
        if (i > 0) flush();
        if (p) line += cls ? '<span class="' + cls + '">' + esc(p) + "</span>" : esc(p);
      });
    }
    if (caret) line += '<span class="caret"></span>';
    flush();
    return html;
  }

  /* =====================================================================
     Media adapters: a <video>, or a virtual clock over still frames
     ===================================================================== */
  function VideoMedia(ep) {
    const v = document.createElement("video");
    v.muted = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.preload = "metadata";
    v.poster = ep.poster; v.src = ep.video;
    return {
      node: v, isVideo: true,
      get duration() { return isFinite(v.duration) && v.duration > 0 ? v.duration : (ep.duration || 1); },
      get currentTime() { return v.currentTime; }, set currentTime(t) { v.currentTime = t; },
      get paused() { return v.paused; },
      play() { const p = v.play(); if (p && p.catch) p.catch(() => {}); }, pause() { v.pause(); },
      on(evt, fn) { v.addEventListener(evt, fn); },
      destroy() { v.pause(); v.removeAttribute("src"); v.load(); }
    };
  }
  function SlideMedia(ep, per = 1.7) {
    const box = el("div"); box.style.cssText = "position:relative;width:100%;height:100%;display:grid;place-items:center";
    const img = el("img", "slide"); img.alt = "Head-camera frame requested by the agent"; img.src = ep.requests[0].frame;
    box.appendChild(img);
    let t = 0, playing = false, last = 0, raf = 0; const L = {};
    const dur = ep.requests.length * per;
    ep.requests.forEach((r) => { const i = new Image(); i.src = r.frame; }); // preload (small jpgs)
    const fire = (e) => (L[e] || []).forEach((f) => f());
    const loop = (now) => {
      if (!playing) return;
      t += (now - last) / 1000; last = now;
      if (t >= dur) { t = dur; playing = false; fire("timeupdate"); fire("pause"); fire("ended"); return; }
      fire("timeupdate"); raf = requestAnimationFrame(loop);
    };
    return {
      node: box, img, isVideo: false, per,
      get duration() { return dur; },
      get currentTime() { return t; }, set currentTime(x) { t = Math.max(0, Math.min(dur - 0.01, x)); fire("timeupdate"); },
      get paused() { return !playing; },
      play() { if (playing) return; if (t >= dur - 0.02) t = 0; playing = true; last = performance.now(); raf = requestAnimationFrame(loop); fire("play"); },
      pause() { playing = false; cancelAnimationFrame(raf); fire("pause"); },
      on(evt, fn) { (L[evt] = L[evt] || []).push(fn); },
      destroy() { playing = false; cancelAnimationFrame(raf); }
    };
  }

  /* =====================================================================
     Episode player with synchronized code panel
     ===================================================================== */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  const ICON_PREV = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>';
  const fmt = (s) => { s = Math.max(0, s); const m = Math.floor(s / 60), r = Math.floor(s % 60); return m + ":" + String(r).padStart(2, "0"); };

  function Player(host, ep, kind) {
    host.innerHTML = "";
    const root = el("div", "player" + (kind === "libero" || kind === "robust" || kind === "transfer" ? " square" : " wide"));
    const mediaCol = el("div", "media"), stage = el("div", "stage");
    const media = kind === "transfer" ? SlideMedia(ep) : VideoMedia(ep);
    stage.appendChild(media.node);
    const badges = el("div", "badge-row");
    const B = (txt, cls) => badges.appendChild(el("span", "badge " + (cls || ""), txt));
    if (kind === "real") { B("Real robot", "hot"); B("XR1 arm"); B("thinking cut · sped up", "gold"); }
    const simX = "motion " + 2 * (ep.speedup || 1) + "× · thinking cut";
    if (kind === "libero") { B(ep.suite, "hot"); B("initial state " + ep.initState); B(simX, "gold"); }
    if (kind === "robust") { B(ep.bench, "hot"); B(ep.pert.split(" · ")[0]); B(simX, "gold"); }
    if (kind === "transfer") { B(ep.bench, "hot"); B("zero-shot"); B("head-camera frames", "gold"); }
    stage.appendChild(badges);
    const flabel = el("div", "frame-label"); if (kind === "transfer") stage.appendChild(flabel);
    mediaCol.appendChild(stage);

    const ctr = el("div", "controls");
    const bPrev = el("button", "ctl-btn ghost", ICON_PREV); bPrev.setAttribute("aria-label", "Previous request");
    const bPlay = el("button", "ctl-btn", ICON_PLAY); bPlay.setAttribute("aria-label", "Play / pause");
    const bNext = el("button", "ctl-btn ghost", ICON_NEXT); bNext.setAttribute("aria-label", "Next request");
    const tl = el("div", "timeline"); tl.innerHTML = '<div class="track"></div><div class="fill"></div>';
    const tread = el("div", "time-read", "0:00");
    ctr.append(bPrev, bPlay, bNext, tl, tread);
    mediaCol.appendChild(ctr);

    const pane = el("div", "codepane");
    const head = el("div", "chead");
    head.innerHTML = '<div class="instr">' + esc(ep.instruction) + '</div><div class="meta">' + esc(metaLine(ep, kind)) + "</div>";
    const reqbar = el("div", "reqbar"), reqnum = el("div", "reqnum"), dots = el("div", "reqdots");
    reqbar.append(reqnum, dots);
    const thought = el("div", "thought");
    const codebox = el("div", "codebox"), pre = el("pre"); codebox.appendChild(pre);
    const receipts = el("div", "receipts");
    pane.append(head, reqbar, thought, codebox, receipts);
    root.append(mediaCol, pane); host.appendChild(root);

    const R = ep.requests || [];
    const times = kind === "transfer" ? R.map((_, i) => i * media.per) : R.map((r) => r.t);
    const toks = R.map((r) => tokenize(r.code || ""));
    R.forEach((r, i) => {
      const d = el("i"); d.title = "Request " + r.k; d.addEventListener("click", () => seekReq(i)); dots.appendChild(d);
    });
    let ticks = [];
    function buildTicks() {
      $$(".tick", tl).forEach((t) => t.remove());
      const D = media.duration;
      ticks = times.map((t, i) => {
        const k = el("div", "tick"); k.style.left = (100 * Math.min(t, D) / D) + "%"; k.title = "Request " + R[i].k;
        k.addEventListener("click", (e) => { e.stopPropagation(); seekReq(i); }); tl.appendChild(k); return k;
      });
    }
    buildTicks(); media.on("loadedmetadata", buildTicks);

    let cur = -1, typeRaf = 0;
    function idxAt(t) {
      let i = 0; for (let j = 0; j < times.length; j++) if (times[j] <= t + 0.05) i = j;
      // several requests can share one timeline point (perception-only requests have no frames); keep a clicked one
      if (cur >= 0 && cur < i && times[cur] === times[i]) return cur;
      return i;
    }
    function show(i, animate) {
      if (i === cur || !R[i]) return; cur = i;
      const r = R[i];
      reqnum.textContent = "Request " + r.k + " / " + (r.n || R.length);
      $$("i", dots).forEach((d, j) => { d.className = j < i ? "past" : j === i ? "cur" : ""; });
      ticks.forEach((k, j) => { k.className = "tick" + (j < i ? " past" : j === i ? " cur" : ""); });
      thought.textContent = r.thought ? shorten(r.thought, 260) : "";
      receipts.innerHTML = (r.receipts || []).map((x) => {
        const bad = /FAILED|rejected/.test(x);
        return '<div class="rl ' + (bad ? "bad" : "ok") + '" title="' + esc(x) + '">' + esc(x) + "</div>";
      }).join("");
      if (kind === "transfer") {
        if (media.img.getAttribute("src") !== r.frame) { media.img.style.opacity = 0.35; media.img.src = r.frame; media.img.onload = () => (media.img.style.opacity = 1); }
        flabel.textContent = r.frameLabel ? r.frameLabel : "latest frame before request " + r.k;
      }
      cancelAnimationFrame(typeRaf);
      const tk = toks[i], total = (r.code || "").length;
      if (!animate || reduceMotion || total === 0) { pre.innerHTML = renderTokens(tk); codebox.scrollTop = 0; return; }
      const dur = Math.max(260, Math.min(1300, total * 2.6)), t0 = performance.now();
      codebox.scrollTop = 0;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur), n = Math.ceil(total * p);
        pre.innerHTML = renderTokens(tk, n, p < 1);
        const lastLn = pre.lastElementChild; if (lastLn && p < 1) {
          const off = lastLn.offsetTop - codebox.clientHeight + 40; if (off > codebox.scrollTop) codebox.scrollTop = off;
        }
        if (p < 1) typeRaf = requestAnimationFrame(step); else codebox.scrollTop = 0;
      };
      typeRaf = requestAnimationFrame(step);
    }
    function sync() {
      const D = media.duration, t = media.currentTime;
      $(".fill", tl).style.width = (100 * Math.min(1, t / D)) + "%";
      tread.textContent = fmt(t) + " / " + fmt(D);
      show(idxAt(t), !media.paused);
    }
    function seekReq(i) { media.currentTime = times[i] + 0.02; cur = -1; show(i, true); sync(); }
    let raf = 0;
    const loop = () => { sync(); if (!media.paused) raf = requestAnimationFrame(loop); };
    media.on("play", () => { bPlay.innerHTML = ICON_PAUSE; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); });
    media.on("pause", () => { bPlay.innerHTML = ICON_PLAY; sync(); });
    media.on("ended", () => { bPlay.innerHTML = ICON_PLAY; });
    media.on("timeupdate", () => { if (media.paused || !media.isVideo) sync(); });
    media.on("seeked", sync);
    bPlay.addEventListener("click", () => (media.paused ? media.play() : media.pause()));
    bPrev.addEventListener("click", () => seekReq(Math.max(0, cur - 1)));
    bNext.addEventListener("click", () => seekReq(Math.min(R.length - 1, cur + 1)));
    tl.addEventListener("click", (e) => {
      const r = tl.getBoundingClientRect(); media.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * media.duration; cur = -1; sync();
    });
    if (media.isVideo) media.node.addEventListener("click", () => (media.paused ? media.play() : media.pause()));
    show(0, false); sync();
    return { media, destroy() { cancelAnimationFrame(raf); cancelAnimationFrame(typeRaf); media.destroy(); } };
  }
  function shorten(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + " …" : s; }
  function metaLine(ep, kind) {
    if (kind === "real") return ep.nreq + " requests · new objects and layout · XR1 arm, adapted in simulation only";
    if (kind === "robust") return ep.suite + " · " + ep.pert + " · " + ep.nreq + " requests · ended with finish()";
    if (kind === "libero") return ep.suite + " · task " + ep.task + " · official initial state " + ep.initState + " (held out) · " + ep.nreq + " requests · ended with finish()";
    return ep.suite + " · " + ep.stats + " · no training on this benchmark";
  }

  /* ---------------- Watch-it-think section ---------------- */
  const SOURCES = {
    real: { list: EP.real, note: "Real-robot videos are shortened: model thinking time is cut and the footage is sped up, so code cells are aligned to the video approximately, by step order and visible motion. Receipts are shortened; ids are elided." },
    libero: { list: EP.libero.filter((e) => e.requests), note: "LIBERO episodes on held-out official initial states, replayed deterministically from the logged actions. Robot motion plays at 6× simulated time; thinking and perception time is cut. Code cells are the exact cells the agent wrote, and each motion is shown with the request that issued it; requests that only perceive or verify have no frames and sit at the point where they happened (click a dot to read them)." },
    robust: { list: EP.robust || [], note: "LIBERO-PRO, LIBERO-Plus and LIBERO-MAX (Dynamic) episodes of the same policy, replayed deterministically from the logged actions in the benchmark's own perturbed environment and checked against the logged object and gripper states. Robot motion plays at 6× simulated time; thinking and perception time is cut. LIBERO-Plus sensor noise and LIBERO-MAX observation effects act on the agent's camera images and are not visible in this clean render." },
    transfer: { list: EP.transfer, note: "Zero-shot transfer episodes. Frames are the head-camera images the agent itself requested during the episode (RoboDojo cropped to the right half of the table); each frame label gives the request that took it and the time since the episode started." }
  };
  let player = null, curSrc = "real", autoplayArmed = false;
  const picker = $("#epPicker"), pcard = $("#playerCard"), pnote = $("#playerNote");
  function loadSource(src, idx = 0, autoplay = false) {
    curSrc = src; const S = SOURCES[src];
    $$("#thinkTabs .chip").forEach((c) => c.classList.toggle("on", c.dataset.src === src));
    picker.innerHTML = "";
    picker.classList.toggle("few", S.list.length <= 3);
    picker.style.setProperty("--n", S.list.length);
    S.list.forEach((ep, i) => {
      const b = el("button", "ep-pick" + (i === idx ? " on" : ""));
      const tag = src === "libero" ? ep.suite.replace("LIBERO-", "") : src === "robust" ? ep.bench.replace("LIBERO-", "") + " · " + ep.pert.split(" · ")[0] : src === "real" ? "Real · task " + "ab"[i] : ep.bench;
      b.innerHTML = '<img loading="lazy" src="' + esc(ep.poster) + '" alt=""><div class="s">' + esc(tag) + '</div><div class="t">' + esc(ep.instruction) + "</div>";
      b.addEventListener("click", () => loadEpisode(i, true));
      picker.appendChild(b);
    });
    pnote.textContent = S.note;
    loadEpisode(idx, autoplay);
  }
  function loadEpisode(i, autoplay) {
    const S = SOURCES[curSrc];
    $$(".ep-pick", picker).forEach((b, j) => b.classList.toggle("on", j === i));
    if (player) player.destroy();
    player = Player(pcard, S.list[i], curSrc);
    if (autoplay) player.media.play();
  }
  $$("#thinkTabs .chip").forEach((c) => c.addEventListener("click", () => loadSource(c.dataset.src, 0, true)));
  if (SOURCES.real.list.length) loadSource("real", 0, false);
  // autoplay once the player first scrolls into view
  new IntersectionObserver((ents, obs) => {
    ents.forEach((en) => {
      if (en.isIntersecting && !autoplayArmed) { autoplayArmed = true; if (player && player.media.paused) player.media.play(); obs.disconnect(); }
    });
  }, { threshold: 0.45 }).observe(pcard);
  $$("[data-goto-think]").forEach((a) => a.addEventListener("click", () => loadSource(a.dataset.gotoThink, 0, true)));

  /* =====================================================================
     Gallery
     ===================================================================== */
  const BENCHES = ["LIBERO", "LIBERO-PRO", "LIBERO-Plus", "LIBERO-MAX", "RoboTwin", "RoboDojo", "Real robot"];
  const galleryItems = [];
  EP.libero.forEach((e) => galleryItems.push({ bench: "LIBERO", label: e.suite, text: e.instruction, video: e.video, poster: e.poster, think: e.requests ? ["libero", SOURCES.libero.list.indexOf(e)] : null }));
  (EP.robust || []).forEach((e, i) => galleryItems.push({ bench: e.bench, label: e.bench + " · " + e.pert, text: e.instruction, video: e.video, poster: e.poster, think: ["robust", i] }));
  EP.transfer.forEach((e, i) => galleryItems.push({ bench: e.bench, label: e.bench + " · zero-shot", text: e.instruction, frames: e.frames, poster: e.poster, wide: e.bench === "RoboDojo", think: ["transfer", i] }));
  (EP.extra || []).forEach((e) => galleryItems.push({ bench: e.bench, label: e.bench + " · zero-shot", text: e.instruction, video: e.video, poster: e.poster, think: null }));
  EP.real.forEach((e, i) => galleryItems.push({ bench: "Real robot", label: "Real robot · XR1 arm", text: e.instruction, video: e.video, poster: e.poster, wide: true, think: ["real", i] }));
  // interleave so that the grid starts diverse
  const order = []; const pools = {};
  galleryItems.forEach((g) => { const k = g.bench === "LIBERO" ? g.label : g.bench; (pools[k] = pools[k] || []).push(g); });
  const keys = ["Real robot", "LIBERO-Spatial", "LIBERO-MAX", "LIBERO-Object", "RoboTwin", "LIBERO-PRO", "LIBERO-Goal", "LIBERO-Plus", "LIBERO-Long", "RoboDojo", "CaP-Bench"];
  Object.keys(pools).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); });
  // both real-robot clips side by side in the first row
  (pools["Real robot"] || []).splice(0).forEach((g) => order.push(g));
  let more = true; while (more) { more = false; keys.forEach((k) => { if (pools[k] && pools[k].length) { order.push(pools[k].shift()); more = true; } }); }

  const grid = $("#galleryGrid"), chipsBox = $("#galleryChips");
  const cardIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      const c = en.target, v = c.querySelector("video");
      if (en.isIntersecting) {
        if (v) { if (!v.src) v.src = v.dataset.src; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        if (c._frames && !c._timer) c._timer = setInterval(() => { c._fi = (c._fi + 1) % c._frames.length; c.querySelector("img").src = c._frames[c._fi]; }, 650);
      } else {
        if (v) v.pause();
        if (c._timer) { clearInterval(c._timer); c._timer = null; }
      }
    });
  }, { rootMargin: "120px 0px", threshold: 0.25 });
  order.forEach((g, i) => {
    const c = el("div", "gcard reveal" + (g.wide ? " wide" : "")); c.dataset.bench = g.bench;
    if (g.video) {
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.preload = "none";
      v.poster = g.poster; v.dataset.src = g.video; v.setAttribute("aria-label", g.text);
      c.appendChild(v);
    } else {
      const im = new Image(); im.src = g.poster; im.alt = g.text; im.loading = "lazy"; c.appendChild(im);
      c._frames = g.frames; c._fi = 0;
    }
    c.appendChild(el("div", "cap", "<b>" + esc(g.label) + "</b>" + esc(g.text)));
    const open = el("button", "open", g.think ? "code ↗" : "enlarge");
    open.addEventListener("click", () => {
      if (g.think) { loadSource(g.think[0], Math.max(0, g.think[1]), true); $("#think").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
      else if (g.video) { const v = document.createElement("video"); v.src = g.video; v.controls = true; v.autoplay = true; v.muted = true; v.loop = true; openLightbox(v); }
    });
    c.appendChild(open);
    c.style.animationDelay = (i % 6) * 50 + "ms";
    grid.appendChild(c); cardIO.observe(c);
  });
  const empty = el("div", "gempty", ""); empty.hidden = true; grid.appendChild(empty);
  let gFilter = "All";
  function renderChips() {
    chipsBox.innerHTML = "";
    ["All"].concat(BENCHES).forEach((b) => {
      const n = b === "All" ? order.length : order.filter((g) => g.bench === b).length;
      const ch = el("button", "chip" + (b === gFilter ? " on" : "") + (n === 0 ? " empty" : ""), esc(b) + ' <span class="cnt">' + (n || "soon") + "</span>");
      ch.addEventListener("click", () => { gFilter = b; renderChips(); applyFilter(); });
      chipsBox.appendChild(ch);
    });
  }
  function applyFilter() {
    let shown = 0;
    $$(".gcard", grid).forEach((c) => { const on = gFilter === "All" || c.dataset.bench === gFilter; c.classList.toggle("hide", !on); if (on) { shown++; c.classList.add("in"); } });
    empty.hidden = shown > 0;
    empty.textContent = gFilter + " clips will be added soon. Quantitative " + gFilter + " results are in the leaderboards below.";
  }
  renderChips(); observeReveal(grid);

  /* =====================================================================
     Gain bars (Table 1)
     ===================================================================== */
  const gainRows = $("#gainRows"); let gainMetric = 0, gainShown = false;
  function renderGain() {
    gainRows.innerHTML = "";
    TB.main.rows.forEach((r) => {
      const row = el("div", "gb-row");
      row.innerHTML =
        '<div class="gb-name">' + esc(r.bench) + "<small>n = " + r.n + " episodes</small></div>" +
        '<div class="gb-bars"><div class="gb-bar sft"><span data-w="' + r.sft[gainMetric] + '"></span><em>' + r.sft[gainMetric].toFixed(1) + "</em></div>" +
        '<div class="gb-bar rl"><span data-w="' + r.rl[gainMetric] + '"></span><em>' + r.rl[gainMetric].toFixed(1) + "</em></div></div>" +
        '<div class="gb-delta">' + r.d[gainMetric] + "<small>p = " + r.p[gainMetric] + "</small></div>";
      gainRows.appendChild(row);
    });
    if (gainShown) requestAnimationFrame(() => requestAnimationFrame(fillGain));
  }
  function fillGain() { $$(".gb-bar span", gainRows).forEach((s) => (s.style.width = s.dataset.w + "%")); }
  $("#gainCard").addEventListener("revealed", () => { gainShown = true; setTimeout(fillGain, 150); });
  $$("#gainMetric .chip").forEach((c) => c.addEventListener("click", () => {
    gainMetric = +c.dataset.m; $$("#gainMetric .chip").forEach((x) => x.classList.toggle("on", x === c)); renderGain();
  }));
  renderGain();

  /* =====================================================================
     Leaderboards
     ===================================================================== */
  const boardBox = $("#board"), boardTabs = $("#boardTabs");
  const val = (c) => (c == null ? null : typeof c === "object" ? c.v : c);
  const st = {};
  function cellHTML(c, bold, dec) {
    if (c == null) return '<span class="na">–</span>';
    const v = val(c), approx = typeof c === "object" && c.approx;
    let s = approx ? "≈" + v : typeof v === "number" ? v.toFixed(dec == null ? 1 : dec) : esc(v);
    if (bold) s = "<b>" + s + "</b>";
    return s;
  }
  function fnHTML(c, board) {
    if (!c || typeof c !== "object" || !c.fn) return "";
    return c.fn.split(",").map((f) => '<span class="fn" data-tip="' + esc(f + ": " + (board.footnotes[f] || "")) + '">' + esc(f) + "</span>").join("");
  }
  function renderBoard(id) {
    const B = TB.boards.find((b) => b.id === id); if (!B) return;
    const S = st[id] = st[id] || { sort: (B.columns.find((c) => c.sortDefault) || {}).key, dir: -1, fam: "All", fr: "All", group: "All", natural: true };
    $$(".chip", boardTabs).forEach((c) => c.classList.toggle("on", c.dataset.id === id));
    boardBox.innerHTML = "";
    boardBox.appendChild(el("h3", null, esc(B.title)));
    boardBox.appendChild(el("div", "sub", esc(B.subtitle)));

    const filters = el("div", "board-filters");
    const fams = ["All"].concat([...new Set(B.rows.map((r) => r.family))]);
    const famChips = el("div", "chips"); famChips.appendChild(el("span", "chip-label", "Family"));
    fams.forEach((f) => { const c = el("button", "chip" + (S.fam === f ? " on" : ""), esc(f)); c.onclick = () => { S.fam = f; renderBoard(id); }; famChips.appendChild(c); });
    const frChips = el("div", "chips"); frChips.appendChild(el("span", "chip-label", "Frontier model at test"));
    [["All", "All"], ["no", "No"], ["yes", "Yes"]].forEach(([k, lab]) => { const c = el("button", "chip" + (S.fr === k ? " on" : ""), lab); c.onclick = () => { S.fr = k; renderBoard(id); }; frChips.appendChild(c); });
    filters.append(famChips, frChips);
    if (B.groups) {
      const gChips = el("div", "chips"); gChips.appendChild(el("span", "chip-label", "Benchmark"));
      [{ key: "All", label: "All" }].concat(B.groups).forEach((g) => { const c = el("button", "chip" + (S.group === g.key ? " on" : ""), esc(g.label)); c.onclick = () => { S.group = g.key; renderBoard(id); }; gChips.appendChild(c); });
      filters.appendChild(gChips);
    }
    boardBox.appendChild(filters);

    const tones = el("div", "tone-legend");
    tones.innerHTML = '<span><i style="background:var(--tone-ours)"></i>ours</span>' +
      (B.rows.some((r) => r.tone === "api") ? '<span><i style="background:var(--tone-api)"></i>frontier-API agent</span>' : "") +
      (B.rows.some((r) => r.tone === "train") ? '<span><i style="background:var(--tone-train)"></i>uses benchmark-specific training data' + (id === "pro" ? " or components (e.g. a VLA fine-tuned on LIBERO demos)" : "") + "</span>" : "");
    boardBox.appendChild(tones);

    let rows = B.rows.filter((r) => (S.fam === "All" || r.family === S.fam) && (S.fr === "All" || (S.fr === "yes") === !!r.frontier) && (!B.groups || S.group === "All" || r.group === S.group));
    const sortRows = (arr) => {
      if (S.natural) return arr;
      const k = S.sort, col = B.columns.find((c) => c.key === k);
      return arr.slice().sort((a, b) => {
        let x = col.type === "num" ? val(a[k]) : col.type === "bool" ? (a[k] ? 1 : 0) : String(a[k] || "").toLowerCase();
        let y = col.type === "num" ? val(b[k]) : col.type === "bool" ? (b[k] ? 1 : 0) : String(b[k] || "").toLowerCase();
        if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
        return (x < y ? -1 : x > y ? 1 : 0) * S.dir;
      });
    };
    const barCol = B.columns.find((c) => c.bar);
    const maxBar = Math.max(1, ...B.rows.map((r) => val(r[barCol.key]) || 0));

    const wrap = el("div", "tbl-wrap"), tbl = el("table", "lb");
    const thead = el("thead"), trh = el("tr");
    B.columns.forEach((c) => {
      const th = el("th", (c.hideSm ? "hide-sm " : "") + (c.type === "num" ? "num " : "") + "sortable" + (!S.natural && S.sort === c.key ? " sorted" : ""));
      th.innerHTML = esc(c.label) + '<span class="arr">' + (!S.natural && S.sort === c.key ? (S.dir < 0 ? "▼" : "▲") : "↕") + "</span>";
      th.onclick = () => {
        if (!S.natural && S.sort === c.key) { if (S.dir === (c.type === "num" ? -1 : 1)) S.dir = -S.dir; else S.natural = true; }
        else { S.natural = false; S.sort = c.key; S.dir = c.type === "num" ? -1 : 1; }
        renderBoard(id);
      };
      th.title = "Sort by " + c.label + " (click again to reverse, a third time for the paper's order)";
      trh.appendChild(th);
    });
    thead.appendChild(trh); tbl.appendChild(thead);
    const tb = el("tbody");
    const groups = B.groups ? B.groups.filter((g) => S.group === "All" || S.group === g.key) : [null];
    groups.forEach((g) => {
      const gr = sortRows(g ? rows.filter((r) => r.group === g.key) : rows);
      if (g && gr.length) {
        const tr = el("tr", "group"); const td = el("td", null, esc(g.label) + ' <span style="text-transform:none;letter-spacing:0;color:var(--ink-mute);font-weight:500">· ' + esc(g.note) + "</span>" + (g.fn ? fnHTML({ fn: g.fn }, B) : ""));
        td.colSpan = B.columns.length; tr.appendChild(td); tb.appendChild(tr);
      }
      gr.forEach((r) => {
        const tr = el("tr", "tone-" + (r.tone || "none") + (r.bold ? " bold" : ""));
        B.columns.forEach((c) => {
          const v = r[c.key]; let td;
          if (c.key === "system") td = el("td", "sys", esc(r.system) + (r.sysFn ? fnHTML({ fn: r.sysFn }, B) : ""));
          else if (c.type === "bool") td = el("td", null, v == null ? "–" : v ? '<span class="yes">✓ yes</span>' : '<span class="no">✗ no</span>');
          else if (c.type === "num" && c.bar) {
            td = el("td", "num barcell");
            const w = v == null ? 0 : (100 * val(v)) / maxBar;
            td.innerHTML = '<div class="cellbar"><div class="b"><span data-w="' + w.toFixed(1) + '"></span></div><span class="v">' + cellHTML(v, r.bold && r.tone === "ours", c.dec) + fnHTML(v, B) + "</span></div>";
          } else if (c.type === "num") td = el("td", "num", cellHTML(v, r.bold && r.tone === "ours", c.dec) + fnHTML(v, B));
          else td = el("td", null, esc(v == null ? "–" : v));
          if (c.hideSm) td.classList.add("hide-sm");
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
    });
    if (!rows.length) { const tr = el("tr"); const td = el("td", "na", "No rows match these filters."); td.colSpan = B.columns.length; td.style.textAlign = "center"; td.style.padding = "24px"; tr.appendChild(td); tb.appendChild(tr); }
    tbl.appendChild(tb); wrap.appendChild(tbl); boardBox.appendChild(wrap);

    const notes = el("div", "board-notes");
    notes.innerHTML = esc(B.note) + "<br>" + Object.entries(B.footnotes).map(([k, v]) => '<span class="fnl"><b>' + esc(k) + "</b> " + esc(v) + "</span>").join(" · ");
    boardBox.appendChild(notes);
    requestAnimationFrame(() => requestAnimationFrame(() => $$(".cellbar .b span", boardBox).forEach((s) => (s.style.width = s.dataset.w + "%"))));
  }
  TB.boards.forEach((b, i) => {
    const c = el("button", "chip" + (i === 0 ? " on" : ""), esc(b.title)); c.dataset.id = b.id; c.onclick = () => renderBoard(b.id); boardTabs.appendChild(c);
  });
  let boardSeen = false;
  boardBox.addEventListener("revealed", () => { boardSeen = true; renderBoard(TB.boards[0].id); });
  if (TB.boards.length) renderBoard(TB.boards[0].id);

  /* =====================================================================
     Critic credit animation (real trace)
     ===================================================================== */
  const CRITIC = { V: [0.024139, 0.024139, 0.024139, 0.043954, 0.303233, 0.303233, 0.335939, 0.169028, 0.263663, 0.989497, 0.989497, 0.989497, 0.989497, 0.989497] };
  function drawCritic() {
    const host = $("#criticPlot"); if (!host) return;
    const V = CRITIC.V, n = V.length, C = V.slice(1).map((v, i) => v - V[i]);
    const W = 640, H = 344, L = 46, Rr = 14, T = 16, PH = 170, CT = 228, CH = 70;
    const x = (i) => L + (W - L - Rr) * (i / (n - 1));
    const y = (v) => T + PH * (1 - v);
    const maxP = Math.max(0, ...C), maxN = Math.max(0, ...C.map((c) => -c));
    const cs = CH / (maxP + maxN), cy0 = CT + maxP * cs;
    let d = "M" + x(0) + "," + y(V[0]);
    for (let i = 1; i < n; i++) d += " H" + x(i) + " V" + y(V[i]);
    let area = d + " V" + y(0) + " H" + x(0) + " Z";
    const grasp = 3, big = 8; // credit indices: request 4→5 (grasp) and 9→10
    let s = '<svg viewBox="0 0 ' + W + " " + (H + 16) + '" role="img">';
    s += '<defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E4572E" stop-opacity=".28"/><stop offset="1" stop-color="#E4572E" stop-opacity="0"/></linearGradient></defs>';
    [0, 0.5, 1].forEach((g) => { s += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="var(--rule)" stroke-dasharray="3 4"/><text x="' + (L - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="11" fill="var(--ink-mute)">' + g + "</text>"; });
    s += '<text x="12" y="' + (T + PH / 2) + '" transform="rotate(-90 12 ' + (T + PH / 2) + ')" text-anchor="middle" font-size="11" fill="var(--ink-mute)">predicted success V</text>';
    s += '<path class="c-area" d="' + area + '" fill="url(#cg)" opacity="0"/>';
    s += '<path class="c-line" d="' + d + '" fill="none" stroke="#E4572E" stroke-width="3" stroke-linejoin="round"/>';
    V.forEach((v, i) => { s += '<circle class="c-dot" data-i="' + i + '" cx="' + x(i) + '" cy="' + y(v) + '" r="4.2" fill="var(--bg-2)" stroke="#E4572E" stroke-width="2" opacity="0" data-tip="Request ' + (i + 1) + ": V = " + v.toFixed(3) + (i ? " · credit δ = " + (v - V[i - 1] >= 0 ? "+" : "") + (v - V[i - 1]).toFixed(3) : "") + '"/>'; });
    // grasp annotation
    const gx = (x(grasp) + x(grasp + 1)) / 2;
    s += '<g class="c-ann" opacity="0"><rect x="' + (x(grasp + 1) - 4) + '" y="' + (y(V[grasp + 1]) - 4) + '" width="8" height="' + (y(V[grasp]) - y(V[grasp + 1]) + 8) + '" rx="4" fill="#D4A017" opacity=".35"/>' +
      '<text x="' + (x(grasp + 1) + 10) + '" y="' + (y(V[grasp + 1]) - 26) + '" font-size="12.5" font-weight="700" fill="#D4A017">grasp → +credit</text>' +
      '<text x="' + (x(grasp + 1) + 10) + '" y="' + (y(V[grasp + 1]) - 11) + '" font-size="11" fill="var(--ink-mute)">V 0.04 → 0.30 at request 5</text></g>';
    s += '<g class="c-ann" opacity="0"><text x="' + (x(big + 1) + 8) + '" y="' + (y(V[big + 1]) + 22) + '" font-size="12.5" font-weight="700" fill="#E4572E">+0.73</text>' +
      '<text x="' + (x(big + 1) + 8) + '" y="' + (y(V[big + 1]) + 37) + '" font-size="11" fill="var(--ink-mute)">goal state reached</text></g>';
    // credit bars
    s += '<text x="' + L + '" y="' + (CT - 12) + '" font-size="11.5" font-weight="600" fill="var(--ink-soft)">credit per request  δₜ = V(sₜ₊₁) − V(sₜ)</text>';
    s += '<line x1="' + L + '" x2="' + (W - Rr) + '" y1="' + cy0 + '" y2="' + cy0 + '" stroke="var(--ink-mute)" stroke-width="1"/>';
    C.forEach((c, i) => {
      const cx = (x(i) + x(i + 1)) / 2, h = Math.abs(c) * cs, bw = 0.55 * (x(1) - x(0));
      const col = c > 0.0005 ? (i === grasp ? "#D4A017" : "#2f8a5b") : c < -0.0005 ? "#b5655a" : "var(--ink-mute)";
      s += '<rect class="c-bar" data-i="' + i + '" x="' + (cx - bw / 2) + '" y="' + (c >= 0 ? cy0 - h : cy0) + '" width="' + bw + '" height="' + Math.max(1, h) + '" fill="' + col + '" rx="2" style="transform-origin:' + cx + "px " + cy0 + 'px;transform:scaleY(0)" data-tip="Request ' + (i + 1) + " → " + (i + 2) + ": δ = " + (c >= 0 ? "+" : "") + c.toFixed(3) + '"/>';
    });
    for (let i = 0; i < n; i++) if (i === 0 || i === n - 1 || (i + 1) % 2 === 1) s += '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="10.5" fill="var(--ink-mute)">' + (i + 1) + "</text>";
    s += '<text x="' + ((L + W - Rr) / 2) + '" y="' + (H + 10) + '" text-anchor="middle" font-size="11" fill="var(--ink-mute)">request</text>';
    s += "</svg>";
    host.innerHTML = s;
    animateCritic();
  }
  function animateCritic() {
    const host = $("#criticPlot"), line = $(".c-line", host); if (!line) return;
    const len = line.getTotalLength();
    const dots = $$(".c-dot", host), bars = $$(".c-bar", host), anns = $$(".c-ann", host), area = $(".c-area", host);
    line.style.transition = "none"; line.style.strokeDasharray = len; line.style.strokeDashoffset = reduceMotion ? 0 : len;
    dots.forEach((d) => { d.style.transition = "none"; d.setAttribute("opacity", reduceMotion ? 1 : 0); });
    bars.forEach((b) => { b.style.transition = "none"; b.style.transform = reduceMotion ? "scaleY(1)" : "scaleY(0)"; });
    anns.forEach((a) => { a.style.transition = "none"; a.setAttribute("opacity", reduceMotion ? 1 : 0); });
    area.style.transition = "none"; area.setAttribute("opacity", reduceMotion ? 1 : 0);
    if (reduceMotion) return;
    host.getBoundingClientRect();
    const D = 2600;
    requestAnimationFrame(() => {
      line.style.transition = "stroke-dashoffset " + D + "ms cubic-bezier(.4,0,.2,1)"; line.style.strokeDashoffset = 0;
      dots.forEach((d, i) => setTimeout(() => { d.style.transition = "opacity .3s"; d.setAttribute("opacity", 1); }, (D * i) / dots.length));
      bars.forEach((b, i) => setTimeout(() => { b.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)"; b.style.transform = "scaleY(1)"; }, (D * (i + 1)) / dots.length));
      setTimeout(() => { anns[0].style.transition = "opacity .5s"; anns[0].setAttribute("opacity", 1); }, (D * 5) / dots.length + 200);
      setTimeout(() => { anns[1].style.transition = "opacity .5s"; anns[1].setAttribute("opacity", 1); area.style.transition = "opacity .8s"; area.setAttribute("opacity", 1); }, D + 150);
    });
  }
  drawCritic();
  const critCard = $(".critic");
  if (critCard) critCard.addEventListener("revealed", () => setTimeout(animateCritic, 200));
  $("#criticReplay").addEventListener("click", animateCritic);
})();
