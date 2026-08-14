import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const cardsPath = path.join(root, 'cards.js');
const outputPath = path.join(root, 'output');

const expectedCards = [
  { id: '01-hook-card', types: ['hook'] },
  { id: '02-data-hero-card', types: ['dataHero'] },
  { id: '03-logistics-card', types: ['logistics', 'supplyChainShift'] },
  { id: '04-not-a-is-b', types: ['compare'] },
  { id: '05-business-loop', types: ['loop', 'orderValidation', 'supplyChainShift'] },
  { id: '06-tracking-checklist', types: ['checklist'] },
  { id: '07-closing-quote', types: ['quote'] },
];

const expectedExtras = [
  { id: '08-evidence-grid-card', type: 'evidenceGrid' },
];

const limits = {
  project: 20,
  sourceUrl: 80,
  tag: 6,
  meta: 32,
  title: 28,
  titleHtml: 80,
  subtitle: 36,
  footer: 36,
  url: 80,
  oldText: 8,
  newText: 8,
  explain: 24,
  step: 8,
  itemTitle: 8,
  itemDesc: 18,
  number: 16,
  unit: 8,
  label: 36,
  compareText: 32,
  insight: 32,
  kicker: 32,
  badge: 12,
  evidenceLabel: 12,
  evidenceValue: 18,
  stageLabel: 6,
  stageDesc: 14,
  verdict: 24,
  shiftFrom: 12,
  shiftTo: 12,
  shiftDriver: 18,
  shiftResult: 24,
};

const errors = [];
const warnings = [];

function plainText(value) {
  return String(value ?? '')
    .replaceAll('<br />', '')
    .replaceAll('<br/>', '')
    .replaceAll('<br>', '')
    .replace(/<span class="(?:gold|risk)">/g, '')
    .replaceAll('</span>', '');
}

function len(value) {
  return Array.from(plainText(value)).length;
}

function requireField(obj, field, scope) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    errors.push(`${scope}: missing required field '${field}'`);
  }
}

function maxLen(obj, field, max, scope) {
  if (obj[field] !== undefined && len(obj[field]) > max) {
    warnings.push(`${scope}: '${field}' is ${len(obj[field])} chars, expected <= ${max}`);
  }
}

function checkTitleHtml(value, scope) {
  if (value === undefined) return;
  const stripped = String(value)
    .replaceAll('<br />', '')
    .replaceAll('<br/>', '')
    .replaceAll('<br>', '')
    .replace(/<span class="(?:gold|risk)">/g, '')
    .replaceAll('</span>', '');
  if (/[<>]/.test(stripped)) {
    errors.push(`${scope}: titleHtml contains unsupported HTML tags`);
  }
}

function checkCommon(card, scope) {
  requireField(card, 'id', scope);
  requireField(card, 'type', scope);
  requireField(card, 'tag', scope);
  maxLen(card, 'tag', limits.tag, scope);
  maxLen(card, 'meta', limits.meta, scope);
  maxLen(card, 'title', limits.title, scope);
  maxLen(card, 'titleHtml', limits.titleHtml, scope);
  maxLen(card, 'subtitle', limits.subtitle, scope);
  maxLen(card, 'footer', limits.footer, scope);
  maxLen(card, 'url', limits.url, scope);
  checkTitleHtml(card.titleHtml, scope);
}

function loadDeck() {
  if (!fs.existsSync(cardsPath)) {
    errors.push('cards.js not found');
    return null;
  }
  const sandbox = { window: {} };
  const code = fs.readFileSync(cardsPath, 'utf8');
  vm.runInNewContext(code, sandbox, { filename: cardsPath });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

function slugFromSourceUrl(sourceUrl) {
  const normalized = String(sourceUrl ?? '').replace(/\/$/, '');
  const slug = normalized.split('/').filter(Boolean).at(-1);
  return slug || 'default';
}

const deck = loadDeck();

if (deck) {
  requireField(deck, 'project', 'deck');
  requireField(deck, 'brand', 'deck');
  requireField(deck, 'sourceUrl', 'deck');
  requireField(deck, 'cover', 'deck');
  maxLen(deck, 'project', limits.project, 'deck');
  maxLen(deck, 'sourceUrl', limits.sourceUrl, 'deck');

  if (deck.brand !== 'INDUSTRY 7VIEW') {
    errors.push("deck: brand must be 'INDUSTRY 7VIEW'");
  }

  if (deck.cover) {
    const scope = `cover ${deck.cover.id ?? '(missing id)'}`;
    checkCommon(deck.cover, scope);
    requireField(deck.cover, 'kicker', scope);
    requireField(deck.cover, 'titleHtml', scope);
    requireField(deck.cover, 'subtitle', scope);
    requireField(deck.cover, 'badge', scope);
    maxLen(deck.cover, 'kicker', limits.kicker, scope);
    maxLen(deck.cover, 'badge', limits.badge, scope);
    if (deck.cover.id !== '00-cover-card') {
      errors.push(`${scope}: expected id '00-cover-card'`);
    }
    if (deck.cover.type !== 'cover') {
      errors.push(`${scope}: expected type 'cover'`);
    }
  }

  if (!Array.isArray(deck.cards)) {
    errors.push('deck: cards must be an array');
  } else {
    if (deck.cards.length < 1) {
      errors.push(`deck: expected at least 1 card, got ${deck.cards.length}`);
    }

    const ids = new Set();
    const expectedById = new Map(expectedCards.map((card) => [card.id, card]));
    const actualById = new Map(deck.cards.map((card) => [card.id, card]));
    for (const expected of expectedCards) {
      const actual = actualById.get(expected.id);
      if (!actual) {
        errors.push(`deck: missing expected card '${expected.id}'`);
      } else if (!expected.types.includes(actual.type)) {
        errors.push(`deck: card '${expected.id}' expected one of types [${expected.types.join(', ')}], got '${actual.type}'`);
      }
    }
    deck.cards.forEach((card, index) => {
      const scope = `card[${index + 1}] ${card.id ?? '(missing id)'}`;
      const expected = expectedById.get(card.id);

      checkCommon(card, scope);

      if (ids.has(card.id)) {
        errors.push(`${scope}: duplicate id '${card.id}'`);
      }
      ids.add(card.id);

      if (expected && !expected.types.includes(card.type)) {
        errors.push(`${scope}: expected one of types [${expected.types.join(', ')}], got '${card.type}'`);
      }

      if (card.type === 'hook' || card.type === 'logistics' || card.type === 'quote') {
        requireField(card, 'titleHtml', scope);
      }

      if (card.type === 'orderValidation') {
        requireField(card, 'title', scope);
        if (!Array.isArray(card.stages)) {
          errors.push(`${scope}: stages must be an array`);
        } else {
          if (card.stages.length < 4 || card.stages.length > 6) {
            errors.push(`${scope}: stages length must be 4-6`);
          }
          let hasCurrent = false;
          card.stages.forEach((stage, stageIndex) => {
            requireField(stage, 'label', `${scope}.stages[${stageIndex}]`);
            requireField(stage, 'status', `${scope}.stages[${stageIndex}]`);
            maxLen(stage, 'label', limits.stageLabel, `${scope}.stages[${stageIndex}]`);
            maxLen(stage, 'desc', limits.stageDesc, `${scope}.stages[${stageIndex}]`);
            if (stage.status === 'current') {
              hasCurrent = true;
            }
            if (!['done', 'current', 'next', 'risk'].includes(stage.status)) {
              errors.push(`${scope}.stages[${stageIndex}]: status must be 'done', 'current', 'next', or 'risk'`);
            }
          });
          if (!hasCurrent) {
            warnings.push(`${scope}: expected exactly one current stage (status='current')`);
          }
        }
        maxLen(card, 'verdict', limits.verdict, scope);
      }

      if (card.type === 'supplyChainShift') {
        requireField(card, 'title', scope);
        requireField(card, 'from', scope);
        requireField(card, 'to', scope);
        maxLen(card, 'from', limits.shiftFrom, scope);
        maxLen(card, 'to', limits.shiftTo, scope);
        if (card.drivers !== undefined) {
          if (!Array.isArray(card.drivers)) {
            errors.push(`${scope}: drivers must be an array`);
          } else {
            card.drivers.forEach((driver, driverIndex) => {
              if (len(driver) > limits.shiftDriver) {
                warnings.push(`${scope}: drivers[${driverIndex}] is ${len(driver)} chars, expected <= ${limits.shiftDriver}`);
              }
            });
          }
        }
        maxLen(card, 'result', limits.shiftResult, scope);
      }

      if (card.type === 'dataHero') {
        requireField(card, 'number', scope);
        requireField(card, 'unit', scope);
        requireField(card, 'label', scope);
        requireField(card, 'insight', scope);
        maxLen(card, 'number', limits.number, scope);
        maxLen(card, 'unit', limits.unit, scope);
        maxLen(card, 'label', limits.label, scope);
        maxLen(card, 'compareText', limits.compareText, scope);
        maxLen(card, 'insight', limits.insight, scope);
      }

      if (card.type === 'compare') {
        requireField(card, 'oldText', scope);
        requireField(card, 'newText', scope);
        maxLen(card, 'oldText', limits.oldText, scope);
        maxLen(card, 'newText', limits.newText, scope);
        maxLen(card, 'explain', limits.explain, scope);
      }

      if (card.type === 'loop') {
        requireField(card, 'title', scope);
        if (!Array.isArray(card.steps)) {
          errors.push(`${scope}: steps must be an array`);
        } else {
          if (card.steps.length < 3 || card.steps.length > 5) {
            errors.push(`${scope}: steps length must be 3-5`);
          }
          card.steps.forEach((step, stepIndex) => {
            if (len(step) > limits.step) {
              warnings.push(`${scope}: steps[${stepIndex}] is ${len(step)} chars, expected <= ${limits.step}`);
            }
          });
        }
      }

      if (card.type === 'checklist') {
        requireField(card, 'titleHtml', scope);
        if (!Array.isArray(card.items)) {
          errors.push(`${scope}: items must be an array`);
        } else {
          if (card.items.length < 3 || card.items.length > 4) {
            errors.push(`${scope}: items length must be 3-4`);
          }
          card.items.forEach((item, itemIndex) => {
            requireField(item, 'title', `${scope}.items[${itemIndex}]`);
            requireField(item, 'desc', `${scope}.items[${itemIndex}]`);
            maxLen(item, 'title', limits.itemTitle, `${scope}.items[${itemIndex}]`);
            maxLen(item, 'desc', limits.itemDesc, `${scope}.items[${itemIndex}]`);
          });
        }
      }
    });
  }

  if (deck.extras !== undefined) {
    if (!Array.isArray(deck.extras)) {
      errors.push('deck: extras must be an array');
    } else {
      deck.extras.forEach((card, index) => {
        const scope = `extra[${index + 1}] ${card.id ?? '(missing id)'}`;
        const expected = expectedExtras[index];

        checkCommon(card, scope);

        if (expected && card.id !== expected.id) {
          errors.push(`${scope}: expected id '${expected.id}' at position ${index + 1}`);
        }
        if (expected && card.type !== expected.type) {
          errors.push(`${scope}: expected type '${expected.type}'`);
        }

        if (card.type === 'evidenceGrid') {
          requireField(card, 'titleHtml', scope);
          requireField(card, 'subtitle', scope);
          if (!Array.isArray(card.evidences)) {
            errors.push(`${scope}: evidences must be an array`);
          } else {
            if (card.evidences.length < 3 || card.evidences.length > 6) {
              errors.push(`${scope}: evidences length must be 3-6`);
            }
            card.evidences.forEach((item, itemIndex) => {
              requireField(item, 'label', `${scope}.evidences[${itemIndex}]`);
              requireField(item, 'value', `${scope}.evidences[${itemIndex}]`);
              maxLen(item, 'label', limits.evidenceLabel, `${scope}.evidences[${itemIndex}]`);
              maxLen(item, 'value', limits.evidenceValue, `${scope}.evidences[${itemIndex}]`);
            });
          }
        }
      });
    }
  }
}

if (deck && fs.existsSync(outputPath)) {
  const themedOutputPath = path.join(outputPath, slugFromSourceUrl(deck.sourceUrl));
  if (deck.cover) {
    const coverPngPath = path.join(themedOutputPath, `${deck.cover.id}.png`);
    if (!fs.existsSync(coverPngPath)) {
      warnings.push(`output: missing ${slugFromSourceUrl(deck.sourceUrl)}/${deck.cover.id}.png`);
    }
  }
  expectedCards.forEach((card) => {
    const pngPath = path.join(themedOutputPath, `${card.id}.png`);
    if (!fs.existsSync(pngPath)) {
      warnings.push(`output: missing ${slugFromSourceUrl(deck.sourceUrl)}/${card.id}.png`);
    }
  });
  expectedExtras.forEach((card) => {
    const pngPath = path.join(themedOutputPath, `${card.id}.png`);
    if (!fs.existsSync(pngPath)) {
      warnings.push(`output: missing ${slugFromSourceUrl(deck.sourceUrl)}/${card.id}.png`);
    }
  });
} else {
  warnings.push('output: directory does not exist yet');
}

if (warnings.length) {
  console.log('Warnings:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error('Errors:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Card deck check passed.');
