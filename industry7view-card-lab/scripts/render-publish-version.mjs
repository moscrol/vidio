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

function run(cmd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`));
    });
    child.on('error', reject);
  });
}

const slug = await readDeckSlug();
const publishDir = path.join(projectRoot, 'output', 'publish', slug);
await fs.mkdir(publishDir, { recursive: true });

const videoPath = path.join(publishDir, 'video.mp4');

console.log(`\n=== Render publish version for: ${slug} ===\n`);

// 1. 卡片校验
await run('npm', ['run', 'check']);

// 2. 导出卡片 PNG
await run('npm', ['run', 'export']);

// 3. 准备 Remotion 资产（发布模式）
await run('npm', ['run', 'video:assets'], { PUBLISH: '1' });

// 4. 校验 motion plan
await run('npm', ['run', 'check:motion']);

// 5. Remotion 渲染
await run('npx', [
  'remotion',
  'render',
  'remotion/index.ts',
  'CardDeckVideo',
  videoPath,
]);

console.log(`\n✓ Publish video: ${videoPath}\n`);

// 6. 写 metadata
const cardsSource = await fs.readFile(path.join(projectRoot, 'cards.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(cardsSource, sandbox, { filename: 'cards.js' });
const deck = sandbox.window.INDUSTRY7VIEW_CARDS;

const metadata = {
  slug,
  brand: deck.brand || 'INDUSTRY 7VIEW',
  sourceUrl: `https://${String(deck.sourceUrl || '').replace(/^https?:\/\//, '')}`,
  cover: deck.cover || null,
  generatedAt: new Date().toISOString(),
  notes: [
    '抖音/B站标题：建议从 cover.titleHtml 提取核心判断 + 反差句',
    '简介：第一句反常识 + 主站链接（评论区/简介可放）',
    '标签：行业 + 公司 + 产业链关键词',
    '封面：output/publish/<slug>/cover.png',
  ],
};
await fs.writeFile(
  path.join(publishDir, 'metadata.json'),
  JSON.stringify(metadata, null, 2),
  'utf8'
);
console.log(`✓ Metadata: ${path.join(publishDir, 'metadata.json')}\n`);

console.log('下一步：');
console.log(`  npm run video:publish:cover    # 从视频抽帧生成平台封面`);
console.log(`  open ${publishDir}             # 查看产物\n`);
