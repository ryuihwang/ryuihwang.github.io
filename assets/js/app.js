(function () {
  "use strict";
  const D = window.CAREER;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (a) => (Array.isArray(a) ? a : a ? [a] : []);
  const params = new URLSearchParams(location.search);

  const svg = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    arrow: svg('<path d="M5 12h14M13 5l7 7-7 7"/>', 2.2),
    ext: svg('<path d="M7 17 17 7M8 7h9v9"/>', 2.2),
    down: svg('<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>', 2.2),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
    pen: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>'),
    brief: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>'),
    cap: svg('<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
    trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
    doc: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
    badge: svg('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>'),
    link: svg('<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'),
  };

  const SKILL_ICON = {
    "LLM Agent": svg('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4M9 4h6M9 13h.01M15 13h.01M9.5 17h5M2 13v3M22 13v3"/>'),
    RAG: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M14 3l5 5M14 3v5h5M8 12h4M8 16h2"/><circle cx="17" cy="16" r="3"/><path d="m21 20-1.8-1.8"/>'),
    LangGraph: svg('<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6.3 8.2l4.4 7.6M17.7 8.2l-4.4 7.6"/>'),
    sLLM: svg('<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>'),
    MLOps: svg('<path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4Zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4Z"/>'),
    "Multimodal AI": svg('<rect x="3" y="4" width="11" height="9" rx="2"/><path d="m3 11 3-3 3 3 2-2 3 3"/><path d="M16 15v5M19 13v9M22 16v3M13 17v1"/>'),
    Diffusion: svg('<path d="M4 5h.01M8 5h.01M4 9h.01M8 9h.01M4 13h.01M6 17h.01M10 13h.01"/><path d="M15 4l1.5 3.5L20 9l-3.5 1.5L15 14l-1.5-3.5L10 9l3.5-1.5Z"/><path d="M18 16l.8 1.7 1.7.8-1.7.8L18 21l-.8-1.7-1.7-.8 1.7-.8Z"/>', 1.8),
    "Time-series": svg('<path d="M3 3v18h18"/><path d="m7 15 3-4 3 2 4-6 3 3"/>'),
    FastAPI: svg('<circle cx="12" cy="12" r="9.5"/><path d="M13 5.5 8 13h4l-1 5.5 5-7.5h-4l1-5.5Z"/>'),
    PyTorch: svg('<path d="M12 3 6.8 8.2a7.3 7.3 0 1 0 10.4 0"/><path d="M15.5 6.5h.01"/>', 2.2),
  };

  /* ---------- lookups ---------- */
  const ORGS = D.orgs;
  const orgById = Object.fromEntries(ORGS.map((o) => [o.id, o]));
  const PROJECTS = [];
  ORGS.forEach((o) => o.projects.forEach((p) => PROJECTS.push(Object.assign(p, { _org: o }))));
  const projById = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const projUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const orgUrl = (o) => `org.html?id=${encodeURIComponent(o.id)}`;
  const ym = (s) => String(s || "").slice(0, 7);
  const shortTitle = (p) => p.product_name || p.title || "";
  const ptag = (p) => (p.product_name ? `<span class="ptag">${esc(p.product_name)}</span>` : "");
  const imagesOf = (p) => (list(p.images).length ? list(p.images).map((src) => [src, ""]) : list(p.figures));
  const cover = (p) => `<div class="cover c${p._org.chapter || 4}"><b>${esc(p.product_name || p.cover_label || p.title)}</b></div>`;
  const media = (p) => {
    const im = imagesOf(p)[0];
    return im ? `<img src="${esc(im[0])}" alt="" loading="lazy">` : cover(p);
  };
  const awardTag = (p) => (p.award ? `<span class="award"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>${esc(p.award)}</span>` : "");

  /* ---------- shared chrome ---------- */
  function chrome() {
    const nav = $("#nav");
    if (nav) {
      const h = document.body.dataset.page === "home" ? "" : "index.html";
      const pg = document.body.dataset.page;
      const on = (p) => (pg === p ? ' class="on" aria-current="page"' : "");
      nav.innerHTML = `<div class="wrap">
        <a class="brand" href="index.html"><img class="logo-l" src="assets/img/logo.png" alt="ryui hwang"><img class="logo-d" src="assets/img/logo-dark.png" alt=""></a>
        <button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          <a href="about.html"${on("about")}>About</a><a href="work.html"${on("work")}>What I do</a><a href="experience.html"${on("experience")}>Experience</a>
          <a href="projects.html"${on("projects")}>Projects</a><a href="${h}#contact">Contact</a>
          <a class="btn btn-dark" href="resume.html">Resume ${ICON.down}</a>
        </nav></div>`;
      const btn = $(".menu-btn", nav);
      btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
      $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
      const onScroll = () => nav.classList.toggle("solid", scrollY > 10);
      onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    const f = $("#footer");
    if (f) f.innerHTML = `<div class="wrap foot">
      <a class="foot-logo" href="index.html"><img class="logo-l" src="assets/img/logo-dark.png" alt="ryui hwang"></a>
      <nav><a href="${esc(D.profile.github)}" target="_blank" rel="noopener">GitHub</a><a href="${esc(D.profile.velog)}" target="_blank" rel="noopener">Velog</a><a href="mailto:${esc(D.profile.email)}">${esc(D.profile.email)}</a></nav>
      <small>© ${new Date().getFullYear()} Ryu I Hwang. Designed &amp; built by hand.</small>
    </div>`;
  }

  function reveal() {
    const els = $$(".rv, .pop");
    if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }

  function lightbox(items) {
    let lb = $(".lb");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lb";
      lb.innerHTML = '<button class="x" aria-label="닫기">×</button><button class="prev" aria-label="이전">‹</button><img alt=""><div class="cap"></div><button class="nxt" aria-label="다음">›</button>';
      document.body.appendChild(lb);
    }
    let i = 0;
    const show = (k) => { i = (k + items.length) % items.length; $("img", lb).src = items[i][0]; $(".cap", lb).textContent = items[i][1] || ""; };
    const close = () => lb.classList.remove("on");
    $(".x", lb).onclick = close;
    lb.onclick = (e) => { if (e.target === lb) close(); };
    $(".prev", lb).onclick = () => show(i - 1);
    $(".nxt", lb).onclick = () => show(i + 1);
    $$(".prev,.nxt", lb).forEach((b) => (b.style.display = items.length > 1 ? "" : "none"));
    addEventListener("keydown", (e) => { if (!lb.classList.contains("on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    return (k) => { show(k); lb.classList.add("on"); };
  }

  /* ---------- shared blocks ---------- */
  const ICON_NAME = {
    langchain: "LangGraph", rag: "RAG", openai: "OpenAI", vllm: "vLLM", docker: "Docker", githubactions: "GitHub Actions",
    pytorch: "PyTorch", huggingface: "Hugging Face", tensorflow: "TensorFlow", python: "Python", scikitlearn: "scikit-learn",
    pandas: "pandas", numpy: "NumPy", r: "R", jupyter: "Jupyter", xgboost: "XGBoost", fastapi: "FastAPI", react: "React",
    nextjs: "Next.js", postgresql: "PostgreSQL", typescript: "TypeScript",
  };
  const logo = (key, name) => `<span class="lg" title="${esc(name || ICON_NAME[key] || key)}"><img src="assets/icons/${esc(key)}.svg" alt="${esc(name || ICON_NAME[key] || key)}" loading="lazy"></span>`;
  // Inline emphasis in prose: ==highlight== and **bold**.
  const rich = (s) => esc(s).replace(/==(.+?)==/g, '<mark class="hl">$1</mark>').replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const plain = (s) => String(s || "").replace(/==|\*\*/g, "");
  const featRow = (p) => `
      <a class="frow rv" href="${projUrl(p)}">
        <div class="media">${media(p)}</div>
        <div class="body">
          <div class="kicker"><span>${esc(p._org.short)}</span><span>·</span><span>${esc(p.period)}</span>${awardTag(p)}</div>
          ${ptag(p)}<h3>${esc(p.title)}</h3>
          <p>${esc(p.define)}</p>
          <div class="chips">${list(p.tags).slice(0, 4).map((t) => `<span class="chip v">${esc(t)}</span>`).join("")}</div>
          <span class="go">자세히 보기 ${ICON.arrow}</span>
        </div>
      </a>`;
  const projChips = (ids) => `<div class="plist">${ids.map((id) => projById[id]).filter(Boolean).map((p) => `<a href="${projUrl(p)}">${ptag(p) ? esc(p.product_name) : esc(p.title)} ${ICON.arrow}</a>`).join("")}</div>`;

  // Core skill tiles alternate black / white and swap back and forth over time.
  function coreTiles(el) {
    el.innerHTML = D.profile.core.map((k, n) => `<div class="tile pop" style="--i:${n}">${SKILL_ICON[k] || ""}<span>${esc(k)}</span></div>`).join("");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => el.classList.toggle("flip"), 2600);
  }

  function facts(detailed) {
    const now = ORGS[0], edu = D.education[0];
    const box = (cls, icon, label, title, sub) => `<div class="fact ${cls} pop"><span class="ico">${icon}</span><div><small>${label}</small><b>${title}</b>${detailed ? `<span>${sub}</span>` : ""}</div></div>`;
    return `<div class="facts">
      ${box("f-now", ICON.brief, "Now", esc(now.name), esc(now.role))}
      ${box("f-edu", ICON.cap, "Education", `${esc(edu.school)} ${esc(edu.degree)}`, `${esc(edu.major.replace(" (주전공)", ""))} · 부전공 ${esc(edu.minor.replace(" (부전공)", ""))}`)}
      ${box("f-res", ICON.doc, "Research", "논문 · 학회 포스터 · 특허", "MMgene 단독 저자 · AACR 2024 공동저자 · 생분해성 소재 특허 출원")}
    </div>`;
  }

  // Awards, research and certificates on one center line, alternating left and right.
  function honors() {
    const pl = (id) => (projById[id] ? `<a class="hl-link" href="${projUrl(projById[id])}">프로젝트 ${ICON.arrow}</a>` : "");
    const short = (s) => s.replace(" ([이스트캠프] 와썹 AI 모델 개발 13회차)", " (이스트캠프 13기)").replace("[이스트캠프] 와썹 AI 모델 개발 13회차", "이스트캠프 13기");
    const items = [
      ...D.awards.map((a) => ({ d: a.date, k: "Award", ico: ICON.trophy, name: short(a.title), tag: a.issuer, note: a.note, link: pl(a.project_id) })),
      ...D.publications_patents.map((x) => ({ d: String(x.date), k: "Research", ico: ICON.doc, name: x.title, tag: x.type, note: x.note, link: pl(x.project_id) })),
      ...D.certificates.map((c) => ({ d: c.date, k: "Certificate", ico: ICON.badge, name: c.name, tag: c.issuer, note: c.note, link: "" })),
      ...D.education.slice(1).map((e) => ({ d: ym(e.period_start), k: "Training", ico: ICON.badge, name: e.school, tag: e.degree, note: e.note, link: "" })),
    ].sort((x, y) => (x.d < y.d ? 1 : -1));
    const row = (it, i) => `
      <li class="hz-row rv ${i % 2 ? "r" : "l"}" style="order:${i}">
        <span class="hz-dot" aria-hidden="true"></span>
        <time>${esc(it.d.slice(0, 7))}</time>
        <span class="hz-kind"><i>${it.ico}</i>${it.k}</span>
        <b>${esc(it.name)}</b>
        ${it.note ? `<p>${esc(it.note)}</p>` : ""}
        <div class="vtags"><span class="ltag">${esc(it.tag)}</span>${it.link}</div>
      </li>`;
    // Two interlocking columns on desktop; on mobile the columns dissolve and `order` keeps the dates in sequence.
    return `<div class="hz">${[0, 1].map((s) => `<ol class="hz-col ${s ? "r" : "l"}">${items.map((it, i) => (i % 2 === s ? row(it, i) : "")).join("")}</ol>`).join("")}</div>`;
  }

  const SMILE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2M9 9.5h.01M15 9.5h.01"/></svg>';
  const orgMark = (o) => (o.logo ? `<span class="omark"><img src="${esc(o.logo)}" alt="${esc(o.name)} 로고"></span>` : `<span class="omark smile">${SMILE}</span>`);
  const pageHero = (kicker, title, lead) => `
      <div class="wrap center">
        <span class="eyebrow"><i></i>${esc(kicker)}</span>
        <h1>${esc(title)}</h1>
        <p class="tagline">${rich(lead)}</p>
      </div>`;

  /* ---------- HOME ---------- */
  function home() {
    const P = D.profile;
    $("#hero").innerHTML = `
      <div class="wrap hero-grid">
        <div class="hero-copy rv">
          <div class="hello" aria-hidden="true"></div>
          <h1>${esc(P.headline[0])}<br><span class="mark">${esc(P.headline[1])}</span>${esc(P.headline[2])}</h1>
          <p class="lede">${esc(P.lede)}</p>
          <div class="hero-cta">
            <a class="btn btn-dark" href="projects.html">프로젝트 보기 ${ICON.arrow}</a>
            <a class="btn btn-line" href="resume.html">이력서</a>
          </div>
          <div class="socials">
            <a href="${esc(P.github)}" target="_blank" rel="noopener" aria-label="GitHub">${ICON.gh}</a>
            <a href="${esc(P.velog)}" target="_blank" rel="noopener" aria-label="Velog">${ICON.pen}</a>
            <a href="mailto:${esc(P.email)}" aria-label="Email">${ICON.mail}</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hv-panel" id="hv-panel">
            <span class="hv-ring" aria-hidden="true"></span>
            <div class="hv-stage" id="hv-stage">
              <img class="scene on" src="assets/img/scene-1.png" alt="노트북 앞에서 코드와 차트를 보며 일하는 엔지니어 일러스트"><img class="scene" src="assets/img/scene-dark.png" alt="헤드폰을 쓰고 모니터 앞에서 코딩하는 엔지니어 일러스트">
            </div>
            <label class="hv-toggle"><button type="button" class="switch" role="switch" aria-checked="false" aria-label="다크 모드"><i></i></button></label>
          </div>
        </div>
      </div>`;
    heroVisual();
    coreTiles($("#core-grid"));

    // Desktop gets the wide pipeline so it fits one view; mobile keeps the tall one.
    $("#about-body").innerHTML = `
      <div class="about-fig pop"><picture><source media="(min-width: 861px)" srcset="assets/img/hero-wide.svg"><img src="assets/img/hero.svg" alt="데이터, 모델, 서비스로 이어지는 AI 파이프라인 인포그래픽"></picture></div>
      ${facts(false)}`;

    $("#focus-grid").innerHTML = D.focus.map((f, i) => `
      <a class="fcard rv" href="work.html#w${i + 1}">
        <span class="n">0${i + 1}</span>
        <h3>${esc(f.t)}</h3>
        <div class="logos">${f.icons.map((k) => logo(k)).join("")}</div>
      </a>`).join("");

    // Timeline: one vertical life line, newest at the top with a branch card.
    const span = (o) => { const a = ym(o.period_start).slice(0, 4), b = o.period_end === "현재" ? "현재" : ym(o.period_end).slice(0, 4); return a === b ? a : `${a} ~ ${b}`; };
    $("#exp-list").innerHTML = ORGS.map((o, i) => `
      <a class="tl-row rv${i === 0 ? " now" : ""}${i % 2 ? " r" : " l"}" href="${orgUrl(o)}">
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-card">
          <div class="tl-year">${esc(span(o))}</div>
          <h3>${esc(o.role.split(" · ")[0])}</h3>
          <p>${esc(o.name)}</p>
          ${o.location ? `<span class="ltag">${esc(o.location)}</span>` : ""}
        </div>
      </a>`).join("");

    // Desktop only: the same timeline folded into a ㄹ-shaped snake, three stops per row.
    const PER = 3, rows = [];
    for (let k = 0; k < ORGS.length; k += PER) rows.push(ORGS.slice(k, k + PER));
    $("#exp-list").insertAdjacentHTML("afterend", `<div class="snake">${rows.map((row, r) => {
      const rev = r % 2 === 1, n = row.length, first = rev ? PER - n + 1 : 1;
      const turn = r < rows.length - 1 ? (rev ? " tl" : " tr") : "";
      const cells = row.map((o, j) => {
        const i = r * PER + j, col = rev ? PER - j : j + 1;
        return `<a class="sn-cell rv${i === 0 ? " now" : ""}" style="grid-column:${col}" href="${orgUrl(o)}">
          <span class="tl-dot" aria-hidden="true"></span>
          <div class="tl-card">
            <div class="tl-year">${esc(span(o))}</div>
            <h3>${esc(o.role.split(" · ")[0])}</h3>
            <p>${esc(o.name)}</p>
            ${o.location ? `<span class="ltag">${esc(o.location)}</span>` : ""}
            </div>
        </a>`;
      }).join("");
      return `<div class="sn-row${turn}" style="--a:${first};--n:${n}">${cells}</div>`;
    }).join("")}</div>`);

    // Project wall: mosaic of cover images; hovering one grows it and reveals its info.
    $("#feat-list").outerHTML = `<div class="wall" id="wall"></div>`;
    const wallItems = [...PROJECTS.filter((p) => p.featured), ...PROJECTS.filter((p) => !p.featured && imagesOf(p).length)];
    // [row, col, height, width] per tile on a 6-column grid; the three bands tile with no holes.
    const SPOTS = [[1,1,2,2],[1,3,1,1],[1,4,1,2],[1,6,2,1],[2,3,1,1],[2,4,1,1],[2,5,1,1],
                   [3,1,1,1],[3,2,2,1],[3,3,1,2],[3,5,2,2],[4,1,1,1],[4,3,1,1],[4,4,1,1],
                   [5,1,1,2],[5,3,1,2],[5,5,1,2]];
    $("#wall").innerHTML = wallItems.slice(0, SPOTS.length).map((p, n) => `
      <a class="wtile" style="grid-area:${SPOTS[n][0]} / ${SPOTS[n][1]} / span ${SPOTS[n][2]} / span ${SPOTS[n][3]}" href="${projUrl(p)}">
        ${media(p)}
        <div class="winfo"><span class="wo">${esc(p._org.short)}</span><b>${esc(p.product_name ? p.product_name + " · " : "")}${esc(p.title)}</b>${p.award ? awardTag(p) : ""}</div>
      </a>`).join("");
    wallPeek($("#wall"), wallItems);

  }

  // Desktop hover: tiles crop their image, so show the whole image and the full title in a larger card.
  function wallPeek(wall, items) {
    const can = matchMedia("(hover: hover) and (min-width: 861px)");
    const peek = document.createElement("a");
    peek.className = "wpeek";
    wall.appendChild(peek);
    let timer = 0;
    const hide = () => { timer = setTimeout(() => peek.classList.remove("on"), 90); };
    const place = (tile) => {
      const w = wall.getBoundingClientRect(), r = tile.getBoundingClientRect();
      const pw = peek.offsetWidth, ph = peek.offsetHeight;
      const x = Math.min(Math.max(r.left - w.left + r.width / 2 - pw / 2, 0), w.width - pw);
      const y = Math.min(Math.max(r.top - w.top + r.height / 2 - ph / 2, 0), Math.max(w.height - ph, 0));
      peek.style.transform = `translate(${x}px, ${y}px)`;
    };
    $$(".wtile", wall).forEach((tile, n) => {
      tile.addEventListener("mouseenter", () => {
        if (!can.matches) return;
        clearTimeout(timer);
        const p = items[n];
        peek.href = tile.getAttribute("href");
        peek.innerHTML = `<div class="wp-media">${media(p)}</div>
          <div class="wp-info"><span class="wo">${esc(p._org.short)}</span><b>${esc(p.product_name ? p.product_name + " · " : "")}${esc(p.title)}</b>${p.tagline ? `<p>${esc(p.tagline)}</p>` : ""}${p.award ? awardTag(p) : ""}</div>`;
        const img = $("img", peek);
        if (img) { img.loading = "eager"; img.addEventListener("load", () => place(tile)); }
        peek.classList.add("on");
        place(tile);
      });
      tile.addEventListener("mouseleave", hide);
    });
    peek.addEventListener("mouseenter", () => clearTimeout(timer));
    peek.addEventListener("mouseleave", hide);
  }

  function contactRow() {
    const P = D.profile, el = $("#contact-row");
    if (!el) return;
    el.innerHTML = `
      <a class="btn btn-lime" href="mailto:${esc(P.email)}">${ICON.mail} ${esc(P.email)}</a>
      <a class="btn btn-ghost-w" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ${ICON.ext}</a>
      <a class="btn btn-ghost-w" href="${esc(P.velog)}" target="_blank" rel="noopener">Velog ${ICON.ext}</a>`;
  }

  /* ---------- ABOUT ---------- */
  function aboutPage() {
    const P = D.profile;
    $("#sub-hero").innerHTML = pageHero("About", "데이터부터 서비스까지 연결하는 엔지니어", P.about[0]);
    $("#about-full").innerHTML = `
      <div class="about-fig pop"><img src="assets/img/hero.svg" alt="데이터, 모델, 서비스로 이어지는 AI 파이프라인 인포그래픽"></div>
      <div class="about-text pop">${P.about.slice(1).map((t) => `<p>${rich(t)}</p>`).join("")}</div>
      ${facts(true)}`;
    coreTiles($("#core-grid"));
    $("#skill-notes").innerHTML = P.core.map((k) => {
      const [note, ids] = D.skill_notes[k] || ["", []];
      return `<article class="snote rv"><span class="sico">${SKILL_ICON[k] || ""}</span><div><h3>${esc(k)}</h3><p>${rich(note)}</p>${projChips(ids)}</div></article>`;
    }).join("");
  }

  /* ---------- WHAT I DO ---------- */
  function workPage() {
    $("#sub-hero").innerHTML = pageHero("What I do", "이런 일을 합니다", "LLM 에이전트와 MLOps, 멀티모달 · 생성 모델, 데이터 분석, 그리고 이 모두를 실제 업무 서비스로 묶는 엔지니어링까지 네 가지 영역에서 일합니다.");
    $("#work-list").innerHTML = D.focus.map((f, i) => `
      <article class="work rv" id="w${i + 1}">
        <div class="work-head">
          <span class="n">0${i + 1}</span>
          <h2>${esc(f.t)}</h2>
          <div class="logos">${f.icons.map((k) => logo(k)).join("")}</div>
        </div>
        <p class="prose">${rich(f.intro)}</p>
        <ol class="steps">${f.does.map((x) => { const k = x.indexOf(": "); return `<li>${k > 0 ? `<b>${esc(x.slice(0, k))}</b>: ${esc(x.slice(k + 2))}` : esc(x)}</li>`; }).join("")}</ol>
        <h3 class="sub-t">관련 프로젝트</h3>
        ${projChips(f.projects)}
      </article>`).join("");
    $("#tech-board").innerHTML = D.tech.map((g) => `
      <div class="tcol t-${esc(g.tone)} rv">
        <h4><span>${esc(g.area)}</span><small>${esc(g.en)}</small></h4>
        <ul>${g.items.map(([k, n, d]) => `<li>${logo(k, n)}<div><b>${esc(n)}</b><span>${esc(d)}</span></div></li>`).join("")}</ul>
      </div>`).join("");
  }

  /* ---------- EXPERIENCE ---------- */
  function experiencePage() {
    $("#sub-hero").innerHTML = pageHero("Experience", "경력 · 연구 이력", "실험실에서 데이터를 만들던 일부터 사내 AI 시스템을 설계하는 지금까지, 소속별로 맡은 역할과 프로젝트입니다.");
    $("#exp-full").innerHTML = ORGS.map((o) => {
      const ch = D.chapters.find((c) => c.n === o.chapter);
      return `<article class="xcard rv">
        <div class="xside">${orgMark(o)}<div class="date">${esc(ym(o.period_start))} ~ ${esc(o.period_end === "현재" ? "현재" : ym(o.period_end))}</div>${ch ? `<span class="chip v">${esc(ch.en)}</span>` : ""}</div>
        <div class="xbody">
          <h2><a class="org-go" href="${orgUrl(o)}">${esc(o.name)}<span class="arr" aria-hidden="true">${ICON.arrow}</span></a></h2>
          <div class="ltags">${o.role.split(" · ").map((r) => `<span class="ltag">${esc(r)}</span>`).join("")}${o.location ? `<span class="ltag loc">${esc(o.location)}</span>` : ""}</div>
          <p class="prose">${esc(o.description)}</p>
          <ul class="xproj">${o.projects.map((p) => `<li><a href="${projUrl(p)}">${ptag(p)}<b>${esc(p.title)}</b><span>${esc(p.period)}</span></a></li>`).join("")}</ul>
        </div>
      </article>`;
    }).join("");
    $("#honors-body").innerHTML = honors();
  }

  /* ---------- PROJECTS ---------- */
  function projectsPage() {
    const withImg = PROJECTS.filter((p) => imagesOf(p).length);
    const fan = [...withImg.filter((p) => p.featured), ...withImg].slice(0, 5);
    $("#sub-hero").outerHTML = `
      <section class="pj-hero">
        <div class="wrap pj-hero-grid">
          <div class="rv">
            <h1>Projects</h1>
            <h2>AX · AI Engineering</h2>
            <p>사내 업무를 시스템으로 옮기고 그 위에 LLM · 에이전트를 얹는 AX 프로젝트부터, 멀티모달 · 생성 모델 연구와 데이터 분석까지.</p>
            <p>모든 프로젝트는 같은 양식으로 정리했습니다. 카드를 누르면 핵심 요약부터 성과 측정, AX 확장 방향까지 볼 수 있습니다.</p>
          </div>
          <div class="fan rv" aria-hidden="true">${fan.map((p, i) => `<img style="--k:${i - Math.floor(fan.length / 2)}" src="${esc(imagesOf(p)[0][0])}" alt="">`).join("")}</div>
        </div>
      </section>`;
    const OTHER = ["independent", "pnu-bit-virus-lab", "dong-eui-univ"];
    const groupOf = (o) => (OTHER.includes(o.id) ? "etc" : o.id);
    const groups = [{ id: "all", label: "All" }, ...ORGS.filter((o) => !OTHER.includes(o.id)).map((o) => ({ id: o.id, label: o.short })), { id: "etc", label: "그 외" }];
    $("#filters").innerHTML = groups.map((g, i) => `<button class="${i ? "" : "on"}" data-f="${g.id}">${esc(g.label)}</button>`).join("");
    const PER = 9;
    let filter = "all", page = 1;
    const draw = () => {
      const items = PROJECTS.filter((p) => filter === "all" || groupOf(p._org) === filter);
      const pages = Math.max(1, Math.ceil(items.length / PER));
      page = Math.min(page, pages);
      $("#pgrid").innerHTML = items.slice((page - 1) * PER, page * PER).map((p) => `
        <a class="gcard" href="${projUrl(p)}">
          <div class="gimg">${media(p)}</div>
          <div class="gtags">${p.product_name ? `<span class="ptag">${esc(p.product_name)}</span>` : ""}${list(p.tags)[0] ? `<span class="mtag">${esc(p.tags[0])}</span>` : ""}${p.award ? awardTag(p) : ""}</div>
          <div class="gcap"><small>${esc(p._org.short)} · ${esc(p.period)}</small><b>${esc(p.title)}</b></div>
        </a>`).join("");
      $("#pager").innerHTML = pages < 2 ? "" : `<button data-p="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="이전">‹</button>${Array.from({ length: pages }, (_, k) => `<button data-p="${k + 1}" class="${k + 1 === page ? "on" : ""}">${k + 1}</button>`).join("")}<button data-p="${page + 1}" ${page === pages ? "disabled" : ""} aria-label="다음">›</button>`;
      $$("#pager button").forEach((b) => b.addEventListener("click", () => { page = +b.dataset.p; draw(); $("#filters").scrollIntoView({ behavior: "smooth", block: "start" }); }));
    };
    $$("#filters button").forEach((b) => b.addEventListener("click", () => {
      $$("#filters button").forEach((x) => x.classList.toggle("on", x === b));
      filter = b.dataset.f; page = 1; draw();
    }));
    draw();
  }

  // Theme toggle in the hero panel: light shows scene 1, dark shows scene 2. Choice persists per viewer.
  function heroVisual() {
    const panel = $("#hv-panel"), stage = $("#hv-stage"), sw = $(".hv-toggle .switch");
    if (!panel) return;
    const scenes = $$(".scene", stage);
    const root = document.documentElement;
    const show = (k) => scenes.forEach((s, n) => {
      if (n === k) { s.classList.remove("out"); s.classList.add("on"); }
      else if (s.classList.contains("on")) { s.classList.remove("on"); s.classList.add("out"); setTimeout(() => s.classList.remove("out"), 900); }
    });
    const apply = (dark, save) => {
      root.dataset.theme = dark ? "dark" : "light";
      sw.setAttribute("aria-checked", dark);
      show(dark ? 1 : 0);
      if (save) { try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* storage blocked */ } }
    };
    apply(root.dataset.theme === "dark", false);
    sw.addEventListener("click", () => apply(root.dataset.theme !== "dark", true));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, scrollY / (panel.offsetHeight + 200)));
        panel.style.setProperty("--p", p.toFixed(3));
        ticking = false;
      });
    };
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- ORG ---------- */
  function orgPage() {
    const o = orgById[params.get("id")] || ORGS[0];
    document.title = `${o.short} | 황류이 Portfolio`;
    const ch = D.chapters.find((c) => c.n === o.chapter);
    $("#sub-hero").innerHTML = `
      <div class="wrap">
        ${ch ? `<span class="eyebrow"><i></i>${esc(ch.en)} · ${esc(ch.ko)}</span>` : ""}
        <h1>${esc(o.name)}</h1>
        <p class="tagline">${esc(o.description || o.one_liner)}</p>
        <div class="meta-tags">
          <div><span class="ltag">Period</span><b>${esc(o.period_start)} ~ ${esc(o.period_end)}</b></div>
          <div><span class="ltag">Role</span><b>${esc(o.role)}</b></div>
          ${o.location ? `<div><span class="ltag">Location</span><b>${esc(o.location)}</b></div>` : ""}
        </div>
      </div>`;
    // Same image cards as the Projects page, with the project details kept inside.
    $("#org-projects").innerHTML = o.projects.map((p) => `
      <a class="ocard rv" href="${projUrl(p)}">
        <div class="gimg">${media(p)}<div class="gtags">${p.product_name ? `<span class="ptag">${esc(p.product_name)}</span>` : ""}${list(p.tags)[0] ? `<span class="mtag">${esc(p.tags[0])}</span>` : ""}${awardTag(p)}</div></div>
        <div class="obody">
          <div class="ometa"><span>${esc(p.period)}</span><span>${esc(p.role.split(" · ")[0])}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.define)}</p>
          <div class="chips">${list(p.tags).slice(0, 4).map((t) => `<span class="chip v">${esc(t)}</span>`).join("")}</div>
          <span class="go">자세히 보기 ${ICON.arrow}</span>
        </div>
      </a>`).join("");
    const k = ORGS.indexOf(o);
    const prev = ORGS[k + 1], next = ORGS[k - 1];
    $("#org-nav").innerHTML = `${prev ? `<a href="${orgUrl(prev)}"><small>← 이전 경력</small><b>${esc(prev.short)}</b></a>` : "<span></span>"}${next ? `<a class="next" href="${orgUrl(next)}"><small>다음 경력 →</small><b>${esc(next.short)}</b></a>` : ""}`;
  }

  /* ---------- PROJECT (PMS 6-part layout) ---------- */
  function projectPage() {
    const p = projById[params.get("id")] || PROJECTS[0];
    const o = p._org;
    document.title = `${shortTitle(p)} | 황류이 Portfolio`;
    $("#sub-hero").innerHTML = `
      <div class="wrap">
        <span class="eyebrow"><i></i>${esc(o.short)}${p.award ? ` · 🏆 ${esc(p.award)}` : ""}</span>
        ${ptag(p)}<h1>${esc(p.title)}</h1>
        ${p.tagline ? `<p class="tagline">${esc(p.tagline)}</p>` : ""}
        <div class="meta-row">
          <div><small>Period</small>${esc(p.period)}</div>
          <div><small>Role</small>${esc(p.role)}</div>
        </div>
        <div class="chips">${list(p.tags).map((t) => `<span class="chip v">${esc(t)}</span>`).join("")}</div>
      </div>`;

    const table = (head, rows, lastStrong) => `<div class="tbl-wrap"><table class="tbl"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${lastStrong && i === r.length - 1 ? ' class="to"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    const bullets = (arr) => `<ul class="blist">${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const subT = (t) => `<h3 class="sub-t">${esc(t)}</h3>`;

    const secs = [];
    const add = (num, title, sub, body) => { if (body) secs.push({ num, title, sub, body }); };

    // 01 핵심 요약
    add("01", "핵심 요약", "한 줄 정의 · 핵심 가치",
      (p.define ? `<div class="define">${esc(p.define)}</div>` : "") +
      (list(p.values).length ? `<div class="values">${p.values.map(([t, d]) => `<div class="value"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : ""));

    // 02 배경 및 문제 정의
    add("02", "배경 및 문제 정의", "추진 배경 · Pain Points",
      [list(p.bg).length ? subT("추진 배경") + bullets(p.bg) : "",
       list(p.pains).length ? subT("Pain Points → Needs") + table(["Pain Point", "기존 (AS-IS)", "필요한 것 (Needs)"], p.pains, true) : ""].join(""));

    // 03 문제 해결 방안
    add("03", "문제 해결 방안", "해결 전략 · AS-IS → TO-BE",
      [p.decision ? `<div class="decision"><small>핵심 결정</small><b>${esc(p.decision)}</b></div>` : "",
       list(p.points).length ? `<ol class="steps">${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` : "",
       list(p.asis).length ? subT("AS-IS → TO-BE") + table(["업무", "AS-IS", "TO-BE"], p.asis, true) : ""].join(""));

    // 04 기술스택 및 아키텍처
    add("04", "기술스택 및 아키텍처", "영역별 기술 · 아키텍처 · 파이프라인",
      [list(p.stack).length ? subT("영역별 기술스택 · 선택 이유") + table(["영역", "기술", "선택 이유"], p.stack) : "",
       list(p.arch).length ? subT("아키텍처") + `<div class="arch">${p.arch.map(([n, items]) => `<div class="layer"><h4>${esc(n)}</h4><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>` + (p.flow ? `<div class="flowline"><small>Flow</small>${esc(p.flow)}</div>` : "") : "",
       list(p.pipes).length ? subT("파이프라인") + p.pipes.map(([n, steps, note]) => `<div class="pipe"><h4>${esc(n)}</h4><ol style="--cols:${steps.length <= 6 ? steps.length : Math.ceil(steps.length / 2)}">${steps.map((s, k) => `<li><i>${String(k + 1).padStart(2, "0")}</i>${esc(s)}</li>`).join("")}</ol>${note ? `<p>${esc(note)}</p>` : ""}</div>`).join("") : "",
       list(p.techniques).length ? subT("핵심 기법") + `<div class="tech-grid">${p.techniques.map(([n, d]) => `<div class="tech"><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : "",
       list(p.notes).length ? subT("설계 포인트") + bullets(p.notes) : "",
       list(p.figures).length ? subT("실험 자료") + `<div class="figs">${p.figures.map(([src, cap], i) => `<figure><button data-fig="${i}" aria-label="이미지 확대"><img src="${esc(src)}" alt="${esc(cap)}" loading="lazy"></button><figcaption>${esc(cap)}</figcaption></figure>`).join("")}</div>` : ""].join(""));

    // 05 성과 측정: the only place for numbers
    add("05", "성과 측정", "정량 지표",
      list(p.kpis).length ? `<div class="kpis">${p.kpis.map(([v, l, s]) => `<div class="kpi"><span class="v">${esc(v)}</span><span class="l">${esc(l)}</span>${s ? `<span class="s">${esc(s)}</span>` : ""}</div>`).join("")}</div>${p.kpiNote ? `<p class="kpi-note">※ ${esc(p.kpiNote)}</p>` : ""}` : "");

    // 06 기대 효과
    add("06", "기대 효과", "효과 · 확장",
      (list(p.impact).length ? bullets(p.impact) : "") +
      (list(p.ax_next).length ? subT("AX 확장 방향 (예정 · 검토)") + `<div class="tech-grid">${p.ax_next.map(([n, d]) => `<div class="tech ax"><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : ""));

    const gallery = list(p.images);
    // Spread screenshots through sections 01-04 as numbered figures instead of a top gallery.
    const figAt = (k) => `<figure class="dfig"><button data-img="${k}" aria-label="이미지 확대"><img src="${esc(gallery[k])}" alt="${esc((p.captions || [])[k] || shortTitle(p))}" loading="lazy"></button><figcaption><b>Figure ${k + 1}.</b> ${esc((p.captions || [])[k] || shortTitle(p))}</figcaption></figure>`;
    gallery.forEach((_, k) => { const sec = secs[Math.min(k, secs.length - 1, 3)]; if (sec) sec.body += figAt(k); });
    const siblings = o.projects;
    const i = siblings.indexOf(p);
    const prev = siblings[i - 1], next = siblings[i + 1];
    $("#doc-main").innerHTML = `
      ${secs.map((s) => `<section class="dsec rv" id="s${s.num}"><div class="dhead"><span class="num">${s.num}</span><div><h2>${esc(s.title)}</h2><small>${esc(s.sub)}</small></div></div>${s.body}</section>`).join("")}
      <div class="pnav">${prev ? `<a href="${projUrl(prev)}"><small>← 이전 프로젝트</small><b>${esc(shortTitle(prev))}</b></a>` : `<a href="${orgUrl(o)}"><small>← 소속으로</small><b>${esc(o.short)}</b></a>`}${next ? `<a class="next" href="${projUrl(next)}"><small>다음 프로젝트 →</small><b>${esc(shortTitle(next))}</b></a>` : `<a class="next" href="projects.html"><small>전체 보기 →</small><b>All Projects</b></a>`}</div>`;

    const links = p.links || {};
    $("#toc").innerHTML = `
      <h5>Contents</h5>
      <nav>${secs.map((s) => `<a href="#s${s.num}"><b>${s.num}</b>${esc(s.title)}</a>`).join("")}</nav>
      ${list(p.tech).length ? `<div class="side-box"><h5>Tech</h5><div class="chips">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>` : ""}
      ${Object.keys(links).length ? `<div class="side-box links"><h5>Links</h5>${Object.entries(links).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div>` : ""}`;

    if (gallery.length) {
      const open = lightbox(gallery.map((s, k) => [s, (p.captions || [])[k] || ""]));
      $$("[data-img]").forEach((b) => b.addEventListener("click", () => open(+b.dataset.img)));
    }
    if (list(p.figures).length) {
      const open = lightbox(p.figures);
      $$("[data-fig]").forEach((b) => b.addEventListener("click", () => open(+b.dataset.fig)));
    }

    // Highlight the current section in the TOC.
    if ("IntersectionObserver" in window) {
      const links = $$("#toc nav a");
      const io = new IntersectionObserver((ents) => ents.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
      }), { rootMargin: "-30% 0px -60% 0px" });
      $$(".dsec").forEach((s) => io.observe(s));
    }
  }

  /* ---------- boot ---------- */
  chrome();
  const page = document.body.dataset.page;
  if (page === "home") home();
  if (page === "org") orgPage();
  if (page === "project") projectPage();
  if (page === "about") aboutPage();
  if (page === "work") workPage();
  if (page === "experience") experiencePage();
  if (page === "projects") projectsPage();
  contactRow();
  reveal();
})();
