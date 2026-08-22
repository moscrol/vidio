import express from "express";
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4700);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

/* ---------- 工具函数 ---------- */

function safeResolve(rel) {
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(ROOT + path.sep) && abs !== ROOT) throw new Error("path escapes root");
  return abs;
}

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function readIfExists(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return null; }
}

// 解析 SKILL.md / brief.md 的简易 frontmatter（key: value + 折叠多行 + 列表）
function parseFrontmatter(text) {
  if (!text || !text.startsWith("---")) return { meta: {}, body: text || "" };
  const end = text.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: text };
  const raw = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n/, "");
  const meta = {};
  let curKey = null;
  for (const line of raw.split("\n")) {
    const kv = line.match(/^([\w\u4e00-\u9fff][\w\u4e00-\u9fff-]*)\s*:\s*(.*)$/);
    if (kv) {
      curKey = kv[1];
      let v = kv[2].trim();
      if (v === ">" || v === "|" || v === "") { meta[curKey] = v === "" ? "" : { folded: true, text: "" }; }
      else meta[curKey] = v.replace(/\s+#.*$/, "").replace(/^"(.*)"$/, "$1");
    } else if (curKey && /^\s+- /.test(line)) {
      if (!Array.isArray(meta[curKey])) meta[curKey] = [];
      meta[curKey].push(line.replace(/^\s+- /, "").trim());
    } else if (curKey && /^\s+\S/.test(line)) {
      if (meta[curKey] && meta[curKey].folded !== undefined) meta[curKey].text += line.trim() + " ";
      else if (typeof meta[curKey] === "string") meta[curKey] += " " + line.trim();
    }
  }
  for (const k of Object.keys(meta)) {
    if (meta[k] && meta[k].folded !== undefined) meta[k] = meta[k].text.trim();
  }
  return { meta, body };
}

function ffprobe(file) {
  try {
    const out = execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration,size",
      "-show_entries", "stream=codec_type,codec_name,width,height,avg_frame_rate",
      "-of", "json", file,
    ], { encoding: "utf8" });
    const j = JSON.parse(out);
    const v = (j.streams || []).find((s) => s.codec_type === "video") || {};
    return {
      duration: Number(j.format?.duration || 0),
      size: Number(j.format?.size || 0),
      width: v.width, height: v.height,
      fps: v.avg_frame_rate, vcodec: v.codec_name,
    };
  } catch { return null; }
}

/* ---------- 项目与风格 ---------- */

const PROJECTS_DIR = path.join(ROOT, "projects");

function listProjects() {
  if (!exists(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR)
    .filter((d) => !d.startsWith("_") && exists(path.join(PROJECTS_DIR, d, "brief.md")))
    .map((slug) => {
      const brief = readIfExists(path.join(PROJECTS_DIR, slug, "brief.md"));
      const { meta, body } = parseFrontmatter(brief);
      const firstHeading = (body.match(/^#\s+(.+)$/m) || [])[1] || slug;
      // 摘要 = 第一个标题后的正文段落（跳过空行，取到下一个标题前，至多 6 行）
      const lines = body.split("\n");
      const h = lines.findIndex((l) => l.startsWith("# "));
      const intro = lines.slice(h + 1)
        .filter((l, idx, arr) => l.trim() || (idx > 0 && arr[idx - 1]?.trim()))
        .slice(0, 8)
        .join("\n")
        .split(/\n#/)[0]
        .trim();
      return { slug, meta, title: firstHeading, intro };
    });
}

// brief 里的风格表：| v01 aurora-glass | 风格 | 特色组件 | BGM |
function parseStyleTable(briefBody) {
  const rows = {};
  for (const line of briefBody.split("\n")) {
    const m = line.match(/^\|\s*(v\d+)[^|]*\|([^|]*)\|([^|]*)\|([^|]*)\|/);
    if (m) rows[m[1]] = { style: m[2].trim(), features: m[3].trim(), bgm: m[4].trim() };
  }
  return rows;
}

app.get("/api/state", (_req, res) => {
  const creds = {};
  for (const k of ["PEXELS_API_KEY", "PIXABAY_API_KEY", "VOLC_ACCESSKEY", "VOLC_SECRETKEY", "FAL_KEY", "MINIMAX_API_KEY", "HEYGEN_API_KEY"]) {
    creds[k] = Boolean(process.env[k]);
  }
  res.json({ root: ROOT, projects: listProjects(), creds });
});

app.get("/api/styles", (req, res) => {
  const slug = String(req.query.project || "");
  const projDir = safeResolve(path.join("projects", slug));
  const engDir = path.join(projDir, "工程");
  const outDir = path.join(projDir, "成片");
  if (!exists(engDir)) return res.json({ styles: [] });

  const brief = readIfExists(path.join(projDir, "brief.md")) || "";
  const table = parseStyleTable(brief);
  const outFiles = exists(outDir) ? fs.readdirSync(outDir).filter((f) => f.endsWith(".mp4")) : [];

  const styles = fs.readdirSync(engDir)
    .filter((d) => exists(path.join(engDir, d, "index.html")))
    .map((dir) => {
      // 工程/demo 是 v01 的母版工程（历史命名）
      const vid = (dir.match(/^v\d+/) || [])[0] || (dir === "demo" ? "v01" : null);
      let video = outFiles.find((f) => f === dir + ".mp4")
        || (vid && outFiles.find((f) => f.startsWith(vid + "-")))
        || outFiles.find((f) => f.includes(dir))
        || (dir === "demo" && outFiles.find((f) => f.includes("demo")));
      const info = (vid && table[vid]) || {};
      const probe = video ? ffprobe(path.join(outDir, video)) : null;
      return {
        id: dir, vid: vid || dir,
        video: video ? path.join("projects", slug, "成片", video) : null,
        probe, ...info,
        engineering: path.join("projects", slug, "工程", dir),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id, "zh"));
  res.json({ styles });
});

app.get("/api/qc", (req, res) => {
  const slug = String(req.query.project || "");
  const qcDir = safeResolve(path.join("projects", slug, "质检"));
  if (!exists(qcDir)) return res.json({ groups: [] });
  const groups = [];
  const walk = (dir, group) => {
    const imgs = [];
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) walk(full, group ? group + "/" + f.name : f.name);
      else if (/\.(png|jpg|jpeg|webp)$/i.test(f.name)) imgs.push(path.relative(ROOT, full));
    }
    if (imgs.length) groups.push({ group: group || "根目录", images: imgs.sort() });
  };
  walk(qcDir, "");
  const reports = fs.readdirSync(qcDir).filter((f) => f.endsWith(".md")).map((f) => ({
    name: f, content: readIfExists(path.join(qcDir, f)),
  }));
  res.json({ groups, reports });
});

/* ---------- 组件库 ---------- */

app.get("/api/library", (_req, res) => {
  const libDir = path.join(ROOT, "library");
  const items = [];
  if (exists(libDir)) {
    for (const cat of fs.readdirSync(libDir, { withFileTypes: true })) {
      if (!cat.isDirectory()) continue;
      for (const comp of fs.readdirSync(path.join(libDir, cat.name), { withFileTypes: true })) {
        if (!comp.isDirectory()) continue;
        const base = path.join(libDir, cat.name, comp.name);
        let manifest = null;
        try { manifest = JSON.parse(readIfExists(path.join(base, "manifest.json")) || "null"); } catch {}
        items.push({
          category: cat.name, name: comp.name, manifest,
          preview: exists(path.join(base, "preview.png")) ? path.relative(ROOT, path.join(base, "preview.png")) : null,
          dir: path.relative(ROOT, base),
        });
      }
    }
  }
  res.json({ items, catalog: readIfExists(path.join(libDir, "CATALOG.md")) });
});

app.get("/api/map", (_req, res) => {
  res.json({ lanes: LANES, overrides: OVERRIDES, blocked: BLOCKED });
});

function collectShots() {
  const root = path.join(ROOT, ".agents", "skills", "video-shotcraft", "references", "shots");
  const out = [];
  if (!exists(root)) return out;
  const walk = (dir, cat) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) walk(full, f.name);
      else if (f.name.endsWith(".md") && f.name !== "ATTRIBUTION.md") {
        const { meta } = parseFrontmatter(readIfExists(full) || "");
        out.push({
          id: meta.name || f.name.replace(/\.md$/, ""),
          one: meta["一句话"] || "",
          use: meta["适用"] || "",
          dur: meta["时长"] || "",
          energy: meta["能量"] || "",
          tag: meta["标签"] || cat,
          category: cat,
          path: path.relative(ROOT, full),
        });
      }
    }
  };
  walk(root, "");
  return out;
}

let shotCache = null;
app.get("/api/shots", (_req, res) => {
  if (!shotCache) shotCache = collectShots();
  res.json({ count: shotCache.length, shots: shotCache });
});

/* ---------- 技能与原子能力 ---------- */

function skillGroup(id) {
  if (id === "vibe-director") return "导演调度";
  if (id === "vibe-design-language") return "设计语言与来源边界";
  if (id === "vibe-visual-taste") return "视觉品味与静帧质检";
  if (id === "vibe-motion-taste") return "动效品味与质检";
  if (id === "openmontage-adapter") return "工具箱适配";
  if (/^(hyperframes|gsap|three|animejs|lottie|waapi|css-animations|tailwind|typegpu|remotion)/.test(id)) return "动效执行";
  if (/^rn-|^editorial-|^transitions-dev|^transitions-polish|^make-interfaces|^contribute-catalog/.test(id)) return "风格与设计工程";
  if (/^seedance/.test(id)) return "生成影像";
  if (/^(rachel|heygen)/.test(id)) return "数字人";
  if (/^(ra-|dbs)/.test(id)) return "文案与洗稿";
  if (/^(skill-captions|skill-cover|xhs-|ian-|ai-jian|video-use|chengfeng)/.test(id)) return "字幕封面与剪辑";
  if (/shotcraft|website-to|stitch|promo-film/.test(id)) return "宣传片与采集";
  if (id === "tts-skill") return "配音（本仓库默认禁用）";
  return "其他";
}

const BLOCKED = {
  "ra-video-production-director": "硬覆盖 1：会抢「做视频」触发并创建 01-内容生产/",
  "tts-skill": "硬覆盖 2：默认不用 IndexTTS2，除非本机已部署并给参考 WAV",
  "heygen-digital-avatar": "硬覆盖 3：未提供自己的 Digital Twin 时禁用（走 rachel）",
};

const LANES = [
  { id: "motion", form: "动效视频", when: "抽象概念、知识口播动效、说不清形态（本仓库默认）", skills: ["vibe-director", "vibe-design-language", "vibe-visual-taste", "vibe-motion-taste", "hyperframes", "gsap"], cred: "无", copy: "帮我做一个讲____的动效视频，9:16，30 秒，无人出镜；先过 reference-brief.md / design-vocabulary.json 门禁，再定视觉与运动合同。" },
  { id: "promo", form: "产品宣传片", when: "产品网址 / 截图 / 桌面或网页 App / 「宣传片」", skills: ["vibe-director", "vibe-design-language", "vibe-visual-taste", "vibe-motion-taste", "promo-film-pipeline", "video-shotcraft", "website-to-hyperframes", "transitions-dev"], cred: "无", copy: "给 ____ 做一支电影感宣传片；先走导演及 reference-brief.md / design-vocabulary.json、视觉门禁，凡交叉淡化、变速、运镜、合成或转场先写 motion-contract.json，再调用 promo-film-pipeline；无人出镜。" },
  { id: "gen", form: "生成影像", when: "即梦 / Seedance / 文生视频 / 图生视频 / 首尾帧", skills: ["seedance-20", "openmontage-adapter"], cred: "默认只交提示词包；代跑需 VOLC 或 FAL_KEY", copy: "用 Seedance 拍一段：____。先出提示词包，不要代跑。" },
  { id: "stock", form: "实拍混剪", when: "真素材 / 纪录片感 / 免费 stock", skills: ["openmontage-adapter"], cred: "PEXELS_API_KEY / PIXABAY_API_KEY", copy: "用免费实拍素材剪一支纪录片感短片，避开真人镜头。" },
  { id: "avatar", form: "数字人口播", when: "人像照片 + 口播稿 / 「数字人」", skills: ["rachel-digital-human-production"], cred: "MINIMAX_API_KEY + HEYGEN_API_KEY；须用户点名", copy: "用我的数字人念这段口播：____（肖像和音色样本另附）。" },
  { id: "talk", form: "口播成片", when: "已有口播录像，或只有文稿要配音但不给肖像", skills: ["ra-人话", "ra-local-talking-head-cut", "hyperframes-media"], cred: "Kokoro 本地无密钥；克隆音色要 MiniMax", copy: "这段口播录像帮我粗剪去口误，画面走动效。" },
  { id: "remix", form: "二创", when: "竞品/参考视频 URL + 「洗稿」「做成我的」", skills: ["ra-video-wash-pipeline", "ra-洗稿", "openmontage-adapter"], cred: "下载源片可能要 TikHub", copy: "把这条视频洗成我的：____（链接）。源标题不要进成片。" },
  { id: "cover", form: "封面图文", when: "封面 / 小红书图 / 标题图", skills: ["vibe-design-language", "vibe-visual-taste", "rn-cover-skill", "editorial-dot-cover", "skill-cover", "xhs-article-to-images"], cred: "无", copy: "给刚这支片子做一张 5:2 封面，标题：____；沿用或先补项目 reference-brief.md / design-vocabulary.json 门禁与视觉合同。" },
];

const OVERRIDES = [
  "禁止加载 ra-video-production-director（会建 01-内容生产/）",
  "禁止加载 tts-skill，除非本机 IndexTTS2 + 参考 WAV",
  "禁止加载 heygen-digital-avatar，除非用户给自己的 Twin id",
  "禁止创建 01-内容生产/：一律 projects/ + library/",
  "默认直接制作，不建选题卡",
  "少问多做：能填默认值就写进 brief",
  "默认无人出镜（含生成人形）",
  "OpenMontage 只当工具箱，不进它的 pipeline / Backlot",
];

function omLane(mod, name) {
  const s = `${mod} ${name}`.toLowerCase();
  if (/corpus|clip_search|pexels_video|pixabay_video|stock|footage|direct_clip|video_selector|video_downloader/.test(s)) return "实拍素材";
  if (/tts|audio_enhance|audio_mixer|audio_probe|audio_energy/.test(s)) return "配音";
  if (/music|freesound|suno|pixabay_music/.test(s)) return "配乐";
  if (/subtitle|whisper|transcriber|transcript|azure_stt|dashscope_asr|remotion_caption/.test(s)) return "字幕";
  if (/jimeng|kling_official_video|kling_video|veo|runway|luma|sora|seedance|wan_video|minimax_video|hunyuan|ltx_|cogvideo|higgsfield|grok_video|gemini_omni|heygen_video|comfyui_video/.test(s)) return "生成代跑";
  if (/enhance|upscale|reframe|green_screen|bg_remove|face_|eye_enhance|color_grade/.test(s)) return "画质";
  if (/scene_detect|video_analyzer|video_understand|frame_sampl|visual_qa|composition_validator|face_tracker/.test(s)) return "参考片拆解";
  if (/avatar|talking_head|lip_sync|character_|pose_library|svg_rig|action_timeline/.test(s)) return "数字人/角色";
  if (/image_gen|flux_|openai_image|google_imagen|recraft|comfyui_image|dashscope_image|grok_image|local_diffusion|pexels_image|pixabay_image|kling_official_image|image_selector/.test(s)) return "生图";
  if (/hyperframes|video_compose|video_stitch|video_trimmer|silence_cutter|showcase_card|code_snippet|diagram_gen|math_animate|export_bundle/.test(s)) return "合成与剪辑";
  if (/capture|screen_record|cap_recorder|screen_capture/.test(s)) return "录屏采集";
  return "其他工具";
}

app.get("/api/skills", (_req, res) => {
  const dir = path.join(ROOT, ".agents", "skills");
  const skills = [];
  if (exists(dir)) {
    for (const d of fs.readdirSync(dir)) {
      const md = readIfExists(path.join(dir, d, "SKILL.md"));
      if (!md) continue;
      const { meta } = parseFrontmatter(md);
      skills.push({
        id: d, name: meta.name || d,
        description: String(meta.description || "").slice(0, 400),
        group: skillGroup(d),
        blocked: BLOCKED[d] || null,
      });
    }
  }
  skills.sort((a, b) => a.group.localeCompare(b.group, "zh") || a.id.localeCompare(b.id));
  res.json({ skills });
});

let omCache = null;
app.get("/api/atoms", (_req, res) => {
  if (omCache) return res.json(omCache);
  const py = path.join(ROOT, "vendor", "openmontage", ".venv", "bin", "python");
  if (!exists(py)) {
    return res.json({ available: false, reason: "vendor/openmontage 未安装（见 openmontage-adapter 技能）", tools: [] });
  }
  const script = `
import sys, json; sys.path.insert(0, ".")
from tools.tool_registry import ToolRegistry
reg = ToolRegistry(); reg.ensure_discovered()
out = []
for name in sorted(reg.list_names() if hasattr(reg, "list_names") else reg._tools.keys()):
    t = reg.get(name)
    mod = type(t).__module__
    doc = (type(t).__doc__ or "").strip().split("\\n")[0][:160]
    out.append({"name": name, "module": mod, "doc": doc})
print(json.dumps(out, ensure_ascii=False))
`;
  execFile(py, ["-c", script], { cwd: path.join(ROOT, "vendor", "openmontage"), timeout: 60000 }, (err, stdout) => {
    if (err) return res.json({ available: false, reason: String(err).slice(0, 300), tools: [] });
    try {
      const tools = JSON.parse(stdout.trim().split("\n").pop()).map((t) => ({
        ...t, lane: omLane(t.module, t.name),
      }));
      omCache = { available: true, tools };
      res.json(omCache);
    } catch (e) {
      res.json({ available: false, reason: "解析失败: " + e.message, tools: [] });
    }
  });
});

/* ---------- 混剪台 ---------- */

const DEFAULT_EDL = {
  segments: [
    { file: "v02-bw-kinetic.mp4", from: 0, to: 5.145, label: "钩子：研报看不完" },
    { file: "v08-collage.mp4", from: 6.543, to: 11.4, label: "信息洪流" },
    { file: "finhot-demo.mp4", from: 0, to: 6, label: "真实UI：聚成一条流" },
    { file: "v07-dataviz.mp4", from: 17.4, to: 23.4, label: "带来源的结论" },
    { file: "v01-aurora-glass.mp4", from: 22.002, to: 26.859, label: "一堆App来回刷 vs FinHot" },
    { file: "v10-velvet.mp4", from: 26.859, to: 30, label: "CTA + 免责声明" },
  ],
  covers: [
    { file: "v02-bw-kinetic.mp4", x: 760, y: 28, w: 280, h: 52, color: "#0D0D0C", enable: "lt(t,3.42)" },
    { file: "v10-velvet.mp4", x: 60, y: 1828, w: 400, h: 58, color: "#07100C", enable: "1" },
  ],
  bgm: "tonight-hiphop.mp3",
  volume: 0.38,
};

function parseEdlFence(text) {
  const m = String(text || "").match(/```edl\s*\n([\s\S]*?)```/);
  if (!m) return null;
  const edl = { segments: [], covers: [], bgm: DEFAULT_EDL.bgm, volume: DEFAULT_EDL.volume };
  for (const raw of m[1].split("\n")) {
    const t = raw.trim();
    if (!t || t.startsWith("#")) continue;
    const p = t.split(/\s+/);
    if (p[0] === "bgm" && p[1]) edl.bgm = path.basename(p[1]);
    else if (p[0] === "volume") edl.volume = Number(p[1]);
    else if (p[0] === "seg" && p.length >= 4) {
      edl.segments.push({ file: path.basename(p[1]), from: Number(p[2]), to: Number(p[3]), label: p.slice(4).join(" ") });
    } else if (p[0] === "cover" && p.length >= 7) {
      edl.covers.push({
        file: path.basename(p[1]),
        x: Number(p[2]), y: Number(p[3]), w: Number(p[4]), h: Number(p[5]),
        color: p[6], enable: p[7] || "1",
      });
    }
  }
  return edl.segments.length ? edl : null;
}

function findCutlist(projDir) {
  const eng = path.join(projDir, "工程");
  if (!exists(eng)) return null;
  for (const d of fs.readdirSync(eng, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const p = path.join(eng, d.name, "CUTLIST.md");
    if (exists(p)) return p;
  }
  return null;
}

function loadEdl(slug) {
  const projDir = safeResolve(path.join("projects", slug));
  const cutPath = findCutlist(projDir);
  if (cutPath) {
    const parsed = parseEdlFence(readIfExists(cutPath));
    if (parsed) return { edl: parsed, source: path.relative(ROOT, cutPath) };
  }
  return { edl: structuredClone(DEFAULT_EDL), source: "fallback" };
}

app.get("/api/cutlist", (req, res) => {
  const slug = String(req.query.project || "");
  const outDir = safeResolve(path.join("projects", slug, "成片"));
  const bgmDir = safeResolve(path.join("projects", slug, "工程", "shared", "bgm"));
  const sources = exists(outDir)
    ? fs.readdirSync(outDir).filter((f) => f.endsWith(".mp4")).map((f) => ({
        file: f, probe: ffprobe(path.join(outDir, f)),
      }))
    : [];
  const bgms = exists(bgmDir) ? fs.readdirSync(bgmDir).filter((f) => /\.(mp3|wav|m4a)$/.test(f)) : [];
  const { edl, source } = loadEdl(slug);
  res.json({ edl, source, sources, bgms });
});

function boxColor(hex) {
  const h = String(hex || "").replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error("cover 颜色非法");
  return "0x" + h.toUpperCase();
}

function safeEnable(expr) {
  if (!expr || expr === "1") return null;
  if (!/^[a-z0-9_()<>=.,+\-\s]+$/i.test(expr)) throw new Error("cover enable 非法");
  return expr;
}

function coverFilter(segFile, covers) {
  const list = (covers || []).filter((c) => path.basename(c.file) === path.basename(segFile));
  if (!list.length) return "";
  return list.map((c) => {
    const x = Number(c.x), y = Number(c.y), w = Number(c.w), h = Number(c.h);
    if (![x, y, w, h].every((n) => Number.isFinite(n) && n >= 0 && n <= 4000)) throw new Error("cover 坐标非法");
    const en = safeEnable(c.enable);
    // 实底用 drawbox；深色渐变底用 delogo 借周围像素，避免黑块
    const solid = String(c.color || "").toLowerCase() === "#0d0d0c";
    const f = solid
      ? `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=${boxColor(c.color)}:t=fill`
      : `delogo=x=${x}:y=${y}:w=${w}:h=${h}:show=0`;
    return `,${f}${en ? `:enable='${en}'` : ""}`;
  }).join("");
}

function buildMixArgs(slug, edl, outName) {
  const outDir = safeResolve(path.join("projects", slug, "成片"));
  const bgmPath = safeResolve(path.join("projects", slug, "工程", "shared", "bgm", path.basename(edl.bgm)));
  const segs = edl.segments;
  if (!Array.isArray(segs) || segs.length < 2 || segs.length > 12) throw new Error("段数需在 2–12 之间");

  const inputs = [];
  const chains = [];
  let cum = 0;
  const cuts = [];
  segs.forEach((s, i) => {
    const file = path.join(outDir, path.basename(s.file));
    if (!exists(file)) throw new Error(`源片不存在: ${s.file}`);
    const from = Number(s.from), to = Number(s.to);
    if (!(from >= 0 && to > from && to - from <= 60)) throw new Error(`第 ${i + 1} 段时间窗非法`);
    inputs.push("-i", file);
    const glitch = i === 0 ? "" : `,rgbashift=rh=${14 - i}:bh=${-(12 - i)}:enable='lt(n,5)'`;
    const cover = coverFilter(s.file, edl.covers);
    chains.push(`[${i}:v]trim=start=${from}:end=${to},setpts=PTS-STARTPTS,fps=30,format=rgba${glitch}${cover}[v${i}]`);
    if (i > 0) cuts.push(cum);
    cum += to - from;
  });
  const total = Math.round(cum * 1000) / 1000;
  if (total > 120) throw new Error("总时长超过 120s");

  const concatIn = segs.map((_, i) => `[v${i}]`).join("");
  const flashEnable = cuts.map((t) => `between(t,${(t - 0.033).toFixed(3)},${(t + 0.067).toFixed(3)})`).join("+") || "0";
  const bgmIdx = segs.length;
  const vol = Math.min(1, Math.max(0, Number(edl.volume ?? 0.38)));
  const filter = [
    ...chains,
    `${concatIn}concat=n=${segs.length}:v=1:a=0,format=yuv420p[vcat]`,
    `color=c=white@0.72:s=1080x1920:d=${total}:r=30,format=yuva420p[flash]`,
    `[vcat][flash]overlay=0:0:eof_action=pass:enable='${flashEnable}'[vout]`,
    `[${bgmIdx}:a]atrim=0:${total},asetpts=PTS-STARTPTS,volume=${vol},aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[aout]`,
  ].join(";");

  const outFile = path.join(outDir, outName);
  const args = [
    "-y", ...inputs, "-i", bgmPath,
    "-filter_complex", filter,
    "-map", "[vout]", "-map", "[aout]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
    "-movflags", "+faststart", "-t", String(total),
    outFile,
  ];
  return { args, outFile, total };
}

let mixRunning = false;
app.post("/api/mix/assemble", (req, res) => {
  const { project, edl, out, dry } = req.body || {};
  let built;
  try {
    const slug = String(project || "");
    const outName = /^[\w][\w.-]*\.mp4$/.test(String(out || "")) ? String(out) : "v11-mix-gui.mp4";
    const resolved = edl && Array.isArray(edl.segments) ? edl : loadEdl(slug).edl;
    if (!Array.isArray(resolved.covers) || !resolved.covers.length) {
      resolved.covers = loadEdl(slug).edl.covers || [];
    }
    built = buildMixArgs(slug, resolved, outName);
  } catch (e) {
    return res.status(400).json({ ok: false, error: e.message });
  }
  if (dry) return res.json({ ok: true, dry: true, total: built.total, command: "ffmpeg " + built.args.join(" ") });
  if (mixRunning) return res.status(409).json({ ok: false, error: "已有拼装任务在跑" });
  mixRunning = true;
  execFile("ffmpeg", built.args, { timeout: 10 * 60 * 1000 }, (err, _stdout, stderr) => {
    mixRunning = false;
    if (err) return res.json({ ok: false, error: String(stderr || err).slice(-1500) });
    res.json({
      ok: true, total: built.total,
      output: path.relative(ROOT, built.outFile),
      probe: ffprobe(built.outFile),
    });
  });
});

/* ---------- HyperFrames 执行环（lint / inspect / preview；不代跑付费渲染） ---------- */

function lastJson(text) {
  const s = String(text || "");
  const start = s.indexOf("{");
  if (start < 0) return null;
  try { return JSON.parse(s.slice(start)); } catch {
    const last = s.lastIndexOf("{");
    try { return JSON.parse(s.slice(last)); } catch { return null; }
  }
}

function resolveEng(slug, styleId) {
  if (!/^[\w.-]+$/.test(styleId)) throw new Error("工程名非法");
  const dir = safeResolve(path.join("projects", slug, "工程", styleId));
  if (!exists(path.join(dir, "index.html"))) throw new Error("没有 index.html");
  return dir;
}

function runHf(args, cwd, timeout) {
  return new Promise((resolve) => {
    execFile("npx", ["--yes", "hyperframes", ...args], {
      cwd, timeout, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, FORCE_COLOR: "0" },
    }, (err, stdout, stderr) => {
      resolve({ err, stdout: String(stdout || ""), stderr: String(stderr || "") });
    });
  });
}

function stylePort(styleId) {
  let h = 0;
  for (const c of styleId) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  return 4710 + (h % 80);
}

app.post("/api/hf", async (req, res) => {
  const { project, style, action } = req.body || {};
  const slug = String(project || "");
  const styleId = String(style || "");
  let dir;
  try { dir = resolveEng(slug, styleId); }
  catch (e) { return res.status(400).json({ ok: false, error: e.message }); }

  if (action === "lint") {
    const r = await runHf(["lint", "--json", dir], dir, 45000);
    const json = lastJson(r.stdout);
    return res.json({
      ok: !r.err || json?.ok === true,
      action, json,
      error: json ? null : String(r.stderr || r.err || "").slice(-800),
    });
  }

  if (action === "inspect") {
    const r = await runHf(["inspect", "--json", "--samples", "6", "--max-issues", "40", dir], dir, 180000);
    const json = lastJson(r.stdout);
    return res.json({
      ok: Boolean(json),
      action, json,
      error: json ? null : String(r.stderr || r.err || "").slice(-800),
    });
  }

  if (action === "preview") {
    const port = stylePort(styleId);
    const r = await runHf(["preview", dir, "--background", "--no-open", `--port=${port}`], dir, 45000);
    const found = (r.stdout + r.stderr).match(/https?:\/\/[^\s]+/);
    const url = found ? found[0].replace(/[.,;]+$/, "") : `http://localhost:${port}/#project/${path.basename(dir)}`;
    const failed = r.err && !/already running|listening|localhost/i.test(r.stdout + r.stderr);
    return res.json({
      ok: !failed,
      action, port, url,
      log: (r.stdout + "\n" + r.stderr).slice(-1200),
      error: failed ? String(r.stderr || r.err).slice(-800) : null,
    });
  }

  if (action === "preview-stop") {
    const r = await runHf(["preview", dir, "--stop"], dir, 20000);
    return res.json({ ok: !r.err, action, log: (r.stdout + r.stderr).slice(-600) });
  }

  if (action === "render-cmd") {
    const outFile = path.join(ROOT, "projects", slug, "成片", `${styleId}.mp4`);
    return res.json({
      ok: true, action,
      command: `npx hyperframes render --fps 30 --quality standard --output ${outFile}`,
      note: "渲染仍走 agent：耗时长、吃 CPU。复制命令在工程目录执行，或贴回对话让 agent 渲。",
    });
  }

  return res.status(400).json({ ok: false, error: "未知 action" });
});

/* ---------- 缩略图（ffmpeg 抽帧，磁盘缓存） ---------- */

const THUMB_DIR = path.join(__dirname, ".thumbs");
fs.mkdirSync(THUMB_DIR, { recursive: true });

app.get("/thumb", (req, res) => {
  try {
    const abs = safeResolve(String(req.query.p || ""));
    if (![".mp4", ".webm", ".mov"].includes(path.extname(abs).toLowerCase()) || !exists(abs)) return res.status(404).end();
    const t = Math.max(0, Math.min(600, Number(req.query.t || 2.5)));
    const key = Buffer.from(`${path.relative(ROOT, abs)}@${t}@${fs.statSync(abs).mtimeMs}`).toString("base64url") + ".jpg";
    const cached = path.join(THUMB_DIR, key);
    if (exists(cached)) return res.sendFile(cached);
    execFile("ffmpeg", ["-y", "-ss", String(t), "-i", abs, "-frames:v", "1", "-vf", "scale=480:-2", "-q:v", "4", cached],
      { timeout: 20000 }, (err) => {
        if (err || !exists(cached)) return res.status(500).end();
        res.sendFile(cached);
      });
  } catch {
    res.status(400).end();
  }
});

/* ---------- 媒体 ---------- */

const MEDIA_EXT = new Set([".mp4", ".webm", ".mov", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp3", ".wav", ".json", ".md"]);
app.get("/media", (req, res) => {
  try {
    const abs = safeResolve(String(req.query.p || ""));
    if (!MEDIA_EXT.has(path.extname(abs).toLowerCase())) return res.status(403).end();
    if (!exists(abs)) return res.status(404).end();
    res.sendFile(abs);
  } catch {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`vidio studio → http://localhost:${PORT}`);
});
