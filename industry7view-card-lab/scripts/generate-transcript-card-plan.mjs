import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

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
        text: lines.slice(timeLineIndex + 1).join(' '),
      };
    })
    .filter(Boolean);
}

function readDeckData(source) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/[\s，。！？、；：,.!?;:“”\"'’‘（）()【】\[\]《》<>-]/g, '')
    .trim();
}

function roundSeconds(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function buildCueWindows(cues) {
  const windows = [];
  for (let startIndex = 0; startIndex < cues.length; startIndex += 1) {
    for (let size = 1; size <= 4 && startIndex + size <= cues.length; size += 1) {
      const group = cues.slice(startIndex, startIndex + size);
      windows.push({
        cueIndexes: group.map((cue) => cue.index),
        start: group[0].start,
        end: group.at(-1).end,
        text: group.map((cue) => cue.text).join(' '),
      });
    }
  }
  return windows;
}

function findBestWindow(cueWindows, keywords) {
  let best = null;
  for (const cueWindow of cueWindows) {
    const normalizedWindow = normalizeText(cueWindow.text);
    const matchedKeywords = [];
    let score = 0;
    for (const keyword of keywords ?? []) {
      const normalizedKeyword = normalizeText(keyword);
      if (!normalizedKeyword) {
        continue;
      }
      if (normalizedWindow.includes(normalizedKeyword)) {
        matchedKeywords.push(keyword);
        score += Math.min(20, normalizedKeyword.length) + 10;
      }
    }
    if (
      !best ||
      score > best.score ||
      (score === best.score && cueWindow.cueIndexes.length < best.cueIndexes.length) ||
      (score === best.score && cueWindow.cueIndexes.length === best.cueIndexes.length && cueWindow.start < best.start)
    ) {
      best = {
        ...cueWindow,
        score,
        matchedKeywords,
      };
    }
  }
  return best;
}

const cardsSource = await fs.readFile(path.join(projectRoot, 'cards.js'), 'utf8');
const deck = readDeckData(cardsSource);
const rules = JSON.parse(await fs.readFile(path.join(projectRoot, 'timeline-rules.json'), 'utf8'));
const srtPath = path.join(projectRoot, 'public', String(rules.srtPath ?? '').replace(/^\//, ''));
const cues = parseSrt(await fs.readFile(srtPath, 'utf8'));
const cueWindows = buildCueWindows(cues);
const cardIds = new Set([
  deck.cover?.id,
  ...(deck.cards ?? []).map((card) => card.id),
  ...(deck.extras ?? []).map((card) => card.id),
].filter(Boolean));

const plan = {
  project: deck.project,
  srtPath: rules.srtPath,
  cueCount: cues.length,
  generatedAt: new Date().toISOString(),
  selected: [],
  disabled: [],
  needsReview: [],
};

for (const rule of rules.segments ?? []) {
  const cardId = String(rule.cardId ?? '');
  const bestWindow = findBestWindow(cueWindows, rule.keywords ?? []);
  const item = {
    cardId,
    enabled: rule.enabled !== false,
    knownCard: cardIds.has(cardId),
    keywords: rule.keywords ?? [],
    matchedKeywords: bestWindow?.matchedKeywords ?? [],
    score: bestWindow?.score ?? 0,
    start: bestWindow && bestWindow.score > 0 ? roundSeconds(bestWindow.start) : null,
    end: bestWindow && bestWindow.score > 0 ? roundSeconds(bestWindow.end) : null,
    cueIndexes: bestWindow && bestWindow.score > 0 ? bestWindow.cueIndexes : [],
    transcript: bestWindow && bestWindow.score > 0 ? bestWindow.text : '',
    duration: rule.duration,
    recipe: rule.recipe,
  };

  if (rule.enabled === false) {
    plan.disabled.push({ ...item, reason: 'disabled in timeline-rules.json' });
  } else if (!item.knownCard || item.score === 0) {
    plan.needsReview.push({ ...item, reason: item.knownCard ? 'no transcript match' : 'cardId not found in cards.js' });
  } else {
    plan.selected.push(item);
  }
}

await fs.writeFile(
  path.join(projectRoot, 'transcript-card-plan.json'),
  `${JSON.stringify(plan, null, 2)}\n`,
  'utf8'
);

console.log(`Parsed ${cues.length} SRT cues from ${rules.srtPath}`);
console.log(`Selected ${plan.selected.length} cards`);
console.log(`Disabled ${plan.disabled.length} cards`);
console.log(`Needs review ${plan.needsReview.length} cards`);
console.log('Generated transcript-card-plan.json');
