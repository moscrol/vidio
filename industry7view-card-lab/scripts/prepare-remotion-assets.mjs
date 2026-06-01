import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function slugFromSourceUrl(sourceUrl) {
  const normalized = String(sourceUrl ?? '').replace(/\/$/, '');
  const slug = normalized.split('/').filter(Boolean).at(-1);
  return slug || 'default';
}

async function readDeckData() {
  const source = await fs.readFile(path.join(projectRoot, 'cards.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return sandbox.window.INDUSTRY7VIEW_CARDS;
}

async function copyCardAssets(sourceDir, targetDir, segments) {
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });

  for (const segment of segments) {
    const filename = `${segment.cardId}.png`;
    const sourceFile = path.join(sourceDir, filename);
    const targetFile = path.join(targetDir, filename);
    await fs.copyFile(sourceFile, targetFile);
  }
}

function parseSrtTime(token) {
  // "00:00:03,066" -> seconds
  const match = /(\d+):(\d+):(\d+)[,.](\d+)/.exec(token);
  if (!match) return 0;
  const [, h, m, s, ms] = match;
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
}

function parseSrt(content) {
  const blocks = content.replace(/\r\n/g, '\n').split(/\n\n+/);
  const cues = [];
  for (const block of blocks) {
    const lines = block.split('\n').filter((line) => line.trim());
    if (lines.length < 2) continue;
    const timingLineIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingLineIndex === -1) continue;
    const timingLine = lines[timingLineIndex];
    const [startStr, endStr] = timingLine.split('-->').map((s) => s.trim());
    const text = lines
      .slice(timingLineIndex + 1)
      .join(' ')
      .trim()
      .replace(/\.{2,}$/, ''); // 去掉口播稿末尾的省略号占位符
    if (!text) continue;
    cues.push({
      start: parseSrtTime(startStr),
      end: parseSrtTime(endStr),
      text,
    });
  }
  return cues;
}

async function loadSubtitleCues(talkingHeadPath, fps) {
  if (!talkingHeadPath) return [];
  const base = path.basename(talkingHeadPath).replace(/\.[^.]+$/, '');
  const srtPath = path.join(projectRoot, 'public', `${base}.srt`);
  try {
    const content = await fs.readFile(srtPath, 'utf8');
    return parseSrt(content).map((cue) => ({
      ...cue,
      startInFrames: Math.round(cue.start * fps),
      endInFrames: Math.round(cue.end * fps),
    }));
  } catch {
    return [];
  }
}

const deck = await readDeckData();
const motionPlan = JSON.parse(await fs.readFile(path.join(projectRoot, 'motion-plan.json'), 'utf8'));
const slug = slugFromSourceUrl(deck.sourceUrl);
const outputDir = path.join(projectRoot, 'output', slug);
const assetDir = path.join(projectRoot, 'public', 'card-assets', slug);
const generatedDir = path.join(projectRoot, 'remotion', 'generated');
const cardsById = new Map([deck.cover, ...(deck.cards || []), ...(deck.extras || [])].map((card) => [card.id, card]));
const nativeCardTypes = new Set(['dataHero', 'compare', 'loop', 'orderValidation', 'supplyChainShift']);

// 发布模式：PUBLISH=1 启用 intro/outro/水印。
const publishEnabled = process.env.PUBLISH === '1' || process.env.PUBLISH === 'true';
const publishConfig = motionPlan.publish || {};
const introSeconds = publishEnabled ? Number(publishConfig.intro ?? 1.5) : 0;
const outroSeconds = publishEnabled ? Number(publishConfig.outro ?? 2.8) : 0;
const fps = Number(motionPlan.fps);
const introDurationInFrames = Math.round(introSeconds * fps);
const outroDurationInFrames = Math.round(outroSeconds * fps);

await copyCardAssets(outputDir, assetDir, motionPlan.segments);
await fs.mkdir(generatedDir, { recursive: true });

let cursorSeconds = 0;
const normalizedSegments = motionPlan.segments.map((segment) => {
  const start = segment.start === undefined ? cursorSeconds : Number(segment.start);
  const duration = Number(segment.duration);
  cursorSeconds = start + duration;
  return {
    ...segment,
    start,
    duration,
    startInFrames: Math.round(start * fps) + introDurationInFrames,
    durationInFrames: Math.round(duration * fps),
    assetPath: `/card-assets/${slug}/${segment.cardId}.png`,
    renderMode: nativeCardTypes.has(cardsById.get(segment.cardId)?.type) ? 'native' : 'png',
    card: cardsById.get(segment.cardId) || null,
  };
});
const cardSequenceDurationInFrames = normalizedSegments.reduce(
  (total, segment) => Math.max(total, segment.startInFrames + segment.durationInFrames),
  0
);
const talkingHeadDurationInFrames = motionPlan.talkingHeadDuration
  ? Math.round(Number(motionPlan.talkingHeadDuration) * fps)
  : 0;
const mainBodyEndInFrames = Math.max(
  cardSequenceDurationInFrames,
  introDurationInFrames + (talkingHeadDurationInFrames || (cardSequenceDurationInFrames - introDurationInFrames))
);
const compositionDurationInFrames = mainBodyEndInFrames + outroDurationInFrames;

const subtitleCues = (await loadSubtitleCues(motionPlan.talkingHeadVideoPath, fps)).map((cue) => ({
  ...cue,
  startInFrames: cue.startInFrames + introDurationInFrames,
  endInFrames: cue.endInFrames + introDurationInFrames,
}));

// B-roll 段：时间偏移 introDurationInFrames，与卡片/字幕保持同一时间轴。
async function buildBrollSegments(rawBrolls) {
  if (!Array.isArray(rawBrolls) || rawBrolls.length === 0) return [];
  const result = [];
  for (const [i, raw] of rawBrolls.entries()) {
    const src = String(raw.src || '');
    if (!src) {
      throw new Error(`brolls[${i}].src 缺失`);
    }
    // 校验文件存在
    const filePath = path.join(projectRoot, 'public', src.replace(/^\//, ''));
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`B-roll 文件不存在: ${filePath}\n  请放到 public/${src.replace(/^\//, '')}`);
    }
    const start = Number(raw.start);
    const duration = Number(raw.duration);
    if (!Number.isFinite(start) || !Number.isFinite(duration) || duration <= 0) {
      throw new Error(`brolls[${i}] 的 start/duration 不合法: start=${raw.start}, duration=${raw.duration}`);
    }
    const isImage = /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(src);
    const kind = raw.kind || (isImage ? 'image' : 'video');
    result.push({
      startInFrames: Math.round(start * fps) + introDurationInFrames,
      durationInFrames: Math.round(duration * fps),
      src,
      kind,
      fit: raw.fit || 'cover',
      opacity: raw.opacity ?? 1,
      fadeInFrames: raw.fadeIn !== undefined ? Math.round(Number(raw.fadeIn) * fps) : 6,
      fadeOutFrames: raw.fadeOut !== undefined ? Math.round(Number(raw.fadeOut) * fps) : 6,
      trimStartInFrames: raw.trimStart !== undefined ? Math.round(Number(raw.trimStart) * fps) : 0,
      motion: kind === 'image' ? (raw.motion || 'kenBurns') : null,
    });
  }
  return result;
}

const brollSegments = await buildBrollSegments(motionPlan.brolls);

const publishMeta = publishEnabled
  ? {
      enabled: true,
      brand: deck.brand || 'INDUSTRY 7VIEW',
      slug,
      introStartInFrames: 0,
      introDurationInFrames,
      talkingHeadStartInFrames: introDurationInFrames,
      outroStartInFrames: mainBodyEndInFrames,
      outroDurationInFrames,
      intro: {
        brand: deck.brand || 'INDUSTRY 7VIEW',
        kicker: deck.cover?.kicker || '',
        titleHtml: deck.cover?.titleHtml || '',
        subtitle: deck.cover?.subtitle || '',
        badge: deck.cover?.badge || '',
      },
      outro: {
        brand: deck.brand || 'INDUSTRY 7VIEW',
        ctaPrimary: publishConfig.ctaPrimary || '关注获取完整研报',
        ctaSecondary: publishConfig.ctaSecondary || '克制研究 · 不喊口号',
      },
    }
  : { enabled: false };

const cardVideoData = {
  project: deck.project,
  slug,
  fps: motionPlan.fps,
  width: motionPlan.width,
  height: motionPlan.height,
  durationInFrames: compositionDurationInFrames,
  cardSequenceDurationInFrames,
  talkingHeadVideoPath: motionPlan.talkingHeadVideoPath || null,
  talkingHeadDurationInFrames,
  talkingHeadStartInFrames: introDurationInFrames,
  segments: normalizedSegments,
  subtitles: subtitleCues,
  brolls: brollSegments,
  publish: publishMeta,
};

await fs.writeFile(
  path.join(generatedDir, 'card-video-data.ts'),
  `export type CardVideoSegment = {
  cardId: string;
  start: number;
  duration: number;
  recipe: string;
  startInFrames: number;
  durationInFrames: number;
  assetPath: string;
  renderMode: 'png' | 'native';
  card: Record<string, unknown> | null;
};

export type SubtitleCue = {
  start: number;
  end: number;
  text: string;
  startInFrames: number;
  endInFrames: number;
};

export type BrollSegmentData = {
  startInFrames: number;
  durationInFrames: number;
  src: string;
  kind: 'video' | 'image';
  fit: 'cover' | 'contain';
  opacity: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  trimStartInFrames: number;
  motion: 'kenBurns' | 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'still' | null;
};

export type PublishIntroData = {
  brand: string;
  kicker: string;
  titleHtml: string;
  subtitle: string;
  badge: string;
};

export type PublishOutroData = {
  brand: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type PublishMeta =
  | { enabled: false }
  | {
      enabled: true;
      brand: string;
      slug: string;
      introStartInFrames: number;
      introDurationInFrames: number;
      talkingHeadStartInFrames: number;
      outroStartInFrames: number;
      outroDurationInFrames: number;
      intro: PublishIntroData;
      outro: PublishOutroData;
    };

export type CardVideoData = {
  project: string;
  slug: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  cardSequenceDurationInFrames: number;
  talkingHeadVideoPath: string | null;
  talkingHeadDurationInFrames: number;
  talkingHeadStartInFrames: number;
  segments: CardVideoSegment[];
  subtitles: SubtitleCue[];
  brolls: BrollSegmentData[];
  publish: PublishMeta;
};

export const cardVideoData: CardVideoData = ${JSON.stringify(cardVideoData, null, 2)};
`,
  'utf8'
);

console.log(`Prepared Remotion assets for ${slug}${publishEnabled ? ' [PUBLISH]' : ''}`);
console.log(`Composition duration: ${(compositionDurationInFrames / fps).toFixed(2)}s`);
if (publishEnabled) {
  console.log(`  Intro: 0 → ${(introDurationInFrames / fps).toFixed(2)}s`);
  console.log(`  Body : ${(introDurationInFrames / fps).toFixed(2)}s → ${(mainBodyEndInFrames / fps).toFixed(2)}s`);
  console.log(`  Outro: ${(mainBodyEndInFrames / fps).toFixed(2)}s → ${(compositionDurationInFrames / fps).toFixed(2)}s`);
}
if (brollSegments.length > 0) {
  console.log(`  B-roll segments: ${brollSegments.length}`);
  for (const b of brollSegments) {
    const start = (b.startInFrames / fps).toFixed(2);
    const end = ((b.startInFrames + b.durationInFrames) / fps).toFixed(2);
    const tag = b.kind === 'image' ? `image:${b.motion}` : 'video';
    console.log(`    ${start}s → ${end}s  [${tag}]  ${b.src}`);
  }
}
