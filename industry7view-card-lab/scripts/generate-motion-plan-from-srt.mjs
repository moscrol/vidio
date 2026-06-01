import fs from 'node:fs/promises';
import path from 'node:path';
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

function findMatch(cues, rule) {
  if ((rule.sourceCueIndexes ?? []).length > 0) {
    const cueIndexSet = new Set(rule.sourceCueIndexes);
    const matchedCues = cues.filter((cue) => cueIndexSet.has(cue.index));
    if (matchedCues.length > 0) {
      return {
        start: matchedCues[0].start,
        end: matchedCues[matchedCues.length - 1].end,
        text: matchedCues.map((cue) => cue.text).join(' '),
      };
    }
  }

  const keywords = rule.keywords ?? [];
  if (keywords.length === 0) {
    return null;
  }
  const firstMatchedIndex = cues.findIndex((cue) => keywords.some((keyword) => cue.text.includes(keyword)));
  if (firstMatchedIndex === -1) {
    return null;
  }
  const lastMatchedIndex = cues.findLastIndex((cue) => keywords.some((keyword) => cue.text.includes(keyword)));
  const matchedCues = cues.slice(firstMatchedIndex, lastMatchedIndex + 1);
  return {
    start: matchedCues[0].start,
    end: matchedCues[matchedCues.length - 1].end,
    text: matchedCues.map((cue) => cue.text).join(' '),
  };
}

function roundSeconds(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function optionalNumber(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return number;
}

function buildSegment(rule, rules, match) {
  const startOffset = optionalNumber(rule.startOffset, optionalNumber(rules.defaultStartOffset, 0));
  const endOffset = optionalNumber(rule.endOffset, 0);
  const minDuration = optionalNumber(rule.minDuration, 0);
  const maxDuration = optionalNumber(rule.maxDuration, Infinity);
  const start = Math.max(0, match.start + startOffset);
  const end = match.end + endOffset;
  let duration = end - start;

  if (duration < minDuration) {
    duration = minDuration;
  }
  if (duration > maxDuration) {
    duration = maxDuration;
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid duration for card rule: ${rule.cardId}`);
  }

  return {
    cardId: rule.cardId,
    start: roundSeconds(start),
    duration: roundSeconds(duration),
    recipe: rule.recipe,
  };
}

const motionPlanPath = path.join(projectRoot, 'motion-plan.json');
const rulesPath = path.join(projectRoot, 'timeline-rules.json');
const motionPlan = JSON.parse(await fs.readFile(motionPlanPath, 'utf8'));
const rules = JSON.parse(await fs.readFile(rulesPath, 'utf8'));
const srtPath = path.join(projectRoot, 'public', String(rules.srtPath ?? '').replace(/^\//, ''));
const cues = parseSrt(await fs.readFile(srtPath, 'utf8'));

const generatedSegments = [];
const unmatched = [];

for (const rule of rules.segments ?? []) {
  if (rule.enabled === false) {
    continue;
  }

  const match = findMatch(cues, rule);
  if (!match) {
    unmatched.push(rule.cardId);
    continue;
  }

  generatedSegments.push(buildSegment(rule, rules, match));
}

generatedSegments.sort((a, b) => a.start - b.start);

if (rules.avoidOverlap) {
  const minGap = Number(rules.minGap ?? 0);
  let previousEnd = 0;
  for (const [index, segment] of generatedSegments.entries()) {
    if (index > 0 && segment.start < previousEnd + minGap) {
      segment.start = roundSeconds(previousEnd + minGap);
    }
    previousEnd = segment.start + segment.duration;
  }
}

const nextMotionPlan = {
  ...motionPlan,
  segments: generatedSegments,
};

await fs.writeFile(motionPlanPath, `${JSON.stringify(nextMotionPlan, null, 2)}\n`, 'utf8');

console.log(`Parsed ${cues.length} SRT cues from ${rules.srtPath}`);
console.log(`Generated ${generatedSegments.length} motion segments`);
if (unmatched.length > 0) {
  console.warn(`Unmatched card rules: ${unmatched.join(', ')}`);
}
console.log('Updated motion-plan.json');
