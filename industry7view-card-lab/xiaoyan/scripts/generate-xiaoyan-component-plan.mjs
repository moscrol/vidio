import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "../..");
const OUTPUT_ROOT = path.join(PROJECT_ROOT, "xiaoyan/component-plans");

const inputArg = process.argv[2];
const outputSlugArg = process.argv[3];

if (!inputArg) {
  console.error(
    "Usage: npm run xiaoyan:component-plan -- <script.md|script.txt|captions.srt> [output-slug]",
  );
  process.exit(1);
}

function parseTimestamp(value) {
  const match = String(value).trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) {
    throw new Error(`Invalid SRT timestamp: ${value}`);
  }
  const [, hours, minutes, seconds, milliseconds] = match;
  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) +
    Number(milliseconds) / 1000
  );
}

function formatSeconds(value) {
  const rounded = Math.round(Number(value) * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}s` : `${rounded.toFixed(1)}s`;
}

function formatTimeRange(segment) {
  if (segment.start !== undefined && segment.end !== undefined) {
    return `${formatSeconds(segment.start)}-${formatSeconds(segment.end)}`;
  }
  return `段落 ${segment.index}`;
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function stripMarkdown(value) {
  return cleanText(value)
    .replace(/^#{1,6}\s+/g, "")
    .replace(/^[-*+]\s+/g, "")
    .replace(/^\d+[.)、]\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?/g, "")
    .trim();
}

function splitSentences(text) {
  const normalized = cleanText(text)
    .replace(/\n+/g, " ")
    .replace(/([。！？!?])\s*/g, "$1\n");
  return normalized
    .split(/\n+/)
    .map((line) => stripMarkdown(line))
    .filter((line) => isVoiceoverLine(line));
}

function isVoiceoverLine(line) {
  if (!line) {
    return false;
  }
  if (line.includes("|")) {
    return false;
  }
  if (/^(视频标题|适合时长|本条只回答|口播稿|口播正文|口播节奏|核心字幕|A-roll|B-roll|动态图文卡|互动结尾|风险提示|使用方式|正文|标题)[:：]?$/.test(line)) {
    return false;
  }
  if (/^(INDUSTRY|http|www\.|仅作|不构成投资建议)/i.test(line)) {
    return false;
  }
  return Array.from(line).length >= 4;
}

function parseSrt(content) {
  const cues = cleanText(content)
    .split(/\n\s*\n/g)
    .map((block, index) => {
      const lines = block.split(/\n/g).map((line) => line.trim()).filter(Boolean);
      const timeLineIndex = lines.findIndex((line) => line.includes("-->"));
      if (timeLineIndex === -1) {
        return null;
      }
      const [startText, endText] = lines[timeLineIndex].split("-->").map((part) => part.trim());
      return {
        index: index + 1,
        start: parseTimestamp(startText),
        end: parseTimestamp(endText),
        text: cleanText(lines.slice(timeLineIndex + 1).join(" ")),
      };
    })
    .filter(Boolean);

  return mergeShortSegments(cues, 16);
}

function parseMarkdownOrText(content) {
  const lines = cleanText(content).split(/\n/g);
  const extracted = [];
  let inLikelyScriptSection = false;
  let inTable = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      inTable = false;
      continue;
    }
    if (line.startsWith("|")) {
      inTable = true;
      continue;
    }
    if (inTable) {
      continue;
    }
    if (/^#{1,6}\s*/.test(line)) {
      if (/^#{1,6}\s*(?:\d+[.、]\s*)?(口播正文|口播稿|压缩口播稿)/.test(line)) {
        inLikelyScriptSection = true;
      } else if (inLikelyScriptSection) {
        inLikelyScriptSection = false;
      }
      continue;
    }
    if (/^-{3,}$/.test(line)) {
      continue;
    }

    const stripped = stripMarkdown(line);
    if (inLikelyScriptSection) {
      extracted.push(stripped);
    }
  }

  const sourceText = extracted.length > 0 ? extracted.join("\n") : lines.map(stripMarkdown).filter(isVoiceoverLine).join("\n");
  const sentences = splitSentences(sourceText);
  return mergeShortSegments(
    sentences.map((text, index) => ({
      index: index + 1,
      text,
    })),
    34,
  );
}

function mergeShortSegments(items, maxChars) {
  const segments = [];
  let current = null;

  for (const item of items) {
    const text = cleanText(item.text);
    if (!text) {
      continue;
    }

    const startsNew =
      !current ||
      current.text.length + text.length > maxChars ||
      includesAny(text, ["但", "真正", "所以", "最后", "一句话", "注意", "你觉得", "这就是"]) ||
      includesAny(current.text, ["？", "?"]);

    if (startsNew) {
      if (current) {
        segments.push(current);
      }
      current = {
        index: segments.length + 1,
        start: item.start,
        end: item.end,
        text,
      };
    } else {
      current.text = `${current.text}${text}`;
      current.end = item.end ?? current.end;
    }
  }

  if (current) {
    segments.push(current);
  }

  return segments;
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function extractNumber(text) {
  const match = text.match(/(\d+(?:\s*[到-]\s*\d+)?(?:\.\d+)?)(\s*(?:万美元|亿美元|亿元|万台|万颗|小时|个月|年|%|％|kW\+?))/i);
  return match ? `${match[1].replace(/\s+/g, "").replace("到", "-")}${match[2].trim()}` : "";
}

function pickTerms(text, terms, fallback = []) {
  const picked = terms.filter((term) => text.includes(term));
  return picked.length > 0 ? picked : fallback;
}

function classify(segment, index, total) {
  const text = segment.text;
  const isOpening = index === 0;
  const isEnding = index >= total - 2;

  if (isEnding || includesAny(text, ["一句话", "真正的终点", "你觉得", "评论区", "这才是"])) {
    return buildQuote(text);
  }
  if (includesAny(text, ["样机", "验证", "导入", "跑产", "认证", "订单", "良率", "客户敢", "进工厂", "稳定干"])) {
    return buildValidation(text);
  }
  if (includesAny(text, ["一条链", "低成本发射", "卫星制造", "星座组网", "地面终端", "应用收费", "上游", "下游", "产业链", "核心零部件", "整机设备"])) {
    return buildChain(text);
  }
  if (includesAny(text, ["成本", "利润", "现金流", "毛利", "付费", "收费", "赚钱", "价格"])) {
    return buildEconomics(text);
  }
  if (extractNumber(text)) {
    return {
      intent: "data",
      semanticComponent: "DataHero",
      renderer: "SwissCard",
      existingComponent: "DataHeroMotion",
      propsDraft: { number: extractNumber(text), label: shorten(text, 28) },
      gap: "无",
      decision: "use-existing",
    };
  }
  if (isOpening || includesAny(text, ["很多人以为", "不是", "但真正", "误解", "反直觉", "以为"])) {
    return {
      intent: isOpening ? "hook" : "compare",
      semanticComponent: isOpening ? "Hook" : "Compare",
      renderer: "SwissCard / A-roll",
      existingComponent: isOpening ? "HookCard" : "CompareMotion",
      propsDraft: { title: shorten(text, 24) },
      gap: "无",
      decision: "use-existing",
    };
  }
  if (includesAny(text, ["三个问题", "三类", "跟踪", "看三个", "第一", "第二", "第三"])) {
    return {
      intent: "checklist",
      semanticComponent: "TrackingChecklist",
      renderer: "SwissCard",
      existingComponent: "TrackingChecklistCard",
      propsDraft: { items: inferChecklist(text) },
      gap: "无",
      decision: "use-existing",
    };
  }
  if (includesAny(text, ["工厂", "实验室", "发射", "卫星", "设备", "晶圆", "机器人", "场景"])) {
    return {
      intent: "b-roll",
      semanticComponent: "B-roll",
      renderer: "B-roll",
      existingComponent: "素材库 / AI B-roll prompt",
      propsDraft: { scene: inferScene(text) },
      gap: "无",
      decision: "use-existing",
    };
  }

  return {
    intent: "context",
    semanticComponent: "A-roll",
    renderer: "A-roll / subtitles",
    existingComponent: "无",
    propsDraft: { note: shorten(text, 32) },
    gap: "无",
    decision: "one-off",
  };
}

function buildValidation(text) {
  const stages = pickTerms(
    text,
    ["样机", "客户验证", "小批量导入", "长期跑产", "批量订单", "收入确认", "毛利兑现", "进工厂", "稳定干活", "客户验收", "批量付费"],
    ["样机", "客户验证", "稳定跑产", "订单兑现"],
  );
  return {
    intent: "validation",
    semanticComponent: "XiaoyanValidationChain",
    renderer: "HyperFrames / XiaoyanSketch",
    existingComponent: "XiaoyanValidationChain",
    propsDraft: {
      title: inferTitle(text, "验证链"),
      stages,
      riskStage: stages.find((stage) => includesAny(stage, ["跑产", "稳定", "验证"])) || stages.at(1),
      finalProof: stages.find((stage) => includesAny(stage, ["订单", "收入", "毛利", "付费"])) || "商业兑现",
    },
    gap: "无",
    decision: "add-props",
  };
}

function buildChain(text) {
  const nodes = pickTerms(
    text,
    ["低成本发射", "批量制造", "卫星制造", "星座组网", "地面终端", "应用收费", "核心零部件", "整机设备", "晶圆厂导入", "稳定跑产", "订单兑现"],
    ["上游", "中游", "下游", "应用兑现"],
  );
  return {
    intent: "chain",
    semanticComponent: "XiaoyanIndustryScroll",
    renderer: "HyperFrames / XiaoyanSketch",
    existingComponent: "XiaoyanIndustryScroll",
    propsDraft: {
      title: inferTitle(text, "产业链路径"),
      nodes,
      highlightNode: nodes.find((node) => includesAny(node, ["收费", "兑现", "订单", "应用"])) || nodes.at(-1),
    },
    gap: "无",
    decision: "add-props",
  };
}

function buildEconomics(text) {
  const factors = pickTerms(
    text,
    ["成本", "价格", "现金流", "利润", "毛利", "付费", "收费", "需求", "竞争"],
    ["需求", "成本", "价格", "付费", "利润"],
  );
  return {
    intent: "economics",
    semanticComponent: "XiaoyanProfitPipe",
    renderer: "HyperFrames / XiaoyanSketch",
    existingComponent: "XiaoyanProfitPipe",
    propsDraft: {
      title: inferTitle(text, "利润管道"),
      factors,
      bottleneck: factors.find((factor) => includesAny(factor, ["成本", "付费", "收费"])) || factors.at(1),
      resultLabel: factors.find((factor) => includesAny(factor, ["利润", "毛利", "现金流"])) || "利润",
    },
    gap: "无",
    decision: "add-props",
  };
}

function buildQuote(text) {
  return {
    intent: includesAny(text, ["你觉得", "评论区"]) ? "quote / interaction" : "quote",
    semanticComponent: "ClosingQuote",
    renderer: "A-roll / SwissCard",
    existingComponent: "ClosingQuoteCard",
    propsDraft: { quote: shorten(text, 34) },
    gap: "无",
    decision: includesAny(text, ["你觉得", "评论区"]) ? "one-off" : "use-existing",
  };
}

function inferChecklist(text) {
  const items = pickTerms(text, ["成本", "组网", "付费", "验证", "订单", "收入", "毛利", "复购"], []);
  return items.length > 0 ? items.slice(0, 4) : ["变量一", "变量二", "变量三"];
}

function inferScene(text) {
  if (text.includes("晶圆")) return "晶圆厂 / 设备调试 / 产线";
  if (text.includes("机器人")) return "工厂 / 机器人作业";
  if (text.includes("卫星")) return "卫星 / 地面站 / 终端";
  if (text.includes("发射")) return "火箭发射 / 发射场";
  return "真实产业场景";
}

function inferTitle(text, fallback) {
  if (text.includes("商业航天")) return "上天后怎么赚钱";
  if (text.includes("半导体设备")) return "从样机到订单";
  if (text.includes("机器人")) return "从 Demo 到产品";
  return fallback;
}

function shorten(text, maxLength) {
  const chars = Array.from(cleanText(text));
  return chars.length > maxLength ? `${chars.slice(0, maxLength).join("")}…` : chars.join("");
}

function slugify(filePath) {
  const base = outputSlugArg || path.basename(filePath, path.extname(filePath));
  return base.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, "_");
}

function markdownEscape(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function formatPropsDraft(value) {
  return markdownEscape(JSON.stringify(value, null, 0));
}

function buildMarkdown(plan) {
  const rows = plan.items.map((item) => {
    return [
      item.time,
      item.voiceover,
      item.intent,
      item.semanticComponent,
      item.renderer,
      item.existingComponent,
      formatPropsDraft(item.propsDraft),
      item.gap,
      item.decision,
    ].map(markdownEscape);
  });

  return [
    `# ${plan.title} Xiaoyan Component Plan`,
    "",
    `- Source: \`${plan.sourcePath}\``,
    `- Generated at: ${plan.generatedAt}`,
    `- Segment count: ${plan.items.length}`,
    "",
    "| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |",
    "|---|---|---|---|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## Summary",
    "",
    ...Object.entries(plan.summary).map(([key, value]) => `- ${key}: ${value}`),
    "",
  ].join("\n");
}

async function main() {
  const inputPath = path.resolve(process.cwd(), inputArg);
  const content = await fs.readFile(inputPath, "utf8");
  const ext = path.extname(inputPath).toLowerCase();
  const segments = ext === ".srt" ? parseSrt(content) : parseMarkdownOrText(content);

  if (segments.length === 0) {
    throw new Error(`No voiceover segments found in ${inputPath}`);
  }

  const items = segments.map((segment, index) => {
    const classification = classify(segment, index, segments.length);
    return {
      time: formatTimeRange(segment),
      voiceover: segment.text,
      ...classification,
    };
  });
  const summary = items.reduce((acc, item) => {
    acc[item.semanticComponent] = (acc[item.semanticComponent] || 0) + 1;
    return acc;
  }, {});
  const slug = slugify(inputPath);
  const plan = {
    title: slug,
    sourcePath: path.relative(PROJECT_ROOT, inputPath),
    generatedAt: new Date().toISOString(),
    items,
    summary,
  };

  await fs.mkdir(OUTPUT_ROOT, { recursive: true });
  const jsonPath = path.join(OUTPUT_ROOT, `${slug}.component-plan.json`);
  const mdPath = path.join(OUTPUT_ROOT, `${slug}.component-plan.md`);
  await fs.writeFile(jsonPath, `${JSON.stringify(plan, null, 2)}\n`);
  await fs.writeFile(mdPath, buildMarkdown(plan));

  console.log(`Generated ${path.relative(PROJECT_ROOT, jsonPath)}`);
  console.log(`Generated ${path.relative(PROJECT_ROOT, mdPath)}`);
  console.log(`Segments: ${items.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
