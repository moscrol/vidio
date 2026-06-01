import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetUrl = `file://${path.join(__dirname, 'index.html')}`;

function slugFromSourceUrl(sourceUrl) {
  const normalized = String(sourceUrl ?? '').replace(/\/$/, '');
  const slug = normalized.split('/').filter(Boolean).at(-1);
  return slug || 'default';
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 2200 },
  deviceScaleFactor: 2,
});

await page.goto(targetUrl, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts && document.fonts.ready);

const slug = await page.evaluate(() => {
  const data = window.INDUSTRY7VIEW_CARDS;
  const normalized = String(data?.sourceUrl ?? '').replace(/\/$/, '');
  return normalized.split('/').filter(Boolean).at(-1) || 'default';
});
const outputDir = path.join(__dirname, 'output', slugFromSourceUrl(slug));
await fs.mkdir(outputDir, { recursive: true });

const cards = await page.locator('.video-card').evaluateAll((nodes) =>
  nodes.map((node) => node.getAttribute('data-card-id')).filter(Boolean)
);

for (const id of cards) {
  const locator = page.locator(`[data-card-id="${id}"]`);
  await locator.screenshot({
    path: path.join(outputDir, `${id}.png`),
    omitBackground: false,
  });
}

await browser.close();

console.log(`Exported ${cards.length} cards to ${outputDir}`);
