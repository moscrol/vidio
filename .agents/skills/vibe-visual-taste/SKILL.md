---
name: vibe-visual-taste
description: "Define, implement, or review the static visual language for a video, cover, UI demo, data card, or promo. Use when requests mention visual style, design systems, DESIGN.md, palettes, typography, grids, materials, hierarchy, premium polish, brand consistency, or avoiding generic AI aesthetics. Produces project-level DESIGN.md and visual-contract.json, runs a hard gate, and reviews rendered frames. Do not use it to choose animation timing, transitions, easing, or camera motion; route those decisions to vibe-motion-taste after the visual contract passes."
---

# Vibe Visual Taste

Turn an approved design-language contract into one original visual thesis, a human-readable rationale, and a machine-checkable static contract before rendering.

## Own these decisions

- Information hierarchy, reading order, and focal budget.
- Semantic color roles and accent budget.
- Type roles, scale, density, geometry, surfaces, and depth strategy.
- Media treatment, component purpose, safe area, and static-frame review.

This skill owns all static numeric design values. It consumes canonical language and source boundaries from `vibe-design-language`; it does not redefine them.

Do not own timeline, shot rhythm, easing, transitions, camera moves, or sound. If the output moves, finish this workflow first and then invoke `vibe-motion-taste`.

## Produce both artifacts

Create these in the project or variant directory:

- `DESIGN.md`: intent, static trade-offs, canonical term IDs, examples, and review notes. Link to the language artifacts for vocabulary and source truth; do not duplicate them or any hex values, sizes, or spacing.
- `visual-contract.json`: the sole numeric source of truth consumed by renderers and the linter.

Start from `templates/`, then make project-specific decisions. Never route by named-brand imitation. Use `identity.inspirationMode: "method-only"` when studying references or `"original"` when no reference corpus is needed; `brandImitation` remains `false`.

## Workflow

1. Read the brief, actual copy, source media, existing brand assets, renderer constraints, target canvas, `reference-brief.md`, and `design-vocabulary.json` before writing the thesis. If either language artifact is missing or the language gate does not pass with zero errors, read and follow `vibe-design-language` first. Carry its warnings downstream and do not invent product evidence. Completion: the project language gate has passed and every canonical term used here resolves upstream.
2. Write one falsifiable visual thesis: who should notice what first, what proof follows, and what the frame should feel like.
3. Choose one distinctive static move. It must clarify identity or evidence, not merely decorate the frame.
4. Lock reading order and component purposes before styling. One frame gets one dominant focal element by default.
5. Define semantic tokens and budgets in `visual-contract.json`. Read `references/visual-language.md` when choosing depth, palette, type, media, or geometry.
6. Explain the rationale and static trade-offs in `DESIGN.md`. Reference upstream canonical term and source IDs, and refer to semantic token names rather than copying vocabulary, evidence records, or numeric values.
7. Run the hard gate:

   ```bash
   node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs <project-or-variant-dir>
   ```

8. Fix every error before rendering. A warning may remain only for an explicit experiment or a documented exception; record it in QC.
9. Render one representative hero frame before expanding the system. Pass the approved artifacts to Stitch, HyperFrames, Remotion, GSAP, or another renderer; the renderer implements decisions and does not invent a replacement style.
10. Read `references/review-rubric.md`, inspect the actual frame, and finish QC with `APPROVE` or `BLOCK`.

## Hard boundaries

- Do not copy a brand's wordmark, proprietary font, distinctive page composition, photo, marketing copy, or exact token set merely because a reference is public.
- Do not use “Apple-like”, “Nike-like”, “Linear-like”, or another brand name as the design mechanism. Translate references into cross-brand principles, then make an original choice.
- Do not duplicate or silently rename the canonical vocabulary, source statuses, or borrow/exclude boundaries from `reference-brief.md` and `design-vocabulary.json`.
- Do not open with effects. First decide hierarchy, content dominance, and the source of depth.
- Do not hide unknown provenance. State whether media is owned, verified, generated, or a placeholder.
- Do not approve from source code or a contract alone. Review the rendered pixels.

## Resources

- `references/visual-language.md`: decision vocabulary and budget rules.
- `references/review-rubric.md`: static-frame QC and block conditions.
- `schemas/visual-contract.schema.json`: versioned contract shape.
- `templates/DESIGN.md`: rationale template.
- `templates/visual-contract.json`: clean 1080×1920 starting contract.
- `scripts/lint-visual-contract.mjs`: dependency-free hard gate.
