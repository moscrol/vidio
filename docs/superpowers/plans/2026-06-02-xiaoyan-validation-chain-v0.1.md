# XiaoyanValidationChain v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Xiaoyan hand-drawn validation-chain HyperFrames component with semiconductor and humanoid robot props, render automation, and verification reports.

**Architecture:** Follow the existing `XiaoyanProfitPipe` structure. The component is a standalone HyperFrames HTML composition that reads embedded JSON props. A Node render script injects props, captures preview, renders MP4 via HyperFrames, validates metadata with `ffprobe`, and writes a report.

**Tech Stack:** HTML/CSS/SVG, GSAP, HyperFrames CLI, Node.js ESM, Playwright, ffprobe.

---

## File Structure

```text
industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/
  index.html              # standalone HyperFrames composition
  sample-props.json       # semiconductor equipment default props
  robot-props.json        # humanoid robot alternate props
  README.md               # usage, props, visual QA

industry7view-card-lab/xiaoyan/scripts/
  render-xiaoyan-validation-chain.mjs

industry7view-card-lab/package.json
  scripts.xiaoyan:validation-chain
```

## Task 1: Add Component Fixtures

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/sample-props.json`
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/robot-props.json`
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/README.md`

- [ ] **Step 1: Create semiconductor props**

Use this exact JSON:

```json
{
  "id": "validation-chain-semi",
  "topic": "半导体设备",
  "title": "从样机到订单",
  "stages": [
    {"label": "样机", "state": "done"},
    {"label": "客户验证", "state": "current"},
    {"label": "小批量导入", "state": "next"},
    {"label": "长期跑产", "state": "risk"},
    {"label": "批量订单", "state": "next"}
  ],
  "riskStage": "长期跑产",
  "finalProof": "收入和毛利兑现",
  "blueNote": "看验证进度",
  "redNote": "卡在产线信任",
  "footer": "真正的国产化，在产线和订单里。",
  "durationSeconds": 8
}
```

- [ ] **Step 2: Create humanoid robot props**

Use this exact JSON:

```json
{
  "id": "validation-chain-robot",
  "topic": "人形机器人",
  "title": "从 Demo 到产品",
  "stages": [
    {"label": "Demo", "state": "done"},
    {"label": "进工厂", "state": "current"},
    {"label": "稳定干活", "state": "risk"},
    {"label": "客户验收", "state": "next"},
    {"label": "批量付费", "state": "next"}
  ],
  "riskStage": "稳定干活",
  "finalProof": "客户愿意付钱",
  "blueNote": "不是动作炫技",
  "redNote": "死亡谷在稳定性",
  "footer": "会跳舞的是样品，能干活不坏的才是产品。",
  "durationSeconds": 8
}
```

- [ ] **Step 3: Add README**

Document:

```text
Purpose: explains validation progress from prototype/demo to customer trust and commercial proof.
Default render: npm run xiaoyan:validation-chain.
Alternate render: node xiaoyan/scripts/render-xiaoyan-validation-chain.mjs xiaoyan/components/XiaoyanValidationChain/robot-props.json.
QA: Xiaoyan must remain flat, hold magnifier, and the component must read as a stage chain rather than a business loop.
```

- [ ] **Step 4: Commit fixtures**

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain
git commit -m "Add XiaoyanValidationChain props fixtures"
```

## Task 2: Build HyperFrames Composition

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/index.html`

- [ ] **Step 1: Create HTML shell**

Include:

```html
<div
  id="xiaoyan-validation-chain"
  data-composition-id="xiaoyan-validation-chain"
  data-width="1080"
  data-height="1920"
  data-duration="8"
  data-start="0"
  data-track-index="0"
>
```

- [ ] **Step 2: Add props script block**

Include a default JSON block with semiconductor props:

```html
<script type="application/json" id="xiaoyan-props">
{
  "id": "validation-chain-semi",
  "topic": "半导体设备",
  "title": "从样机到订单",
  "stages": [
    {"label": "样机", "state": "done"},
    {"label": "客户验证", "state": "current"},
    {"label": "小批量导入", "state": "next"},
    {"label": "长期跑产", "state": "risk"},
    {"label": "批量订单", "state": "next"}
  ],
  "riskStage": "长期跑产",
  "finalProof": "收入和毛利兑现",
  "blueNote": "看验证进度",
  "redNote": "卡在产线信任",
  "footer": "真正的国产化，在产线和订单里。",
  "durationSeconds": 8
}
</script>
```

- [ ] **Step 3: Render props into DOM**

Implement a small script that:

```js
const props = JSON.parse(document.getElementById("xiaoyan-props").textContent);
document.querySelector("[data-prop='topic']").textContent = props.topic;
document.querySelector("[data-prop='title']").textContent = props.title;
document.querySelector("[data-prop='footer']").textContent = props.footer || "";
```

For stages, create one `.stage` element per stage with `data-state` and `data-label`.

- [ ] **Step 4: Draw visual system**

Use SVG/CSS to create:

```text
1. Warm paper canvas.
2. Brand tag at top-left.
3. Hand-written title near top.
4. Five stage gates across the center.
5. A hand-drawn path line through the gates.
6. Flat Xiaoyan stick figure holding magnifier.
7. Blue note near the current stage.
8. Red note targeting riskStage.
9. Final proof node at the end.
```

- [ ] **Step 5: Add GSAP timeline**

Expose the timeline:

```js
window.__timelines = window.__timelines || {};
window.__timelines["xiaoyan-validation-chain"] = tl;
```

Animation order:

```text
0.0-0.8s: title and paper marks appear.
0.8-1.5s: Xiaoyan enters.
1.5-4.2s: stages draw in with stagger.
4.2-5.6s: magnifier scans riskStage and red note appears.
5.6-7.0s: final proof lights up.
7.0-8.0s: footer appears and hold.
```

- [ ] **Step 6: Commit composition**

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/index.html
git commit -m "Add XiaoyanValidationChain composition"
```

## Task 3: Add Render Automation

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-validation-chain.mjs`
- Modify: `industry7view-card-lab/package.json`

- [ ] **Step 1: Copy proven renderer structure**

Base the script on `render-xiaoyan-profit-pipe.mjs`, changing constants:

```js
const DEFAULT_PROPS_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanValidationChain/sample-props.json",
);
const COMPONENT_INDEX_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanValidationChain/index.html",
);
const TIMELINE_ID = "xiaoyan-validation-chain";
```

- [ ] **Step 2: Validate props**

Implement validation:

```js
if (!Array.isArray(props.stages) || props.stages.length < 4 || props.stages.length > 6) {
  errors.push("props.stages must contain 4-6 stages");
}
for (const stage of props.stages || []) {
  if (typeof stage.label !== "string" || stage.label.trim() === "") {
    errors.push("each stage.label must be a non-empty string");
  }
  if (!["done", "current", "next", "risk"].includes(stage.state)) {
    errors.push(`invalid stage.state for ${stage.label || "(missing label)"}`);
  }
}
if (props.riskStage && !props.stages.some((stage) => stage.label === props.riskStage)) {
  errors.push("props.riskStage must match one stage.label");
}
```

- [ ] **Step 3: Add package script**

Add:

```json
"xiaoyan:validation-chain": "node xiaoyan/scripts/render-xiaoyan-validation-chain.mjs"
```

- [ ] **Step 4: Commit automation**

```bash
git add industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-validation-chain.mjs industry7view-card-lab/package.json
git commit -m "Add XiaoyanValidationChain render automation"
```

## Task 4: Render And Verify

**Files:**
- Generated only, do not commit: `industry7view-card-lab/xiaoyan/renders/validation-chain-semi/`
- Generated only, do not commit: `industry7view-card-lab/xiaoyan/renders/validation-chain-robot/`

- [ ] **Step 1: Render semiconductor sample**

```bash
cd industry7view-card-lab
npm run xiaoyan:validation-chain
```

Expected:

```text
xiaoyan/renders/validation-chain-semi/xiaoyan-validation-chain.mp4
xiaoyan/renders/validation-chain-semi/preview.png
xiaoyan/renders/validation-chain-semi/render-report.md
```

- [ ] **Step 2: Render robot sample**

```bash
cd industry7view-card-lab
node xiaoyan/scripts/render-xiaoyan-validation-chain.mjs xiaoyan/components/XiaoyanValidationChain/robot-props.json
```

Expected:

```text
xiaoyan/renders/validation-chain-robot/xiaoyan-validation-chain.mp4
xiaoyan/renders/validation-chain-robot/preview.png
xiaoyan/renders/validation-chain-robot/render-report.md
```

- [ ] **Step 3: Verify reports**

Each `render-report.md` must include successful HyperFrames render and ffprobe metadata:

```text
width=1080
height=1920
r_frame_rate=30/1
duration=8.000000
```

- [ ] **Step 4: Copy user-facing outputs**

```bash
mkdir -p ../../outputs/xiaoyan-validation-chain-v0.1/semi ../../outputs/xiaoyan-validation-chain-v0.1/robot
cp xiaoyan/renders/validation-chain-semi/xiaoyan-validation-chain.mp4 ../../outputs/xiaoyan-validation-chain-v0.1/semi/
cp xiaoyan/renders/validation-chain-semi/preview.png ../../outputs/xiaoyan-validation-chain-v0.1/semi/
cp xiaoyan/renders/validation-chain-semi/render-report.md ../../outputs/xiaoyan-validation-chain-v0.1/semi/
cp xiaoyan/renders/validation-chain-robot/xiaoyan-validation-chain.mp4 ../../outputs/xiaoyan-validation-chain-v0.1/robot/
cp xiaoyan/renders/validation-chain-robot/preview.png ../../outputs/xiaoyan-validation-chain-v0.1/robot/
cp xiaoyan/renders/validation-chain-robot/render-report.md ../../outputs/xiaoyan-validation-chain-v0.1/robot/
```

- [ ] **Step 5: Commit only source files**

Do not commit render outputs. Check:

```bash
git status --short
```

Expected untracked render directories are allowed:

```text
?? industry7view-card-lab/xiaoyan/renders/validation-chain-semi/
?? industry7view-card-lab/xiaoyan/renders/validation-chain-robot/
```

## Task 5: Update Documentation

**Files:**
- Modify: `industry7view-card-lab/XIAOYAN_COMPONENT_LIBRARY.md`
- Modify: `industry7view-card-lab/XIAOYAN_SCRIPT_COMPONENT_AUDIT.md`

- [ ] **Step 1: Register v0.1 implementation**

Update `XIAOYAN_COMPONENT_LIBRARY.md`:

```text
XiaoyanValidationChain: v0.1 已代码化并通过半导体设备、人形机器人双 props 渲染。
```

- [ ] **Step 2: Add output paths**

Add paths:

```text
outputs/xiaoyan-validation-chain-v0.1/semi/xiaoyan-validation-chain.mp4
outputs/xiaoyan-validation-chain-v0.1/robot/xiaoyan-validation-chain.mp4
```

- [ ] **Step 3: Commit docs**

```bash
git add industry7view-card-lab/XIAOYAN_COMPONENT_LIBRARY.md industry7view-card-lab/XIAOYAN_SCRIPT_COMPONENT_AUDIT.md
git commit -m "Document XiaoyanValidationChain v0.1"
```

## Self-Review

Spec coverage:

```text
The plan covers component files, two props fixtures, visual boundary, motion sequence, render automation, ffprobe verification, outputs sync, and docs registration.
```

Placeholder scan:

```text
No placeholder language is required. Every task has exact files and commands.
```

Type consistency:

```text
The props shape matches the design spec: id, topic, title, stages, riskStage, finalProof, blueNote, redNote, footer, durationSeconds.
```
