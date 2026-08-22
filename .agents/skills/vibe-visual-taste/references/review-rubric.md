# Static-frame review rubric

Review rendered pixels, not just `DESIGN.md`, JSON, or CSS. Record the linter command and exact result in the project's QC note.

## 1. Full-size review

- Inspect at the final pixel size and normal viewing distance.
- Confirm the first fixation matches `layout.readingOrder[0]`.
- Confirm literal UI, source labels, numbers, and disclaimers are readable.
- Confirm the distinctive move has a content job and does not resemble a borrowed brand signature.
- Confirm all visible colors, type roles, radii, effects, and components map to the contract.

## 2. Thumbnail review

Inspect at 25% size.

- The dominant claim remains legible.
- The next evidence step remains identifiable.
- Secondary copy can soften, but it must not turn into equal-strength visual noise.
- If two or more panels still fight for first place, block and reduce the focal budget.

## 3. Grayscale review

- Hierarchy survives without hue.
- Text and literal product evidence remain distinct from their surfaces.
- Accent color is reinforcement, not the only carrier of meaning.

## 4. Safe-area and crop review

- Every required item remains inside the declared safe area.
- Platform UI, subtitles, and expected crops do not cover the headline, evidence, source, or disclaimer.
- Media crops do not remove context needed to support the claim.

## 5. Decision

Use this compact record:

```text
Linter: 0 errors, N warnings
1x: PASS | BLOCK — evidence
25%: PASS | BLOCK — evidence
Grayscale: PASS | BLOCK — evidence
Safe area: PASS | BLOCK — evidence
Provenance: PASS | BLOCK — evidence
Warnings: each code plus accepted reason or fix
Decision: APPROVE | BLOCK
```

`APPROVE` requires zero errors. Production work should have zero warnings; an experiment may retain warnings only when they are the variable under test and the QC note says so. Block unreadable sources, false product states, unclear provenance, named-brand imitation, or a mismatch between the contract and rendered pixels.
