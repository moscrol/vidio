import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const recipeByType = {
  cover: 'cover.titleFadeUp',
  hook: 'hook.staggerTitleReveal',
  dataHero: 'dataHero.numberEmphasis',
  logistics: 'logistics.metaphorReveal',
  compare: 'compare.oldNewReveal',
  loop: 'loop.sequentialStepHighlight',
  checklist: 'checklist.staggerReveal',
  quote: 'quote.fadeUp',
};

const durationByType = {
  cover: 2,
  hook: 3,
  dataHero: 4,
  logistics: 3.5,
  compare: 3.5,
  loop: 5,
  checklist: 4.5,
  quote: 5,
};

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
        text: lines.slice(timeLineIndex + 1).join(' ').replace(/\.{2,}/g, '').trim(),
      };
    })
    .filter(Boolean);
}

function cleanKeyword(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function keywordsFromPlanItem(item, cueByIndex) {
  const cueKeywords = (item.cueIndexes ?? [])
    .map((index) => cueByIndex.get(index)?.text)
    .filter(Boolean);
  const candidates = [
    ...cueKeywords,
    ...(item.card?.oldText && item.card?.newText ? [`${item.card.oldText} 和 ${item.card.newText}`] : []),
    item.card?.label,
    item.card?.title,
    item.card?.subtitle,
    ...(item.card?.steps ?? []),
  ];
  const keywords = [];
  for (const candidate of candidates) {
    const keyword = cleanKeyword(candidate);
    if (keyword.length >= 2 && !keywords.includes(keyword)) {
      keywords.push(keyword);
    }
    if (keywords.length >= 3) {
      break;
    }
  }
  return keywords;
}

const plan = JSON.parse(await fs.readFile(path.join(projectRoot, 'card-plan.generated.json'), 'utf8'));
const existingRules = JSON.parse(await fs.readFile(path.join(projectRoot, 'timeline-rules.json'), 'utf8'));
const srtPath = path.join(projectRoot, 'public', String(plan.source?.srtPath ?? existingRules.srtPath ?? '').replace(/^\//, ''));
const cues = parseSrt(await fs.readFile(srtPath, 'utf8'));
const cueByIndex = new Map(cues.map((cue) => [cue.index, cue]));

const usedCardIds = new Set();
const segments = (plan.cards ?? [])
  .filter((item) => {
    if (!item.card?.id || !recipeByType[item.card.type] || usedCardIds.has(item.card.id)) {
      return false;
    }
    usedCardIds.add(item.card.id);
    return true;
  })
  .map((item) => ({
    cardId: item.card.id,
    keywords: keywordsFromPlanItem(item, cueByIndex),
    start: item.start,
    duration: durationByType[item.card.type] ?? 4,
    recipe: recipeByType[item.card.type],
    sourceCueIndexes: item.cueIndexes,
    reason: item.reason,
  }));

const generatedRules = {
  srtPath: plan.source?.srtPath ?? existingRules.srtPath,
  defaultStartOffset: existingRules.defaultStartOffset ?? 0,
  avoidOverlap: existingRules.avoidOverlap ?? true,
  minGap: existingRules.minGap ?? 0.3,
  segments,
};

await fs.writeFile(
  path.join(projectRoot, 'timeline-rules.generated.json'),
  `${JSON.stringify(generatedRules, null, 2)}\n`,
  'utf8'
);

console.log('Generated timeline-rules.generated.json');
console.log(`Generated ${segments.length} timeline rules from card-plan.generated.json`);
console.log('Review it before replacing timeline-rules.json.');
