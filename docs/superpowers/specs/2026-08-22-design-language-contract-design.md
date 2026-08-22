# Vidio Design Language Contract — Design Specification

**Date:** 2026-08-22  
**Status:** Approved for implementation  
**Branch:** `feat/design-language-contract`  
**Upstream:** stacked on `feat/awesome-design-md-distillation`

## Objective

Insert one evidence-aware language layer before Vidio's visual and motion contracts so an agent must translate vague aesthetic requests and reference material into canonical, bounded, testable terms before choosing tokens, timing, or renderer code.

The resulting authored-design chain is:

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

Pure supplied footage with no authored overlay may skip all three design contracts. Authored covers, cards, UI demonstrations, charts, typography frames, and product visuals use the complete language-to-visual path. Motion work adds the motion contract after the visual gate.

## Decision

Create one repository-owned, model-invoked skill named `vibe-design-language`.

It owns:

- exact reference targets, observation status, evidence boundaries, and "borrow / exclude" decisions;
- canonical project terms, aliases, definitions, adjacent-concept boundaries, states, acceptance checks, and source links;
- translations from vague source phrases to observable project decisions;
- unresolved language gaps and the explicit downstream handoff.

It does not own palette values, typography sizes, layout geometry, animation timing, easing, renderer code, or reusable component implementation. Those remain with `vibe-visual-taste`, `vibe-motion-taste`, the renderer, and `library/` respectively.

## Alternatives considered

### 1. One `vibe-design-language` skill — selected

One invocation creates the two artifacts that must be reviewed together: evidence and vocabulary. It adds a single routing concept, keeps the hard gate small, and gives visual and motion skills one shared upstream contract.

### 2. Fold the work into `vibe-visual-taste` — rejected

This would couple source confidence and component naming to static token decisions. Motion-only vocabulary and cross-renderer reference work would then depend on a skill whose declared boundary excludes motion.

### 3. Split reference research and vocabulary into two skills — deferred

The two activities have different concerns but no independent production value in this first increment: a reference without a bounded term cannot drive a contract, and a sourced term needs the reference record. Two skills would add routing and handoff overhead before repeated use demonstrates a stable split.

## Artifacts

### `reference-brief.md`

A human-readable record in the project or variant directory. It contains these exact sections:

- `Objective`
- `Evidence Boundary`
- `Sources`
- `Synthesis`
- `Downstream Handoff`
- `Open Gaps`

Each source is an H3 entry whose title starts with a stable `REF-###` ID and whose field list declares:

- `Layer`: `visual-ceiling`, `flow`, `platform`, `implementation`, `principle`, or `project-evidence`;
- `Status`: `VERIFIED`, `REFERENCE_ONLY`, or `SUPPLIED`;
- `Target`: exact page, screen, component, or video time range;
- `Borrow`: the method, relationship, or constraint being extracted;
- `Exclude`: identity, assets, tokens, claims, or behavior that must not be inherited;
- `Retrieved`: ISO date;
- `Evidence`: what was actually observed.

`VERIFIED` means the target was directly read or inspected. `REFERENCE_ONLY` records a lead that may guide lookup but cannot support a project fact or a copied decision. `SUPPLIED` covers a project input whose exact provenance and permitted use must still be stated; it does not imply ownership.

### `design-vocabulary.json`

A machine-checkable project contract. JSON is selected instead of YAML because Vidio's existing contracts and zero-dependency linters already use JSON. This preserves deterministic validation without adding a package runtime or accepting a partial YAML parser.

Top-level shape:

```json
{
  "version": "1.0",
  "project": "project-slug",
  "terms": [],
  "translations": [],
  "openGaps": []
}
```

Every term contains:

- `id`: stable `TERM-###` identifier;
- `canonicalName`: the only downstream label;
- `kind`: `component`, `pattern`, `motion`, `principle`, or `visual-axis`;
- `aliases`: accepted input names that normalize to the canonical name;
- `definition`: the project-specific problem or relationship it names;
- `notThis`: at least one adjacent concept or misleading interpretation;
- `states`: meaningful states; required for `component` and `motion` terms;
- `acceptance`: observable checks that prove correct use;
- `sourceRefs`: one or more `REF-###` IDs from `reference-brief.md`.

Every translation contains:

- `phrase`: the raw vague or overloaded wording;
- `replaceWith`: one or more canonical term IDs;
- `acceptance`: observable replacement criteria;
- `sourceRefs`: evidence used for the translation.

Every open gap contains an unresolved `term`, a `reason`, and the downstream `owner` (`brief`, `visual-contract`, `motion-contract`, `component-contract`, or `human`). Empty `openGaps` is valid; hidden ambiguity is not.

## Hard gate

The dependency-free Node linter runs as:

```bash
node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs <project-or-variant-dir>
```

It returns exit code 1 for errors and 0 when only warnings remain. Stable diagnostics:

| Code | Severity | Meaning |
| --- | --- | --- |
| `VDL001` | error | missing, unreadable, malformed, or unsupported contract shape |
| `VDL002` | error | required reference-brief section or source field is missing |
| `VDL003` | error | duplicate/colliding term ID, canonical name, or alias |
| `VDL004` | error | term lacks a definition, boundary, state, or acceptance check |
| `VDL005` | error | source reference is missing or does not resolve to the brief |
| `VDL006` | error | vague language is used as a canonical term without translation |
| `VDL007` | error | translation targets an unknown term or has no observable acceptance |
| `VDL101` | warning | a source is `REFERENCE_ONLY` and therefore cannot be treated as verified evidence |
| `VDL102` | warning | an open language gap remains and must travel into the downstream handoff |

Vague-language detection covers high-frequency placeholders such as `高级`, `高端`, `大气`, `丝滑`, `炫酷`, `premium`, `clean`, `modern`, `slick`, and `cool`. Those phrases are allowed only in `translations[].phrase`; downstream canonical terms must be operational.

## Workflow

1. Read the project brief, real content, existing brand assets, and renderer/platform constraints.
2. Inventory every reference and assign an exact target, layer, status, borrow boundary, and exclusion boundary.
3. Normalize only the terms needed by the current project. Record aliases and adjacent-concept boundaries rather than building an encyclopedia.
4. Translate vague phrases into canonical terms with observable acceptance checks.
5. Run the hard gate and resolve every error. Warnings remain visible in the downstream handoff.
6. Pass canonical term IDs and accepted constraints into `vibe-visual-taste` and, when applicable, `vibe-motion-taste`.
7. After rendering, verify that the implementation uses the canonical meaning. Repeated implementation gaps belong in component contracts or `library/`, not back in this skill.

## Integration

- `vibe-director` binds the language gate before the visual gate for authored design.
- `vibe-visual-taste` reads both language artifacts before writing its thesis and numeric contract.
- `vibe-motion-taste` reads them before assigning purpose and relationship names.
- `AGENTS.md`, Cursor rules, README, and Studio lane hints expose the same canonical chain.
- The project brief template lists both language artifacts under project paths and requires their lint verdict under acceptance.
- `skills-lock.json` remains unchanged because this is a repository-owned skill, not a CLI-installed external dependency.

## Controlled proof

Extend the existing FinHot visual-taste proof with one shared `reference-brief.md` and one shared `design-vocabulary.json`.

The proof will:

- classify the local FinHot screenshot as `SUPPLIED` project evidence and preserve its provenance boundary;
- classify the method sources used to establish hierarchy and evidence boundaries without copying their brand identity;
- translate generic phrases such as "高级 SaaS 感" into the canonical terms actually used by the distilled frame;
- connect the existing evidence-rail pattern and visual-axis terms to source IDs;
- pass the new hard gate with zero errors and zero warnings;
- leave the existing baseline/distilled pixel comparison unchanged, proving the new layer is an upstream decision contract rather than a renderer rewrite.

## Source and rights boundary

The knowledge-star article and its direct links are method sources only. Vidio will not vendor article text, PDF attachments, screenshots, private session data, brand assets, proprietary fonts, or third-party design-system corpora. A repository source record will list the inspected URLs, date, depth-one scope, verification statuses, and independent implementation boundary.

## Verification

The implementation is complete when:

- the new skill passes `quick_validate.py`;
- linter unit tests cover every `VDL` diagnostic and the valid template;
- the template and FinHot proof each pass with zero errors and zero warnings;
- existing visual and motion linter test suites remain green;
- JavaScript syntax checks and `git diff --check` pass;
- canonical routing surfaces agree on the new chain;
- no third-party source corpus or private article content appears under `.agents/skills/`;
- the feature branch is pushed to Gitea and remote SHA equals local `HEAD`.
