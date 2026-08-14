import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function readDeckData(source) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function byType(cards, type) {
  return cards.find((item) => item.card?.type === type && item.card?.id)?.card ?? null;
}

function normalizeCard(card, fallback) {
  return {
    ...deepClone(fallback),
    ...deepClone(card),
    id: fallback.id,
    type: fallback.type,
  };
}

const planPath = path.join(projectRoot, 'card-plan.generated.json');
const cardsPath = path.join(projectRoot, 'cards.js');
const plan = JSON.parse(await fs.readFile(planPath, 'utf8'));
const currentDeck = readDeckData(await fs.readFile(cardsPath, 'utf8'));
const plannedCards = plan.cards ?? [];
const currentByType = new Map((currentDeck.cards ?? []).map((card) => [card.type, card]));
const currentExtraByType = new Map((currentDeck.extras ?? []).map((card) => [card.type, card]));
const currentById = new Map([
  currentDeck.cover,
  ...(currentDeck.cards ?? []),
  ...(currentDeck.extras ?? []),
].filter(Boolean).map((card) => [card.id, card]));

const coverPlan = byType(plannedCards, 'cover');
const cover = normalizeCard(coverPlan, currentDeck.cover);
const sourceUrl = String(plan.source?.srtPath ?? '').includes('commercial-space')
  ? 'industry7view.com/research/commercial-space/'
  : currentDeck.sourceUrl;

const cards = (currentDeck.cards ?? []).map((fallback) => {
  const planned = byType(plannedCards, fallback.type);
  return normalizeCard(planned, fallback);
});

const extras = [
  normalizeCard(
    currentExtraByType.get('evidenceGrid'),
    {
      id: '08-evidence-grid-card',
      type: 'evidenceGrid',
      tag: '证据墙',
      meta: 'EVIDENCE / 可选补充',
      titleHtml: '补充证据<br /><span class="gold">人工确认</span>',
      subtitle: '这张卡作为可选扩展，不一定进入视频。',
      evidences: [
        { label: '场景', value: '真实需求' },
        { label: '成本', value: '量产门槛' },
        { label: '客户', value: '愿意付钱' },
      ],
      footer: '可选证据卡，不强制上屏。',
    }
  ),
];

const nextDeck = {
  project: plan.project ?? currentDeck.project,
  brand: 'INDUSTRY 7VIEW',
  sourceUrl,
  cover,
  extras,
  cards,
};

const output = `window.INDUSTRY7VIEW_CARDS = ${JSON.stringify(nextDeck, null, 2)};\n`;
const outputPath = path.join(projectRoot, 'cards.generated.js');
await fs.writeFile(outputPath, output, 'utf8');

console.log('Generated cards.generated.js');
console.log(`Cover: ${cover.titleHtml}`);
console.log(`Cards: ${cards.map((card) => card.id).join(', ')}`);
console.log('Review cards.generated.js before replacing cards.js.');
