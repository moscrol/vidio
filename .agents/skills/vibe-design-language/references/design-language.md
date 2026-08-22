# Design-language decisions

Use this reference while authoring `reference-brief.md` and `design-vocabulary.json`. Keep the vocabulary project-sized: name only distinctions that downstream work must preserve.

## Bound every source

Choose the layer that describes why the target is useful:

| Layer | Use for |
| --- | --- |
| `visual-ceiling` | A quality bar or visual relationship to evaluate against |
| `flow` | Sequence, hierarchy, or interaction flow |
| `platform` | Channel conventions, overlays, safe regions, or delivery constraints |
| `implementation` | Observable construction methods or technical constraints |
| `principle` | A general design method independent of one identity |
| `project-evidence` | Supplied or observed facts about this project |

Assign status from the evidence actually inspected:

- `VERIFIED`: directly read, watched, or inspected at the recorded target.
- `REFERENCE_ONLY`: a lead for further lookup; it cannot support a project fact or copied decision.
- `SUPPLIED`: provided as a project input. Record provenance and permitted use; supplied never implies ownership.

Make `Target` independently reachable: name the page, screen, component, frame, or video time range. `Borrow` states the transferable method or relationship. `Exclude` states identity, assets, tokens, claims, or behavior that must stay behind. `Evidence` records only what was observed.

## Canonicalize project terms

One concept gets one `TERM-###` ID and one canonical name. Aliases accept precise input variants; they do not create synonyms downstream. The linter compares IDs, canonical names, and aliases after Unicode lowercasing and removal of spaces, `_`, `-`, and punctuation, so visually different spellings cannot hide a collision.

Choose a kind by the decision being named:

- `component`: a semantic unit with meaningful states; implementation remains downstream.
- `pattern`: a repeated relationship among content or components.
- `motion`: a time-based relationship with states; timing and easing remain in the motion contract.
- `principle`: a rule that constrains several decisions.
- `visual-axis`: a named direction for later static design choices, without numeric values.

Write `definition` for this project's problem. Use `notThis` to separate the nearest misleading interpretation. Make `acceptance` observable in an artifact or rendered result. Components and motion terms must list non-empty states; all other kinds still declare a `states` array.

## Translate vague requests

Keep `高级`, `高端`, `大气`, `丝滑`, `炫酷`, `premium`, `clean`, `modern`, `slick`, and `cool` only in `translations[].phrase`. Replace each with one or more canonical IDs and an observable check.

Example: translate “premium clean” into a named hierarchy pattern plus a literal-evidence principle, then require the claim, proof order, and preserved product state to be visible. A palette, type size, duration, or easing value belongs to its downstream contract instead.

## Carry gaps forward

Record ambiguity instead of inventing a term. Assign each gap to `brief`, `visual-contract`, `motion-contract`, `component-contract`, or `human`. Mirror open gaps and `REFERENCE_ONLY` warnings in `Downstream Handoff` so later work cannot silently promote them to facts.
