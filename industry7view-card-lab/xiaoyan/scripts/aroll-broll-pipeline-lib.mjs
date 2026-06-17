const FILLER_WORDS = new Set([
  "嗯",
  "嗯嗯",
  "啊",
  "呃",
  "呃呃",
  "额",
  "这个",
  "那个",
  "um",
  "uh",
  "erm",
]);

const XIAOYAN_COMPONENTS = [
  "XiaoyanGateLens",
  "XiaoyanRiskDomino",
  "XiaoyanValidationScroll",
];

export function parseTimestamp(value) {
  if (typeof value === "number") return value;
  const match = String(value ?? "")
    .trim()
    .match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!match) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  const [, hours, minutes, seconds, milliseconds] = match;
  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) +
    Number(milliseconds) / 1000
  );
}

export function normalizeTranscript(raw) {
  const source = typeof raw === "string" ? JSON.parse(raw) : raw;
  const words = [];

  for (const segment of source.transcription ?? source.segments ?? []) {
    const tokens = segment.tokens ?? segment.words ?? [];
    const segmentText = cleanText(segment.text);
    const segmentStart = segmentStartTime(segment);
    const segmentEnd = segmentEndTime(segment, segmentStart);
    if (shouldUseSegmentText(segmentText, segmentStart, segmentEnd, tokens)) {
      const pieces = splitTextIntoPieces(segmentText);
      const step = (segmentEnd - segmentStart) / Math.max(1, pieces.length);
      pieces.forEach((piece, index) => {
        if (!isUsableWord(piece)) return;
        words.push({
          text: piece,
          start: roundTime(segmentStart + step * index),
          end: roundTime(segmentStart + step * (index + 1)),
        });
      });
      continue;
    }

    if (tokens.length > 0) {
      for (const token of tokens) {
        const text = cleanToken(token.text ?? token.word);
        if (!isUsableWord(text)) continue;
        const offsets = token.offsets ?? {};
        const timestamps = token.timestamps ?? {};
        const start = secondsFromOffset(offsets.from) ?? parseOptionalTimestamp(timestamps.from);
        const end = secondsFromOffset(offsets.to) ?? parseOptionalTimestamp(timestamps.to);
        if (start === undefined || end === undefined || end <= start) continue;
        words.push({ text, start, end, probability: token.p ?? token.probability });
      }
      continue;
    }

    const text = segmentText;
    if (!text) continue;
    const start = segmentStart;
    const end = segmentEnd;
    const pieces = splitTextIntoPieces(text);
    const step = (end - start) / Math.max(1, pieces.length);
    pieces.forEach((piece, index) => {
      if (!isUsableWord(piece)) return;
      words.push({
        text: piece,
        start: roundTime(start + step * index),
        end: roundTime(start + step * (index + 1)),
      });
    });
  }

  return words
    .sort((left, right) => left.start - right.start)
    .map((word) => ({
      ...word,
      start: roundTime(word.start),
      end: roundTime(word.end),
    }));
}

export function buildCaptionBeats(words, options = {}) {
  const maxDuration = options.maxDuration ?? 3.2;
  const maxChars = options.maxChars ?? 18;
  const beats = [];
  let current = null;

  for (const word of words) {
    if (!current) {
      current = startBeat(word);
      continue;
    }

    const gap = word.start - current.end;
    const nextText = `${current.text}${word.text}`;
    const tooLong = word.end - current.start > maxDuration || Array.from(nextText).length > maxChars;
    const punctuationBreak = /[。！？!?；;]/.test(current.text);
    const pauseBreak = gap > 0.55;

    if (tooLong || punctuationBreak || pauseBreak) {
      beats.push(finishBeat(current));
      current = startBeat(word);
    } else {
      current.text = nextText;
      current.end = word.end;
    }
  }

  if (current) beats.push(finishBeat(current));
  return beats.map((beat, index) => ({ ...beat, id: `beat-${index + 1}` }));
}

export function buildEditDecision({ arollPath, transcriptPath, words, duration, slug }) {
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error("A positive duration is required to build an edit decision.");
  }

  const captionBeats = buildCaptionBeats(words);
  const semanticBeats = captionBeats
    .map((beat) => ({ ...beat, classification: classifyText(beat.text) }))
    .filter((beat) => beat.classification.kind === "xiaoyan");

  const xiaoyanScenes = selectXiaoyanScenes(semanticBeats, duration);
  const scenes = fillArollGaps(xiaoyanScenes, duration);
  const captions = captionBeats.filter((caption) =>
    xiaoyanScenes.some((scene) => overlaps(caption, scene)),
  );

  return {
    schemaVersion: 1,
    slug,
    generatedAt: new Date().toISOString(),
    sources: {
      arollPath,
      transcriptPath,
    },
    duration: roundTime(duration),
    strategy: {
      openingArollSeconds: 4.5,
      closingArollSeconds: 2.5,
      maxBrollSeconds: 7,
      minBrollSeconds: 4,
      components: XIAOYAN_COMPONENTS,
    },
    scenes,
    captions,
    stats: {
      wordCount: words.length,
      captionBeatCount: captionBeats.length,
      xiaoyanSceneCount: xiaoyanScenes.length,
      xiaoyanSeconds: roundTime(
        xiaoyanScenes.reduce((sum, scene) => sum + scene.end - scene.start, 0),
      ),
    },
  };
}

export function validateSceneTimeline(scenes, duration) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error("Scene timeline is empty.");
  }
  const first = scenes[0];
  const last = scenes.at(-1);
  if (Math.abs(first.start) > 0.001) {
    throw new Error(`First scene must start at 0, got ${first.start}.`);
  }
  if (Math.abs(last.end - duration) > 0.05) {
    throw new Error(`Last scene must end at ${duration}, got ${last.end}.`);
  }
  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index];
    if (scene.end <= scene.start) {
      throw new Error(`Scene ${scene.id} has non-positive duration.`);
    }
    const next = scenes[index + 1];
    if (next && Math.abs(scene.end - next.start) > 0.05) {
      throw new Error(`Gap or overlap between ${scene.id} and ${next.id}.`);
    }
  }
  return true;
}

export function renderScenesModule(decision) {
  return `export const TOTAL_DURATION = ${decision.duration};\n\nexport const SCENES = ${JSON.stringify(
    decision.scenes,
    null,
    2,
  )};\n`;
}

export function renderCaptionsModule(decision) {
  const captions = decision.captions.map((caption) => ({
    start: caption.start,
    end: caption.end,
    text: caption.text,
  }));
  return `export const CAPTIONS = ${JSON.stringify(captions, null, 2)};\n\nexport function captionAt(time) {\n  return CAPTIONS.find((caption) => time >= caption.start && time < caption.end);\n}\n`;
}

function selectXiaoyanScenes(beats, duration) {
  const scenes = [];
  let componentCursor = 0;
  const minStart = 4.5;
  const maxEnd = Math.max(minStart, duration - 2.5);

  for (const beat of beats) {
    let start = Math.max(minStart, beat.start - 0.2);
    let end = Math.min(maxEnd, Math.max(beat.end + 1.6, start + 4));
    const component = beat.classification.component ?? XIAOYAN_COMPONENTS[componentCursor % XIAOYAN_COMPONENTS.length];
    const previous = scenes.at(-1);
    if (
      previous &&
      previous.component === component &&
      start < previous.end + 0.8 &&
      Math.max(previous.end, end) - previous.start <= 7
    ) {
      previous.end = roundTime(Math.min(maxEnd, Math.max(previous.end, end)));
      previous.captions.push(beat.id);
      continue;
    }

    if (previous && start < previous.end) {
      start = previous.end;
      end = Math.min(maxEnd, Math.max(beat.end + 1.6, start + 4));
    }
    if (end - start < 3.5) continue;

    componentCursor += 1;
    scenes.push({
      id: `xiaoyan-${scenes.length + 1}`,
      type: "xiaoyan",
      component,
      start: roundTime(start),
      end: roundTime(end),
      reason: beat.classification.reason,
      captions: [beat.id],
    });
  }

  if (scenes.length === 0 && duration > 10) {
    scenes.push({
      id: "xiaoyan-1",
      type: "xiaoyan",
      component: "XiaoyanGateLens",
      start: 5,
      end: roundTime(Math.min(duration - 2.5, 11)),
      reason: "fallback-midpoint",
      captions: [],
    });
  }

  return scenes.slice(0, 5);
}

function fillArollGaps(xiaoyanScenes, duration) {
  const scenes = [];
  let cursor = 0;
  for (const xiaoyan of xiaoyanScenes) {
    if (xiaoyan.start > cursor) {
      scenes.push({
        id: `aroll-${scenes.length + 1}`,
        type: "aroll",
        start: roundTime(cursor),
        end: xiaoyan.start,
      });
    }
    scenes.push(xiaoyan);
    cursor = xiaoyan.end;
  }
  if (cursor < duration) {
    scenes.push({
      id: `aroll-${scenes.length + 1}`,
      type: "aroll",
      start: roundTime(cursor),
      end: roundTime(duration),
    });
  }
  return scenes;
}

function classifyText(text) {
  if (includesAny(text, ["门槛", "门砍", "发布会", "实验室", "晶圆厂", "敢不敢", "验证", "认证", "客户", "跑产", "订单"])) {
    return { kind: "xiaoyan", component: "XiaoyanGateLens", reason: "validation-gate" };
  }
  if (includesAny(text, ["普通工厂", "一台设", "不稳定", "良率", "污染", "拖慢", "风险", "下降"])) {
    return { kind: "xiaoyan", component: "XiaoyanRiskDomino", reason: "risk-chain" };
  }
  if (includesAny(text, ["链", "第一步", "第二步", "第三步", "第四步", "长期", "从", "到"])) {
    return { kind: "xiaoyan", component: "XiaoyanValidationScroll", reason: "process-chain" };
  }
  if (includesAny(text, ["成本", "收入", "毛利", "利润", "赚钱", "现金流"])) {
    return { kind: "xiaoyan", component: "XiaoyanValidationScroll", reason: "business-proof" };
  }
  return { kind: "aroll", reason: "talking-head-context" };
}

function overlaps(left, right) {
  return left.start < right.end && left.end > right.start;
}

function cleanToken(value) {
  return cleanText(value)
    .replace(/^\[_.*?_\]$/, "")
    .replace(/[，,。！？!?；;：:、"“”'‘’４]/g, "")
    .trim();
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function splitTextIntoPieces(text) {
  const chars = Array.from(cleanText(text).replace(/４/g, "。"));
  return chars.length > 0 ? chars : [];
}

function isUsableWord(text) {
  if (!text || FILLER_WORDS.has(text.toLowerCase())) return false;
  if (/^\[_.*?_\]$/.test(text)) return false;
  if (/^[\s,.，。！？!?；;：:、]+$/.test(text)) return false;
  if (text === "４") return false;
  if (text.includes("�")) return false;
  return true;
}

function shouldUseSegmentText(text, start, end, tokens) {
  if (!text || !Number.isFinite(start) || !Number.isFinite(end)) return false;
  const duration = end - start;
  if (duration < 8 || Array.from(text).length < 20) return false;
  if (tokens.length === 0) return true;
  const tokenText = tokens.map((token) => cleanToken(token.text ?? token.word)).join("");
  return tokenText.length < text.length * 0.72 || text.includes("４");
}

function segmentStartTime(segment) {
  const offsets = segment.offsets ?? {};
  const timestamps = segment.timestamps ?? {};
  return secondsFromOffset(offsets.from) ?? parseOptionalTimestamp(timestamps.from) ?? 0;
}

function segmentEndTime(segment, start) {
  const offsets = segment.offsets ?? {};
  const timestamps = segment.timestamps ?? {};
  return secondsFromOffset(offsets.to) ?? parseOptionalTimestamp(timestamps.to) ?? start + 3;
}

function secondsFromOffset(value) {
  if (!Number.isFinite(value)) return undefined;
  return Number(value) / 1000;
}

function parseOptionalTimestamp(value) {
  if (!value) return undefined;
  return parseTimestamp(value);
}

function finishBeat(beat) {
  return {
    start: roundTime(beat.start),
    end: roundTime(beat.end),
    text: beat.text,
  };
}

function startBeat(word) {
  return {
    start: word.start,
    end: word.end,
    text: word.text,
  };
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function roundTime(value) {
  return Math.round(Number(value) * 1000) / 1000;
}
