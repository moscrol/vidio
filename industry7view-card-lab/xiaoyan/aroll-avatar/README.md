# A-roll Sketch Avatar

This folder contains the black-and-white sketch avatar derived from the A-roll
presenter. It is a separate character system from Xiaoyan professor and should
not inherit Xiaoyan's glasses, suit, doctoral cap, magnifier, or cyber styling.

## Assets

- `references/ar-schema-front.png` is the only approved identity reference.
- `sheets/ar-schema-turnaround.png` is for side and back reconstruction.
- `sheets/ar-schema-expressions.png` may change only facial controls.
- `sheets/ar-schema-actions.png` provides B-roll blocking references.
- `sheets/ar-schema-hands.png` provides prop-interaction details.

## Locked Traits

- Narrow oval face, tapered jaw, long neck, narrow shoulders.
- Shoulder-length black bob, 3/7 side part, right curved fringe.
- White stand-collar shirt with rolled sleeves.
- Light trousers.
- Small ear studs.
- Round dark-strap watch on the character's left wrist.

## B-roll Mapping

```text
walking              -> entering an industry chain
seated presentation  -> replacing short A-roll inserts
pointing at chart    -> explaining metrics
turning notebook     -> changing research stages
writing              -> recording validation evidence
inspecting equipment -> factory and device scenes
arranging data cards -> comparison and screening scenes
looking back         -> transition or conclusion
```

## Validation

Run from `industry7view-card-lab`:

```bash
node --test xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

The test locks the identity contract and verifies that all manifest assets are
present.
