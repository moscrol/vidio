import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const errors = [];
const warnings = [];

function slugFromSourceUrl(sourceUrl) {
  const normalized = String(sourceUrl ?? '').replace(/\/$/, '');
  const slug = normalized.split('/').filter(Boolean).at(-1);
  return slug || 'default';
}

function readDeckData() {
  const source = fs.readFileSync(path.join(root, 'cards.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const deck = readDeckData();
const motionPlanPath = path.join(root, 'motion-plan.json');

if (!fs.existsSync(motionPlanPath)) {
  fail('motion-plan.json is missing');
} else {
  const motionPlan = JSON.parse(fs.readFileSync(motionPlanPath, 'utf8'));
  const fps = Number(motionPlan.fps);
  const talkingHeadDuration = Number(motionPlan.talkingHeadDuration || 0);
  const slug = slugFromSourceUrl(deck.sourceUrl);
  const outputDir = path.join(root, 'output', slug);
  const knownIds = new Set([
    deck.cover?.id,
    ...(deck.cards ?? []).map((card) => card.id),
    ...(deck.extras ?? []).map((card) => card.id),
  ].filter(Boolean));

  if (!Number.isFinite(fps) || fps <= 0) {
    fail('motion-plan.json: fps must be a positive number');
  }

  if (!Array.isArray(motionPlan.segments) || motionPlan.segments.length === 0) {
    fail('motion-plan.json: segments must be a non-empty array');
  }

  if (motionPlan.talkingHeadVideoPath) {
    const videoPath = path.join(root, 'public', String(motionPlan.talkingHeadVideoPath).replace(/^\//, ''));
    if (!fs.existsSync(videoPath)) {
      fail(`motion-plan.json: talkingHeadVideoPath does not exist: ${motionPlan.talkingHeadVideoPath}`);
    }
  }

  let cursor = 0;
  let previousEnd = 0;
  for (const [index, segment] of (motionPlan.segments ?? []).entries()) {
    const scope = `motion-plan segment ${index + 1}`;
    const cardId = String(segment.cardId ?? '');
    const start = segment.start === undefined ? cursor : Number(segment.start);
    const duration = Number(segment.duration);
    cursor = start + duration;

    if (!cardId) {
      fail(`${scope}: cardId is required`);
      continue;
    }

    if (!knownIds.has(cardId)) {
      fail(`${scope}: cardId '${cardId}' is not found in cards.js`);
    }

    if (!Number.isFinite(start) || start < 0) {
      fail(`${scope}: start must be a non-negative number`);
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      fail(`${scope}: duration must be a positive number`);
    }

    if (talkingHeadDuration > 0 && start + duration > talkingHeadDuration + 0.1) {
      warn(`${scope}: card '${cardId}' ends after talkingHeadDuration`);
    }

    if (index > 0 && start < previousEnd) {
      warn(`${scope}: card '${cardId}' overlaps with the previous segment`);
    }
    previousEnd = Math.max(previousEnd, start + duration);

    const pngPath = path.join(outputDir, `${cardId}.png`);
    if (!fs.existsSync(pngPath)) {
      fail(`${scope}: missing exported PNG: output/${slug}/${cardId}.png`);
    }
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

console.log('Motion plan check passed.');
