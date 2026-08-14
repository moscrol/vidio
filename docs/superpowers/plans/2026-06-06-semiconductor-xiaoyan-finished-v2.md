# Semiconductor Xiaoyan Finished Video v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and render the 90.2-second semiconductor video with seven full-screen Xiaoyan hand-drawn canvases, approximately 73% Xiaoyan visuals, and paper-cover transitions around the retained A-roll sections.

**Architecture:** Create a self-contained HyperFrames project under `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2`. A root composition owns media tracks, scene timing, captions, and transitions; focused JavaScript modules own shared sketch primitives and each canvas scene. A render script prepares seek-friendly media, validates timing, renders the visual track, muxes the original audio, and exports QA frames.

**Tech Stack:** HyperFrames HTML compositions, GSAP, browser DOM/SVG, Node.js ES modules, ffmpeg/ffprobe, existing Xiaoyan visual language.

---

### Task 1: Scene Contract and Timeline Validation

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs`

- [ ] **Step 1: Write the failing timeline tests**

```js
import assert from "node:assert/strict";
import {SCENES, TOTAL_DURATION} from "./scenes.mjs";
import {validateScenes} from "./validate-scenes.mjs";

assert.equal(TOTAL_DURATION, 90.2);
assert.doesNotThrow(() => validateScenes(SCENES, TOTAL_DURATION));
assert.equal(
  SCENES.filter((scene) => scene.type === "xiaoyan")
    .reduce((sum, scene) => sum + scene.end - scene.start, 0)
    .toFixed(3),
  "65.866",
);
assert.throws(
  () => validateScenes([{id: "a", start: 0, end: 2}, {id: "b", start: 1, end: 3}], 3),
  /overlap/,
);
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs`

Expected: FAIL because the scene modules do not exist.

- [ ] **Step 3: Implement the exact SRT-aligned scene configuration**

Define the retained A-roll and Xiaoyan ranges:

```js
export const TOTAL_DURATION = 90.2;
export const SCENES = [
  {id: "aroll-hook", type: "aroll", start: 0, end: 5.066},
  {id: "gate-lens", type: "xiaoyan", component: "XiaoyanGateLens", start: 5.066, end: 11.4},
  {id: "aroll-why", type: "aroll", start: 11.4, end: 14.6},
  {id: "risk-domino", type: "xiaoyan", component: "XiaoyanRiskDomino", start: 14.6, end: 19.033},
  {id: "aroll-risk", type: "aroll", start: 19.033, end: 21},
  {id: "validation-scroll", type: "xiaoyan", component: "XiaoyanValidationScroll", start: 21, end: 49.166},
  {id: "aroll-barrier", type: "aroll", start: 49.166, end: 54.6},
  {id: "barrier-scale", type: "xiaoyan", component: "XiaoyanBarrierScale", start: 54.6, end: 62.833},
  {id: "aroll-research", type: "aroll", start: 62.833, end: 64.133},
  {id: "certification-tunnel", type: "xiaoyan", component: "XiaoyanCertificationTunnel", start: 64.133, end: 68.066},
  {id: "research-gates", type: "xiaoyan", component: "XiaoyanResearchGates", start: 68.066, end: 78.2},
  {id: "aroll-ending-turn", type: "aroll", start: 78.2, end: 82.533},
  {id: "business-proof", type: "xiaoyan", component: "XiaoyanBusinessProof", start: 82.533, end: 87.166},
  {id: "aroll-ending", type: "aroll", start: 87.166, end: 90.2},
];
```

`validateScenes` must reject duplicate IDs, negative duration, overlaps, gaps, wrong start/end boundaries, and missing component names for Xiaoyan scenes.

- [ ] **Step 4: Run the tests**

Run: `node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
git commit -m "Add semiconductor v2 scene contract"
```

### Task 2: Shared Xiaoyan Visual Primitives

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/sketch-primitives.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/character.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/primitives-preview.html`

- [ ] **Step 1: Create a static preview contract**

The preview must render:

```html
<main class="xiaoyan-canvas">
  <div id="character-preview"></div>
  <div id="label-preview"></div>
  <div id="line-preview"></div>
</main>
```

Expected visual constraints: 720x1280 paper canvas, flat stick figure, circular magnifier, black sketch lines, red/blue/yellow accents, no nested cards.

- [ ] **Step 2: Implement shared CSS tokens**

Define exact tokens:

```css
:root {
  --xy-paper: #fbfaef;
  --xy-ink: #171717;
  --xy-red: #df4938;
  --xy-blue: #3073bd;
  --xy-yellow: #ffe36e;
  --xy-muted: #a9a69d;
}
```

Add stable canvas, safe-area, sketch-label, sketch-node, caption, paper-transition, and hidden clip styles.

- [ ] **Step 3: Implement DOM/SVG primitives**

Export:

```js
export function sketchLine({x1, y1, x2, y2, color, width, progress});
export function sketchLabel({x, y, text, tone, size, align});
export function sketchNode({x, y, width, height, label, tone, dashed});
export function createXiaoyanCharacter({x, y, scale, pose, lookDirection});
```

The character must remain two-dimensional and always include the magnifier. Supported poses: `walk`, `inspect`, `push`, `brace`, `stamp`, `point`.

- [ ] **Step 4: Verify the preview**

Run: `cd industry7view-card-lab && python3 -m http.server 8787`

Open: `http://localhost:8787/xiaoyan/finished/SemiconductorFinishedV2/primitives-preview.html`

Expected: no clipping at 720x1280 and the character matches the established Xiaoyan silhouette.

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
git commit -m "Add shared Xiaoyan sketch primitives"
```

### Task 3: First Three Full-Screen Canvases

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/gate-lens.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/risk-domino.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/validation-scroll.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/scenes-preview-a.html`

- [ ] **Step 1: Implement `XiaoyanGateLens`**

Build the end-state layout with “发布会”, “实验室样机”, a distant wafer-fab gate, Xiaoyan, and the conclusion “晶圆厂敢不敢用”. Animate bubbles aside, magnifier focus, gate enlargement, and conclusion stamp.

- [ ] **Step 2: Implement `XiaoyanRiskDomino`**

Build a full-screen domino chain from unstable equipment to yield loss, wafer contamination, and line slowdown. Animate Xiaoyan bracing the first falling domino and red propagation marks.

- [ ] **Step 3: Implement `XiaoyanValidationScroll`**

Build one continuous horizontal scroll with seven stages. Animate line growth, stage illumination, Xiaoyan walking, magnifier movement, and a final “能跑通 -> 能赚钱” distance reveal. Do not split this into repeated clips.

- [ ] **Step 4: Verify representative local times**

Preview each scene at start, midpoint, and end. Confirm titles occupy the main canvas, Xiaoyan is not an edge mascot, and no element overlaps the subtitle safe area.

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes
git commit -m "Add first semiconductor Xiaoyan canvases"
```

### Task 4: Remaining Four Full-Screen Canvases

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/barrier-scale.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/certification-tunnel.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/research-gates.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/business-proof.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/scenes-preview-b.html`

- [ ] **Step 1: Implement `XiaoyanBarrierScale`**

Animate a scale where many technical-parameter sheets lose against the two blue weights “客户认证” and “产线信任”. Xiaoyan inspects the parameters and stamps the trusted side.

- [ ] **Step 2: Implement `XiaoyanCertificationTunnel`**

Make “12-24 个月” the full-screen hero data. Animate a month ruler through test, correction, and revalidation checkpoints with the magnifier following the ruler.

- [ ] **Step 3: Implement `XiaoyanResearchGates`**

Create three sequential inspection gates for head-customer validation, repeat orders, and revenue/gross-margin realization. Xiaoyan checks evidence, ticks each gate, and lights the final pass signal.

- [ ] **Step 4: Implement `XiaoyanBusinessProof`**

Animate the “我们做出来了” idea bubble breaking into a real production line, repeated order slips, and a rising gross-margin curve. End with the magnifier centered on “毛利兑现”.

- [ ] **Step 5: Verify and commit**

Run the preview at start, midpoint, and end for all four scenes, then:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes
git commit -m "Add remaining semiconductor Xiaoyan canvases"
```

### Task 5: Root Composition, Captions, and Paper Transitions

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/index.html`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/composition.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/captions.mjs`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/paper-transition.mjs`

- [ ] **Step 1: Build the 720x1280 root composition**

Add muted A-roll video on its own track, seven canvas hosts, brand labels, a single caption layer for Xiaoyan ranges, and a registered paused timeline named `semiconductor-finished-v2`.

- [ ] **Step 2: Implement scene activation**

At time `t`, show A-roll only during `type: "aroll"` ranges. For Xiaoyan scenes, call the selected scene renderer with local time and duration. No rendered component MP4 may be embedded.

- [ ] **Step 3: Implement SRT-derived captions**

Use the existing semiconductor SRT timings. Hide generated captions during A-roll ranges because the source video already contains burned-in subtitles. Show captions only during Xiaoyan ranges.

- [ ] **Step 4: Implement paper-cover transitions**

At every A-roll/Xiaoyan boundary, animate an off-white paper sheet for 0.35-0.55 seconds. The first sketch line of the incoming scene must begin while the paper is still completing its cover.

- [ ] **Step 5: Validate**

Run:

```bash
npx hyperframes lint industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
npx hyperframes inspect --samples 12 --json industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
```

Expected: zero errors and zero warnings.

- [ ] **Step 6: Commit**

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
git commit -m "Assemble semiconductor Xiaoyan finished composition"
```

### Task 6: Render Automation and Finished Output

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/render-semiconductor-finished-v2.mjs`
- Modify: `industry7view-card-lab/package.json`
- Create: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/README.md`

- [ ] **Step 1: Add the render command**

Add:

```json
"xiaoyan:semiconductor:v2": "node xiaoyan/scripts/render-semiconductor-finished-v2.mjs"
```

- [ ] **Step 2: Implement media preparation**

The script must:

1. Accept the A-roll path or use the known default.
2. Re-encode the visual source to 720x1280, 30fps, GOP 30.
3. Copy prepared media into the HyperFrames project media directory.
4. Validate scene timing before rendering.

- [ ] **Step 3: Implement rendering and audio mux**

Run HyperFrames draft render to create a visual MP4, then mux the original A-roll AAC audio into:

`/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-finished-v2/semiconductor-equipment-xiaoyan-v2.mp4`

- [ ] **Step 4: Export QA artifacts**

Export PNG frames at 2, 8, 16, 25, 40, 51, 58, 65, 73, 81, and 87 seconds, plus a JSON ffprobe report and render report.

- [ ] **Step 5: Run the complete render**

Run:

```bash
cd industry7view-card-lab
npm run xiaoyan:semiconductor:v2
```

Expected: final 720x1280, 30fps, 90.2-second MP4 with AAC audio and all QA artifacts.

- [ ] **Step 6: Visually inspect all QA frames**

Confirm full-screen scale, Xiaoyan presence, no clipped text, no duplicate subtitles, paper transitions, and the final gross-margin focus.

- [ ] **Step 7: Commit**

```bash
git add industry7view-card-lab/package.json industry7view-card-lab/xiaoyan/scripts/render-semiconductor-finished-v2.mjs industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/README.md
git commit -m "Add semiconductor Xiaoyan v2 render workflow"
```

### Task 7: Final Validation and Documentation

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/README.md`

- [ ] **Step 1: Run all focused checks**

```bash
node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs
npx hyperframes lint industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
npx hyperframes inspect --samples 12 --json industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
```

Expected: all pass.

- [ ] **Step 2: Verify the final media**

Use ffprobe to confirm:

- H.264 video.
- 720x1280.
- 30fps.
- 90.2-second duration.
- AAC stereo audio.

- [ ] **Step 3: Document reuse boundaries**

Document that the seven scene modules are the first validated full-screen Xiaoyan canvas set. Future scripts should reuse the primitives and scene contract, while new metaphors receive new scene modules rather than forcing content into old card templates.

- [ ] **Step 4: Commit**

```bash
git add industry7view-card-lab/xiaoyan/README.md
git commit -m "Document Xiaoyan full-screen finished workflow"
```
