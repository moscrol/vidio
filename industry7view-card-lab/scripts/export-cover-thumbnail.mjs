import { spawn } from 'node:child_process';
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

async function readDeckSlug() {
  const source = await fs.readFile(path.join(projectRoot, 'cards.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'cards.js' });
  return slugFromSourceUrl(sandbox.window.INDUSTRY7VIEW_CARDS?.sourceUrl);
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: projectRoot, stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
    child.on('error', reject);
  });
}

const slug = await readDeckSlug();
const publishDir = path.join(projectRoot, 'output', 'publish', slug);
const videoPath = path.join(publishDir, 'video.mp4');
const coverPath = path.join(publishDir, 'cover.png');

try {
  await fs.access(videoPath);
} catch {
  console.error(`✗ 发布视频不存在: ${videoPath}`);
  console.error('请先运行: npm run video:publish');
  process.exit(1);
}

// 从片头 0.6s 抽帧（封面已渐入但还没切走）
console.log(`Extracting cover from ${videoPath} at 0.6s...`);
await run('ffmpeg', [
  '-y',
  '-ss', '0.6',
  '-i', videoPath,
  '-frames:v', '1',
  '-q:v', '2',
  coverPath,
]);

console.log(`\n✓ Cover thumbnail: ${coverPath}`);
console.log('  尺寸：1080x1920（适配抖音/B站竖屏封面）');
