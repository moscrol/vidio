# Design Language Contract Implementation Plan

> **Required sub-skill:** Execute this plan with `subagent-driven-development`: one fresh implementer per task, spec-compliance review before code-quality review, and a final whole-branch review.

**Goal:** Add an evidence-aware design-language gate that produces and validates `reference-brief.md` plus `design-vocabulary.json` before Vidio's visual and motion contracts.

**Architecture:** A new repository-owned `vibe-design-language` skill owns reference boundaries, canonical terms, vague-language translation, and downstream handoff. A dependency-free Node linter cross-checks the Markdown source IDs against a JSON vocabulary contract. Existing visual and motion skills consume the artifacts without surrendering their current ownership of static values and timeline values.

**Tech stack:** Markdown, JSON Schema 2020-12, Node.js ESM, built-in `node:test`, repository-local Codex skills.

**Design spec:** `docs/superpowers/specs/2026-08-22-design-language-contract-design.md`

---

## Task 1: Build the `vibe-design-language` skill and hard gate

**Files:**

- Create: `.agents/skills/vibe-design-language/SKILL.md`
- Create: `.agents/skills/vibe-design-language/agents/openai.yaml`
- Create: `.agents/skills/vibe-design-language/references/design-language.md`
- Create: `.agents/skills/vibe-design-language/references/review-rubric.md`
- Create: `.agents/skills/vibe-design-language/schemas/design-vocabulary.schema.json`
- Create: `.agents/skills/vibe-design-language/templates/reference-brief.md`
- Create: `.agents/skills/vibe-design-language/templates/design-vocabulary.json`
- Create: `.agents/skills/vibe-design-language/scripts/lint-design-language.mjs`
- Create: `.agents/skills/vibe-design-language/scripts/lint-design-language.test.mjs`

### Step 1: Scaffold the new skill

Run the skill creator before hand-editing the generated files:

```bash
python3 /Users/a77/.codex/skills/.system/skill-creator/scripts/init_skill.py \
  vibe-design-language \
  --path .agents/skills \
  --resources scripts,references \
  --interface display_name="Vibe Design Language" \
  --interface short_description="Turn references and vague taste into bounded design terms" \
  --interface default_prompt="Use $vibe-design-language to source and normalize this project's design language before visual or motion contracts."
```

Expected: `.agents/skills/vibe-design-language/` exists with a skill stub, `agents/openai.yaml`, `scripts/`, and `references/`.

### Step 2: Write the failing linter tests

Create `lint-design-language.test.mjs` with isolated temporary project directories. Cover:

- valid pair returns exit 0 with zero diagnostics;
- `VDL001` for malformed JSON and missing top-level structure;
- `VDL002` for a missing required Markdown section and missing source field;
- `VDL003` for colliding IDs, canonical names, and aliases after case/punctuation normalization;
- `VDL004` for missing definition, boundary, required states, or acceptance;
- `VDL005` for empty or unknown `REF-###` links;
- `VDL006` for vague canonical language;
- `VDL007` for unknown translation targets or empty observable acceptance;
- `VDL101` for a `REFERENCE_ONLY` source;
- `VDL102` for a non-empty open gap.

Run:

```bash
node --test .agents/skills/vibe-design-language/scripts/lint-design-language.test.mjs
```

Expected: FAIL because the linter implementation does not yet exist or does not satisfy the contract.

### Step 3: Implement the dependency-free linter

Implement exported `lintArtifacts({ brief, vocabulary })` and a CLI that accepts one or more project directories. The CLI reads `reference-brief.md` and `design-vocabulary.json`, prints stable diagnostics plus `APPROVE` or `BLOCK`, and returns nonzero only when errors exist.

Parsing rules:

- recognize exact H2 section names case-insensitively;
- recognize source headings as `### REF-### — title` or `### REF-### - title`;
- parse the seven required `- Field: value` lines inside each source entry;
- normalize term and alias collisions with Unicode lowercasing plus removal of spaces, `_`, `-`, and punctuation;
- keep vague phrases legal only in `translations[].phrase`;
- cross-check every term and translation `sourceRefs` against parsed reference IDs;
- warn, without failing, for `REFERENCE_ONLY` and non-empty `openGaps`.

Run the test suite again.

Expected: all tests pass.

### Step 4: Add schema, templates, references, and skill instructions

Implement the approved contract exactly:

- JSON Schema locks version `1.0`, allowed kinds, term fields, translation fields, and open-gap owners;
- templates form a coherent zero-warning pair;
- `design-language.md` explains reference layers, statuses, canonicalization, boundaries, and vague-language translation;
- `review-rubric.md` checks source precision, rights boundaries, term collisions, downstream observability, and open gaps;
- `SKILL.md` uses progressive disclosure, checkable completion criteria, and explicitly routes palette/geometry to visual taste and timing/easing to motion taste;
- `agents/openai.yaml` contains only the documented interface fields and explicitly names `$vibe-design-language` in `default_prompt`.

### Step 5: Validate the skill and its templates

Run:

```bash
node --test .agents/skills/vibe-design-language/scripts/lint-design-language.test.mjs
node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs \
  .agents/skills/vibe-design-language/templates
python3 /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-design-language
```

Expected: tests pass; template reports `APPROVE` with zero errors and zero warnings; skill validation passes.

### Step 6: Commit

```bash
git add .agents/skills/vibe-design-language
git commit -m "feat: add design language contract skill"
```

---

## Task 2: Route the language gate through Vidio

**Files:**

- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `.cursor/rules/vibe-motion.mdc`
- Modify: `.agents/skills/vibe-director/SKILL.md`
- Modify: `.agents/skills/vibe-director/templates/brief.md`
- Modify: `.agents/skills/vibe-director/templates/manifest.json`
- Modify: `.agents/skills/vibe-visual-taste/SKILL.md`
- Modify: `.agents/skills/vibe-motion-taste/SKILL.md`
- Modify: `studio/server.mjs`
- Modify: `industry7view-card-lab/VIDEO_DESIGN.md`
- Modify: `docs/system/industry7view-video-system-design.md`

### Step 1: Add an initially failing routing assertion

Run a repository search before editing:

```bash
rg -n "vibe-design-language|reference-brief.md|design-vocabulary.json" \
  AGENTS.md README.md .cursor/rules/vibe-motion.mdc \
  .agents/skills/vibe-director .agents/skills/vibe-visual-taste \
  .agents/skills/vibe-motion-taste studio/server.mjs \
  industry7view-card-lab/VIDEO_DESIGN.md \
  docs/system/industry7view-video-system-design.md
```

Expected: no matches; the new gate is not yet routed.

### Step 2: Update the canonical route

Make all canonical surfaces agree on:

```text
vibe-director
  → vibe-design-language
  → reference-brief.md + design-vocabulary.json
  → vibe-visual-taste
  → DESIGN.md + visual-contract.json
  → vibe-motion-taste
  → motion-contract.json
  → renderer
  → hybrid QC
```

Rules:

- authored design always binds the language gate before visual taste;
- pure supplied footage without authored overlays may skip it;
- visual taste reads both language artifacts and owns all static numeric values;
- motion taste reads both language artifacts plus the visual contract and owns time-based values;
- renderer-facing tools remain executors rather than reference or vocabulary owners.

### Step 3: Update project and reuse templates

Add language artifact paths and the language-lint verdict to `brief.md`. Add `vibe-design-language` to reusable component prerequisites before visual and motion taste in `manifest.json`.

### Step 4: Update Studio and system guidance

Add `vibe-design-language` to the motion, promo, and cover lane skill arrays and classify it as design language/evidence. Update only the workflow and ownership passages in the two Industry 7View design documents; keep their historical implementation content unchanged.

### Step 5: Run focused checks

```bash
node --check studio/server.mjs
rg -n "vibe-design-language|reference-brief.md|design-vocabulary.json" \
  AGENTS.md README.md .cursor/rules/vibe-motion.mdc \
  .agents/skills/vibe-director .agents/skills/vibe-visual-taste \
  .agents/skills/vibe-motion-taste studio/server.mjs \
  industry7view-card-lab/VIDEO_DESIGN.md \
  docs/system/industry7view-video-system-design.md
```

Expected: JavaScript syntax passes and each named routing surface contains the appropriate language-gate pointer.

### Step 6: Commit

```bash
git add AGENTS.md README.md .cursor/rules/vibe-motion.mdc \
  .agents/skills/vibe-director/SKILL.md \
  .agents/skills/vibe-director/templates/brief.md \
  .agents/skills/vibe-director/templates/manifest.json \
  .agents/skills/vibe-visual-taste/SKILL.md \
  .agents/skills/vibe-motion-taste/SKILL.md studio/server.mjs \
  industry7view-card-lab/VIDEO_DESIGN.md \
  docs/system/industry7view-video-system-design.md
git commit -m "docs: route design language before visual taste"
```

---

## Task 3: Record provenance and prove the layer on FinHot

**Files:**

- Create: `docs/sources/zsxq-ai-design-language.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/reference-brief.md`
- Create: `projects/2026-08-22-finhot-visual-taste-proof/design-vocabulary.json`
- Modify: `projects/2026-08-22-finhot-visual-taste-proof/README.md`
- Modify: `projects/2026-08-22-finhot-visual-taste-proof/brief.md`
- Modify: `projects/2026-08-22-finhot-visual-taste-proof/质检/QC.md`

### Step 1: Run the proof gate red

```bash
node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs \
  projects/2026-08-22-finhot-visual-taste-proof
```

Expected: `BLOCK` because the two language artifacts do not exist.

### Step 2: Add the source record

Record the main article, all 16 direct content links, the two official Material page-data URLs, the 2026-08-22 read date, depth-one scope, verification boundary, and independent implementation boundary. Do not copy article prose, PDF attachments, private session material, third-party assets, or design-system corpora.

Classify recommendations that were named but not directly opened as `REFERENCE_ONLY`. State that Vidio implemented a new contract rather than vendoring an upstream skill or corpus.

### Step 3: Write the FinHot reference brief

Use exact project evidence and verified method sources:

- the local FinHot capture is `SUPPLIED` `project-evidence`, with its repository path and provenance limits;
- the fixed VoltAgent corpus audit is a `VERIFIED` `principle` source used only for cross-sample method;
- the design-language research report is represented by its directly inspected source pages, not by copying the local report into the repository.

Every source states exact target, borrow, exclude, retrieved date, and observed evidence. Use no `REFERENCE_ONLY` entry in the proof so the production contract can reach zero warnings.

### Step 4: Write the FinHot vocabulary contract

Include canonical terms for the existing design decisions, including:

- `evidence rail` as a pattern;
- `content dominance` and `accent scarcity` as visual axes;
- `literal product proof` as a pattern;
- `editorial restraint` as a principle.

Translate `高级 SaaS 感`, `干净`, and `现代` into those term IDs with observable checks. Link every term and translation to valid `REF-###` sources. Keep `openGaps` empty.

### Step 5: Run the proof and existing proof checks green

```bash
node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs \
  projects/2026-08-22-finhot-visual-taste-proof
node projects/2026-08-22-finhot-visual-taste-proof/verify-proof.mjs
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/baseline
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  projects/2026-08-22-finhot-visual-taste-proof/distilled
```

Expected: language gate has zero errors and zero warnings; proof verifier passes; baseline retains only its declared six warnings and zero errors; distilled remains zero errors and zero warnings.

Record exact commands and results in `质检/QC.md` without changing the frozen rendered pixels.

### Step 6: Commit

```bash
git add docs/sources/zsxq-ai-design-language.md \
  projects/2026-08-22-finhot-visual-taste-proof/reference-brief.md \
  projects/2026-08-22-finhot-visual-taste-proof/design-vocabulary.json \
  projects/2026-08-22-finhot-visual-taste-proof/README.md \
  projects/2026-08-22-finhot-visual-taste-proof/brief.md \
  projects/2026-08-22-finhot-visual-taste-proof/质检/QC.md
git commit -m "test: prove design language handoff"
```

---

## Task 4: Final verification and Gitea handoff

### Step 1: Run the complete regression set

```bash
node --test .agents/skills/vibe-design-language/scripts/lint-design-language.test.mjs
node --test .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.test.mjs
node --test .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs
node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs \
  .agents/skills/vibe-design-language/templates \
  projects/2026-08-22-finhot-visual-taste-proof
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs \
  .agents/skills/vibe-visual-taste/templates
node .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs \
  .agents/skills/vibe-motion-taste/templates/motion-contract.json
python3 /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-design-language
python3 /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-visual-taste
python3 /Users/a77/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .agents/skills/vibe-motion-taste
node --check studio/server.mjs
git diff --check feat/awesome-design-md-distillation..HEAD
```

Expected: all unit tests and hard gates pass; both production templates have zero warnings; FinHot design language and distilled visual contracts have zero warnings; only the controlled baseline reports its documented warnings.

### Step 2: Verify source-corpus exclusion and repository state

```bash
find .agents/skills/vibe-design-language -type f -maxdepth 4 -print | sort
rg -n "articles\.zsxq\.com|t\.zsxq\.com" .agents/skills/vibe-design-language || true
git status --short --branch
git log --oneline --decorate feat/awesome-design-md-distillation..HEAD
```

Expected: only Vidio-owned skill artifacts exist; no private article URLs or copied corpus appear inside the runtime skill; working tree is clean.

### Step 3: Push without merging `main`

```bash
git push -u origin feat/design-language-contract
```

### Step 4: Confirm remote parity

```bash
git rev-parse HEAD
git ls-remote --heads origin feat/design-language-contract
```

Expected: local and remote SHAs match. `main` remains untouched.
