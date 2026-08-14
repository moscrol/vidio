import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const defaultSrtPath = '/0510-2(1).srt';

function parseTimestamp(value) {
  const match = String(value).trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) {
    throw new Error(`Invalid SRT timestamp: ${value}`);
  }
  const [, hours, minutes, seconds, milliseconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 1000;
}

function parseSrt(content) {
  return String(content)
    .replace(/^\uFEFF/, '')
    .trim()
    .split(/\n\s*\n/g)
    .map((block, index) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const timeLineIndex = lines.findIndex((line) => line.includes('-->'));
      if (timeLineIndex === -1) {
        return null;
      }
      const [startText, endText] = lines[timeLineIndex].split('-->').map((part) => part.trim());
      return {
        index: index + 1,
        start: parseTimestamp(startText),
        end: parseTimestamp(endText),
        text: cleanCueText(lines.slice(timeLineIndex + 1).join(' ')),
      };
    })
    .filter(Boolean);
}

function cleanCueText(value) {
  return String(value ?? '')
    .replace(/\.{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function roundSeconds(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function clampText(value, maxLength) {
  const chars = Array.from(String(value ?? '').trim());
  return chars.length > maxLength ? chars.slice(0, maxLength).join('') : chars.join('');
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function extractNumberUnit(text) {
  const match = text.match(/(\d+(?:\s*[到-]\s*\d+)?(?:\.\d+)?)(\s*(?:万美元|亿美元|亿元|万台|小时|个|%|％))/);
  if (!match) {
    return null;
  }
  return {
    number: match[1].replace(/\s+/g, '').replace('到', '-'),
    unit: match[2].trim(),
  };
}

function mergeCuesToBeats(cues) {
  const beats = [];
  let current = null;

  for (const cue of cues) {
    if (cue.index === 1) {
      if (current) {
        beats.push(finalizeBeat(current));
      }
      beats.push(finalizeBeat({
        start: cue.start,
        end: cue.end,
        cues: [cue],
      }));
      current = null;
      continue;
    }

    const startsNewBeat =
      !current ||
      cue.start - current.end > 1.2 ||
      includesAny(cue.text, ['但', '真正', '注意', '什么叫', '所以', '现在是', '你觉得']) ||
      current.cues.length >= 4;

    if (startsNewBeat) {
      if (current) {
        beats.push(finalizeBeat(current));
      }
      current = {
        start: cue.start,
        end: cue.end,
        cues: [cue],
      };
    } else {
      current.end = cue.end;
      current.cues.push(cue);
    }
  }

  if (current) {
    beats.push(finalizeBeat(current));
  }

  return beats;
}

function finalizeBeat(beat) {
  return {
    start: roundSeconds(beat.start),
    end: roundSeconds(beat.end),
    cueIndexes: beat.cues.map((cue) => cue.index),
    text: beat.cues.map((cue) => cue.text).join(' '),
  };
}

function classifyBeat(beat, index, beats) {
  const text = beat.text;
  const numberUnit = extractNumberUnit(text);

  if (index === 0) {
    return { role: 'cover', suggestedType: 'cover', confidence: 0.95, reason: '开头第一句是强判断，适合作封面和开场主视觉。' };
  }
  if (text.includes('Demo') && text.includes('产品')) {
    return { role: 'compare', suggestedType: 'compare', confidence: 0.92, reason: '原文直接出现 A/B 对比，适合 Compare 卡。' };
  }
  if (includesAny(text, ['你看过', '反直觉', '很酷', '对吧'])) {
    return { role: 'hook', suggestedType: 'hook', confidence: 0.86, reason: '这段在抛问题和制造反常识，适合作 Hook 卡。' };
  }
  if (includesAny(text, ['进工厂', '搬箱子', '拧螺丝', '产线'])) {
    return { role: 'factory-shift', suggestedType: 'logistics', confidence: 0.9, reason: '这段讲真实应用场景，适合用场景/拐点卡表达。' };
  }
  if (numberUnit) {
    return { role: 'data-anchor', suggestedType: 'dataHero', confidence: 0.88, reason: '这段出现明确数字和单位，适合 DataHero 卡。' };
  }
  if (includesAny(text, ['什么叫量产', '百万台', '成本'])) {
    return { role: 'production-loop', suggestedType: 'loop', confidence: 0.82, reason: '这段解释量产和成本，适合拆成闭环/步骤卡。' };
  }
  if (includesAny(text, ['记住一个区分', '三个变量', '不坏', '不贵'])) {
    return { role: 'tracking-checklist', suggestedType: 'checklist', confidence: 0.84, reason: '这段是可收藏的判断标准，适合 Checklist 卡。' };
  }
  if (index >= beats.length - 2 || includesAny(text, ['产品时代', '死亡谷', '你觉得'])) {
    if (includesAny(text, ['你觉得', '先进入'])) {
      return { role: 'cta', suggestedType: 'cta', confidence: 0.8, reason: '结尾互动问题，适合作为发布文案或评论区引导，不一定需要复用结论卡。' };
    }
    return { role: 'closing', suggestedType: 'quote', confidence: 0.82, reason: '结尾金句或互动问题，适合收束卡。' };
  }
  return { role: 'context', suggestedType: 'note', confidence: 0.45, reason: '这段更像上下文承接，不一定需要单独出卡。' };
}

function formatTitleHtml(firstLine, secondLine, highlightClass = 'gold') {
  return `${clampText(firstLine, 12)}<br /><span class="${highlightClass}">${clampText(secondLine, 12)}</span>`;
}

function buildCardFields(classification, beat, sequence) {
  const text = beat.text;
  const numberUnit = extractNumberUnit(text);

  if (classification.suggestedType === 'cover') {
    const [firstPart, secondPart = '是来干活的'] = text.split('，');
    return {
      id: '00-cover-card',
      type: 'cover',
      tag: inferTag(text),
      kicker: 'INDUSTRY 7VIEW / AUTO PLAN',
      titleHtml: formatTitleHtml(firstPart.replace('的', ''), secondPart.replace('。', '')),
      subtitle: '先看它能不能进入真实场景',
      badge: '自动草稿',
      footer: 'industry7view.com',
    };
  }

  if (classification.suggestedType === 'hook') {
    return {
      id: numberedCardId(sequence, 'hook'),
      type: 'hook',
      tag: inferTag(text),
      meta: 'THESIS / 反常识',
      titleHtml: formatTitleHtml('会表演', '不等于能交付', 'risk'),
      subtitle: clampText('好看的 Demo，不等于真正的产品化。', 36),
      footer: '先纠偏，再看产业拐点。',
    };
  }

  if (classification.suggestedType === 'compare') {
    return {
      id: numberedCardId(sequence, 'compare'),
      type: 'compare',
      tag: '核心区分',
      oldText: text.includes('Demo') ? 'Demo' : '样品',
      newText: text.includes('产品') ? '产品' : '交付',
      explain: clampText('中间隔着稳定、成本和客户付费。', 24),
      footer: clampText(text, 36),
    };
  }

  if (classification.suggestedType === 'logistics') {
    return {
      id: numberedCardId(sequence, 'logistics'),
      type: 'logistics',
      tag: '应用场景',
      meta: 'FACTORY / 拐点',
      titleHtml: formatTitleHtml('真正拐点', '进工厂'),
      subtitle: clampText('搬箱子、拧螺丝、稳定工作，才是商业化入口。', 36),
      footer: '不是能做动作，而是能持续完成任务。',
    };
  }

  if (classification.suggestedType === 'dataHero') {
    return {
      id: numberedCardId(sequence, 'dataHero'),
      type: 'dataHero',
      tag: '数据锚点',
      meta: 'DATA / 关键数字',
      number: numberUnit?.number ?? '1',
      unit: numberUnit?.unit ?? '个',
      label: clampText(text.includes('Optimus') ? '特斯拉 Optimus 量产目标价' : text, 36),
      compareText: clampText('注意数字背后的产业门槛', 32),
      insight: clampText('大数字不是结论，是验证线索。', 32),
      footer: '数字负责锚定判断。',
    };
  }

  if (classification.suggestedType === 'loop') {
    return {
      id: numberedCardId(sequence, 'loop'),
      type: 'loop',
      tag: '闭环判断',
      title: clampText(text.includes('什么叫量产') ? '什么叫量产？不是研发成功' : '从样品到产品要过几关', 28),
      steps: inferSteps(text),
      footer: '判断产业，不只看视频，要看兑现。',
    };
  }

  if (classification.suggestedType === 'checklist') {
    return {
      id: numberedCardId(sequence, 'checklist'),
      type: 'checklist',
      tag: '跟踪清单',
      titleHtml: formatTitleHtml(inferTag(text) === '产业观察' ? '人形机器人' : inferTag(text), '看三个变量'),
      items: inferChecklistItems(text),
      footer: '适合收藏：场景、稳定、成本。',
    };
  }

  if (classification.suggestedType === 'quote') {
    return {
      id: numberedCardId(sequence, 'quote'),
      type: 'quote',
      tag: '一句话结论',
      meta: 'FINAL TAKEAWAY',
      titleHtml: formatTitleHtml('样品时代结束', '产品时代开始'),
      subtitle: clampText(text.includes('死亡谷') ? '中间这段路，叫死亡谷。' : text, 36),
      url: 'industry7view.com',
      footer: '本文仅作产业研究和知识整理，不构成投资建议。',
    };
  }

  if (classification.suggestedType === 'cta') {
    return {
      type: 'cta',
      title: clampText(text, 28),
      usage: '建议放在结尾字幕、评论区置顶或口播保留，不强制生成 PNG 卡。',
    };
  }

  return {
    type: 'note',
    title: clampText(text, 28),
  };
}

function numberedCardId(sequence, type) {
  const map = {
    hook: '01-hook-card',
    dataHero: '02-data-hero-card',
    logistics: '03-logistics-card',
    compare: '04-not-a-is-b',
    loop: '05-business-loop',
    checklist: '06-tracking-checklist',
    quote: '07-closing-quote',
  };
  return map[type] ?? `card-${String(sequence).padStart(2, '0')}`;
}

function inferTag(text) {
  if (text.includes('机器人')) return '机器人';
  if (text.includes('芯片') || text.includes('半导体')) return '半导体';
  if (text.includes('创新药')) return '创新药';
  return '产业观察';
}

function inferSteps(text) {
  if (text.includes('百万台') || text.includes('量产')) {
    return ['百万台级别', '成本压低', '批量制造', '稳定交付', '客户付费'];
  }
  return ['验证场景', '压低成本', '批量交付'];
}

function inferChecklistItems(text) {
  if (text.includes('机器人') || text.includes('工厂') || text.includes('不坏') || text.includes('不贵')) {
    return [
      { title: '进工厂', desc: '是否进入真实产线。' },
      { title: '不坏', desc: '能否稳定工作。' },
      { title: '不贵', desc: '成本能否下降。' },
    ];
  }
  return [
    { title: '场景', desc: '需求是否真实。' },
    { title: '数据', desc: '验证是否充分。' },
    { title: '兑现', desc: '商业是否落地。' },
  ];
}

function shouldKeepCard(classification, selectedTypes) {
  if (classification.suggestedType === 'note') return false;
  if (classification.suggestedType === 'cta') return false;
  if (classification.suggestedType === 'cover') return !selectedTypes.has('cover');
  if (classification.suggestedType === 'hook') return !selectedTypes.has('hook');
  if (classification.suggestedType === 'quote') return true;
  return !selectedTypes.has(classification.suggestedType);
}

const rulesPath = path.join(projectRoot, 'timeline-rules.json');
let srtPathFromRules = defaultSrtPath;
try {
  const rules = JSON.parse(await fs.readFile(rulesPath, 'utf8'));
  srtPathFromRules = rules.srtPath ?? defaultSrtPath;
} catch {
  srtPathFromRules = defaultSrtPath;
}

const srtPath = path.join(projectRoot, 'public', String(srtPathFromRules).replace(/^\//, ''));
const cues = parseSrt(await fs.readFile(srtPath, 'utf8'));
const beats = mergeCuesToBeats(cues);
const selectedTypes = new Set();
const cards = [];
const skipped = [];

for (const [index, beat] of beats.entries()) {
  const classification = classifyBeat(beat, index, beats);
  const keep = shouldKeepCard(classification, selectedTypes) || cards.length < 2;
  const card = buildCardFields(classification, beat, cards.length + 1);
  const item = {
    role: classification.role,
    suggestedType: classification.suggestedType,
    confidence: classification.confidence,
    reason: classification.reason,
    start: beat.start,
    end: beat.end,
    cueIndexes: beat.cueIndexes,
    transcript: beat.text,
    card,
  };

  if (keep && cards.length < 8) {
    cards.push(item);
    selectedTypes.add(classification.suggestedType);
  } else {
    skipped.push({ ...item, reason: `${classification.reason} 未进入上屏计划，避免信息卡过密或类型重复。` });
  }
}

const plan = {
  project: inferTag(cues.map((cue) => cue.text).join('')) === '机器人' ? '人形机器人第一条' : '自动生成短视频卡片计划',
  source: {
    srtPath: srtPathFromRules,
    cueCount: cues.length,
    beatCount: beats.length,
  },
  generatedAt: new Date().toISOString(),
  policy: {
    maxCards: 8,
    principle: '先按演讲稿语义段落决定是否出卡，再决定卡片类型，避免固定模板硬套。',
  },
  cards,
  skipped,
};

await fs.writeFile(path.join(projectRoot, 'card-plan.generated.json'), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

console.log(`Parsed ${cues.length} SRT cues from ${srtPathFromRules}`);
console.log(`Merged into ${beats.length} semantic beats`);
console.log(`Selected ${cards.length} card plans`);
console.log(`Skipped ${skipped.length} beats`);
console.log('Generated card-plan.generated.json');
