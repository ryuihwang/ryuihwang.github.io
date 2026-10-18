(function () {
  "use strict";
  const D = window.CAREER;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(location.search);

  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
    brief: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>',
  };

  /* ---------- lookups ---------- */
  const ORGS = D.orgs;
  const orgById = Object.fromEntries(ORGS.map((o) => [o.id, o]));
  const PROJECTS = [];
  ORGS.forEach((o) => o.projects.forEach((p, i) => PROJECTS.push(Object.assign(p, { _org: o, _idx: i }))));
  const projById = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const projUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const orgUrl = (o) => `org.html?id=${encodeURIComponent(o.id)}`;
  const cls = (o) => `c${o.chapter || 3}`;
  const yr = (s) => String(s || "").slice(0, 7);
  const glyph = (p) => {
    if (p.product_name) return p.product_name;
    const m = (p.title || "").match(/^[A-Za-z][A-Za-z0-9-]*/) || list(p.tags).join(" ").match(/[A-Z][A-Za-z0-9-]+/);
    return m ? m[0].slice(0, 6) : p._org.badge;
  };
  const coverHTML = (p, rich = true) => {
    const c = p.cover;
    const inner = rich ? `<div class="cv-in"><span class="cv-name">${esc(p.product_name || glyph(p))}</span>${c ? `<span class="cv-metric">${esc(c.metric)}</span><span class="cv-label">${esc(c.label)}</span>` : `<span class="cv-label">${esc(list(p.tags).slice(0, 3).join(" · "))}</span>`}</div>` : "";
    return `<div class="cover ${cls(p._org)}"><div class="dots"></div><div class="glyph">${esc(glyph(p))}</div>${inner}</div>`;
  };
  const thumbHTML = (p) => (p.images && p.images.length ? `<img src="${esc(p.images[0])}" alt="" loading="lazy">` : coverHTML(p));
  // Wrap numbers in <b> so metrics pop.
  const NUM_RE = /(\d[\d,.]*\s?(?:%p|%|명|건|개|배|초|분|줄|주|일|원|종|단계|문항|점)?(?:\s?→\s?\d[\d,.]*\s?(?:%p|%|명|건|개|배|초|분)?)?)/;
  const numHL = (s) => String(s ?? "").split(NUM_RE).map((part, i) => (i % 2 ? `<b>${esc(part)}</b>` : esc(part))).join("");
  const short = (p) => (p.title || "").split(/\s[—:-]\s/)[0];
  const list = (a) => (Array.isArray(a) ? a : a ? [a] : []);

  /* ---------- shared chrome ---------- */
  function chrome(active) {
    const nav = $("#nav");
    if (nav) {
      const home = document.body.dataset.page === "home" ? "" : "index.html";
      nav.innerHTML = `<div class="wrap">
        <a class="brand" href="index.html"><span class="mark">RH</span>RYU I HWANG</a>
        <button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          <a href="${home}#about">About</a><a href="${home}#journey">Journey</a><a href="${home}#career">Career</a>
          <a href="${home}#projects">Projects</a><a href="${home}#honors">Honors</a><a href="${home}#contact">Contact</a>
          <a class="btn btn-primary" href="resume.html">${ICON.doc.replace("<svg", '<svg width="16" height="16"')} 이력서</a>
        </nav></div>`;
      const btn = $(".menu-btn", nav);
      btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
      $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
      const onScroll = () => nav.classList.toggle("solid", scrollY > 40);
      onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    const f = $("#footer");
    if (f) f.innerHTML = `<div class="wrap"><span>© ${new Date().getFullYear()} ${esc(D.profile.name)} · ${esc(D.profile.name_en)}</span><span><a href="${esc(D.profile.github)}" target="_blank" rel="noopener">GitHub</a> · <a href="${esc(D.profile.velog)}" target="_blank" rel="noopener">Velog</a> · <a href="mailto:${esc(D.profile.email)}">${esc(D.profile.email)}</a></span></div>`;
  }

  function reveal() {
    const els = $$(".rv");
    if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  function lightbox(imgs) {
    let lb = $(".lb");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lb";
      lb.innerHTML = '<button class="x" aria-label="닫기">×</button><button class="lbn prev" aria-label="이전">‹</button><img alt=""><button class="lbn nxt" aria-label="다음">›</button>';
      document.body.appendChild(lb);
    }
    let i = 0;
    const show = (k) => { i = (k + imgs.length) % imgs.length; $("img", lb).src = imgs[i]; };
    const close = () => lb.classList.remove("on");
    $(".x", lb).onclick = close;
    lb.onclick = (e) => { if (e.target === lb) close(); };
    $(".prev", lb).onclick = () => show(i - 1);
    $(".nxt", lb).onclick = () => show(i + 1);
    $$(".prev,.nxt", lb).forEach((b) => (b.style.display = imgs.length > 1 ? "" : "none"));
    addEventListener("keydown", (e) => { if (!lb.classList.contains("on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    return (k) => { show(k); lb.classList.add("on"); };
  }

  /* ---------- HOME ---------- */
  function home() {
    const P = D.profile;
    const awardsTop = D.awards.filter((a) => /대상|최우수/.test(a.title)).length;
    const startYear = 2021;
    $("#hero").innerHTML = `
      <div class="grid-bg"></div><div class="hero-giant" aria-hidden="true">AX</div>
      <div class="wrap">
        <div class="hero-inner">
          <div class="rv">
            <span class="eyebrow"><span class="dot"></span>${esc(P.name)} · ${esc(P.name_en)} — 이스트소프트 EST-LAB 재직 중</span>
            <h1>From <span class="hl">Bench</span><br>to <span class="hl">Bot.</span></h1>
            <p class="hero-lede">바이오 실험실에서 출발해 <strong>데이터 → AI 모델 → 실제 서비스</strong>로 영역을 넓혀 온 <strong>AI · AX 엔지니어</strong>입니다. 지금은 사내 업무를 LLM·RAG·Agent로 다시 설계해, 정확하고 안전하게 운영되는 시스템을 만듭니다.</p>
            <div class="hero-cta">
              <a class="btn btn-primary" href="#projects">프로젝트 보기 ${ICON.arrow.replace("<svg", '<svg width="16" height="16"')}</a>
              <a class="btn btn-ghost" href="resume.html">이력서 열기</a>
            </div>
          </div>
          <div class="hero-photo rv">
            <div class="frame"><img src="${esc(P.photo.replace("assets/", "assets/img/"))}" alt="${esc(P.name)} 프로필 사진"></div>
            <div class="quote-card"><b>“</b>모델은 제안하고, 코드가 검증하고, 사람이 결정한다.</div>
          </div>
        </div>
        <div class="stats rv">
          <div class="stat"><b>${new Date().getFullYear() - startYear}+ yrs</b><span>연구 · 개발 여정</span></div>
          <div class="stat"><b>${ORGS.length}</b><span>소속 조직 · 연구실</span></div>
          <div class="stat"><b>${PROJECTS.length}</b><span>수행 프로젝트</span></div>
          <div class="stat"><b>${awardsTop}</b><span>대상 · 최우수상</span></div>
        </div>
      </div>`;
    const kw = ["LLM Agent", "RAG", "LangGraph", "sLLM", "DX · AX", "FastAPI", "React", "Multimodal AI", "Diffusion", "Time-series Anomaly", "Bioinformatics", "Drug Screening"];
    $("#marquee").innerHTML = `<div class="track">${[...kw, ...kw].map((k) => `<span>${esc(k)}</span>`).join("")}</div>`;

    // About
    const edu = D.education[0];
    $("#about-body").innerHTML = `
      <div class="about-text rv">
        <p>${esc(P.summary_ko).replace(/(데이터, AI 모델, 그리고 실제 서비스)/, "<b>$1</b>").replace(/(1·2차 프로젝트 대상)/, "<b>$1</b>").replace(/(단독으로 설계·개발)/, "<b>$1</b>")}</p>
        <div class="chips" style="margin-top:22px">${(P.keywords || []).map((k) => `<span class="chip v">${esc(k)}</span>`).join("")}</div>
        <div class="motto">“${esc(P.motto)}”</div>
      </div>
      <div class="facts rv">
        <div class="fact"><span class="ico">${ICON.brief}</span><div><small>Now</small>이스트소프트 EST-LAB<span>AI-ML 개발자 · 사내 DX·AX 시스템 설계 및 개발</span></div></div>
        <div class="fact"><span class="ico">${ICON.cap}</span><div><small>Education</small>${esc(edu.school)} ${esc(edu.degree)}<span>${esc(edu.major)} · ${esc(edu.minor)} · GPA ${esc(edu.gpa)}</span></div></div>
        <div class="fact"><span class="ico">${ICON.trophy}</span><div><small>Highlights</small>이스트캠프 1·2차 프로젝트 대상 · 이달의 러너<span>AACR 2024 포스터 공동저자 · 특허 출원 1건</span></div></div>
        <div class="fact"><span class="ico">${ICON.badge}</span><div><small>Certificates</small>${D.certificates.slice(0, 3).map((c) => esc(c.name.split(" (")[0])).join(" · ")}<span>${D.certificates.slice(3).map((c) => esc(c.name)).join(" · ")}</span></div></div>
      </div>`;

    // Journey
    $("#chapters").innerHTML = D.chapters.map((c) => `
      <div class="chapter c${c.n} rv">
        <div class="num">0${c.n}</div>
        <div class="yr">${esc(c.years)}</div>
        <h3>${esc(c.en)}</h3><div class="ko">${esc(c.ko)}</div>
        <p>${esc(c.desc)}</p>
        <div class="orgs">${c.orgs.map((id) => orgById[id]).filter(Boolean).map((o) => `<a href="${orgUrl(o)}">${esc(o.short)} <em>${o.projects.length} projects</em></a>`).join("")}</div>
      </div>`).join("");

    // Timeline
    $("#timeline").innerHTML = ORGS.map((o) => {
      const ch = D.chapters.find((c) => c.n === o.chapter);
      return `<div class="tl-item ${cls(o)} rv">
        <div class="tl-date">${esc(yr(o.period_start))}<span>— ${esc(o.period_end === "현재" ? "현재" : yr(o.period_end))}</span></div>
        <a class="tl-card" href="${orgUrl(o)}">
          <div class="tl-top">
            <div class="tl-head"><span class="org-badge">${esc(o.badge)}</span><div><h3>${esc(o.name)}</h3><p>${esc(o.role)}</p></div></div>
            ${ch ? `<span class="ch-tag">${esc(ch.ko)}</span>` : ""}
          </div>
          <p class="one">${esc(o.one_liner)}</p>
          <div class="proj-links">${o.projects.map((p) => `<span class="pl" data-href="${projUrl(p)}">${esc(short(p))}</span>`).join("")}</div>
          <span class="tl-more">조직 상세 · 프로젝트 ${o.projects.length}개 ${ICON.arrow}</span>
        </a></div>`;
    }).join("");
    // Inner project chips act as links without nesting <a>.
    $$("#timeline .pl").forEach((s) => {
      s.setAttribute("role", "link"); s.tabIndex = 0;
      const go = (e) => { e.preventDefault(); e.stopPropagation(); location.href = s.dataset.href; };
      s.addEventListener("click", go);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter") go(e); });
    });

    // Featured
    const feat = ["pms", "estory", "est-flow", "smd-anomaly-dashboard", "youth-2030-employment", "homi-ai", "mmgene", "ssl-rep-style-transfer"].map((id) => projById[id]).filter(Boolean);
    $("#feat-grid").innerHTML = feat.map((p, i) => `
      <a class="feat ${i < 2 ? "big" : ""} ${cls(p._org)} rv" href="${projUrl(p)}">
        <div class="bg">${p.images && p.images.length ? `<img src="${esc(p.images[0])}" alt="" loading="lazy">` : coverHTML(p, false)}</div>
        <div class="top"><span class="org">${esc(p._org.short)}</span>${p.award ? `<span class="award">🏆 ${esc(p.award.split(" (")[0])}</span>` : ""}</div>
        <div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <div class="chips">${list(p.tags).slice(0, 4).map((t) => `<span class="chip dark">${esc(t)}</span>`).join("")}</div>
        </div>
      </a>`).join("");

    // All projects + filters
    const groups = [{ id: "all", label: "전체", n: PROJECTS.length }, ...ORGS.map((o) => ({ id: o.id, label: o.short, n: o.projects.length }))];
    $("#filters").innerHTML = groups.map((g, i) => `<button class="${i ? "" : "on"}" data-f="${g.id}">${esc(g.label)}<span class="n">${g.n}</span></button>`).join("");
    $("#pgrid").innerHTML = PROJECTS.map((p) => `
      <a class="pcard ${cls(p._org)}" data-org="${p._org.id}" href="${projUrl(p)}">
        <div class="thumb">${thumbHTML(p)}${p.award ? `<span class="award">🏆 ${esc(p.award.split(" (")[0])}</span>` : ""}</div>
        <div class="body">
          <div class="meta"><span>${esc(p._org.short)}</span><span>${esc((p.period || "").split(" (")[0])}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <div class="tags">${list(p.tags).slice(0, 4).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
      </a>`).join("");
    $$("#filters button").forEach((b) => b.addEventListener("click", () => {
      $$("#filters button").forEach((x) => x.classList.toggle("on", x === b));
      $$("#pgrid .pcard").forEach((c) => c.classList.toggle("hide", b.dataset.f !== "all" && c.dataset.org !== b.dataset.f));
    }));

    // Skills
    $("#skills").innerHTML = Object.entries(D.skills).map(([k, v]) => `
      <div class="skill-box rv"><h4>${esc(k)}</h4><div class="chips">${v.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("");

    // Honors
    const pl = (id) => (projById[id] ? ` <a href="${projUrl(projById[id])}">프로젝트 →</a>` : "");
    $("#honors-body").innerHTML = `
      <div class="panel rv"><h3><span class="ico">${ICON.trophy}</span>Awards</h3><ul class="list">
        ${D.awards.map((a) => `<li><time>${esc(a.date.slice(0, 7))}</time><div><b>${esc(a.title)}</b><small>${esc(a.issuer)}${pl(a.project_id)}</small></div></li>`).join("")}
      </ul></div>
      <div style="display:grid;gap:24px;align-content:start">
        <div class="panel rv"><h3><span class="ico">${ICON.doc}</span>Publications & Patent</h3><ul class="list">
          ${D.publications_patents.map((x) => `<li><time>${esc(String(x.date).slice(0, 7))}</time><div><b>${esc(x.title)}</b><small>${esc(x.type)}${x.venue ? " · " + esc(x.venue) : ""}${x.number ? " · " + esc(x.number) : ""}${pl(x.project_id)}</small></div></li>`).join("")}
        </ul></div>
        <div class="panel rv"><h3><span class="ico">${ICON.badge}</span>Certificates</h3><ul class="list">
          ${D.certificates.map((c) => `<li><time>${esc(c.date)}</time><div><b>${esc(c.name)}</b><small>${esc(c.issuer)}</small></div></li>`).join("")}
        </ul></div>
      </div>`;

    $("#contact-row").innerHTML = `
      <a class="btn btn-light" href="mailto:${esc(P.email)}">${esc(P.email)}</a>
      <a class="btn btn-ghost" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ${ICON.ext}</a>
      <a class="btn btn-ghost" href="${esc(P.velog)}" target="_blank" rel="noopener">Velog ${ICON.ext}</a>
      <a class="btn btn-primary" href="resume.html">이력서 보기</a>`;
  }

  /* ---------- ORG ---------- */
  function orgPage() {
    const o = orgById[params.get("id")] || ORGS[0];
    document.title = `${o.short} — 황류이 Portfolio`;
    document.body.classList.add(cls(o));
    const ch = D.chapters.find((c) => c.n === o.chapter);
    $("#sub-hero").innerHTML = `
      <div class="giant" aria-hidden="true">${esc(o.badge)}</div>
      <div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a><i>/</i><a href="index.html#career">Career</a><i>/</i><span>${esc(o.short)}</span></div>
        ${ch ? `<span class="eyebrow" style="margin-bottom:20px"><span class="dot" style="background:var(--acc);box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 25%,transparent)"></span>Chapter 0${ch.n} · ${esc(ch.en)}</span>` : ""}
        <h1>${esc(o.name)}</h1>
        ${o.name_en ? `<div class="en">${esc(o.name_en)}</div>` : ""}
        <p class="lead">${esc(o.description || o.one_liner)}</p>
        <div class="meta-row">
          <div><small>Period</small>${esc(o.period_start)} — ${esc(o.period_end)}</div>
          <div><small>Role</small>${esc(o.role)}</div>
          ${o.team ? `<div><small>Team</small>${esc(o.team)}</div>` : ""}
          ${o.location ? `<div><small>Location</small>${esc(o.location)}</div>` : ""}
          <div><small>Projects</small>${o.projects.length}개</div>
        </div>
      </div>`;
    $("#org-projects").innerHTML = o.projects.map((p, i) => `
      <a class="op rv" href="${projUrl(p)}">
        <div class="op-media">${thumbHTML(p)}<span class="idx">${String(i + 1).padStart(2, "0")}</span></div>
        <div class="op-body">
          <div class="meta">${esc(p.period || "")}${p.award ? ` · 🏆 ${esc(p.award.split(" (")[0])}` : ""}</div>
          <h3>${esc(p.title)}</h3>
          ${p.subtitle ? `<div class="subt">${esc(p.subtitle)}</div>` : ""}
          <p>${esc(p.summary)}</p>
          <ul>${list(p.highlights && p.highlights.length ? p.highlights : p.results).slice(0, 3).map((r) => `<li>${numHL(r)}</li>`).join("")}</ul>
          <span class="go">자세히 보기 ${ICON.arrow}</span>
        </div>
      </a>`).join("");
    const extra = $("#org-extra");
    if (o.other_repos && o.other_repos.length && extra) {
      extra.innerHTML = `<div class="p-block rv" style="margin-top:56px"><h2>Team Context</h2><p>EST-LAB에서 함께 운영되는 사내 서비스들입니다. 직접 개발한 시스템은 이들과 Teams·SSO·알림 채널을 공유하도록 설계했습니다.</p>
        <div class="features">${o.other_repos.map((r) => `<div class="feature"><b>${esc(r.repo)}</b><span>${esc(r.desc)}</span></div>`).join("")}</div></div>`;
    }
    const k = ORGS.indexOf(o);
    const prev = ORGS[k + 1], next = ORGS[k - 1];
    $("#org-nav").innerHTML = `${prev ? `<a href="${orgUrl(prev)}"><small>← 이전 커리어</small><b>${esc(prev.short)}</b></a>` : "<span></span>"}${next ? `<a class="next" href="${orgUrl(next)}"><small>다음 커리어 →</small><b>${esc(next.short)}</b></a>` : ""}`;
  }

  /* ---------- PROJECT ---------- */
  function projectPage() {
    const p = projById[params.get("id")] || PROJECTS[0];
    const o = p._org;
    document.title = `${short(p)} — 황류이 Portfolio`;
    document.body.classList.add(cls(o));
    $("#sub-hero").innerHTML = `
      <div class="giant" aria-hidden="true">${esc(glyph(p))}</div>
      <div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a><i>/</i><a href="${orgUrl(o)}">${esc(o.short)}</a><i>/</i><span>${esc(short(p))}</span></div>
        <h1>${esc(p.title)}</h1>
        ${p.subtitle ? `<div class="en" style="font-family:var(--sans)">${esc(p.subtitle)}</div>` : ""}
        <div class="meta-row">
          <div><small>Organization</small>${esc(o.short)}</div>
          <div><small>Period</small>${esc(p.period || "-")}</div>
          <div><small>Role</small>${esc(p.role || o.role)}</div>
        </div>
      </div>`;

    const blocks = [];
    const imgs = list(p.images);
    if (imgs.length) blocks.push(`<div class="gallery rv">${imgs.map((s, i) => `<button data-i="${i}" aria-label="이미지 확대"><img src="${esc(s)}" alt="${esc(short(p))} 이미지 ${i + 1}" loading="lazy"></button>`).join("")}</div>`);
    blocks.push(`<div class="p-block rv"><h2>Overview</h2><p class="big">${esc(p.summary)}</p></div>`);
    if (p.highlights && p.highlights.length) blocks.push(`<div class="p-block rv"><h2>Highlights</h2><ul class="hl-list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>`);
    if (p.problem) blocks.push(`<div class="p-block rv"><h2>Problem</h2><p>${esc(p.problem)}</p></div>`);
    if (list(p.approach).length) blocks.push(`<div class="p-block rv"><h2>Approach</h2><ol class="steps">${list(p.approach).map((a) => `<li>${esc(a)}</li>`).join("")}</ol></div>`);
    if (p.architecture && list(p.architecture.layers).length) {
      blocks.push(`<div class="p-block rv"><h2>Architecture</h2><div class="arch">${p.architecture.layers.map((l) => `<div class="layer"><h4>${esc(l.name)}</h4><ul>${list(l.items).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
        ${p.architecture.flow ? `<div class="flow"><b>Flow —</b> ${esc(p.architecture.flow)}</div>` : ""}</div>`);
    }
    const feat = (arr, title) => {
      if (!list(arr).length) return;
      blocks.push(`<div class="p-block rv"><h2>${title}</h2><div class="features">${list(arr).map((f) => typeof f === "string" ? `<div class="feature"><span style="color:#363c5c">${esc(f)}</span></div>` : `<div class="feature"><b>${esc(f.name)}</b><span>${esc(f.desc)}</span></div>`).join("")}</div></div>`);
    };
    feat(p.ax_features, "AX Features");
    feat(p.features, "Features");
    feat(p.security, "Security by Design");
    if (list(p.results).length) blocks.push(`<div class="p-block rv"><h2>Results</h2><div class="results">${list(p.results).map((r) => `<div class="result">${numHL(r)}</div>`).join("")}</div></div>`);

    const siblings = o.projects;
    const i = siblings.indexOf(p);
    const prev = siblings[i - 1], next = siblings[i + 1];
    blocks.push(`<div class="pnav">${prev ? `<a href="${projUrl(prev)}"><small>← 이전 프로젝트</small><b>${esc(short(prev))}</b></a>` : `<a href="${orgUrl(o)}"><small>← 조직으로</small><b>${esc(o.short)}</b></a>`}${next ? `<a class="next" href="${projUrl(next)}"><small>다음 프로젝트 →</small><b>${esc(short(next))}</b></a>` : `<a class="next" href="index.html#projects"><small>전체 보기 →</small><b>All Projects</b></a>`}</div>`);
    $("#p-main").innerHTML = blocks.join("");

    const c = p.contribution;
    const links = p.links || {};
    $("#aside").innerHTML = `
      ${p.award ? `<div class="box award-box"><h5>Award</h5><b>🏆 ${esc(p.award)}</b></div>` : ""}
      ${c && c.commits_total ? `<div class="box"><h5>Contribution</h5><dl><div><dt>커밋</dt><dd>${c.commits_mine} / ${c.commits_total} (${c.share_pct}%)</dd><div class="contrib"><i style="width:${Math.min(100, c.share_pct)}%"></i></div></div>
        ${list(c.areas).length ? `<div><dt>담당 영역</dt><dd><div class="chips" style="margin-top:6px">${c.areas.slice(0, 6).map((a) => `<span class="chip" style="white-space:normal">${esc(a.split(/[:(（]/)[0].trim())}</span>`).join("")}</div></dd></div>` : ""}</dl></div>` : ""}
      ${list(p.tech).length ? `<div class="box"><h5>Tech Stack</h5><div class="chips">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>` : ""}
      ${p.stats && p.stats.loc ? `<div class="box"><h5>Codebase</h5><dl><div><dt>규모</dt><dd style="font-size:13px">${esc(p.stats.loc)}</dd></div>${p.stats.period ? `<div><dt>커밋 기간</dt><dd>${esc(p.stats.period)}</dd></div>` : ""}</dl></div>` : ""}
      ${Object.keys(links).length ? `<div class="box links"><h5>Links</h5>${Object.entries(links).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ${ICON.ext}</a>`).join("")}</div>` : ""}
      ${list(p.tags).length ? `<div class="box"><h5>Tags</h5><div class="chips">${p.tags.map((t) => `<span class="chip v">${esc(t)}</span>`).join("")}</div></div>` : ""}`;

    if (imgs.length) {
      const open = lightbox(imgs);
      $$(".gallery button").forEach((b) => b.addEventListener("click", () => open(+b.dataset.i)));
    }
  }

  /* ---------- boot ---------- */
  chrome();
  const page = document.body.dataset.page;
  if (page === "home") home();
  if (page === "org") orgPage();
  if (page === "project") projectPage();
  reveal();
})();
