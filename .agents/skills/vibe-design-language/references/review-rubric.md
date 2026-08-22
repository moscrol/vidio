# Design-language review rubric

Review `reference-brief.md` and `design-vocabulary.json` as one decision contract. Record the linter command and exact verdict.

## Source precision

- Every `REF-###` target identifies a page, screen, component, frame, or time range another reviewer can inspect.
- `Status` matches the evidence actually observed. `REFERENCE_ONLY` supports no project fact; `SUPPLIED` makes no ownership claim.
- `Borrow` names a transferable method or relationship. `Exclude` protects identity, assets, tokens, claims, and unobserved behavior.
- `Evidence` is an observation, not an inference disguised as a fact.

## Vocabulary integrity

- Each concept has one canonical label; normalized IDs, canonical names, and aliases do not collide.
- `definition` is project-specific, and `notThis` separates the nearest adjacent concept.
- Component and motion states cover the states downstream work must preserve.
- Every acceptance check can be judged from an artifact or rendered result.
- Every `sourceRefs` entry resolves to evidence that supports the term or translation.

## Translation and handoff

- Vague phrases occur only as translation inputs and resolve to known canonical IDs.
- Translation acceptance describes observable replacement behavior, not another adjective.
- Static numeric design choices are assigned to the visual contract; timing and easing are assigned to the motion contract.
- Every open gap names a reason and next owner, and every warning appears in `Downstream Handoff`.

## Decision

```text
Linter: APPROVE | BLOCK — N errors, N warnings
Sources: PASS | BLOCK — evidence
Terms: PASS | BLOCK — evidence
Translations: PASS | BLOCK — evidence
Rights boundary: PASS | BLOCK — evidence
Handoff: PASS | BLOCK — evidence
Decision: APPROVE | BLOCK
```

`APPROVE` requires zero errors. Production handoff requires zero warnings; exploratory work may retain a warning only when the handoff names its impact and owner.
