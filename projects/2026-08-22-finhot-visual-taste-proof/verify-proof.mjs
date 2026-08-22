import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const variants = ["baseline", "distilled"];
const lockedContent = [
  "FINHOT / SIGNAL WORKSPACE",
  "把一整天的公开信源，压成可判断的研究流",
  "多源聚合：雪球、微博、公众号与更多公开信源",
  "质量排序：高信号内容先浮上来",
  "原文可追：保留来源，不替你下结论",
  "真实界面 / 全部动态",
  "FinHot 产品界面（本地截图，2026-08-22）",
  "演示仅说明信息整理流程，不构成投资建议。内容来自公开信源，最终判断由用户完成。",
];

function normalize(value) {
  return value.replace(/\s+/g, "");
}

function visibleBody(html) {
  const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1];
  assert.ok(body, "HTML must contain one body element");
  return normalize(body.replace(/<[^>]*>/g, " "));
}

function pngSize(path) {
  const png = readFileSync(path);
  assert.equal(png.toString("ascii", 1, 4), "PNG", `${path} is not a PNG`);
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
}

const texts = [];
const contracts = [];
for (const variant of variants) {
  const html = readFileSync(join(root, variant, "index.html"), "utf8");
  const text = visibleBody(html);
  texts.push(text);
  for (const item of lockedContent) {
    assert.ok(text.includes(normalize(item)), `${variant} is missing locked content: ${item}`);
  }
  assert.equal(
    (html.match(/\.\.\/assets\/d-feed\.png/g) ?? []).length,
    1,
    `${variant} must use the shared FinHot screenshot exactly once`,
  );
  contracts.push(
    JSON.parse(readFileSync(join(root, variant, "visual-contract.json"), "utf8")),
  );
  assert.deepEqual(
    pngSize(join(root, "质检", `${variant}.png`)),
    [1080, 1920],
    `${variant} capture must be 1080x1920`,
  );
}

assert.equal(texts[0], texts[1], "Visible content differs between variants");
assert.deepEqual(contracts[0].canvas, contracts[1].canvas, "Canvas contract differs");
assert.deepEqual(
  pngSize(join(root, "质检", "comparison.png")),
  [2240, 2080],
  "comparison board has unexpected dimensions",
);

console.log("proof verification ok: identical content, shared asset, fixed canvas, final captures");
