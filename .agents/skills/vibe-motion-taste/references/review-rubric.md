# Motion review rubric

## Evidence set

Review only when all inputs refer to the same render:

- composition source and `motion-contract.json`;
- contract linter output;
- renderer lint, validation, and inspection output;
- final-resolution video;
- matching keyframes at the start, transition, payoff, and final hold;
- audio waveform or beat markers when sound drives motion.

Stale frames invalidate the review.

## Review passes

1. **Purpose at 1×.** Watch once without stopping. Name the main change in each beat. Block when the eye follows decoration instead of meaning.
2. **Focus on a phone-sized view.** Confirm one high-salience subject, readable subtitles, and stable data. Block collisions, clipping, competing movement, or unreadable holds.
3. **Continuity at cuts.** Step across every scene boundary. Confirm direction, origin, velocity, color, shape, or causal linkage. A deliberate hard cut must improve rhythm or argument.
4. **Physicality at 0.25×.** Check easing, origin, settle, overshoot, opacity/transform synchronization, and camera stop. Block `ease-in` entry, tiny-origin growth, or unjustified bounce.
5. **Anti-PPT.** Confirm that movement explains, emphasizes, or bridges content. Breathing, glow, grain, and card fly-ins alone do not pass.
6. **Cohesion.** Confirm the motion personality matches the subject. Financial research defaults to crisp, restrained, trustworthy movement.
7. **Sound sync.** When audio exists, confirm that causal actions land on the intended syllable, beat, impact, or pause without chasing every beat.

## Findings format

Write one table:

| Time | Finding | Evidence | Fix |
| --- | --- | --- | --- |
| `00:03.8` | Two high-salience changes compete | title enters while camera is still accelerating | settle the camera before the title entry |

Order findings by impact:

1. meaning or focus;
2. legibility and framing;
3. continuity and physicality;
4. timing and settle;
5. performance and determinism;
6. polish.

## Verdict

- `BLOCK`: any contract error; obscured meaning; unreadable text/data; competing primary focus; broken continuity; unmotivated spring/back motion; renderer instability; or stale evidence.
- `APPROVE`: zero contract errors, renderer checks pass, warnings are resolved or explicitly accepted, and every review pass above has current evidence.

Close with the verdict, accepted warnings, and exact artifact paths. Do not convert subjective impressions into a numeric score.
