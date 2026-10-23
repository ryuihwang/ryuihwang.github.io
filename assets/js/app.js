/*
 * 화면 그리기 — 내용은 assets/js/data.js(window.CAREER) 하나.
 * 홈(index.html)은 한 줄 요약만, 조직(org.html?id=)·프로젝트(project.html?id=)에서 자세히(긴 내용은 접어 둠).
 */
(() => {
  const D = window.CAREER;
  const P = D.profile;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ym = (s) => String(s ?? "").replace(/^(\d{4})\.(\d{2}).*$/, "$1.$2");
  const span = (a, b) => `${ym(a)} – ${b === "현재" || !b ? "현재" : ym(b)}`;
  const projects = D.orgs.flatMap((o) => o.projects.map((p) => ({ ...p, org: o })));
  const orgName = (o) => o.short || o.name;
  const tags = (list, n = 3, cls = "") => `<div class="tags">${(list || []).slice(0, n).map((t) => `<span class="tag ${cls}">${esc(t)}</span>`).join("")}</div>`;
  const ticks = (list, cls = "") => (list?.length ? `<ul class="ticks ${cls}">${list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
  const LINK = { demo: "데모", github: "GitHub", repo: "저장소", video: "영상", slides: "발표 자료", paper: "논문", notion: "노션", velog: "글", site: "사이트" };

  /* ── 위 줄 · 아래 줄 ── */
  const home = document.body.dataset.page === "home";
  const h = (id) => (home ? `#${id}` : `index.html#${id}`);
  $("#nav").innerHTML = `<div class="wrap"><a class="logo" href="index.html">Ryu I Hwang<b>.</b></a>
    <nav><a href="${h("focus")}">About</a><a href="${h("career")}">Experience</a><a href="${h("projects")}">Projects</a><a href="${h("skills")}">Skills</a><a href="${h("honors")}">Honors</a><a class="cta" href="resume.html">이력서</a></nav></div>`;
  $("#footer").innerHTML = `<div class="wrap">© ${new Date().getFullYear()} ${esc(P.name)} · ${esc(P.name_en)}</div>`;

  /* ── 프로젝트 카드 ── */
  const card = (p) => {
    const pic = p.images?.length
      ? `<div class="pic"><img src="${esc(p.images[0])}" alt="" loading="lazy"></div>`
      : `<div class="pic none"><div><b>${esc(p.cover?.metric || p.product_name || p.title.split(/[—:·]/)[0].trim())}</b>${p.cover?.label ? `<span>${esc(p.cover.label)}</span>` : ""}</div></div>`;
    return `<a class="card pcard" href="project.html?id=${encodeURIComponent(p.id)}">${pic}
      <div class="body"><span class="org">${esc(orgName(p.org))}</span><h3>${esc(p.title)}</h3>${p.award ? `<span class="award">🏆 ${esc(p.award)}</span>` : ""}${tags(p.tags)}</div></a>`;
  };

  /* ── 홈 ── */
  function renderHome() {
    const now = D.orgs.find((o) => /현재/.test(o.period_end ?? ""));
    $("#hero").innerHTML = `<div class="wrap">
      <span class="kicker">${esc(P.title)}</span>
      <h1>${esc(P.name)}<small>${esc(P.name_en)}</small></h1>
      <p class="lead">바이오 데이터에서 출발해 <em>멀티모달 AI</em>와 <em>LLM 서비스</em>까지 만드는 AI 엔지니어입니다.${now ? `<br>지금은 ${esc(orgName(now))}에서 사내 업무를 AI로 바꾸고 있어요.` : ""}</p>
      <div class="btns"><a class="btn primary" href="#projects">프로젝트 보기</a><a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a><a class="btn" href="${esc(P.velog)}" target="_blank" rel="noopener">Velog</a><a class="btn" href="mailto:${esc(P.email)}">Email</a></div></div>`;

    const FOCUS = [
      ["Bio Data", "약물 스크리닝 · 임상·유전체 코호트 데이터를 다루고 분석합니다."],
      ["Multimodal & Generative", "CLIP · Diffusion · Transformer 기반 파이프라인을 설계합니다."],
      ["LLM Agent & MLOps", "RAG · LangGraph · FastAPI로 실제 서비스까지 만듭니다."],
    ];
    $("#focus-body").innerHTML = FOCUS.map(([t, d], i) => `<div class="card"><span class="n">0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join("");

    const work = D.orgs.filter((o) => o.id !== "independent" && o.id !== "dong-eui-univ");
    const edu = D.education[0];
    $("#career-body").innerHTML =
      work.map((o) => `<a class="row${/현재/.test(o.period_end ?? "") ? " now" : ""}" href="org.html?id=${encodeURIComponent(o.id)}"><span class="when">${span(o.period_start, o.period_end)}</span><div><b>${esc(orgName(o))}</b><span class="role">${esc(o.role)}</span></div><span class="go">프로젝트 ${o.projects.length}개 →</span></a>`).join("") +
      (edu ? `<a class="row" href="org.html?id=dong-eui-univ"><span class="when">${span(edu.period_start, edu.period_end)}</span><div><b>${esc(edu.school)}</b><span class="role">${esc(edu.major)} · ${esc(edu.minor)} · 학점 ${esc(edu.gpa)}</span></div><span class="go">학부 프로젝트 →</span></a>` : "");

    const featured = projects.filter((p) => p.featured);
    const rest = projects.filter((p) => !p.featured);
    $("#projects-body").innerHTML = `<div class="pgrid">${featured.map(card).join("")}</div>
      <details class="more"><summary>나머지 프로젝트 ${rest.length}개</summary>
        <div class="plist">${rest.map((p) => `<a href="project.html?id=${encodeURIComponent(p.id)}"><span>${esc(p.title)}</span><span>${esc(orgName(p.org))}</span></a>`).join("")}</div></details>`;

    // 묶음마다 6개까지만, 나머지는 개수로(글자 압박 줄이기)
    $("#skills-body").innerHTML = Object.entries(D.skills).map(([g, list]) => `<div class="card"><h3>${esc(g)}</h3>${tags(list, 6).replace(/<\/div>$/, list.length > 6 ? `<span class="tag muted">+${list.length - 6}</span></div>` : "</div>")}</div>`).join("");

    const li = (title, sub) => `<li><span>${esc(title)}</span>${sub ? `<small>${esc(sub)}</small>` : ""}</li>`;
    $("#honors-body").innerHTML = `
      <div class="card"><h3>수상</h3><ul>${D.awards.map((a) => li(a.title, `${a.issuer} · ${a.date}`)).join("")}</ul></div>
      <div class="card"><h3>논문 · 특허</h3><ul>${D.publications_patents.map((x) => li(x.title, `${x.type}${x.date ? ` · ${x.date}` : ""}`)).join("")}</ul></div>
      <div class="card"><h3>자격</h3><ul>${D.certificates.map((c) => li(c.name, `${c.issuer} · ${c.date}`)).join("")}</ul></div>`;

    $("#contact-body").innerHTML = `<div class="card"><h2>함께 만들 문제가 있다면 <b>편하게 연락 주세요.</b></h2>
      <div class="btns"><a class="btn primary" href="mailto:${esc(P.email)}">${esc(P.email)}</a><a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a><a class="btn" href="resume.html">이력서</a></div></div>`;
  }

  /* ── 조직 상세 ── */
  function renderOrg() {
    const o = D.orgs.find((x) => x.id === new URLSearchParams(location.search).get("id"));
    if (!o) return void ($("#page").innerHTML = `<div class="wrap empty">찾는 조직이 없어요. <a class="back" href="index.html">← 홈으로</a></div>`);
    document.title = `${orgName(o)} — 황류이 Portfolio`;
    $("#page").innerHTML = `<div class="sub"><div class="wrap">
        <a class="back" href="index.html#career">← 경력</a>
        <h1>${esc(o.name)}</h1><p class="one">${esc(o.one_liner)}</p>
        <div class="meta"><span><b>역할</b> ${esc(o.role)}</span>${o.period_start ? `<span><b>기간</b> ${span(o.period_start, o.period_end)}</span>` : ""}${o.location ? `<span><b>위치</b> ${esc(o.location)}</span>` : ""}</div></div></div>
      <section><div class="wrap">${o.description ? `<p class="muted" style="max-width:760px;margin-bottom:28px">${esc(o.description)}</p>` : ""}
        <div class="pgrid">${o.projects.map((p) => card({ ...p, org: o })).join("")}</div></div></section>`;
  }

  /* ── 프로젝트 상세 ── */
  function renderProject() {
    const p = projects.find((x) => x.id === new URLSearchParams(location.search).get("id"));
    if (!p) return void ($("#page").innerHTML = `<div class="wrap empty">찾는 프로젝트가 없어요. <a class="back" href="index.html#projects">← 프로젝트</a></div>`);
    document.title = `${p.title} — 황류이 Portfolio`;
    const feats = (list) => (list?.length ? `<div class="feat">${list.map((f) => `<div class="card"><b>${esc(f.name)}</b><span>${esc(f.desc)}</span></div>`).join("")}</div>` : "");
    const arch = p.architecture?.layers?.length ? `<h2>구조</h2>${ticks(p.architecture.layers.map((l) => `${l.name} — ${(l.items || []).join(" · ")}`), "v")}` : "";
    const fold = [
      p.problem ? `<h2>문제</h2><p>${esc(p.problem)}</p>` : "",
      p.approach?.length ? `<h2>접근</h2>${ticks(p.approach, "v")}` : "",
      p.features?.length ? `<h2>주요 기능</h2>${feats(p.features)}` : "",
      p.ax_features?.length ? `<h2>AI 기능</h2>${feats(p.ax_features)}` : "",
      arch,
      p.security?.length ? `<h2>보안</h2>${ticks(p.security, "v")}` : "",
    ].join("");
    const links = Object.entries(p.links || {}).filter(([, u]) => u);
    const c = p.contribution;
    $("#page").innerHTML = `<div class="sub"><div class="wrap">
        <a class="back" href="org.html?id=${encodeURIComponent(p.org.id)}">← ${esc(orgName(p.org))}</a>
        <h1>${esc(p.title)}</h1>${p.subtitle ? `<p class="one">${esc(p.subtitle)}</p>` : ""}
        <div class="meta">${p.period ? `<span><b>기간</b> ${esc(p.period)}</span>` : ""}${p.role ? `<span><b>역할</b> ${esc(p.role)}</span>` : ""}</div></div></div>
      <section style="padding-top:0;border-top:0"><div class="wrap detail">
        <div>
          ${p.summary ? `<h2>요약</h2><p>${esc(p.summary)}</p>` : ""}
          ${p.results?.length ? `<h2>결과</h2>${ticks(p.results)}` : ""}
          ${p.highlights?.length ? `<h2>핵심</h2>${ticks(p.highlights)}` : ""}
          ${p.images?.length ? `<div class="gallery">${p.images.map((s) => `<a href="${esc(s)}" target="_blank" rel="noopener"><img src="${esc(s)}" alt="" loading="lazy"></a>`).join("")}</div>` : ""}
          ${fold ? `<details class="fold"><summary>자세히 — 문제 · 접근${p.features?.length ? " · 기능" : ""}${arch ? " · 구조" : ""}</summary><div>${fold}</div></details>` : ""}
        </div>
        <aside class="aside">
          ${p.cover?.metric ? `<div class="card"><h3>한 줄 성과</h3><div class="metric">${esc(p.cover.metric)}</div><p class="muted" style="font-size:13px;margin-top:4px">${esc(p.cover.label || "")}</p></div>` : ""}
          ${p.award ? `<div class="card"><h3>수상</h3><span class="tag l">🏆 ${esc(p.award)}</span></div>` : ""}
          ${p.tech?.length ? `<div class="card"><h3>사용 기술</h3>${tags(p.tech, 99, "v")}</div>` : ""}
          ${c?.share_pct ? `<div class="card"><h3>기여</h3><div class="metric">${c.share_pct}%</div><p class="muted" style="font-size:13px">커밋 ${c.commits_mine} / ${c.commits_total}</p></div>` : ""}
          ${links.length || p.repo ? `<div class="card"><h3>링크</h3><div class="links">${links.map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(LINK[k] || k)} ↗</a>`).join("")}${p.repo ? `<span class="muted" style="font-size:13px">${esc(p.repo)} (비공개 저장소)</span>` : ""}</div></div>` : ""}
        </aside></div></section>`;
  }

  ({ home: renderHome, org: renderOrg, project: renderProject })[document.body.dataset.page]?.();
})();
