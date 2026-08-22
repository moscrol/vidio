# Project Visual System

Pair this rationale with `visual-contract.json`. The JSON file owns all numeric values; this file owns intent, trade-offs, and review evidence.

## Intent

- Visual thesis: Lead with one evidence-backed claim, then reveal the literal product proof in a calm editorial frame.
- Voice: Precise, restrained, and evidence-led.
- Distinctive move: A narrow evidence rail connects the headline to supporting observations.
- Evidence boundary: Use owned or verified media; label generated or placeholder material explicitly.

## Hierarchy

The claim is the only dominant focal element. Evidence rows form the second reading step, product media is the third, and provenance closes the frame. Secondary surfaces reduce contrast instead of adding a second hero.

## Tokens

Use only semantic roles declared in `visual-contract.json`. The accent marks evidence or action. Type roles may share families; depth comes from rules and spacing before effects.

## Components

The evidence rail binds one claim to its proof. Product media remains literal. Source and disclaimer components remain inside the safe area and visible at final output size.

## Media

Preserve decision-relevant labels, dates, values, and product state. Crop only context that does not change the claim. Surround media with a quiet surface when the content already supplies color and detail.

## Do / Avoid

Do keep one focal claim, use semantic roles, and preserve literal evidence. Avoid named-brand imitation, decorative effect stacks, and competing hero panels.

## Review

Run the visual-contract linter, then inspect the rendered hero frame at full size, 25% size, grayscale, and with safe-area overlays. Record every warning and finish QC with `APPROVE` or `BLOCK`.
