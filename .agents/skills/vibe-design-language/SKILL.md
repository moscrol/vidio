---
name: vibe-design-language
description: Normalize project references, supplied examples, and vague aesthetic requests into an evidence-bounded reference-brief.md and design-vocabulary.json. Use before visual or motion contracts for authored covers, cards, UI demonstrations, charts, typography frames, product visuals, motion systems, or requests such as premium, clean, or modern that need canonical project terms and source boundaries.
---

# Vibe Design Language

Produce one paired upstream contract: `reference-brief.md` records what was observed and what may be borrowed; `design-vocabulary.json` turns that evidence into bounded, testable project language.

## Workflow

1. Read the project brief, real content, supplied assets, existing brand evidence, and platform constraints. Treat supplied material as project input with explicit provenance, never as proof of ownership.
2. Copy both files from `templates/` into the project or variant directory. Keep the filenames unchanged.
3. Read [references/design-language.md](references/design-language.md), then inventory exact source targets. Record one `REF-###` entry per independently reviewable target with its layer, status, borrow boundary, exclusion boundary, retrieval date, and observed evidence.
4. Define only the terms the current project needs. Give each term one canonical label, accepted aliases, a project-specific definition, a `notThis` boundary, applicable states, observable acceptance checks, and source IDs.
5. Translate vague or overloaded requests in `translations[].phrase`. Point each phrase to known `TERM-###` IDs and state what a reviewer can observe when the translation is honored.
6. Put unresolved language in `openGaps` and assign its next owner. Repeat every warning and gap in `Downstream Handoff`.
7. Run the hard gate from the repository root:

   ```bash
   node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs <project-or-variant-dir> [...]
   ```

8. Read [references/review-rubric.md](references/review-rubric.md) and review the pair together. Resolve every error before handoff.

## Ownership boundary

Stop this layer at evidence and language decisions.

- Send palette values, typography sizes, layout geometry, spacing, radii, and other static numeric design decisions to `$vibe-visual-taste`.
- Send durations, timing, easing, stagger, transition mechanics, and camera movement to `$vibe-motion-taste`.
- Send renderer code to the selected renderer and reusable implementation to the component contract or `library/`.
- Pass canonical term IDs and accepted constraints downstream; downstream contracts consume the terms without redefining them.

## Completion gate

Complete the language gate only when:

- both artifacts exist in the same project or variant directory;
- every source names an exact target and separates `Borrow`, `Exclude`, and observed `Evidence`;
- every term has a distinct normalized label, an adjacent-concept boundary, observable acceptance, and resolvable source IDs;
- every vague phrase is translated to known term IDs;
- the linter prints `APPROVE` with zero errors; production handoff has zero warnings, or each remaining warning is explicit in `Downstream Handoff`;
- the downstream handoff names the canonical term IDs and the contract that owns each remaining decision.

Use [schemas/design-vocabulary.schema.json](schemas/design-vocabulary.schema.json) as the complete JSON shape reference. Use the templates as a coherent starting pair, not as project evidence.
