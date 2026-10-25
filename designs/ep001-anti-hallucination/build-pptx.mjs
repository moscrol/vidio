/**
 * ep001 · 五层防幻觉 — pptxgenjs 竖屏 9:16 讲解 deck
 * 对齐 baoyu case-first 六页叙事，独立用 Grok pptx skill 重建一版
 */
import pptxgen from "pptxgenjs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "ep001-pptxgenjs.pptx");

const C = {
  bg: "0B1220",
  bg2: "121C32",
  card: "17233C",
  text: "F3F6FB",
  muted: "9AABC4",
  gold: "E8B54D",
  green: "3ECF8E",
  amber: "E8B54D",
  red: "F07178",
  foot: "5D6D88",
  greenBg: "1A3A32",
  amberBg: "3A3220",
  redBg: "3A2228",
  goldDim: "2A2418",
};

const notes = [
  "开发研究 Agent 时，我见过这种回复——「成交额加了 20%，属于健康分歧，明天会回流，A 是最强。」乍一看很专业。",
  "拆开看：加了 20%，也许库里对得上，这是事实；健康分歧，已经是解释；明天回流，是预测；A 最强，是在替你做选择。",
  "大模型在预测下一个词，流畅不等于真实。数字对了，也不能把后面整段一起升级成「可以下单的结论」。",
  "所以我按五层挡：生成只写候选，外面要证据、代码校验、历史重放、人工金标准；再加一道权限——没验收的分数，不能自动写库。",
  "客服、知识库、代码助手，同一套：先问它是事实、解释，还是动作。生成不是真相——错误要很难一路升到决策权。",
  "你最近被 AI 哪一句「像真的」带偏过？评论区聊聊。架构演示，非投资建议。",
];

const pres = new pptxgen();
pres.defineLayout({ name: "DOUYIN_9x16", width: 6.075, height: 10.8 });
pres.layout = "DOUYIN_9x16";
pres.author = "vidio / ops short-video";
pres.title = "001 · 数字对了，也不能一起升级";
pres.subject = "五层防幻觉 · 案例优先 · pptxgenjs";

const W = 6.075;
const H = 10.8;
const M = 0.42; // side margin
const contentW = W - M * 2;

function paintBg(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: C.bg },
    line: { color: C.bg, width: 0 },
  });
  // soft top glow
  slide.addShape(pres.shapes.OVAL, {
    x: -0.8, y: -1.6, w: 7.6, h: 3.4,
    fill: { color: "1E335C", transparency: 55 },
    line: { color: "1E335C", width: 0, transparency: 100 },
  });
}

function badge(slide, label) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: 0.38, w: 1.55, h: 0.38,
    fill: { color: "2A2418" },
    line: { color: "8A6A28", width: 1 },
    rectRadius: 0.19,
  });
  slide.addText(label, {
    x: M, y: 0.38, w: 1.55, h: 0.38,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: C.gold, bold: true, align: "center", valign: "middle",
    margin: 0,
  });
}

function warn(slide) {
  slide.addText("架构演示 · 非投资建议", {
    x: W - M - 2.1, y: 0.4, w: 2.1, h: 0.32,
    fontSize: 9, fontFace: "Microsoft YaHei",
    color: C.muted, align: "right", valign: "middle", margin: 0,
  });
}

function foot(slide, n) {
  slide.addText("001 · 五层防幻觉", {
    x: M, y: H - 0.42, w: 2.8, h: 0.28,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.foot, margin: 0,
  });
  slide.addText(`${n} / 6`, {
    x: W - M - 0.9, y: H - 0.42, w: 0.9, h: 0.28,
    fontSize: 9, fontFace: "Microsoft YaHei", color: C.foot, align: "right", margin: 0,
  });
}

// ─── Slide 1: 案例 ───────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "01 · 案例");
  warn(s);

  s.addText([
    { text: "开发研究 Agent 时", options: { breakLine: true, color: C.text } },
    { text: "我见过这种回复", options: { color: C.gold } },
  ], {
    x: M, y: 1.05, w: contentW, h: 1.35,
    fontSize: 28, fontFace: "Microsoft YaHei", bold: true,
    margin: 0, valign: "top",
  });

  s.addText("乍一看很专业。拆开才知道问题在哪。", {
    x: M, y: 2.5, w: contentW, h: 0.45,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: 3.2, w: contentW, h: 2.55,
    fill: { color: C.card },
    line: { color: "2A3A55", width: 1 },
    rectRadius: 0.18,
    shadow: { type: "outer", color: "000000", blur: 18, offset: 6, angle: 180, opacity: 0.35 },
  });

  s.addText("AI 输出 · 示意", {
    x: M + 0.28, y: 3.4, w: contentW - 0.56, h: 0.32,
    fontSize: 11, fontFace: "Microsoft YaHei", color: C.gold, bold: true, margin: 0,
  });

  s.addText("「储能成交额增加 20%，属于健康分歧，明天会回流，A 是最强标的。」", {
    x: M + 0.28, y: 3.85, w: contentW - 0.56, h: 1.6,
    fontSize: 16, fontFace: "Microsoft YaHei", color: C.text, bold: true,
    margin: 0, valign: "top",
  });

  foot(s, 1);
  s.addNotes(notes[0]);
}

// ─── Slide 2: 拆解 ───────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "02 · 拆开看");
  warn(s);

  s.addText([
    { text: "同一句话里", options: { breakLine: true, color: C.text } },
    { text: "有", options: { color: C.text } },
    { text: "四种地位", options: { color: C.gold } },
  ], {
    x: M, y: 1.0, w: contentW, h: 1.15,
    fontSize: 28, fontFace: "Microsoft YaHei", bold: true, margin: 0,
  });

  const rows = [
    { t: "成交额增加 20%", tag: "可核验事实", tc: C.green, bg: C.greenBg },
    { t: "属于健康分歧", tag: "解释", tc: C.amber, bg: C.amberBg },
    { t: "明天会回流", tag: "预测", tc: C.red, bg: C.redBg },
    { t: "A 是最强标的", tag: "选择 / 建议", tc: C.red, bg: C.redBg },
  ];

  let y = 2.45;
  for (const r of rows) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: M, y, w: contentW, h: 1.05,
      fill: { color: C.card },
      line: { color: "2A3A55", width: 1 },
      rectRadius: 0.12,
    });
    s.addText(r.t, {
      x: M + 0.28, y, w: 3.1, h: 1.05,
      fontSize: 15, fontFace: "Microsoft YaHei", color: C.text, bold: true,
      valign: "middle", margin: 0,
    });
    const tagW = 1.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: W - M - tagW - 0.22, y: y + 0.3, w: tagW, h: 0.45,
      fill: { color: r.bg },
      line: { color: r.tc, width: 0.5 },
      rectRadius: 0.08,
    });
    s.addText(r.tag, {
      x: W - M - tagW - 0.22, y: y + 0.3, w: tagW, h: 0.45,
      fontSize: 11, fontFace: "Microsoft YaHei", color: r.tc, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    y += 1.2;
  }

  foot(s, 2);
  s.addNotes(notes[1]);
}

// ─── Slide 3: 金句 ───────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "03 · 金句");

  s.addText([
    { text: "数字对了", options: { breakLine: true, color: C.text } },
    { text: "也不能一起升级", options: { color: C.gold } },
  ], {
    x: M, y: 3.6, w: contentW, h: 1.7,
    fontSize: 32, fontFace: "Microsoft YaHei", bold: true, margin: 0,
  });

  s.addText([
    { text: "大模型在预测下一个词。", options: { breakLine: true } },
    { text: "流畅 ≠ 真实 · 意见 ≠ 决策权" },
  ], {
    x: M, y: 5.55, w: contentW, h: 0.9,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  foot(s, 3);
  s.addNotes(notes[2]);
}

// ─── Slide 4: 五层 ───────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "04 · 通式");

  s.addText([
    { text: "所以我按", options: { color: C.text } },
    { text: "五层", options: { color: C.gold } },
    { text: "挡", options: { color: C.text } },
  ], {
    x: M, y: 0.95, w: contentW, h: 0.55,
    fontSize: 24, fontFace: "Microsoft YaHei", bold: true, margin: 0,
  });

  s.addText("生成只写候选，再逐级升级", {
    x: M, y: 1.5, w: contentW, h: 0.35,
    fontSize: 12, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  const layers = [
    { n: "1", t: "生成器", d: "写候选，不宣布终审" },
    { n: "2", t: "数据证据", d: "对齐外部可追溯记录" },
    { n: "3", t: "确定性校验", d: "同输入 → 同检查结果" },
    { n: "4", t: "历史重放", d: "禁止偷看当时不可知信息" },
    { n: "5", t: "人工金标准", d: "模糊边界与争议样本" },
  ];

  let y = 2.05;
  for (const L of layers) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: M, y, w: contentW, h: 0.95,
      fill: { color: "141E32" },
      line: { color: "2A3A55", width: 1 },
      rectRadius: 0.1,
    });
    s.addText(L.n, {
      x: M + 0.12, y, w: 0.45, h: 0.95,
      fontSize: 18, fontFace: "Arial", color: C.gold, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(L.t, {
      x: M + 0.65, y: y + 0.14, w: contentW - 0.9, h: 0.35,
      fontSize: 14, fontFace: "Microsoft YaHei", color: C.text, bold: true, margin: 0,
    });
    s.addText(L.d, {
      x: M + 0.65, y: y + 0.5, w: contentW - 0.9, h: 0.32,
      fontSize: 11, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
    });
    y += 1.05;
  }

  // authority
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: M, y: y + 0.08, w: contentW, h: 1.05,
    fill: { color: C.goldDim },
    line: { color: "C9A227", width: 1.5 },
    rectRadius: 0.1,
  });
  s.addText("+ 权限 authority", {
    x: M + 0.28, y: y + 0.2, w: contentW - 0.56, h: 0.32,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.gold, bold: true, margin: 0,
  });
  s.addText("没验收的分数，不能自动写库、不能当硬闸门", {
    x: M + 0.28, y: y + 0.55, w: contentW - 0.56, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei", color: "D8E0EE", margin: 0,
  });

  foot(s, 4);
  s.addNotes(notes[3]);
}

// ─── Slide 5: 可复用 ─────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "05 · 可复用");

  s.addText("同一套问题", {
    x: M, y: 1.15, w: contentW, h: 0.6,
    fontSize: 28, fontFace: "Microsoft YaHei", color: C.text, bold: true, margin: 0,
  });

  s.addText("先问它是事实、解释，还是动作。", {
    x: M, y: 1.85, w: contentW, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  const chips = ["客服 Agent", "企业知识库", "代码助手", "研究 Agent"];
  let cx = M;
  let cy = 2.6;
  for (let i = 0; i < chips.length; i++) {
    const chip = chips[i];
    const cw = 2.4;
    if (i === 2) {
      cx = M;
      cy = 3.35;
    }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.58,
      fill: { color: "1A2538" },
      line: { color: "2A3A55", width: 1 },
      rectRadius: 0.29,
    });
    s.addText(chip, {
      x: cx, y: cy, w: cw, h: 0.58,
      fontSize: 13, fontFace: "Microsoft YaHei", color: C.text, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    cx += cw + 0.2;
  }

  s.addText("生成不是真相 —— 错误要很难一路升到决策权。", {
    x: M, y: 4.3, w: contentW, h: 0.7,
    fontSize: 14, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  foot(s, 5);
  s.addNotes(notes[4]);
}

// ─── Slide 6: 讨论 ───────────────────────────────────────────
{
  const s = pres.addSlide();
  paintBg(s);
  badge(s, "06 · 讨论");

  s.addText([
    { text: "你最近被 AI", options: { breakLine: true, color: C.text } },
    { text: "哪一句「像真的」带偏过？", options: { color: C.gold } },
  ], {
    x: M, y: 3.5, w: contentW, h: 1.8,
    fontSize: 26, fontFace: "Microsoft YaHei", bold: true, margin: 0,
  });

  s.addText("评论区聊聊 · 不求关注 · 非投资建议", {
    x: M, y: 5.5, w: contentW, h: 0.4,
    fontSize: 13, fontFace: "Microsoft YaHei", color: C.muted, margin: 0,
  });

  foot(s, 6);
  s.addNotes(notes[5]);
}

await pres.writeFile({ fileName: outPath });
console.log("Wrote", outPath);
