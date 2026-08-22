# FinHot visual-taste proof

This controlled static A/B isolates Vidio's self-owned visual-taste layer.

- Canvas: 1080 × 1920, static, no animation or audio.
- Content lock: both variants use the same FinHot product screenshot, headline, three evidence statements, source, and disclaimer.
- Baseline: a generic AI-SaaS composition with multiple focal panels, four font families, over-budget accent, stacked effects, and four radii.
- Distilled: an original “research desk” composition with one focal claim, one evidence rail, literal product proof, and restrained semantic tokens.
- Upstream language gate: `reference-brief.md` bounds four exact sources and `design-vocabulary.json` defines `TERM-001` through `TERM-005` plus three explicit phrase translations before visual review.
- Gate: the language pair must have zero errors and zero warnings. Both visual contracts must have zero errors; the baseline retains only five declared experimental warnings, and the distilled variant must have zero warnings.

The comparison measures static hierarchy, readability, consistency, and distinctiveness. It does not claim that every dark or glass design is bad; it demonstrates the cost of using those devices without a single visual thesis or budget.

Run `node verify-proof.mjs` after final screenshots to verify identical visible content, the shared source asset, matching canvas contracts, and output dimensions.

## Current contract checks

Run from the repository root:

- `node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs projects/2026-08-22-finhot-visual-taste-proof` → `APPROVE`, 0 errors, 0 warnings.
- `node projects/2026-08-22-finhot-visual-taste-proof/verify-proof.mjs` → `proof verification ok: identical content, shared asset, fixed canvas, final captures`.
- `node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs projects/2026-08-22-finhot-visual-taste-proof/baseline` → `Summary: 0 error(s), 5 warning(s)`; the five warnings are the documented experimental controls.
- `node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs projects/2026-08-22-finhot-visual-taste-proof/distilled` → `Summary: 0 error(s), 0 warning(s)`.

This language-proof change leaves the locked copy, shared asset bytes, variant HTML, rendered PNGs, and comparison evidence byte-for-byte unchanged. Each variant's `DESIGN.md` and QC consume the five term IDs; the visual-contract JSON files retain ownership of numeric decisions without redefining the vocabulary. Both contracts now encode the supplied screenshot as `supplied-local-proof-only`, consistent with the controlling provenance boundary in `reference-brief.md`.
