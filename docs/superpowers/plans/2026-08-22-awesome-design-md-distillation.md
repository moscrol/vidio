# Awesome DESIGN.md Visual Taste Distillation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `skill-creator` for the skill scaffold and validation, `writing-for-agents` for agent-facing instructions, and test-first development for the contract linter.

**Goal:** Distill `VoltAgent/awesome-design-md` into a Vidio-owned visual-taste layer that produces project-level `DESIGN.md` and `visual-contract.json`, enforces them with a dependency-free linter, and proves the value with a controlled FinHot static A/B comparison.

**Architecture:** `vibe-director` routes static visual decisions to `vibe-visual-taste`; the new skill emits human-readable intent plus a machine-readable visual contract. The visual contract is linted before rendering. Motion work then passes to `vibe-motion-taste`, keeping visual hierarchy and temporal behavior as separate contracts.

**Tech Stack:** Markdown, JSON Schema, Node.js standard library, HTML/CSS, headless Chrome, ffmpeg, Git.

---

## Task 1: Record the upstream source and legal boundary

**Files:**

- Create: `docs/sources/voltagent-awesome-design-md.md`
- Create: `third_party/licenses/voltagent-awesome-design-md-MIT.txt`

- [ ] **Step 1: Add the fixed source record**

Record repository URL, audited commit `8147538b4226ae41e2487a9179e3bcc1f68e8554`, audit date, measured tree facts, extracted method, excluded brand assets, and update procedure. Explicitly state that no upstream corpus is a runtime dependency.

- [ ] **Step 2: Add the upstream MIT text**

Copy the license from the fixed audited commit and retain its copyright notice.

- [ ] **Step 3: Verify the records**

Run:

```bash
rg -n "8147538b4226ae41e2487a9179e3bcc1f68e8554|method-only|runtime" docs/sources/voltagent-awesome-design-md.md
rg -n "MIT License|VoltAgent" third_party/licenses/voltagent-awesome-design-md-MIT.txt
```

Expected: both records contain the fixed provenance and legal boundary.

- [ ] **Step 4: Commit**

```bash
git add docs/sources/voltagent-awesome-design-md.md third_party/licenses/voltagent-awesome-design-md-MIT.txt
git commit -m "docs: record awesome design md source"
```

## Task 2: Scaffold the Vidio-owned visual-taste skill

**Files:**

- Create: `.agents/skills/vibe-visual-taste/SKILL.md`
- Create: `.agents/skills/vibe-visual-taste/agents/openai.yaml`
- Create: `.agents/skills/vibe-visual-taste/references/visual-language.md`
- Create: `.agents/skills/vibe-visual-taste/references/review-rubric.md`
- Create: `.agents/skills/vibe-visual-taste/schemas/visual-contract.schema.json`
- Create: `.agents/skills/vibe-visual-taste/templates/DESIGN.md`
- Create: `.agents/skills/vibe-visual-taste/templates/visual-contract.json`
- Create: `.claude/skills/vibe-visual-taste` (symlink)

- [ ] **Step 1: Use the official scaffold script**

Run:

```bash
python /Users/a77/.codex/skills/.system/skill-creator/scripts/init_skill.py vibe-visual-taste \
  --path .agents/skills \
  --resources scripts,references \
  --interface display_name="Vibe Visual Taste" \
  --interface short_description="Turn visual intent into enforceable design contracts" \
  --interface default_prompt="Use \$vibe-visual-taste to define and validate this project's visual system before rendering."
```

Expected: the skill directory and interface metadata are created once.

- [ ] **Step 2: Replace scaffold prose with the operational workflow**

`SKILL.md` must define triggers, the intent-first sequence, artifact ownership, hard-gate behavior, renderer handoff, and static QC. Keep the main file short and route detail to references.

- [ ] **Step 3: Add the method and review references**

Describe semantic roles, one distinctive move, focal-budget discipline, media evidence handling, non-imitation rules, and 1x/thumbnail/grayscale/safe-area review.

- [ ] **Step 4: Add schema and templates**

The JSON template is the numeric source of truth. The Markdown template explains intent and trade-offs without duplicating color, size, or spacing values.

- [ ] **Step 5: Add Claude discovery symlink**

Run:

```bash
ln -s ../../.agents/skills/vibe-visual-taste .claude/skills/vibe-visual-taste
```

Expected: both agents discover one canonical skill implementation.

## Task 3: Build the visual-contract linter test-first

**Files:**

- Create: `.agents/skills/vibe-visual-taste/scripts/lint-visual-contract.test.mjs`
- Create: `.agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs`

- [ ] **Step 1: Write failing tests**

Cover a valid contract plus `VVT001`–`VVT008` errors and `VVT101`–`VVT106` warnings. Tests invoke the CLI in temporary directories and assert exit status and stable diagnostic codes.

- [ ] **Step 2: Run tests and confirm RED**

Run:

```bash
node --test .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.test.mjs
```

Expected: failure because the linter is not implemented.

- [ ] **Step 3: Implement the dependency-free linter**

Use only Node standard modules. Validate both files, JSON shape, semantic colors, WCAG contrast, type sizes relative to a 1080-wide canvas, brand-imitation controls, safe area, reading order, component purpose, do/avoid rules, and warning budgets.

- [ ] **Step 4: Run tests and confirm GREEN**

Run the same command.

Expected: all tests pass.

- [ ] **Step 5: Validate the production template**

Run:

```bash
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  .agents/skills/vibe-visual-taste/templates
```

Expected: `0 error(s), 0 warning(s)`.

- [ ] **Step 6: Validate the skill package**

Run:

```bash
python /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-visual-taste
```

Expected: validation succeeds.

- [ ] **Step 7: Commit**

```bash
git add .agents/skills/vibe-visual-taste .claude/skills/vibe-visual-taste
git commit -m "feat: add visual taste contract skill"
```

## Task 4: Integrate visual taste into Vidio routing

**Files:**

- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `.cursor/rules/vibe-motion.mdc`
- Modify: `.agents/skills/vibe-director/SKILL.md`
- Modify: `.claude/skills/stitch-to-video/SKILL.md`
- Modify: `studio/server.mjs`
- Modify: `industry7view-card-lab/VIDEO_DESIGN.md`
- Modify: `docs/system/industry7view-video-system-design.md`

- [ ] **Step 1: Update the canonical workflow**

Document `vibe-director -> vibe-visual-taste -> vibe-motion-taste -> renderer -> QC`, and distinguish static visual ownership from motion ownership.

- [ ] **Step 2: Update renderer-facing instructions**

Require Stitch and other renderers to consume an existing visual contract. Remove canned brand-style defaults and topic-to-color stereotypes.

- [ ] **Step 3: Update studio lane suggestions**

Add `vibe-visual-taste` to cover, promo, and motion-related routes without changing unrelated lane behavior.

- [ ] **Step 4: Update Industry 7View docs**

Map existing brand tokens to the new project-level artifacts and state which file owns numeric values.

- [ ] **Step 5: Run focused checks**

```bash
node --check studio/server.mjs
rg -n "vibe-visual-taste|visual-contract.json" \
  AGENTS.md README.md .cursor/rules/vibe-motion.mdc \
  .agents/skills/vibe-director/SKILL.md \
  .claude/skills/stitch-to-video/SKILL.md \
  industry7view-card-lab/VIDEO_DESIGN.md \
  docs/system/industry7view-video-system-design.md studio/server.mjs
```

Expected: JavaScript syntax passes and each routed surface names the new contract.

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md README.md .cursor/rules/vibe-motion.mdc \
  .agents/skills/vibe-director/SKILL.md \
  .claude/skills/stitch-to-video/SKILL.md studio/server.mjs \
  industry7view-card-lab/VIDEO_DESIGN.md \
  docs/system/industry7view-video-system-design.md
git commit -m "docs: route visual taste before motion"
```

## Task 5: Build the controlled FinHot A/B proof

**Files:**

- Create: `projects/2026-08-22-finhot-visual-taste-proof/README.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/brief.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/baseline/DESIGN.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/baseline/visual-contract.json`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/baseline/index.html`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/distilled/DESIGN.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/distilled/visual-contract.json`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/distilled/index.html`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/质检/QC.md`
- Copy: `projects/2026-08-22-finhot-visual-taste-proof/assets/d-feed.png`
- Copy: `projects/2026-08-22-finhot-visual-taste-proof/assets/fonts/*`

- [ ] **Step 1: Freeze content and experiment controls**

Use the same real FinHot screenshot, headline, three evidence points, source, disclaimer, and 1080x1920 canvas in both variants.

- [ ] **Step 2: Implement the generic baseline**

Keep zero hard errors while deliberately encoding the common AI-SaaS warning pattern: font overload, accent overuse, competing focal elements, too many effects, and too many radii.

- [ ] **Step 3: Implement the distilled research-desk system**

Use paper white, ink navy, one evidence-gold accent, a single evidence rail, explicit hierarchy, and one focal element. It must produce no warnings.

- [ ] **Step 4: Lint both variants**

```bash
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/baseline
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/distilled
```

Expected: baseline has declared warnings and zero errors; distilled has zero errors and zero warnings.

- [ ] **Step 5: Capture final frames**

Use system Chrome with `--headless --hide-scrollbars --window-size=1080,1920 --force-device-scale-factor=1` and save both final PNGs under `质检/`.

- [ ] **Step 6: Build the comparison board**

Use ffmpeg to place the two final frames side by side with clear baseline/distilled labels. Copy the three user-facing PNGs to the Codex task `outputs/` directory.

- [ ] **Step 7: Inspect and record QC**

Visually inspect the full-size frames and comparison. Record 1x, 25%, grayscale, safe-area, hierarchy, source/disclaimer readability, exact linter results, and finish with `APPROVE` or `BLOCK`.

- [ ] **Step 8: Commit**

```bash
git add projects/2026-08-22-finhot-visual-taste-proof
git commit -m "test: prove visual taste with finhot ab"
```

## Task 6: Final verification and Gitea handoff

- [ ] **Step 1: Run the complete verification set**

```bash
node --test .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.test.mjs
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  .agents/skills/vibe-visual-taste/templates
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/baseline
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/distilled
python /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-visual-taste
node --check studio/server.mjs
git diff --check HEAD~4..HEAD
git status --short --branch
```

Expected: all hard gates pass, expected baseline warnings are documented, and the working tree is clean.

- [ ] **Step 2: Verify corpus exclusion**

```bash
find .agents/skills/vibe-visual-taste -name DESIGN.md -print
```

Expected: only the self-owned template appears; none of the 74 upstream brand documents are vendored.

- [ ] **Step 3: Push the feature branch**

```bash
git push -u origin feat/awesome-design-md-distillation
```

Expected: the remote branch points to the local HEAD. Do not merge `main`.

- [ ] **Step 4: Confirm remote parity**

```bash
git rev-parse HEAD
git ls-remote --heads origin feat/awesome-design-md-distillation
```

Expected: local and remote SHA values match.
