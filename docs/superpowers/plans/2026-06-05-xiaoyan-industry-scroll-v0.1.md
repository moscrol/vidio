# XiaoyanIndustryScroll v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Xiaoyan hand-drawn industry-chain scroll component with commercial aerospace and semiconductor equipment props, render automation, and verification reports.

**Architecture:** Follow the existing Xiaoyan component structure. The component is a standalone HyperFrames HTML composition with embedded props. A Node render script injects props, serves the composition, captures preview, renders MP4, validates with ffprobe, and writes a report.

**Tech Stack:** HTML/CSS/SVG, self-contained JavaScript timeline, HyperFrames CLI, Node.js ESM, Playwright, ffprobe.

---

## File Structure

```text
industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/
  index.html
  sample-props.json
  semi-props.json
  README.md

industry7view-card-lab/xiaoyan/scripts/
  render-xiaoyan-industry-scroll.mjs

industry7view-card-lab/package.json
  scripts.xiaoyan:industry-scroll
```

## Task 1: Add Fixtures

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/sample-props.json`
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/semi-props.json`
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/README.md`

- [ ] **Step 1: Add commercial aerospace props**

Use the props from the design spec with id `industry-scroll-space`.

- [ ] **Step 2: Add semiconductor props**

Use the props from the design spec with id `industry-scroll-semi`.

- [ ] **Step 3: Add README**

Document purpose, render commands, props shape, and QA:

```text
Reads as scroll/map, not pipe or validation gates.
Xiaoyan stays flat and holds magnifier.
Highlight node must be visually distinct.
```

- [ ] **Step 4: Commit**

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll
git commit -m "Add XiaoyanIndustryScroll props fixtures"
```

## Task 2: Build Composition

**Files:**
- Create: `industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/index.html`

- [ ] **Step 1: Add shell**

Use `data-composition-id="xiaoyan-industry-scroll"`, 1080x1920, default duration 8.

- [ ] **Step 2: Render props**

Render `topic`, `title`, `nodes`, `highlightNode`, `blueNote`, `redNote`, and `footer`.

- [ ] **Step 3: Visual system**

Create:

```text
Warm paper canvas.
Horizontal parchment scroll across the center.
4-6 pinned nodes on the scroll.
Blue direction path.
Red wrong-focus note.
Highlighted node with green or blue circle.
Flat Xiaoyan with magnifier near lower-left.
```

- [ ] **Step 4: Add self-contained timeline**

Expose:

```js
window.__timelines["xiaoyan-industry-scroll"] = timeline;
```

Do not load CDN scripts.

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/index.html
git commit -m "Add XiaoyanIndustryScroll composition"
```

## Task 3: Add Render Automation

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs`
- Modify: `industry7view-card-lab/package.json`

- [ ] **Step 1: Copy ValidationChain renderer**

Change constants to:

```js
const DEFAULT_PROPS_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanIndustryScroll/sample-props.json",
);
const COMPONENT_INDEX_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanIndustryScroll/index.html",
);
const TIMELINE_ID = "xiaoyan-industry-scroll";
```

- [ ] **Step 2: Validate props**

Check:

```text
id path-safe
topic/title non-empty
nodes length 4-6
node.label non-empty
highlightNode matches a node label when present
durationSeconds 6-10 when provided
```

- [ ] **Step 3: Add package script**

```json
"xiaoyan:industry-scroll": "node xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs industry7view-card-lab/package.json
git commit -m "Add XiaoyanIndustryScroll render automation"
```

## Task 4: Render And Verify

**Files:**
- Generated only: `industry7view-card-lab/xiaoyan/renders/industry-scroll-space/`
- Generated only: `industry7view-card-lab/xiaoyan/renders/industry-scroll-semi/`

- [ ] **Step 1: Render default**

```bash
cd industry7view-card-lab
npm run xiaoyan:industry-scroll
```

- [ ] **Step 2: Render semiconductor sample**

```bash
node xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs xiaoyan/components/XiaoyanIndustryScroll/semi-props.json
```

- [ ] **Step 3: Verify reports**

Expected ffprobe:

```text
width=1080
height=1920
r_frame_rate=30/1
duration=8.000000
```

- [ ] **Step 4: Copy outputs**

Copy MP4, preview, and report into:

```text
outputs/xiaoyan-industry-scroll-v0.1/space/
outputs/xiaoyan-industry-scroll-v0.1/semi/
```

## Task 5: Update Docs

**Files:**
- Modify: `industry7view-card-lab/XIAOYAN_COMPONENT_LIBRARY.md`
- Modify: `industry7view-card-lab/XIAOYAN_SCRIPT_COMPONENT_AUDIT.md`

- [ ] **Step 1: Register v0.1**

Mark `XiaoyanIndustryScroll` as v0.1 implemented and link outputs.

- [ ] **Step 2: Commit docs**

```bash
git add industry7view-card-lab/XIAOYAN_COMPONENT_LIBRARY.md industry7view-card-lab/XIAOYAN_SCRIPT_COMPONENT_AUDIT.md
git commit -m "Document XiaoyanIndustryScroll v0.1"
```

## Self-Review

```text
Spec coverage: component, fixtures, rendering, verification, docs.
Placeholder scan: no open-ended implementation placeholders.
Type consistency: props match design spec.
```

