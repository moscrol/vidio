/* vidio studio 前端：无构建，纯 ES 模块 */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const media = (p) => `/media?p=${encodeURIComponent(p)}`;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const state = {
  projects: [],
  creds: {},
  project: null,
  styles: [],
  picks: new Set(JSON.parse(localStorage.getItem("picks") || "[]")),
  edl: null,
  cutSource: null,
  sources: [],
  bgms: [],
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(t._h);
  t._h = setTimeout(() => (t.hidden = true), 2600);
}

async function api(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok && r.status !== 400 && r.status !== 409) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

/* ---------- 视图路由 ---------- */

const TITLES = { dash: "工作台", gallery: "风格画廊", mixer: "混剪台", library: "组件库", map: "能力地图", qc: "质检" };
let current = "dash";

function setView(view) {
  if (!TITLES[view]) view = "dash";
  current = view;
  $$("#nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $("#view-title").textContent = TITLES[view];
  if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  render();
}

$("#nav").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-view]");
  if (btn) setView(btn.dataset.view);
});
window.addEventListener("hashchange", () => setView(location.hash.slice(1)));

function render() {
  const v = $("#view");
  v.innerHTML = "";
  ({ dash: renderDash, gallery: renderGallery, mixer: renderMixer, library: renderLibrary, map: renderMap, qc: renderQc })[current](v);
}

/* ---------- 工作台 ---------- */

const STATUS_CHIP = { 待制作: "chip", 制作中: "chip gold", 待确认: "chip gold", 已完成: "chip ok" };

function renderDash(v) {
  const p = state.projects.find((x) => x.slug === state.project);
  const nStyles = state.styles.length;
  const nVideos = state.styles.filter((s) => s.video).length;
  v.innerHTML = `
    <div class="dash-head">
      <div class="stat"><div class="n">${state.projects.length}</div><div class="l">生产项目</div></div>
      <div class="stat"><div class="n">${nStyles}</div><div class="l">风格工程</div></div>
      <div class="stat"><div class="n">${nVideos}</div><div class="l">本地成片</div></div>
      <div class="stat"><div class="n">${state.picks.size}</div><div class="l">已选候选</div></div>
    </div>
    <h2 class="sec">项目</h2>
    <div class="grid cols-2" id="proj-list"></div>
    ${p ? `<h2 class="sec">当前 brief 摘要</h2><div class="card proj-card"><div class="intro">${esc(p.intro)}</div></div>` : ""}
    <h2 class="sec">本仓库硬覆盖</h2>
    <div class="card">
      <div class="row" style="flex-wrap:wrap; display:flex; gap:8px">
        <span class="chip gold">无人出镜</span>
        <span class="chip">OpenMontage 只当工具箱</span>
        <span class="chip">不建 01-内容生产/</span>
        <span class="chip">少问多做 · 默认直接拍</span>
      </div>
      <p class="muted" style="margin-top:12px; line-height:1.8">生成 / Seedance / 数字人仍走 vibe-director。本机可直接跑的执行环：画廊打开成片 → Lint / Inspect / 打开 HyperFrames 预览。整片 MP4 渲染请复制命令或贴回对话。</p>
    </div>
    <h2 class="sec">本机执行环</h2>
    <div class="card">
      <div class="row" style="flex-wrap:wrap; display:flex; gap:8px">
        <span class="chip gold">1. 画廊挑风格</span>
        <span class="chip">2. Lint</span>
        <span class="chip">3. Inspect</span>
        <span class="chip">4. HyperFrames 预览</span>
        <span class="chip">5. 混剪台拼装</span>
        <span class="chip">6. 质检页看证据</span>
      </div>
      <p class="muted" style="margin-top:12px; line-height:1.8">HyperFrames 是默认动效引擎。付费代跑（即梦 / HeyGen）不进浏览器。</p>
    </div>
  `;
  const list = $("#proj-list", v);
  for (const proj of state.projects) {
    const m = proj.meta || {};
    const card = document.createElement("div");
    card.className = "card proj-card";
    card.innerHTML = `
      <h3>${esc(proj.slug)}</h3>
      <div class="row">
        <span class="${STATUS_CHIP[m.status] || "chip"}">${esc(m.status || "?")}</span>
        <span class="chip">${esc(m.form || "")}</span>
        <span class="chip">${esc(m.ratio || "")} · ${esc(m.duration_target_s || "?")}s</span>
        <span class="chip">engine: ${esc(m.engine || "")}</span>
        <span class="chip">voice: ${esc(m.voice || "")}</span>
      </div>
      <div class="muted" style="font-size:12px; line-height:1.8;">
        复用组件：${(Array.isArray(m.reuse) ? m.reuse : []).map((r) => esc(r.split("/").pop())).join("、") || "—"}
      </div>
    `;
    list.appendChild(card);
  }
}

/* ---------- 风格画廊 ---------- */

function renderGallery(v) {
  if (!state.styles.length) {
    v.innerHTML = `<div class="empty">当前项目没有风格工程。<br/>用 vibe-director 开一个项目后再来。</div>`;
    return;
  }
  v.innerHTML = `
    <div class="grid cols-3" id="style-grid"></div>
    <div class="pickbar">
      <strong style="color:var(--gold-2)">候选</strong>
      <span id="pick-list" class="muted">未选择</span>
      <span style="flex:1"></span>
      <button class="btn" id="pick-clear">清空</button>
      <button class="btn gold" id="pick-copy">复制拍板话术</button>
    </div>
  `;
  const grid = $("#style-grid", v);
  for (const s of state.styles) {
    const card = document.createElement("div");
    card.className = "card style-card" + (state.picks.has(s.id) ? " selected" : "");
    card.innerHTML = `
      ${s.video
        ? `<video src="${media(s.video)}" poster="/thumb?p=${encodeURIComponent(s.video)}&t=2.5" muted preload="none" playsinline></video>`
        : `<div class="noVideo">本地无成片<br/>（成片不入库，需本机渲染）</div>`}
      <div class="body">
        <div class="name">
          <span>${esc(s.id)}</span>
          <span>
            ${/mix/.test(s.id) ? `<span class="chip gold">混剪</span> ` : ""}
            <span class="chip ${state.picks.has(s.id) ? "gold" : ""}">${state.picks.has(s.id) ? "已选" : "选它"}</span>
          </span>
        </div>
        <div class="desc">${esc(s.style || "")} ${s.features ? "· " + esc(s.features) : ""}<br/>
          ${s.probe ? `${s.probe.width}×${s.probe.height} · ${Math.round(s.probe.duration)}s · ${(s.probe.size / 1048576).toFixed(1)}MB` : ""}
          ${s.bgm ? " · BGM " + esc(s.bgm) : ""}</div>
      </div>
    `;
    const vid = $("video", card);
    if (vid) {
      card.addEventListener("mouseenter", () => vid.play().catch(() => {}));
      card.addEventListener("mouseleave", () => { vid.pause(); vid.currentTime = 0; });
    }
    card.addEventListener("click", (e) => {
      if (e.target.closest(".chip")) {
        togglePick(s.id);
        renderGallery(v);
      } else if (s.video) {
        openLightbox(s);
      }
    });
    grid.appendChild(card);
  }
  updatePickbar(v);
  $("#pick-clear", v).onclick = () => { state.picks.clear(); persistPicks(); renderGallery(v); };
  $("#pick-copy", v).onclick = () => {
    const picks = [...state.picks].join(" + ") || "（未选）";
    const text = `我选 ${picks}。产品名：____；一条真实指令：____；界面：有/无。`;
    navigator.clipboard.writeText(text).then(() => toast("已复制，贴给 agent 就能渲定稿"));
  };
}

function togglePick(id) {
  state.picks.has(id) ? state.picks.delete(id) : state.picks.add(id);
  persistPicks();
}
function persistPicks() { localStorage.setItem("picks", JSON.stringify([...state.picks])); }
function updatePickbar(v) {
  const el = $("#pick-list", v);
  if (el) el.textContent = state.picks.size ? [...state.picks].join(" + ") : "未选择";
}

function openLightbox(s) {
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="close">×</button>
    <video src="${media(s.video)}" controls autoplay playsinline></video>
    <div class="info card">
      <h3 style="margin-bottom:8px">${esc(s.id)}</h3>
      <p class="muted" style="line-height:1.9; font-size:13px">
        ${esc(s.style || "")}<br/>${esc(s.features || "")}<br/>
        ${s.probe ? `${s.probe.width}×${s.probe.height} · ${s.probe.duration}s · ${s.probe.vcodec}` : ""}<br/>
        工程：<span class="mono">${esc(s.engineering)}</span>
      </p>
      <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn gold" id="lb-pick">${state.picks.has(s.id) ? "取消候选" : "加入候选"}</button>
        <button class="btn" id="lb-lint">Lint</button>
        <button class="btn" id="lb-inspect">Inspect</button>
        <button class="btn" id="lb-preview">打开预览</button>
        <button class="btn" id="lb-render">复制渲染命令</button>
      </div>
      <div id="lb-hf" class="hf-box muted" style="margin-top:12px">HyperFrames 执行环：lint → inspect → 预览。整片渲染仍走 agent。</div>
    </div>
  `;
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.closest(".close")) { $("video", lb).pause(); lb.remove(); }
  });
  $("#lb-pick", lb).onclick = () => { togglePick(s.id); lb.remove(); render(); };
  const box = $("#lb-hf", lb);
  $("#lb-lint", lb).onclick = () => runHf(s.id, "lint", box);
  $("#lb-inspect", lb).onclick = () => runHf(s.id, "inspect", box);
  $("#lb-preview", lb).onclick = () => runHf(s.id, "preview", box);
  $("#lb-render", lb).onclick = () => runHf(s.id, "render-cmd", box);
  document.body.appendChild(lb);
}

async function runHf(style, action, box) {
  const labels = { lint: "Lint", inspect: "Inspect（约 20–40s）", preview: "启动预览", "render-cmd": "生成渲染命令", "preview-stop": "关掉预览" };
  box.innerHTML = `<span class="chip">${labels[action] || action} 运行中…</span>`;
  try {
    const r = await api("/api/hf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: state.project, style, action }),
    });
    if (!r.ok) {
      box.innerHTML = `<span class="chip warn">失败</span><pre class="log">${esc(r.error || r.log || "")}</pre>`;
      return;
    }
    if (action === "lint") {
      const j = r.json || {};
      box.innerHTML = `<span class="chip ${j.errorCount ? "warn" : "ok"}">lint ${j.errorCount ?? "?"} err / ${j.warningCount ?? "?"} warn</span>
        <pre class="log">${esc(JSON.stringify(j.findings || j, null, 2).slice(0, 1800))}</pre>`;
    } else if (action === "inspect") {
      const j = r.json || {};
      const n = j.errorCount ?? j.errors ?? (j.issues && j.issues.length) ?? "?";
      box.innerHTML = `<span class="chip">inspect 账面 ${esc(String(n))} · 已知大量离场叠层误报</span>
        <pre class="log">${esc(JSON.stringify(j, null, 2).slice(0, 1800))}</pre>`;
    } else if (action === "preview") {
      box.innerHTML = `<span class="chip ok">预览已起</span>
        <p class="muted" style="margin-top:8px; line-height:1.8">HyperFrames Studio：<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a></p>
        <button class="btn" id="hf-stop">关掉预览</button>`;
      $("#hf-stop", box).onclick = () => runHf(style, "preview-stop", box);
    } else if (action === "preview-stop") {
      box.innerHTML = `<span class="chip">预览已停</span>`;
    } else if (action === "render-cmd") {
      await navigator.clipboard.writeText(r.command);
      box.innerHTML = `<span class="chip ok">已复制</span><pre class="log">${esc(r.command)}\n${esc(r.note || "")}</pre>`;
      toast("渲染命令已复制");
    }
  } catch (e) {
    box.innerHTML = `<span class="chip warn">异常</span><pre class="log">${esc(e.message)}</pre>`;
  }
}

/* ---------- 混剪台 ---------- */

const SEG_COLORS = ["#FFD60A", "#8ECAE6", "#3DD68C", "#F4A261", "#CDB4DB", "#FF8FAB", "#A3B18A", "#E9C46A"];

function renderMixer(v) {
  if (!state.edl) {
    v.innerHTML = `<div class="empty">读取剪接表中…</div>`;
    return;
  }
  const total = state.edl.segments.reduce((a, s) => a + (s.to - s.from), 0);
  v.innerHTML = `
    <div class="card">
      <h2 class="sec">剪接表 · 硬切 + 白闪 + RGB 位移 · 同一条 BGM</h2>
      <p class="muted" style="margin:-4px 0 12px; font-size:12px">
        <span class="chip">${state.cutSource && state.cutSource !== "fallback" ? "真源 CUTLIST.md" : "内置回退"}</span>
        ${state.cutSource ? ` 读取 <span class="mono">${esc(state.cutSource)}</span> 的 edl 块。改窗口后点拼装；要回到文件版本点「从 CUTLIST 重载」。` : ""}
        ${state.edl.covers?.length ? ` · ${state.edl.covers.length} 处角标遮盖` : ""}
      </p>
      <div class="seg-row head"><span>#</span><span>源片</span><span>入点 s</span><span>出点 s</span><span>时长</span><span>预览</span><span></span></div>
      <div id="seg-rows"></div>
      <div class="timeline" id="tl"></div>
      <div class="muted" style="font-size:12px" id="total-line"></div>
      <div style="display:flex; gap:12px; align-items:center; margin-top:16px; flex-wrap:wrap">
        <button class="btn" id="seg-add">+ 加一段</button>
        <button class="btn" id="seg-reload">从 CUTLIST 重载</button>
        <span style="flex:1"></span>
        <label class="muted">BGM</label>
        <select id="bgm-sel">${state.bgms.map((b) => `<option ${b === state.edl.bgm ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>
        <label class="muted">音量</label>
        <input type="number" id="bgm-vol" min="0" max="1" step="0.02" value="${state.edl.volume}" />
        <label class="muted">输出名</label>
        <input id="out-name" value="v11-mix-gui.mp4" style="width:170px" />
        <button class="btn" id="mix-dry">看命令</button>
        <button class="btn gold" id="mix-run">开始拼装</button>
      </div>
    </div>
    <div class="mix-result" id="mix-result"></div>
  `;

  const rows = $("#seg-rows", v);
  state.edl.segments.forEach((seg, i) => {
    const row = document.createElement("div");
    row.className = "seg-row";
    row.innerHTML = `
      <span class="idx">${i + 1}</span>
      <select data-i="${i}" data-k="file">${state.sources.map((s) =>
        `<option ${s.file === seg.file ? "selected" : ""}>${esc(s.file)}</option>`).join("")}</select>
      <input type="number" step="0.1" min="0" value="${seg.from}" data-i="${i}" data-k="from" />
      <input type="number" step="0.1" min="0" value="${seg.to}" data-i="${i}" data-k="to" />
      <span class="muted">${(seg.to - seg.from).toFixed(1)}s</span>
      <button class="btn" style="padding:4px 10px" data-prev="${i}">▶</button>
      <button class="rm" data-rm="${i}">✕</button>
    `;
    rows.appendChild(row);
  });

  const tl = $("#tl", v);
  state.edl.segments.forEach((seg, i) => {
    const d = seg.to - seg.from;
    const el = document.createElement("div");
    el.className = "seg";
    el.style.flex = String(d);
    el.style.background = SEG_COLORS[i % SEG_COLORS.length];
    el.innerHTML = `<span>${esc(seg.file.split("-")[0])}</span><span>${d.toFixed(1)}s</span>`;
    el.title = seg.label || seg.file;
    tl.appendChild(el);
  });
  $("#total-line", v).textContent =
    `总时长 ${total.toFixed(1)}s${Math.abs(total - 30) > 0.01 ? "（注意：目标 30s）" : " · 正好 30s"} · 切点自动加 3 帧白闪 + 段首 RGB 位移`;

  rows.addEventListener("change", (e) => {
    const t = e.target, i = Number(t.dataset.i), k = t.dataset.k;
    if (!k) return;
    state.edl.segments[i][k] = k === "file" ? t.value : Number(t.value);
    renderMixer(v);
  });
  rows.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-rm]");
    if (rm) { state.edl.segments.splice(Number(rm.dataset.rm), 1); renderMixer(v); return; }
    const pv = e.target.closest("[data-prev]");
    if (pv) previewSegment(state.edl.segments[Number(pv.dataset.prev)]);
  });
  $("#seg-add", v).onclick = () => {
    state.edl.segments.push({ file: state.sources[0]?.file || "", from: 0, to: 5, label: "" });
    renderMixer(v);
  };
  $("#seg-reload", v).onclick = async () => {
    const cut = await api(`/api/cutlist?project=${encodeURIComponent(state.project)}`);
    state.edl = cut.edl;
    state.cutSource = cut.source;
    state.sources = cut.sources;
    state.bgms = cut.bgms;
    toast("已从 CUTLIST.md 重载");
    renderMixer(v);
  };
  $("#bgm-sel", v).onchange = (e) => (state.edl.bgm = e.target.value);
  $("#bgm-vol", v).onchange = (e) => (state.edl.volume = Number(e.target.value));

  $("#mix-dry", v).onclick = () => runMix(v, true);
  $("#mix-run", v).onclick = () => runMix(v, false);
}

function previewSegment(seg) {
  const src = state.sources.find((s) => s.file === seg.file);
  if (!src) return toast("找不到源片");
  const rel = `projects/${state.project}/成片/${seg.file}`;
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="close">×</button>
    <video src="${media(rel)}#t=${seg.from},${seg.to}" controls autoplay playsinline></video>
    <div class="info card"><h3>${esc(seg.file)}</h3>
      <p class="muted" style="margin-top:8px">窗口 ${seg.from}s → ${seg.to}s（播放器会从入点开始）</p></div>
  `;
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target.closest(".close")) { $("video", lb).pause(); lb.remove(); }
  });
  document.body.appendChild(lb);
  const vid = $("video", lb);
  vid.addEventListener("timeupdate", () => { if (vid.currentTime >= seg.to) vid.pause(); });
}

async function runMix(v, dry) {
  const btns = [$("#mix-dry", v), $("#mix-run", v)];
  btns.forEach((b) => (b.disabled = true));
  $("#mix-result", v).innerHTML = `<div class="card muted">${dry ? "生成命令…" : "ffmpeg 拼装中，30 秒片约需 15–20 秒…"}</div>`;
  try {
    const r = await api("/api/mix/assemble", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: state.project, edl: state.edl, out: $("#out-name", v).value, dry }),
    });
    if (!r.ok) {
      $("#mix-result", v).innerHTML = `<div class="card"><span class="chip warn">失败</span><pre class="log">${esc(r.error)}</pre></div>`;
    } else if (r.dry) {
      $("#mix-result", v).innerHTML = `<div class="card"><span class="chip">dry run · 总时长 ${r.total}s</span><pre class="log">${esc(r.command)}</pre></div>`;
    } else {
      $("#mix-result", v).innerHTML = `
        <div class="card" style="display:flex; gap:18px; align-items:flex-start">
          <video src="${media(r.output)}?t=${Date.now()}" controls playsinline></video>
          <div>
            <span class="chip ok">拼装完成</span>
            <p class="muted" style="margin-top:10px; line-height:2">
              输出：<span class="mono">${esc(r.output)}</span><br/>
              ${r.probe ? `${r.probe.width}×${r.probe.height} · ${r.probe.duration}s · ${(r.probe.size / 1048576).toFixed(1)}MB` : ""}
            </p>
          </div>
        </div>`;
      toast("拼装完成");
    }
  } catch (e) {
    $("#mix-result", v).innerHTML = `<div class="card"><span class="chip warn">异常</span><pre class="log">${esc(e.message)}</pre></div>`;
  } finally {
    btns.forEach((b) => (b.disabled = false));
  }
}

/* ---------- 组件库 ---------- */

async function renderLibrary(v) {
  v.innerHTML = `<div class="empty">读取组件库…</div>`;
  const { items } = await api("/api/library");
  if (!items.length) { v.innerHTML = `<div class="empty">library/ 还没有组件。做完一个片段后让 agent 沉淀进来。</div>`; return; }
  const cats = [...new Set(items.map((i) => i.category))];
  v.innerHTML = cats.map((c) => `
    <h2 class="sec">${esc(c)}</h2>
    <div class="grid cols-2">
      ${items.filter((i) => i.category === c).map((i) => {
        const m = i.manifest || {};
        return `
        <div class="card lib-card">
          ${i.preview ? `<img src="${media(i.preview)}" alt="" loading="lazy" />` : ""}
          <div>
            <h3>${esc(i.name)}</h3>
            <div class="meta">
              ${m.reuse || m.说明 || m.description ? esc(m.reuse || m.说明 || m.description) + "<br/>" : ""}
              ${m.source_project || m.来源项目 ? "来源：" + esc(m.source_project || m.来源项目) + "<br/>" : ""}
              ${m.specs ? `规格：${m.specs.fps || "?"}fps · ${m.specs.duration_s || "?"}s<br/>` : ""}
              路径：<span class="mono">${esc(i.dir)}</span>
            </div>
            <div style="margin-top:10px"><button class="btn" data-copy="${esc(i.dir)}">复制路径</button></div>
          </div>
        </div>`;
      }).join("")}
    </div>`).join("");
  v.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (b) navigator.clipboard.writeText(b.dataset.copy).then(() => toast("路径已复制，贴给 agent 即可复用"));
  });
}

/* ---------- 能力地图（导演路由 + 镜头卡 + 技能 + OM 工具箱） ---------- */

async function renderMap(v) {
  v.innerHTML = `<div class="empty">读取能力地图…</div>`;
  const [map, shots, { skills }, atoms] = await Promise.all([
    api("/api/map"), api("/api/shots"), api("/api/skills"), api("/api/atoms"),
  ]);
  const cats = [...new Set(shots.shots.map((s) => s.category))].filter(Boolean);
  const omLanes = [...new Set((atoms.tools || []).map((t) => t.lane))];
  v.innerHTML = `
    <h2 class="sec">vibe-director 形态路由 · 你说什么 → 走哪条链</h2>
    <div class="grid cols-2" id="lane-grid">
      ${map.lanes.map((l) => `
        <div class="card lane-card">
          <div class="name" style="display:flex; justify-content:space-between; align-items:center">
            <strong>${esc(l.form)}</strong>
            <span class="chip">${esc(l.cred)}</span>
          </div>
          <p class="muted" style="margin:8px 0; line-height:1.7">${esc(l.when)}</p>
          <div class="row" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px">
            ${l.skills.map((s) => `<span class="chip gold">${esc(s)}</span>`).join("")}
          </div>
          <button class="btn" data-copy="${esc(l.copy)}">复制开场话术</button>
        </div>`).join("")}
    </div>

    <h2 class="sec">硬覆盖 · 本仓库优先于一切上游技能</h2>
    <div class="card">
      <ol class="muted" style="padding-left:18px; line-height:2">
        ${map.overrides.map((o) => `<li>${esc(o)}</li>`).join("")}
      </ol>
    </div>

    <h2 class="sec">video-shotcraft 镜头卡 · ${shots.count} 张动效词汇表</h2>
    <div class="card">
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px">
        <input id="shot-q" placeholder="搜镜头：打字机 / 滑块 / 数据…" style="width:280px" />
        <select id="shot-cat"><option value="">全部分类</option>${cats.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
        <span class="muted" id="shot-n"></span>
      </div>
      <div class="shot-grid" id="shot-grid"></div>
    </div>

    <h2 class="sec">已装技能 · ${skills.length} 个（点开看触发条件）</h2>
    ${[...new Set(skills.map((s) => s.group))].map((g) => `
      <div class="skill-group card">
        <div style="font-weight:700; margin-bottom:6px">${esc(g)} <span class="muted">· ${skills.filter((s) => s.group === g).length}</span></div>
        ${skills.filter((s) => s.group === g).map((s) => `
          <div class="skill-item">
            <div class="head">
              <span class="id mono ${s.blocked ? "strike" : ""}">${esc(s.id)}</span>
              ${s.blocked ? `<span class="chip warn">禁用</span>` : ""}
            </div>
            <div class="desc">${esc(s.blocked ? s.blocked + " —— " : "")}${esc(s.description)}</div>
          </div>`).join("")}
      </div>`).join("")}

    <h2 class="sec">OpenMontage 工具箱 · 只取工具，不进它的调度</h2>
    <div class="card">
      ${atoms.available
        ? `<div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center">
             <span class="chip ok">${atoms.tools.length} 个工具</span>
             <input id="tool-q" placeholder="搜 tts / clip / scene / jimeng…" style="width:260px" />
           </div>
           ${omLanes.map((lane) => `<div class="om-lane" data-lane="${esc(lane)}"><h3>${esc(lane)}</h3><div class="tool-grid"></div></div>`).join("")}`
        : `<span class="chip warn">不可用</span> <span class="muted">${esc(atoms.reason)}</span>`}
    </div>
  `;

  v.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (b) navigator.clipboard.writeText(b.dataset.copy).then(() => toast("已复制，贴回对话即开工"));
    const it = e.target.closest(".skill-item .head");
    if (it) it.parentElement.classList.toggle("open");
  });

  const drawShots = () => {
    const q = ($("#shot-q", v)?.value || "").trim().toLowerCase();
    const cat = $("#shot-cat", v)?.value || "";
    const hit = shots.shots.filter((s) =>
      (!cat || s.category === cat) &&
      (!q || `${s.id} ${s.one} ${s.use} ${s.tag}`.toLowerCase().includes(q))
    );
    $("#shot-n", v).textContent = `${hit.length} / ${shots.count}`;
    $("#shot-grid", v).innerHTML = hit.slice(0, 80).map((s) => `
      <div class="shot-card">
        <div class="t mono">${esc(s.id)}</div>
        <div class="m">${esc(s.one || s.use)}</div>
        <div class="m">${esc(s.category)}${s.dur ? " · " + esc(s.dur) : ""}${s.energy ? " · " + esc(s.energy) : ""}</div>
        <button class="btn" style="margin-top:8px; padding:4px 10px" data-copy="用镜头卡 ${s.id} 做这一镜">点名这张卡</button>
      </div>`).join("") + (hit.length > 80 ? `<div class="muted">只显示前 80，缩小搜索</div>` : "");
  };
  drawShots();
  $("#shot-q", v).addEventListener("input", drawShots);
  $("#shot-cat", v).addEventListener("change", drawShots);

  if (atoms.available) {
    const drawTools = () => {
      const q = ($("#tool-q", v)?.value || "").trim().toLowerCase();
      $$(".om-lane", v).forEach((box) => {
        const lane = box.dataset.lane;
        const list = atoms.tools.filter((t) => t.lane === lane && (!q || t.name.includes(q) || t.module.includes(q)));
        box.style.display = list.length ? "" : "none";
        $(".tool-grid", box).innerHTML = list.map((t) =>
          `<div class="tool-card"><div class="t mono">${esc(t.name)}</div><div class="m">${esc(t.doc || t.module)}</div></div>`
        ).join("");
      });
    };
    drawTools();
    $("#tool-q", v).addEventListener("input", drawTools);
  }
}

/* ---------- 质检 ---------- */

async function renderQc(v) {
  if (!state.project) { v.innerHTML = `<div class="empty">没有项目</div>`; return; }
  v.innerHTML = `<div class="empty">读取质检…</div>`;
  const data = await api(`/api/qc?project=${encodeURIComponent(state.project)}`);
  const report = (data.reports || [])[0];
  const excerpt = report ? report.content.split("\n").slice(0, 40).join("\n") : "";
  v.innerHTML = `
    <h2 class="sec">报告</h2>
    <div class="card">
      ${report ? `<div style="display:flex; justify-content:space-between"><strong>${esc(report.name)}</strong><span class="chip">本地</span></div>
        <pre class="log" style="max-height:280px; margin-top:10px">${esc(excerpt)}${report.content.length > excerpt.length ? "\n…" : ""}</pre>`
        : `<span class="muted">还没有 QC.md</span>`}
    </div>
    ${(data.groups || []).map((g) => {
      const prefer = g.images.filter((p) => /frame-|f\d|recheck/.test(p) && !/cut\d/.test(p));
      const imgs = (prefer.length ? prefer : g.images.filter((p) => !/cut\d/.test(p))).slice(0, 18);
      if (!imgs.length) return "";
      return `
      <h2 class="sec">${esc(g.group)} · ${imgs.length} 帧</h2>
      <div class="qc-grid">
        ${imgs.map((p) => `
          <figure>
            <img src="${media(p)}" alt="" loading="lazy" data-full="${esc(p)}" />
            <figcaption class="muted">${esc(p.split("/").pop())}</figcaption>
          </figure>`).join("")}
      </div>`;
    }).join("") || `<div class="empty">没有质检帧。跑完质检链后会出现在 projects/*/质检/</div>`}
  `;
  v.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-full]");
    if (!img) return;
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<button class="close">×</button><img src="${img.src}" style="max-height:86vh; border-radius:12px" />`;
    lb.onclick = (ev) => { if (ev.target === lb || ev.target.closest(".close")) lb.remove(); };
    document.body.appendChild(lb);
  });
}

/* ---------- 启动 ---------- */

async function boot() {
  const st = await api("/api/state");
  state.projects = st.projects;
  state.creds = st.creds;
  state.project = st.projects[0]?.slug || null;

  $("#proj-picker").innerHTML = state.projects.length > 1
    ? `<select id="proj-sel">${state.projects.map((p) => `<option>${esc(p.slug)}</option>`).join("")}</select>`
    : `<span class="mono">${esc(state.project || "无项目")}</span>`;
  $("#proj-sel")?.addEventListener("change", async (e) => {
    state.project = e.target.value;
    await loadProject();
    render();
  });

  $("#side-foot").innerHTML = `
    <div style="margin-bottom:6px; letter-spacing:1px">凭据状态</div>
    ${Object.entries(state.creds).map(([k, on]) =>
      `<div class="cred ${on ? "on" : ""}"><i></i>${esc(k)}</div>`).join("")}
  `;

  await loadProject();
  setView(location.hash.slice(1) || "dash");
}

async function loadProject() {
  if (!state.project) return;
  const [{ styles }, cut] = await Promise.all([
    api(`/api/styles?project=${encodeURIComponent(state.project)}`),
    api(`/api/cutlist?project=${encodeURIComponent(state.project)}`),
  ]);
  state.styles = styles;
  state.edl = cut.edl;
  state.cutSource = cut.source;
  state.sources = cut.sources;
  state.bgms = cut.bgms;
}

boot().catch((e) => {
  $("#view").innerHTML = `<div class="empty">启动失败：${esc(e.message)}</div>`;
});
