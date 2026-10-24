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

  /* ---------- lookups ---------- */
  const ORGS = D.orgs;
  const orgById = Object.fromEntries(ORGS.map((o) => [o.id, o]));
  const PROJECTS = [];
  ORGS.forEach((o) => o.projects.forEach((p) => PROJECTS.push(Object.assign(p, { _org: o }))));
  const projById = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const projUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const orgUrl = (o) => `org.html?id=${encodeURIComponent(o.id)}`;
  const ym = (s) => String(s || "").slice(0, 7);
  const shortTitle = (p) => (p.title || "").split(/\s[—:-]\s/)[0];
  const imagesOf = (p) => (list(p.images).length ? list(p.images).map((src) => [src, ""]) : list(p.figures));
  const cover = (p) => `<div class="cover c${p._org.chapter || 4}"><b>${esc(p.product_name || shortTitle(p))}</b></div>`;
  const media = (p) => {
    const im = imagesOf(p)[0];
    return im ? `<img src="${esc(im[0])}" alt="" loading="lazy">` : cover(p);
  };
  const awardTag = (p) => (p.award ? `<span class="award">🏆 ${esc(p.award)}</span>` : "");

  /* ---------- shared chrome ---------- */
  function chrome() {
    const nav = $("#nav");
    if (nav) {
      const h = document.body.dataset.page === "home" ? "" : "index.html";
      nav.innerHTML = `<div class="wrap">
        <a class="brand" href="index.html"><span class="logo">RH</span>RYU I HWANG</a>
        <button class="menu-btn" aria-label="메뉴 열기" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          <a href="${h}#about">About</a><a href="${h}#focus">What I do</a><a href="${h}#experience">Experience</a>
          <a href="${h}#projects">Projects</a><a href="${h}#contact">Contact</a>
          <a class="btn btn-dark" href="resume.html">Resume ${ICON.down}</a>
        </nav></div>`;
      const btn = $(".menu-btn", nav);
      btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
      $$(".nav-links a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
      const onScroll = () => nav.classList.toggle("solid", scrollY > 10);
      onScroll(); addEventListener("scroll", onScroll, { passive: true });
    }
    const f = $("#footer");
    if (f) f.innerHTML = `<div class="wrap"><span>© ${new Date().getFullYear()} ${esc(D.profile.name)} · ${esc(D.profile.name_en)}</span><span><a href="${esc(D.profile.github)}" target="_blank" rel="noopener">GitHub</a> · <a href="${esc(D.profile.velog)}" target="_blank" rel="noopener">Velog</a> · <a href="mailto:${esc(D.profile.email)}">${esc(D.profile.email)}</a></span></div>`;
  }

  function reveal() {
    const els = $$(".rv");
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

  /* ---------- HOME ---------- */
  function home() {
    const P = D.profile;
    const now = ORGS[0];
    $("#hero").innerHTML = `
      <div class="wrap hero-grid">
        <div class="rv">
          <p class="hello">Hello, I'm <b>${esc(P.name)}</b>.</p>
          <h1>${esc(P.headline[0])}<br><span class="mark">${esc(P.headline[1])}</span></h1>
          <p class="lede">${esc(P.lede)}</p>
          <div class="hero-cta">
            <a class="btn btn-dark" href="#projects">프로젝트 보기 ${ICON.arrow}</a>
            <a class="btn btn-line" href="resume.html">이력서</a>
          </div>
          <div class="socials">
            <a href="${esc(P.github)}" target="_blank" rel="noopener" aria-label="GitHub">${ICON.gh}</a>
            <a href="${esc(P.velog)}" target="_blank" rel="noopener" aria-label="Velog">${ICON.pen}</a>
            <a href="mailto:${esc(P.email)}" aria-label="Email">${ICON.mail}</a>
          </div>
        </div>
        <div class="hero-photo rv">
          <div class="frame"><img src="${esc(P.photo)}" alt="${esc(P.name)} 프로필 사진"></div>
          <div class="quote">${esc(P.principle)}</div>
          <a class="tag" href="${orgUrl(now)}"><small>Now</small>${esc(now.name_en)}</a>
        </div>
      </div>`;
    const kw = [...P.keywords, "FastAPI", "PyTorch", "Data Science"];
    $("#marquee").innerHTML = `<div class="track">${[...kw, ...kw].map((k) => `<span>${esc(k)}</span>`).join("")}</div>`;

    // About
    const edu = D.education[0];
    $("#about-body").innerHTML = `
      <div class="about-text rv">
        ${P.about.map((t) => `<p>${esc(t)}</p>`).join("")}
        <div class="principle">“${esc(P.motto)}”</div>
      </div>
      <div class="facts rv">
        <div class="fact"><span class="ico">${ICON.brief}</span><div><small>Now</small><b>${esc(now.name)}</b><span>${esc(now.role)}</span></div></div>
        <div class="fact"><span class="ico">${ICON.cap}</span><div><small>Education</small><b>${esc(edu.school)} ${esc(edu.degree)}</b><span>${esc(edu.major.replace(" (주전공)", ""))} · 부전공 ${esc(edu.minor.replace(" (부전공)", ""))}</span></div></div>
        <div class="fact"><span class="ico">${ICON.trophy}</span><div><small>Highlights</small><b>이스트캠프 1 · 2차 프로젝트 대상</b><span>AACR 2024 포스터 공동저자 · 특허 출원</span></div></div>
        <div class="fact"><span class="ico">${ICON.badge}</span><div><small>Certificates</small><b>${D.certificates.slice(0, 2).map((c) => esc(c.name.split(" (")[0])).join(" · ")}</b><span>${esc(D.certificates[3].name)}</span></div></div>
      </div>`;

    // What I do
    $("#focus-grid").innerHTML = D.focus.map((f, i) => `
      <div class="fcard rv">
        <span class="n">0${i + 1}</span>
        <h3>${esc(f.t)}</h3>
        <p>${esc(f.d)}</p>
        <div class="chips">${f.k.map((k) => `<span class="chip">${esc(k)}</span>`).join("")}</div>
      </div>`).join("");

    // Experience
    $("#exp-list").innerHTML = ORGS.map((o) => {
      const ch = D.chapters.find((c) => c.n === o.chapter);
      return `<a class="ecard rv" href="${orgUrl(o)}">
        <span class="badge">${esc(o.badge)}</span>
        <div>
          <h3>${esc(o.name)}</h3>
          <div class="role">${esc(o.role)}</div>
          <p class="one">${esc(o.one_liner)}</p>
          <div class="plinks">${o.projects.map((p) => `<span data-href="${projUrl(p)}">${esc(shortTitle(p))}</span>`).join("")}</div>
        </div>
        <div class="date">${esc(ym(o.period_start))} — ${esc(o.period_end === "현재" ? "현재" : ym(o.period_end))}${ch ? `<span>${esc(ch.en)}</span>` : ""}</div>
      </a>`;
    }).join("");
    $$("#exp-list .plinks span").forEach((s) => {
      s.setAttribute("role", "link"); s.tabIndex = 0;
      const go = (e) => { e.preventDefault(); e.stopPropagation(); location.href = s.dataset.href; };
      s.addEventListener("click", go);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter") go(e); });
    });

    // Featured
    const feat = PROJECTS.filter((p) => p.featured);
    $("#feat-list").innerHTML = feat.map((p) => `
      <a class="frow rv" href="${projUrl(p)}">
        <div class="media">${media(p)}</div>
        <div class="body">
          <div class="kicker"><span>${esc(p._org.short)}</span><span>·</span><span>${esc(p.period)}</span>${awardTag(p)}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.define)}</p>
          <div class="chips">${list(p.tags).slice(0, 4).map((t) => `<span class="chip v">${esc(t)}</span>`).join("")}</div>
          <span class="go">자세히 보기 ${ICON.arrow}</span>
        </div>
      </a>`).join("");

    // Archive
    const groups = [{ id: "all", label: "전체", n: PROJECTS.length }, ...ORGS.map((o) => ({ id: o.id, label: o.short, n: o.projects.length }))];
    $("#filters").innerHTML = groups.map((g, i) => `<button class="${i ? "" : "on"}" data-f="${g.id}">${esc(g.label)}<span class="n">${g.n}</span></button>`).join("");
    $("#pgrid").innerHTML = PROJECTS.map((p) => `
      <a class="pcard" data-org="${p._org.id}" href="${projUrl(p)}">
        <div class="thumb">${media(p)}${awardTag(p)}</div>
        <div class="body">
          <div class="meta">${esc(p._org.short)} · ${esc(p.period)}</div>
          <h4>${esc(p.title)}</h4>
          <p>${esc(p.define)}</p>
        </div>
      </a>`).join("");
    $$("#filters button").forEach((b) => b.addEventListener("click", () => {
      $$("#filters button").forEach((x) => x.classList.toggle("on", x === b));
      $$("#pgrid .pcard").forEach((c) => c.classList.toggle("hide", b.dataset.f !== "all" && c.dataset.org !== b.dataset.f));
    }));

    // Skills
    $("#skill-grid").innerHTML = Object.entries(D.skills).map(([k, v]) => `
      <div class="sbox rv"><h4>${esc(k)}</h4><div class="chips">${v.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("");

    // Honors
    const pl = (id) => (projById[id] ? ` · <a href="${projUrl(projById[id])}">프로젝트 →</a>` : "");
    $("#honors-body").innerHTML = `
      <div class="panel rv"><h3><span class="ico">${ICON.trophy}</span>Awards</h3><ul class="hlist">
        ${D.awards.map((a) => `<li><time>${esc(a.date.slice(0, 7))}</time><div><b>${esc(a.title.replace("[이스트캠프] 와썹 AI 모델 개발 13회차", "이스트캠프 13기"))}</b><small>${esc(a.issuer)}${pl(a.project_id)}</small></div></li>`).join("")}
      </ul></div>
      <div class="panel rv"><h3><span class="ico">${ICON.doc}</span>Publications · Patent</h3><ul class="hlist">
        ${D.publications_patents.map((x) => `<li><time>${esc(String(x.date).slice(0, 7))}</time><div><b>${esc(x.title)}</b><small>${esc(x.type)}${x.venue ? " · " + esc(x.venue) : ""}${x.number ? " · " + esc(x.number) : ""}${pl(x.project_id)}</small></div></li>`).join("")}
      </ul></div>
      <div class="panel rv"><h3><span class="ico">${ICON.badge}</span>Certificates · Education</h3><ul class="hlist">
        ${D.certificates.map((c) => `<li><time>${esc(c.date)}</time><div><b>${esc(c.name)}</b><small>${esc(c.issuer)}</small></div></li>`).join("")}
        ${D.education.slice(1).map((e) => `<li><time>${esc(ym(e.period_start))}</time><div><b>${esc(e.school)}</b><small>${esc(e.degree)}</small></div></li>`).join("")}
      </ul></div>`;

    $("#contact-row").innerHTML = `
      <a class="btn btn-lime" href="mailto:${esc(P.email)}">${ICON.mail} ${esc(P.email)}</a>
      <a class="btn btn-ghost-w" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ${ICON.ext}</a>
      <a class="btn btn-ghost-w" href="${esc(P.velog)}" target="_blank" rel="noopener">Velog ${ICON.ext}</a>`;
  }

  /* ---------- ORG ---------- */
  function orgPage() {
    const o = orgById[params.get("id")] || ORGS[0];
    document.title = `${o.short} — 황류이 Portfolio`;
    const ch = D.chapters.find((c) => c.n === o.chapter);
    $("#sub-hero").innerHTML = `
      <div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a><i>/</i><a href="index.html#experience">Experience</a><i>/</i><span>${esc(o.short)}</span></div>
        ${ch ? `<span class="eyebrow"><i></i>${esc(ch.en)} · ${esc(ch.ko)}</span>` : ""}
        <h1>${esc(o.name)}</h1>
        <p class="tagline">${esc(o.description || o.one_liner)}</p>
        <div class="meta-row">
          <div><small>Period</small>${esc(o.period_start)} — ${esc(o.period_end)}</div>
          <div><small>Role</small>${esc(o.role)}</div>
          ${o.location ? `<div><small>Location</small>${esc(o.location)}</div>` : ""}
        </div>
      </div>`;
    $("#org-projects").innerHTML = o.projects.map((p) => `
      <a class="frow rv" href="${projUrl(p)}">
        <div class="media">${media(p)}</div>
        <div class="body">
          <div class="kicker"><span>${esc(p.period)}</span><span>·</span><span>${esc(p.role.split(" · ")[0])}</span>${awardTag(p)}</div>
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
    document.title = `${shortTitle(p)} — 황류이 Portfolio`;
    $("#sub-hero").innerHTML = `
      <div class="wrap">
        <div class="crumbs"><a href="index.html">Home</a><i>/</i><a href="${orgUrl(o)}">${esc(o.short)}</a><i>/</i><span>${esc(shortTitle(p))}</span></div>
        <span class="eyebrow"><i></i>${esc(o.short)}${p.award ? ` · 🏆 ${esc(p.award)}` : ""}</span>
        <h1>${esc(p.title)}</h1>
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
      (list(p.values).length ? `<div class="values">${p.values.map(([t, d]) => `<div class="value"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : "") +
      (p.support ? `<div class="support"><span class="ico">${ICON.link}</span><div><b>${esc(p.support.t)}</b><span>${esc(p.support.d)}</span></div></div>` : ""));

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
       list(p.pipes).length ? subT("파이프라인") + p.pipes.map(([n, steps, note]) => `<div class="pipe"><h4>${esc(n)}</h4><ol>${steps.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>${note ? `<p>${esc(note)}</p>` : ""}</div>`).join("") : "",
       list(p.techniques).length ? subT("핵심 기법") + `<div class="tech-grid">${p.techniques.map(([n, d]) => `<div class="tech"><b>${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}</div>` : "",
       list(p.notes).length ? subT("설계 포인트") + bullets(p.notes) : "",
       list(p.figures).length ? subT("실험 자료") + `<div class="figs">${p.figures.map(([src, cap], i) => `<figure><button data-fig="${i}" aria-label="이미지 확대"><img src="${esc(src)}" alt="${esc(cap)}" loading="lazy"></button><figcaption>${esc(cap)}</figcaption></figure>`).join("")}</div>` : ""].join(""));

    // 05 성과 측정 — the only place for numbers
    add("05", "성과 측정", "정량 지표",
      list(p.kpis).length ? `<div class="kpis">${p.kpis.map(([v, l, s]) => `<div class="kpi"><span class="v">${esc(v)}</span><span class="l">${esc(l)}</span>${s ? `<span class="s">${esc(s)}</span>` : ""}</div>`).join("")}</div>${p.kpiNote ? `<p class="kpi-note">※ ${esc(p.kpiNote)}</p>` : ""}` : "");

    // 06 기대 효과
    add("06", "기대 효과", "효과 · 확장",
      (list(p.impact).length ? bullets(p.impact) : "") + (p.quote ? `<div class="quote-box">${esc(p.quote)}</div>` : ""));

    const gallery = list(p.images);
    const siblings = o.projects;
    const i = siblings.indexOf(p);
    const prev = siblings[i - 1], next = siblings[i + 1];
    $("#doc-main").innerHTML = `
      ${gallery.length ? `<div class="gallery">${gallery.map((s, k) => `<button data-img="${k}" aria-label="이미지 확대"><img src="${esc(s)}" alt="${esc(shortTitle(p))} 이미지 ${k + 1}" loading="lazy"></button>`).join("")}</div>` : ""}
      ${secs.map((s) => `<section class="dsec rv" id="s${s.num}"><div class="dhead"><span class="num">${s.num}</span><h2>${esc(s.title)}<small>${esc(s.sub)}</small></h2></div>${s.body}</section>`).join("")}
      <div class="pnav">${prev ? `<a href="${projUrl(prev)}"><small>← 이전 프로젝트</small><b>${esc(shortTitle(prev))}</b></a>` : `<a href="${orgUrl(o)}"><small>← 소속으로</small><b>${esc(o.short)}</b></a>`}${next ? `<a class="next" href="${projUrl(next)}"><small>다음 프로젝트 →</small><b>${esc(shortTitle(next))}</b></a>` : `<a class="next" href="index.html#projects"><small>전체 보기 →</small><b>All Projects</b></a>`}</div>`;

    const links = p.links || {};
    $("#toc").innerHTML = `
      <h5>Contents</h5>
      <nav>${secs.map((s) => `<a href="#s${s.num}"><b>${s.num}</b>${esc(s.title)}</a>`).join("")}</nav>
      ${list(p.tech).length ? `<div class="side-box"><h5>Tech</h5><div class="chips">${p.tech.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div></div>` : ""}
      ${Object.keys(links).length ? `<div class="side-box links"><h5>Links</h5>${Object.entries(links).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div>` : ""}`;

    if (gallery.length) {
      const open = lightbox(gallery.map((s) => [s, ""]));
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
  reveal();
})();
