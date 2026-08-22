# Emil Motion Taste Distillation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the vendored Emil UI skills with a vidio-owned, executable motion-taste contract and prove it with an 8-second FinHot A/B sample.

**Architecture:** `vibe-motion-taste` owns video motion decisions, a JSON contract, a dependency-free linter, and the human review rubric. `vibe-director` routes video requests into that module before HyperFrames/GSAP; a separate proof project renders identical content with baseline and distilled timelines.

**Tech Stack:** Markdown agent skills, JSON Schema, Node.js 22 (`node:test`), HTML/CSS, GSAP 3, HyperFrames CLI 0.7.33, ffmpeg.

---

## File map

- `.agents/skills/vibe-motion-taste/SKILL.md`: public workflow and routing contract for motion decisions.
- `.agents/skills/vibe-motion-taste/references/motion-language.md`: UI-to-video translation, timing bands, curves, and vocabulary.
- `.agents/skills/vibe-motion-taste/references/review-rubric.md`: human `BLOCK` / `APPROVE` review.
- `.agents/skills/vibe-motion-taste/schemas/motion-contract.schema.json`: machine-readable contract shape.
- `.agents/skills/vibe-motion-taste/templates/motion-contract.json`: valid starting contract.
- `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs`: dependency-free contract checker and CLI.
- `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs`: Node unit tests for hard errors and warnings.
- `.agents/skills/vibe-director/SKILL.md`: restored eight-lane router and sample/QC gates.
- `.agents/skills/vibe-director/templates/brief.md`: project state contract.
- `.agents/skills/vibe-director/templates/manifest.json`: reusable library component contract.
- `docs/sources/emilkowalski-skills.md`: provenance, selected concepts, exclusions, and refresh workflow.
- `third_party/licenses/emilkowalski-skills-MIT.txt`: upstream license notice.
- `projects/2026-08-22-finhot-motion-taste-proof/`: isolated A/B proof project.
- `AGENTS.md`, `README.md`, `.cursor/rules/vibe-motion.mdc`: route all video motion through the new module.
- `skills-lock.json`: remove Emil runtime entries because the repository no longer installs those skills.

### Task 1: Source provenance and de-vendoring

**Files:**
- Create: `docs/sources/emilkowalski-skills.md`
- Create: `third_party/licenses/emilkowalski-skills-MIT.txt`
- Delete: `.agents/skills/{animate,animate-expo,animation-vocabulary,apple-design,ask-sonner,emil-design-eng,find-animation-opportunities,improve-animations,pick-ui-library,prototype,review-animations}/`
- Delete: matching `.claude/skills/*` links
- Modify: `skills-lock.json`

- [ ] **Step 1: Record the source contract**

Write the source document with these exact facts:

```markdown
# emilkowalski/skills source record

- URL: https://github.com/emilkowalski/skills
- Audited commit: d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7
- License: MIT; preserved at `third_party/licenses/emilkowalski-skills-MIT.txt`
- Runtime dependency: none
- Refresh rule: clone the new commit in a scratch directory, diff only the seven relevant skills, update vidio-owned rules deliberately, and never copy the upstream skill tree into this repository.

Relevant: `emil-design-eng`, `animate`, `review-animations`, `find-animation-opportunities`, `improve-animations`, `animation-vocabulary`, selected spatial principles from `apple-design`.

Excluded: `animate-expo`, `ask-sonner`, `pick-ui-library`, `prototype`, `write-swift`.
```

- [ ] **Step 2: Preserve the MIT license**

Copy the upstream `LICENSE` text verbatim into `third_party/licenses/emilkowalski-skills-MIT.txt` and verify it names Emil Kowalski.

Run: `rg -n "MIT License|Emil Kowalski" third_party/licenses/emilkowalski-skills-MIT.txt`

Expected: both strings are present.

- [ ] **Step 3: Remove vendored runtime files**

Remove only the eleven directories and links added by commit `a84c0ec`. Do not remove HyperFrames skills already present on `main`.

Run:

```bash
git diff --name-only origin/main...HEAD | rg '^\.agents/skills|^\.claude/skills'
```

Expected after removal: no Emil skill body or link remains in the diff.

- [ ] **Step 4: Remove Emil entries from the lock file**

Delete the keys `animate`, `animate-expo`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `pick-ui-library`, `prototype`, and `review-animations`. Preserve all unrelated entries and valid JSON formatting.

Run:

```bash
node -e "const x=require('./skills-lock.json'); const bad=Object.values(x.skills).filter(s=>s.source==='emilkowalski/skills'); if(bad.length) process.exit(1)"
```

Expected: exit 0.

- [ ] **Step 5: Commit the source boundary**

```bash
git add docs/sources third_party/licenses skills-lock.json .agents/skills .claude/skills
git commit -m "chore: replace vendored Emil skills with source record"
```

### Task 2: Contract linter built test-first

**Files:**
- Create: `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs`
- Create: `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs`
- Create: `.agents/skills/vibe-motion-taste/schemas/motion-contract.schema.json`
- Create: `.agents/skills/vibe-motion-taste/templates/motion-contract.json`

- [ ] **Step 1: Write the failing test suite**

The test imports `lintContract` and covers a valid contract plus each required error:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { lintContract } from './lint-motion-contract.mjs';

const valid = () => ({
  version: 1,
  composition: {
    id: 'proof', fps: 30, durationFrames: 240,
    personality: 'crisp-editorial', primaryAudience: 'mobile'
  },
  beats: [{
    id: 'intro', range: [0, 72], purpose: 'orient',
    focus: 'FinHot feed',
    entry: {
      properties: ['transform', 'opacity'], easing: 'ease-out-strong',
      durationFrames: 10, fromScale: 0.95
    },
    holdFrames: 30,
    exit: { mode: 'bridge-to-next-scene' }
  }]
});

test('valid contract passes', () => {
  assert.deepEqual(lintContract(valid()), { errors: [], warnings: [] });
});

test('rejects an unknown purpose', () => {
  const c = valid(); c.beats[0].purpose = 'look-cool';
  assert.match(lintContract(c).errors[0].message, /purpose/);
});

test('rejects ease-in on entry', () => {
  const c = valid(); c.beats[0].entry.easing = 'ease-in';
  assert.match(lintContract(c).errors[0].message, /ease-in/);
});

test('rejects scale below 0.9', () => {
  const c = valid(); c.beats[0].entry.fromScale = 0;
  assert.match(lintContract(c).errors[0].message, /fromScale/);
});

test('rejects an out-of-range beat', () => {
  const c = valid(); c.beats[0].range = [0, 241];
  assert.match(lintContract(c).errors[0].message, /durationFrames/);
});

test('requires an exit or persistence', () => {
  const c = valid(); delete c.beats[0].exit;
  assert.match(lintContract(c).errors[0].message, /exit/);
});

test('warns about layout animation', () => {
  const c = valid(); c.beats[0].entry.properties.push('width');
  assert.match(lintContract(c).warnings[0].message, /layout/);
});
```

- [ ] **Step 2: Run the suite and confirm the missing module failure**

Run: `node --test .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `lint-motion-contract.mjs`.

- [ ] **Step 3: Implement the minimal linter API and CLI**

Export these stable interfaces:

```js
export const PURPOSES = new Set(['orient', 'explain', 'emphasize', 'bridge', 'confirm', 'delight']);
export function lintContract(contract) { return { errors, warnings }; }
export function formatReport(file, report) { return string; }
```

Each finding is:

```js
{ rule: 'VMT003', path: 'beats[0].entry.easing', message: 'Entry easing cannot be ease-in.' }
```

The CLI accepts one or more JSON paths, prints one report per file, and exits 1 if any report has errors. It must not require npm packages.

- [ ] **Step 4: Run tests to green**

Run: `node --test .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs`

Expected: 7 tests pass, 0 fail.

- [ ] **Step 5: Add schema and template**

The schema must require `version`, `composition`, and `beats`; constrain purpose to the six values; constrain `range` to two non-negative integers; and define entry properties, easing, duration, scale, exit, persistence, `timingReason`, and `physicalReason`.

The template must pass the linter:

```bash
node .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs \
  .agents/skills/vibe-motion-taste/templates/motion-contract.json
```

Expected: `APPROVE` and exit 0.

- [ ] **Step 6: Commit the executable contract**

```bash
git add .agents/skills/vibe-motion-taste/{scripts,schemas,templates}
git commit -m "feat: add executable video motion contract"
```

### Task 3: Write the vidio-owned skills and restore the router

**Files:**
- Create: `.agents/skills/vibe-motion-taste/SKILL.md`
- Create: `.agents/skills/vibe-motion-taste/references/motion-language.md`
- Create: `.agents/skills/vibe-motion-taste/references/review-rubric.md`
- Create: `.agents/skills/vibe-director/SKILL.md`
- Create: `.agents/skills/vibe-director/templates/brief.md`
- Create: `.agents/skills/vibe-director/templates/manifest.json`

- [ ] **Step 1: Write `vibe-motion-taste` as a deep module**

The skill must expose this sequence and no renderer implementation:

```text
read brief → reject unjustified motion → name one purpose per beat
→ choose frame band → choose path/curve → write motion-contract.json
→ lint contract → render with selected engine → human review → verdict
```

It must route readers to the language reference for construction, the linter for objective rules, and the rubric for human review. It must explicitly say UI millisecond tables are source material, not video defaults.

- [ ] **Step 2: Write the motion language reference**

Include the six purposes, 30fps timing bands, `ease-out` / `ease-in-out` / `linear` rules, spatial continuity, settle/hold requirements, one-primary-focus rule, Anti-PPT guidance, and the source-to-video translation table from the design spec.

- [ ] **Step 3: Write the review rubric**

Require one table with `Time`, `Finding`, `Evidence`, `Fix`, followed by a `BLOCK` or `APPROVE` verdict. Review at 1× mobile size, 0.25× slow motion, and matching keyframes.

- [ ] **Step 4: Restore `vibe-director`**

The router must implement the eight routes already promised in `README.md`, require `vibe-motion-taste` for motion-bearing routes, preserve paid-API confirmation, create projects under `projects/<YYYY-MM-DD>-<slug>/`, and require QC before library promotion.

- [ ] **Step 5: Add valid templates**

`brief.md` must include status, form, platform, ratio, duration, engine, voice, audience, facts, constraints, project paths, and acceptance. `manifest.json` must include name, category, source project, specs, parameters, files, and reuse instructions.

- [ ] **Step 6: Run structural checks**

Run:

```bash
test -f .agents/skills/vibe-director/SKILL.md
test -f .agents/skills/vibe-director/templates/brief.md
test -f .agents/skills/vibe-director/templates/manifest.json
test -f .agents/skills/vibe-motion-taste/SKILL.md
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit the routing layer**

```bash
git add .agents/skills/vibe-director .agents/skills/vibe-motion-taste
git commit -m "feat: distill motion taste into vidio routing"
```

### Task 4: Align repository instructions

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `.cursor/rules/vibe-motion.mdc`

- [ ] **Step 1: Replace direct upstream runtime routing**

All three files must state:

```text
vibe-director → vibe-motion-taste → motion-contract.json → renderer → hybrid QC
```

Keep the upstream source link as attribution, but remove language that tells agents to load `emil-design-eng`, `animate`, or `review-animations` directly.

- [ ] **Step 2: Document local Gitea and restoration**

README must identify `http://localhost:3300/a77/vidio` as the repository home for this workspace and explain that external source records are documentation, not installable runtime dependencies.

- [ ] **Step 3: Check for broken or contradictory routes**

Run:

```bash
rg -n 'emil-design-eng|review-animations|animate-expo' AGENTS.md README.md .cursor/rules/vibe-motion.mdc
rg -n 'vibe-motion-taste|motion-contract' AGENTS.md README.md .cursor/rules/vibe-motion.mdc
```

Expected: the first command shows source history only if explicitly labeled non-runtime; the second shows active routing in all three files.

- [ ] **Step 4: Commit instruction alignment**

```bash
git add AGENTS.md README.md .cursor/rules/vibe-motion.mdc
git commit -m "docs: route vidio motion through its own taste layer"
```

### Task 5: Build the 8-second FinHot A/B proof

**Files:**
- Create: `projects/2026-08-22-finhot-motion-taste-proof/brief.md`
- Create: `projects/2026-08-22-finhot-motion-taste-proof/assets/{d-feed.png,m-feed.png}`
- Create: `projects/2026-08-22-finhot-motion-taste-proof/{baseline,distilled}/{index.html,hyperframes.json,meta.json,package.json,motion-contract.json}`

- [ ] **Step 1: Create the proof brief**

Set `status: 制作中`, `form: 动效样片`, `ratio: "9:16"`, `duration_target_s: 8`, `engine: hyperframes`, `voice: none`, and acceptance requiring identical content/assets/duration across A/B.

- [ ] **Step 2: Copy only the two existing real-UI assets**

Source:

```text
projects/2026-08-13-finance-agent-promo/工程/finhot-demo/assets/d-feed.png
projects/2026-08-13-finance-agent-promo/工程/finhot-demo/assets/m-feed.png
```

Destination: the proof project's shared `assets/` directory. Do not modify the source project.

- [ ] **Step 3: Build the baseline composition**

Use the existing FinHot layout and copy, set `data-duration="8"`, and preserve the legacy motion grammar:

```js
tl.fromTo('#shotwrap',
  { y: 140, rotateX: 12, rotateY: -10, scale: 0.72, opacity: 0 },
  { y: 0, rotateX: 8, rotateY: -7, scale: 0.78, opacity: 1,
    duration: 0.55, ease: 'power3.out' }, 0.05);
chips.forEach((selector, index) => {
  tl.fromTo(selector,
    { y: 40, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.34, ease: 'back.out(2)' },
    0.6 + index * 0.14);
});
```

Scale the first scene to 0–4s and the second to 4–8s. The baseline contract must be valid but warn about concurrent high-salience motion and unjustified back easing.

- [ ] **Step 4: Build the distilled composition**

Keep markup, text, assets, palette, and 8-second duration equal. Change only motion carriers and timeline:

```js
tl.fromTo('#shotwrap',
  { y: 64, rotateX: 9, rotateY: -8, scale: 0.76, opacity: 0 },
  { y: 0, rotateX: 8, rotateY: -7, scale: 0.78, opacity: 1,
    duration: 0.4, ease: 'power3.out' }, 0.1);
chips.forEach((selector, index) => {
  tl.fromTo(selector,
    { x: -24, opacity: 0, scale: 0.96 },
    { x: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
    0.75 + index * 0.1);
});
tl.to('#shotwrap', { scale: 0.82, duration: 1.4, ease: 'sine.inOut' }, 1.5);
tl.to('#shotwrap', { scale: 0.82, duration: 0.8, ease: 'none' }, 2.9);
```

Bridge at 3.7–4.2s with a feed-highlight carrier, settle the mobile shot by 5.4s, reveal the score and copy sequentially, and hold the final readable state for at least 1.2s.

- [ ] **Step 5: Lint both contracts**

Run:

```bash
node .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs \
  projects/2026-08-22-finhot-motion-taste-proof/baseline/motion-contract.json \
  projects/2026-08-22-finhot-motion-taste-proof/distilled/motion-contract.json
```

Expected: both have 0 errors; baseline has warnings; distilled reports `APPROVE`.

- [ ] **Step 6: Run HyperFrames checks**

For each composition run its package `check` command.

Expected: lint, validate, and inspect exit 0.

- [ ] **Step 7: Commit the proof sources**

```bash
git add projects/2026-08-22-finhot-motion-taste-proof
git commit -m "feat: add FinHot motion taste A-B proof"
```

### Task 6: Render and review the proof

**Files:**
- Create: `projects/2026-08-22-finhot-motion-taste-proof/质检/QC.md`
- Create: eight representative PNG frames and one comparison board under the same `质检/` directory
- Create outside Git: two mp4 files under the task `outputs/` directory

- [ ] **Step 1: Render both compositions**

Run the HyperFrames render command from each composition directory and write baseline/distilled mp4 files to the task output directory.

Expected: both are 1080×1920, 30fps, 8.0s, H.264, and silent.

- [ ] **Step 2: Verify media metadata**

Run `ffprobe` with JSON output for both files.

Expected: width 1080, height 1920, average frame rate 30/1, duration within 7.95–8.05 seconds, and no audio stream.

- [ ] **Step 3: Extract matching keyframes**

Extract 1.0s, 3.8s, 5.2s, and 7.2s from each video. Build a 2×4 comparison board with baseline on top and distilled below.

- [ ] **Step 4: Write the human verdict**

Use the rubric table:

```markdown
| Time | Finding | Evidence | Fix |
| --- | --- | --- | --- |
```

Record baseline warnings and distilled evidence for single focus, settle, legibility, causal bridge, and motion personality. Close with `APPROVE` only if no blocking issue remains.

- [ ] **Step 5: Re-run after any fix**

Every visual fix requires contract lint, HyperFrames check, re-render, and replacement of the affected matching frame. Do not retain stale evidence.

- [ ] **Step 6: Commit review evidence**

```bash
git add projects/2026-08-22-finhot-motion-taste-proof/质检
git commit -m "test: verify distilled FinHot motion sample"
```

### Task 7: Final repository verification and Gitea handoff

**Files:**
- Modify only if verification finds a scoped defect.

- [ ] **Step 1: Run all new tests and linters**

```bash
node --test .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs
node .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs \
  .agents/skills/vibe-motion-taste/templates/motion-contract.json \
  projects/2026-08-22-finhot-motion-taste-proof/baseline/motion-contract.json \
  projects/2026-08-22-finhot-motion-taste-proof/distilled/motion-contract.json
git diff --check origin/main...HEAD
```

Expected: tests pass, no contract errors, and no whitespace errors.

- [ ] **Step 2: Verify the de-vendor boundary**

```bash
git diff --name-only origin/main...HEAD | rg '^\.agents/skills/(animate|animate-expo|animation-vocabulary|apple-design|ask-sonner|emil-design-eng|find-animation-opportunities|improve-animations|pick-ui-library|prototype|review-animations)/' && exit 1 || true
```

Expected: no tracked upstream body files.

- [ ] **Step 3: Review branch diff and status**

Run: `git status --short --branch` and `git diff --stat origin/main...HEAD`.

Expected: clean worktree; only scoped distillation, routing, proof, and documentation changes.

- [ ] **Step 4: Push to local Gitea**

Run: `git push origin feat/emilkowalski-skills`

Expected: push succeeds to `http://127.0.0.1:3300/a77/vidio.git` without rewriting history.

- [ ] **Step 5: Record durable local memory**

Append the branch, final commit, verification commands, output paths, and any remaining non-blocking warnings to `~/.codex/leila-memory.md`. Do not store credentials or environment secrets.
