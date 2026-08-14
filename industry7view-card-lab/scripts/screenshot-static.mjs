import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const cards = process.argv.slice(2);
if (!cards.length) {
  console.error('usage: node screenshot-static.mjs <name1> [name2...]');
  process.exit(1);
}

const browser = await chromium.launch();
for (const name of cards) {
  const page = await browser.newPage({
    viewport: { width: 420, height: 800 },
    deviceScaleFactor: 2,
  });
  const url = `file://${path.join(projectRoot, 'cards-static', `${name}.html`)}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const el = await page.$('.video-card');
  if (!el) {
    console.error(`No .video-card on ${name}`);
    continue;
  }
  const outPath = path.join(projectRoot, 'cards-static', `_preview-${name}.png`);
  await el.screenshot({ path: outPath });
  console.log('wrote', outPath);
  await page.close();
}
await browser.close();
