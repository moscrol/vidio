# XiaoyanProfitPipe v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first repeatable Xiaoyan HyperFrames component that renders a hand-drawn profit-pipe MP4 from structured props.

**Architecture:** Add a new isolated `industry7view-card-lab/xiaoyan` track. The first component keeps HTML/CSS/SVG local to `XiaoyanProfitPipe`, reads props through an injected JSON script, and renders through a Node script that runs HyperFrames lint, inspect, render, preview capture, ffprobe, and report generation.

**Tech Stack:** HyperFrames HTML composition, GSAP, Node.js ESM scripts, Playwright with system Chrome, FFmpeg/ffprobe, existing `npx hyperframes` CLI.

---

## File Structure

Create these files:

- `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/index.html`  
  HyperFrames composition source. Contains the approved V2 hand-drawn layout, reads props from the `#xiaoyan-props` JSON script element, registers `window.__timelines["xiaoyan-profit-pipe"]`.

- `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/sample-props.json`  
  Canonical v0.1 fixture matching the approved profit-pipe sample.

- `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md`  
  Component boundary, props, render command, QA expectations.

- `industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs`  
  Render automation. Copies the component to a temp render directory, injects props, runs HyperFrames lint/inspect/render, captures preview PNG, runs ffprobe, writes report.

- `industry7view-card-lab/xiaoyan/README.md`  
  Entry document for the new Xiaoyan track.

Modify these files:

- `industry7view-card-lab/package.json`  
  Add `xiaoyan:profit-pipe` script.

Do not modify Remotion files in v0.1.

---

### Task 1: Add Xiaoyan Track Skeleton

**Files:**
- Create: `industry7view-card-lab/xiaoyan/README.md`
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md`
- Create directory: `industry7view-card-lab/xiaoyan/renders/.gitkeep`

- [ ] **Step 1: Create the Xiaoyan track README**

Create `industry7view-card-lab/xiaoyan/README.md`:

```md
# Xiaoyan Motion Components

This directory contains the hand-drawn Xiaoyan IP motion track for Industry 7View.

The first supported component is `XiaoyanProfitPipe`.

## Production Split

- HyperFrames owns Xiaoyan hand-drawn motion clips.
- Remotion owns final timeline assembly, A-roll, B-roll, captions, and audio.

## Render Command

```bash
npm run xiaoyan:profit-pipe
```

The command renders the canonical sample props into:

```text
xiaoyan/renders/profit-pipe-default/
  xiaoyan-profit-pipe.mp4
  preview.png
  props.json
  render-report.md
```

## QA Rules

- Xiaoyan is flat 2D line art.
- Xiaoyan holds a magnifying glass.
- The main object is a hand-drawn pipe, not a Swiss card.
- The render passes HyperFrames lint and inspect.
- `ffprobe` confirms 1080x1920, 30fps, and 6 seconds for the default sample.
```

- [ ] **Step 2: Create the component README**

Create `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md`:

```md
# XiaoyanProfitPipe

`XiaoyanProfitPipe` expresses profit, cash flow, and commercial realization logic with Xiaoyan inspecting a hand-drawn pipe.

## Use When

- The script asks where profit comes from.
- The script explains demand, cost, price, competition, or cash-flow realization.
- The script asks whether a hot theme can become real business.

## Do Not Use For

- Full industry-chain maps.
- Prototype-to-order validation chains.
- Data hero cards.
- Final quote cards.

## Props

```ts
type XiaoyanProfitPipeProps = {
  id: string;
  topic: string;
  title?: string;
  factors: string[];
  bottleneck?: {
    label: string;
    targetFactor?: string;
  };
  resultLabel: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: 6 | 8;
};
```

## Render

```bash
npm run xiaoyan:profit-pipe
```
```

- [ ] **Step 3: Create render directory marker**

Create `industry7view-card-lab/xiaoyan/renders/.gitkeep` as an empty file.

- [ ] **Step 4: Commit skeleton**

Run:

```bash
git add industry7view-card-lab/xiaoyan/README.md \
  industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md \
  industry7view-card-lab/xiaoyan/renders/.gitkeep
git commit -m "Add Xiaoyan motion component skeleton"
```

Expected: commit succeeds.

---

### Task 2: Add Canonical Profit Pipe Props

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/sample-props.json`

- [ ] **Step 1: Add sample props**

Create `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/sample-props.json`:

```json
{
  "id": "profit-pipe-default",
  "topic": "产业研究利润流向",
  "title": "利润水管",
  "factors": ["需求", "成本", "价格", "竞争", "利润"],
  "bottleneck": {
    "label": "卡点",
    "targetFactor": "成本"
  },
  "resultLabel": "利润",
  "blueNote": "看流向",
  "redNote": "卡点",
  "footer": "题材热不热先放一边，利润阀门能不能打开，才是产业研究要看的问题。",
  "durationSeconds": 6
}
```

- [ ] **Step 2: Validate JSON**

Run:

```bash
node -e "const p=require('./industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/sample-props.json'); if (p.factors.length !== 5) process.exit(1); console.log(p.id)"
```

Expected output:

```text
profit-pipe-default
```

- [ ] **Step 3: Commit props**

Run:

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/sample-props.json
git commit -m "Add XiaoyanProfitPipe sample props"
```

Expected: commit succeeds.

---

### Task 3: Add HyperFrames Composition

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/index.html`

- [ ] **Step 1: Create component HTML**

Create `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/index.html` with this complete source:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Xiaoyan Profit Pipe</title>
    <style>
      :root {
        --ink: #121212;
        --paper: #fffefa;
        --blue: #1d65d8;
        --red: #df2626;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #ece9df;
        font-family:
          "Kaiti SC", "STKaiti", "Songti SC", "PingFang SC", "Noto Sans CJK SC",
          sans-serif;
      }

      #xiaoyan-profit-pipe {
        position: relative;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 45%, rgba(0, 0, 0, 0.035), transparent 42%),
          var(--paper);
        color: var(--ink);
      }

      .brand {
        position: absolute;
        left: 82px;
        top: 82px;
        font-family:
          -apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans CJK SC",
          sans-serif;
        font-size: 24px;
        font-weight: 750;
      }

      .small-title {
        position: absolute;
        right: 82px;
        top: 78px;
        font-size: 30px;
        font-weight: 700;
        transform: rotate(2deg);
      }

      .pipe-wrap {
        position: absolute;
        left: 24px;
        top: 520px;
        width: 1032px;
        height: 720px;
      }

      .pipe-svg,
      .xiaoyan {
        position: absolute;
        overflow: visible;
      }

      .pipe-svg {
        left: 0;
        top: 0;
        width: 1032px;
        height: 610px;
      }

      .xiaoyan {
        right: -34px;
        top: 204px;
        width: 190px;
        height: 300px;
      }

      .tag {
        position: absolute;
        width: 118px;
        height: 70px;
        display: grid;
        place-items: center;
        border: 3px solid var(--ink);
        border-radius: 8px;
        background: #fffefa;
        font-size: 32px;
        font-weight: 700;
        box-shadow: 7px 9px 0 rgba(0, 0, 0, 0.08);
      }

      .tag.demand { left: 156px; top: 146px; transform: rotate(-2deg); }
      .tag.cost { left: 354px; top: 146px; transform: rotate(1deg); }
      .tag.price { left: 554px; top: 146px; transform: rotate(-1deg); }
      .tag.compete { left: 744px; top: 146px; transform: rotate(2deg); }
      .tag.profit { left: 890px; top: 146px; transform: rotate(-2deg); }

      .scribble {
        position: absolute;
        font-size: 34px;
        font-weight: 700;
        color: var(--blue);
        transform: rotate(-4deg);
      }

      .scribble.flow { left: 456px; top: 548px; }
      .scribble.block { left: 332px; top: 530px; color: var(--red); transform: rotate(5deg); }

      .caption {
        position: absolute;
        left: 94px;
        right: 94px;
        bottom: 245px;
        font-family:
          -apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans CJK SC",
          sans-serif;
        font-size: 42px;
        line-height: 1.35;
        font-weight: 800;
        letter-spacing: 0;
      }

      .caption .red {
        color: var(--red);
      }

      .ground {
        position: absolute;
        left: 82px;
        right: 82px;
        top: 1028px;
        height: 42px;
        border-bottom: 3px solid rgba(18, 18, 18, 0.18);
        transform: rotate(-1deg);
      }
    </style>
  </head>
  <body>
    <div
      id="xiaoyan-profit-pipe"
      data-composition-id="xiaoyan-profit-pipe"
      data-width="1080"
      data-height="1920"
      data-duration="6"
      data-start="0"
      data-track-index="0"
    >
      <div class="brand">INDUSTRY 7VIEW / XIAOYAN</div>
      <div class="small-title" data-field="title">利润水管</div>
      <div class="ground"></div>

      <div class="pipe-wrap">
        <svg class="pipe-svg" viewBox="0 0 1032 610" aria-label="利润水管手绘动效">
          <defs>
            <filter id="soft-pencil" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="0" flood-color="#121212" flood-opacity="0.06" />
            </filter>
          </defs>
          <g class="main-pipe" filter="url(#soft-pencil)">
            <path class="pipe-sketch-1" d="M38 334 C172 322, 268 326, 380 326 S620 328, 762 326 S916 324, 1000 332" fill="none" stroke="#121212" stroke-width="84" stroke-linecap="round" />
            <path class="pipe-sketch-2" d="M42 324 C182 314, 284 318, 392 318 S622 320, 756 318 S908 316, 996 324" fill="none" stroke="#fffefa" stroke-width="66" stroke-linecap="round" />
            <path class="pipe-line-top" d="M62 300 C184 290, 302 295, 404 294 S625 296, 750 294 S888 292, 966 300" fill="none" stroke="#121212" stroke-width="3" stroke-linecap="round" opacity="0.55" />
            <path class="pipe-line-bottom" d="M60 360 C190 350, 304 354, 410 354 S626 356, 750 354 S890 352, 970 360" fill="none" stroke="#121212" stroke-width="3" stroke-linecap="round" opacity="0.42" />
          </g>
          <g class="arrow-in" fill="none" stroke="#121212" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M-10 330 H44" />
            <path d="M24 310 L46 330 L24 350" />
          </g>
          <g class="arrow-out" fill="none" stroke="#121212" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1000 330 H1060" />
            <path d="M1038 310 L1062 330 L1038 350" />
          </g>
          <g class="joint j1" transform="translate(248 326)"><ellipse cx="0" cy="0" rx="22" ry="61" fill="#fffefa" stroke="#121212" stroke-width="5" /><path d="M-6 -52 C10 -30, 8 34, -7 54" fill="none" stroke="#121212" stroke-width="2" opacity="0.45" /></g>
          <g class="joint j2" transform="translate(450 326)"><ellipse cx="0" cy="0" rx="22" ry="61" fill="#fffefa" stroke="#121212" stroke-width="5" /><path d="M-5 -52 C9 -30, 7 34, -7 54" fill="none" stroke="#121212" stroke-width="2" opacity="0.45" /></g>
          <g class="joint j3" transform="translate(650 326)"><ellipse cx="0" cy="0" rx="22" ry="61" fill="#fffefa" stroke="#121212" stroke-width="5" /><path d="M-5 -52 C9 -30, 7 34, -7 54" fill="none" stroke="#121212" stroke-width="2" opacity="0.45" /></g>
          <g class="joint j4" transform="translate(840 326)"><ellipse cx="0" cy="0" rx="22" ry="61" fill="#fffefa" stroke="#121212" stroke-width="5" /><path d="M-5 -52 C9 -30, 7 34, -7 54" fill="none" stroke="#121212" stroke-width="2" opacity="0.45" /></g>
          <g class="valve v1" transform="translate(206 166)"></g>
          <g class="valve v2" transform="translate(404 166)"></g>
          <g class="valve v3" transform="translate(604 166)"></g>
          <g class="valve v4" transform="translate(794 166)"></g>
          <g class="valve v5" transform="translate(938 166)"></g>
          <g class="leak" fill="none" stroke="#121212" stroke-linecap="round">
            <path d="M414 376 C410 398, 414 412, 404 430" stroke-width="3" />
            <path d="M392 452 C410 444, 430 444, 448 454" stroke-width="3" opacity="0.55" />
            <path d="M410 398 C402 410, 404 420, 414 426" stroke="#df2626" stroke-width="4" />
          </g>
          <path class="flow-mark" d="M468 504 C552 496, 622 496, 704 506" fill="none" stroke="#1d65d8" stroke-width="5" stroke-linecap="round" />
          <path class="flow-mark-head" d="M684 486 L706 506 L680 524" fill="none" stroke="#1d65d8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path class="block-arrow" d="M382 504 L404 436" fill="none" stroke="#df2626" stroke-width="4" stroke-linecap="round" />
          <path class="block-arrow-head" d="M392 450 L404 436 L412 454" fill="none" stroke="#df2626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div class="tag demand" data-factor-index="0">需求</div>
        <div class="tag cost" data-factor-index="1">成本</div>
        <div class="tag price" data-factor-index="2">价格</div>
        <div class="tag compete" data-factor-index="3">竞争</div>
        <div class="tag profit" data-factor-index="4">利润</div>
        <div class="scribble block" data-field="redNote">卡点</div>
        <div class="scribble flow" data-field="blueNote">看流向</div>

        <svg class="xiaoyan" viewBox="0 0 214 300" aria-label="小研">
          <g class="xy-body" fill="none" stroke="#121212" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="72" cy="54" r="34" fill="#fffefa" />
            <path d="M60 50 L54 58" />
            <circle cx="86" cy="52" r="2.5" fill="#121212" stroke="none" />
            <path d="M73 91 L70 154" />
            <path d="M71 108 L40 134" />
            <path d="M72 112 L126 142" />
            <path d="M70 154 L38 236" />
            <path d="M70 154 L118 232 L88 232" />
            <path d="M126 142 L154 114" />
          </g>
          <g class="magnifier" fill="none" stroke="#121212" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="166" cy="98" rx="39" ry="44" transform="rotate(-16 166 98)" fill="rgba(255,255,255,0.55)" />
            <ellipse cx="166" cy="98" rx="28" ry="33" transform="rotate(-16 166 98)" stroke-width="3" opacity="0.5" />
            <path d="M144 132 L126 154" />
          </g>
        </svg>
      </div>

      <div class="caption" data-field="footer">
        题材热不热先放一边，<span class="red">利润阀门</span>能不能打开，才是产业研究要看的问题。
      </div>
    </div>

    <script type="application/json" id="xiaoyan-props">
      {
        "id": "profit-pipe-default",
        "topic": "产业研究利润流向",
        "title": "利润水管",
        "factors": ["需求", "成本", "价格", "竞争", "利润"],
        "bottleneck": { "label": "卡点", "targetFactor": "成本" },
        "resultLabel": "利润",
        "blueNote": "看流向",
        "redNote": "卡点",
        "footer": "题材热不热先放一边，利润阀门能不能打开，才是产业研究要看的问题。",
        "durationSeconds": 6
      }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script>
      const props = JSON.parse(document.getElementById("xiaoyan-props").textContent);
      const root = document.querySelector("#xiaoyan-profit-pipe");
      root.dataset.duration = String(props.durationSeconds || 6);
      document.querySelector('[data-field="title"]').textContent = props.title || "利润水管";
      document.querySelector('[data-field="blueNote"]').textContent = props.blueNote || "看流向";
      document.querySelector('[data-field="redNote"]').textContent = props.redNote || props.bottleneck?.label || "卡点";
      const factors = (props.factors || []).slice(0, 5);
      document.querySelectorAll("[data-factor-index]").forEach((node) => {
        const index = Number(node.dataset.factorIndex);
        node.textContent = factors[index] || "";
      });
      document.querySelector('[data-field="footer"]').innerHTML = (props.footer || "").replace(props.resultLabel || "利润", `<span class="red">${props.resultLabel || "利润"}</span>`);

      const valveMarkup = `
        <path d="M0 50 V148" stroke="#121212" stroke-width="8" stroke-linecap="round" />
        <rect x="-44" y="128" width="88" height="36" rx="4" fill="#fffefa" stroke="#121212" stroke-width="5" />
        <ellipse cx="0" cy="28" rx="56" ry="22" fill="#fffefa" stroke="#121212" stroke-width="6" />
        <ellipse cx="0" cy="28" rx="42" ry="14" fill="none" stroke="#121212" stroke-width="3" />
        <path d="M-34 28 H34 M0 14 V42 M-24 17 L24 39 M-24 39 L24 17" stroke="#121212" stroke-width="3" stroke-linecap="round" />
      `;
      document.querySelectorAll(".valve").forEach((node) => {
        node.innerHTML = valveMarkup;
      });

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      window.__timelines = window.__timelines || {};
      window.__timelines["xiaoyan-profit-pipe"] = tl;

      tl.fromTo(".brand, .small-title", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.08, ease: "power2.out" }, 0.1);
      tl.fromTo(".main-pipe path", { strokeDasharray: "0 1300" }, { strokeDasharray: "1300 1300", duration: 0.9, stagger: 0.05, ease: "power2.inOut" }, 0.35);
      tl.fromTo(".arrow-in", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.34, ease: "power2.out" }, 0.78);
      tl.fromTo(".joint", { opacity: 0, scaleX: 0.5 }, { opacity: 1, scaleX: 1, transformOrigin: "center", duration: 0.26, stagger: 0.08, ease: "back.out(1.8)" }, 0.95);
      tl.fromTo(".valve", { opacity: 0, y: -42, rotate: -2 }, { opacity: 1, y: 0, rotate: 0, duration: 0.34, stagger: 0.11, ease: "back.out(2)" }, 1.12);
      tl.fromTo(".tag", { opacity: 0, y: 16, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.1, ease: "back.out(2)" }, 1.38);
      tl.fromTo(".xiaoyan", { opacity: 0, x: 70, rotate: 3 }, { opacity: 1, x: 0, rotate: 0, duration: 0.56, ease: "expo.out" }, 1.88);
      tl.fromTo(".leak", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.38, ease: "steps(4)" }, 2.3);
      tl.fromTo(".block, .block-arrow, .block-arrow-head", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, 2.52);
      tl.fromTo(".flow-mark, .flow-mark-head", { opacity: 0, strokeDasharray: "0 260" }, { opacity: 1, strokeDasharray: "260 260", duration: 0.48, stagger: 0.06, ease: "power2.out" }, 2.86);
      tl.fromTo(".arrow-out", { opacity: 0, x: -26 }, { opacity: 1, x: 0, duration: 0.36, ease: "power2.out" }, 3.16);
      tl.fromTo(".caption", { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.56, ease: "expo.out" }, 3.55);
      tl.to(".magnifier", { rotate: -8, transformOrigin: "126px 154px", duration: 0.55, yoyo: true, repeat: 3, ease: "sine.inOut" }, 3.95);
    </script>
  </body>
</html>
```

- [ ] **Step 2: Run HyperFrames lint and inspect**

Run:

```bash
cd industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe
npx hyperframes lint --verbose
npx hyperframes inspect --samples 8 --json
```

Expected:

```text
lint: 0 error(s)
inspect: "ok": true
```

The font warning may appear in v0.1 and is acceptable if there are 0 lint errors.

- [ ] **Step 3: Commit component HTML**

Run:

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/index.html
git commit -m "Add XiaoyanProfitPipe HyperFrames composition"
```

Expected: commit succeeds.

---

### Task 4: Add Render Automation Script

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs`
- Modify: `industry7view-card-lab/package.json`

- [ ] **Step 1: Create render script**

Create `industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs`:

```js
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const labRoot = path.resolve(__dirname, '..', '..');
const xiaoyanRoot = path.resolve(labRoot, 'xiaoyan');
const componentRoot = path.resolve(xiaoyanRoot, 'components', 'XiaoyanProfitPipe');
const defaultPropsPath = path.resolve(componentRoot, 'sample-props.json');

const propsPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultPropsPath;
const props = JSON.parse(readFileSync(propsPath, 'utf8'));

if (!props.id || !Array.isArray(props.factors) || !props.resultLabel) {
  throw new Error('Props must include id, factors[], and resultLabel.');
}

const renderId = props.id;
const outputDir = path.resolve(xiaoyanRoot, 'renders', renderId);
const workDir = path.resolve(outputDir, 'composition');
const outputMp4 = path.resolve(outputDir, 'xiaoyan-profit-pipe.mp4');
const previewPng = path.resolve(outputDir, 'preview.png');
const reportPath = path.resolve(outputDir, 'render-report.md');

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(workDir, { recursive: true });

const htmlSource = readFileSync(path.resolve(componentRoot, 'index.html'), 'utf8');
const injectedHtml = htmlSource.replace(
  /<script type="application\/json" id="xiaoyan-props">[\s\S]*?<\/script>/,
  `<script type="application/json" id="xiaoyan-props">\n${JSON.stringify(props, null, 2)}\n    </script>`,
);

writeFileSync(path.resolve(workDir, 'index.html'), injectedHtml);
writeFileSync(path.resolve(outputDir, 'props.json'), `${JSON.stringify(props, null, 2)}\n`);

function run(command, args, cwd = workDir) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

const lintOutput = run('npx', ['hyperframes', 'lint', '--verbose']);
const inspectOutput = run('npx', ['hyperframes', 'inspect', '--samples', '8', '--json']);
run('npx', ['hyperframes', 'render', '--quality', 'draft', '--output', outputMp4]);

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto(`file://${path.resolve(workDir, 'index.html')}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(5200);
await page.screenshot({ path: previewPng, fullPage: false });
await browser.close();

const ffprobeOutput = run('ffprobe', [
  '-v',
  'error',
  '-select_streams',
  'v:0',
  '-show_entries',
  'stream=width,height,r_frame_rate,duration',
  '-of',
  'default=nw=1',
  outputMp4,
], labRoot);

const report = `# XiaoyanProfitPipe Render Report

## Input

- props: ${propsPath}
- id: ${renderId}

## Outputs

- mp4: ${outputMp4}
- preview: ${previewPng}
- props copy: ${path.resolve(outputDir, 'props.json')}

## HyperFrames Lint

\`\`\`text
${lintOutput.trim()}
\`\`\`

## HyperFrames Inspect

\`\`\`json
${inspectOutput.trim()}
\`\`\`

## ffprobe

\`\`\`text
${ffprobeOutput.trim()}
\`\`\`
`;

writeFileSync(reportPath, report);

if (!existsSync(outputMp4)) {
  throw new Error(`Render failed: ${outputMp4} was not created.`);
}

console.log(`Rendered ${outputMp4}`);
console.log(`Preview ${previewPng}`);
console.log(`Report ${reportPath}`);
```

- [ ] **Step 2: Add npm script**

Modify `industry7view-card-lab/package.json` scripts block to include:

```json
"xiaoyan:profit-pipe": "node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs"
```

Place it near the existing video scripts. Keep the JSON valid with commas.

- [ ] **Step 3: Run render script**

Run:

```bash
cd industry7view-card-lab
npm run xiaoyan:profit-pipe
```

Expected output includes:

```text
Rendered .../xiaoyan/renders/profit-pipe-default/xiaoyan-profit-pipe.mp4
Preview .../xiaoyan/renders/profit-pipe-default/preview.png
Report .../xiaoyan/renders/profit-pipe-default/render-report.md
```

- [ ] **Step 4: Verify output metadata**

Run:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 industry7view-card-lab/xiaoyan/renders/profit-pipe-default/xiaoyan-profit-pipe.mp4
```

Expected output:

```text
width=1080
height=1920
r_frame_rate=30/1
duration=6.000000
```

- [ ] **Step 5: Commit render automation**

Run:

```bash
git add industry7view-card-lab/package.json \
  industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs
git commit -m "Add XiaoyanProfitPipe render automation"
```

Expected: commit succeeds.

---

### Task 5: Verify Alternate Props Without SVG Rewiring

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json`
- Generated output: `industry7view-card-lab/xiaoyan/renders/profit-pipe-cashflow/`

- [ ] **Step 1: Add alternate props**

Create `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json`:

```json
{
  "id": "profit-pipe-cashflow",
  "topic": "商业兑现现金流",
  "title": "现金流水管",
  "factors": ["需求", "交付", "回款", "成本", "现金流"],
  "bottleneck": {
    "label": "堵点",
    "targetFactor": "回款"
  },
  "resultLabel": "现金流",
  "blueNote": "看回款",
  "redNote": "堵点",
  "footer": "故事讲得再热，最后也要看现金流能不能真正流回来。",
  "durationSeconds": 6
}
```

- [ ] **Step 2: Render alternate props**

Run:

```bash
cd industry7view-card-lab
node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
```

Expected output includes:

```text
Rendered .../xiaoyan/renders/profit-pipe-cashflow/xiaoyan-profit-pipe.mp4
```

- [ ] **Step 3: Verify alternate output**

Run:

```bash
test -f industry7view-card-lab/xiaoyan/renders/profit-pipe-cashflow/preview.png
test -f industry7view-card-lab/xiaoyan/renders/profit-pipe-cashflow/render-report.md
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 industry7view-card-lab/xiaoyan/renders/profit-pipe-cashflow/xiaoyan-profit-pipe.mp4
```

Expected metadata:

```text
width=1080
height=1920
r_frame_rate=30/1
duration=6.000000
```

- [ ] **Step 4: Commit alternate fixture**

Run:

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
git commit -m "Add XiaoyanProfitPipe alternate props fixture"
```

Expected: commit succeeds.

Generated renders are not committed unless explicitly requested.

---

### Task 6: Add Final Documentation and QA Notes

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md`
- Modify: `industry7view-card-lab/xiaoyan/README.md`

- [ ] **Step 1: Update component README with output contract**

Append this section to `industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md`:

```md
## Output Contract

Each render writes:

```text
xiaoyan/renders/<props.id>/
  xiaoyan-profit-pipe.mp4
  preview.png
  props.json
  render-report.md
```

## v0.1 Acceptance

- Default props render to 1080x1920 MP4.
- Alternate props render without editing SVG or HTML.
- HyperFrames lint has 0 errors.
- HyperFrames inspect has 0 layout issues.
- Xiaoyan remains a flat 2D stick figure with magnifier.
```

- [ ] **Step 2: Update track README with alternate props command**

Append this section to `industry7view-card-lab/xiaoyan/README.md`:

```md
## Alternate Props

```bash
node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
```

Use alternate props to verify that the component is reusable and not hard-wired to one SVG label set.
```

- [ ] **Step 3: Run final verification**

Run:

```bash
cd industry7view-card-lab
npm run xiaoyan:profit-pipe
node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
```

Expected: both commands finish with `Rendered ...xiaoyan-profit-pipe.mp4`.

- [ ] **Step 4: Commit docs**

Run:

```bash
git add industry7view-card-lab/xiaoyan/README.md \
  industry7view-card-lab/xiaoyan/components/XiaoyanProfitPipe/README.md
git commit -m "Document XiaoyanProfitPipe render workflow"
```

Expected: commit succeeds.

---

## Plan Self-Review

Spec coverage:

- Single HyperFrames component: Task 3.
- Structured props: Task 2 and Task 5.
- Render automation: Task 4.
- MP4, preview, props copy, report: Task 4.
- Alternate props without SVG rewiring: Task 5.
- Remotion untouched: file structure and tasks avoid Remotion files.
- QA via lint, inspect, ffprobe: Tasks 3, 4, 5, 6.

Placeholder scan:

- The implementation steps contain no unresolved placeholder instructions or undefined file paths.

Type consistency:

- `XiaoyanProfitPipeProps` fields match the design spec and JSON fixtures.
- Render script uses `id`, `factors`, `resultLabel`, `durationSeconds`, `title`, `blueNote`, `redNote`, `footer`, and `bottleneck`.
