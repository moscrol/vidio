import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pushText(parts, value) {
  const text = stripHtml(value);
  if (text) {
    parts.push(text);
  }
}

function collectCardText(card) {
  const parts = [];
  pushText(parts, card.titleHtml);
  pushText(parts, card.title);
  pushText(parts, card.subtitle);
  pushText(parts, card.number);
  pushText(parts, card.unit);
  pushText(parts, card.label);
  pushText(parts, card.compareText);
  pushText(parts, card.insight);
  pushText(parts, card.oldText);
  pushText(parts, card.newText);
  pushText(parts, card.explain);
  pushText(parts, card.footer);
  for (const step of card.steps ?? []) {
    pushText(parts, step);
  }
  for (const item of card.items ?? []) {
    pushText(parts, item.title);
    pushText(parts, item.desc);
  }
  for (const evidence of card.evidences ?? []) {
    pushText(parts, evidence.label);
    pushText(parts, evidence.value);
  }
  return parts;
}

function compactKeyword(value) {
  return stripHtml(value)
    .replace(/(?<!\d)[，。！？、；：,.!?;:]/g, ' ')
    .replace(/[，。！？、；：,.!?;:](?!\d)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildKeywords(parts) {
  const keywords = [];
  for (const part of parts) {
    const keyword = compactKeyword(part);
    if (keyword && keyword.length >= 2 && !keywords.includes(keyword)) {
      keywords.push(keyword);
    }
    if (keywords.length >= 4) {
      break;
    }
  }
  return keywords;
}

function readDeckData(source) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

function orderedCards(deck) {
  return [deck.cover, ...(deck.cards ?? []), ...(deck.extras ?? [])].filter(Boolean);
}

const cardsSource = await fs.readFile(path.join(projectRoot, 'cards.js'), 'utf8');
const deck = readDeckData(cardsSource);
const motionPlan = JSON.parse(await fs.readFile(path.join(projectRoot, 'motion-plan.json'), 'utf8'));
const existingRulesPath = path.join(projectRoot, 'timeline-rules.json');
const existingRules = JSON.parse(await fs.readFile(existingRulesPath, 'utf8'));
const motionByCardId = new Map((motionPlan.segments ?? []).map((segment) => [segment.cardId, segment]));

const draft = {
  srtPath: existingRules.srtPath ?? '/replace-with-your-subtitles.srt',
  defaultStartOffset: existingRules.defaultStartOffset ?? 0,
  avoidOverlap: existingRules.avoidOverlap ?? true,
  minGap: existingRules.minGap ?? 0.3,
  segments: orderedCards(deck).map((card) => {
    const existingMotion = motionByCardId.get(card.id) ?? {};
    return {
      cardId: card.id,
      keywords: buildKeywords(collectCardText(card)),
      duration: existingMotion.duration ?? 4,
      recipe: existingMotion.recipe ?? `${card.type}.default`,
    };
  }),
};

const outputPath = path.join(projectRoot, 'timeline-rules.draft.json');
await fs.writeFile(outputPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');

console.log(`Generated ${path.relative(projectRoot, outputPath)}`);
console.log(`Drafted ${draft.segments.length} timeline rules from cards.js`);
console.log('Review keywords manually, then copy useful rules into timeline-rules.json.');
