# Visual language decisions

Use this reference after reading the project's real content and before filling `visual-contract.json`.

## Start with a thesis

A useful visual thesis can be disproved. It names the audience, the first thing they should notice, the proof that follows, and the intended emotional temperature.

Weak: “premium, clean, modern.”

Strong: “A cautious retail investor sees one claim first, verifies it against three evidence rows, then recognizes the literal product UI; the frame feels editorial rather than promotional.”

Choose one distinctive static move that reinforces the thesis: an evidence rail, a crop grammar, a typographic interruption, a data spine, or another original relationship. A gradient, glow, glass panel, or oversized word is not distinctive without a content job.

## Decide hierarchy before style

Write the reading order as named steps. Give every component one purpose and a priority. Default budgets:

- one dominant focal element;
- no more than three major panels;
- one content hero, such as product UI, data, portrait, image, or type;
- supporting elements reduce contrast, scale, or density instead of competing.

At 25% size, the focal claim and the next reading step should remain obvious. If everything survives equally, the hierarchy is too flat.

## Use semantic roles

The required palette roles are `background`, `surface`, `textPrimary`, `textMuted`, `accent`, and `warning`. Components consume roles; they do not introduce anonymous colors.

The accent is scarce evidence or action, not ambient decoration. Keep its planned frame coverage at or below the warning budget unless the project explicitly documents why color itself is the content.

Type roles are `display`, `body`, `data`, and `label`. Roles may share a family. Prefer scale, weight, tracking, line length, and alignment over adding a fourth family.

## Choose one source of depth

State how the frame gets depth before adding effects:

- surface ladder: adjacent tonal surfaces plus fine borders;
- shadow: restrained elevation for a small number of floating objects;
- photographic: crop, occlusion, focus, and light in the source media;
- flat editorial: rules, spacing, scale, and overlap without simulated elevation.

One source leads. Other effects must name a purpose and coverage budget. More than three effects or more than three radius values is a warning that geometry has become decoration rather than language.

## Make media evidence legible

Classify source media in prose as owned, verified public, generated, or placeholder. Preserve decision-relevant UI, labels, dates, and values. Crop only regions that do not change the claim. Do not recolor literal screenshots until they imply a state the product never showed.

When media provides the visual interest, keep the surrounding UI quiet. When type or data is the hero, media becomes supporting proof rather than wallpaper.

## Adapt the system, not the identity

For each output canvas, preserve semantic roles and the visual thesis while changing density, line breaks, crop, and safe area. Do not invent a new style per aspect ratio.

At a 1080-wide output, body, label, and source text must meet the contract's readability floors. Treat platform overlays and subtitles as occupied safe-area regions, not as last-minute collisions.

## Keep references method-only

Extract cross-brand axes such as content dominance, density, depth source, surface temperature, geometry, and accent scarcity. Do not make a preset whose identity is “looks like Brand X.” Publicly observable values may be evidence about a reference, but they are not automatically licensed product assets or an official brand system.
