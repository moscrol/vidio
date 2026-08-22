# Vidio motion language

## Contents

- [Build order](#build-order)
- [Six purposes](#six-purposes)
- [Repetition and focus](#repetition-and-focus)
- [Timing bands](#timing-bands)
- [Curves and physicality](#curves-and-physicality)
- [Spatial continuity](#spatial-continuity)
- [Reading and Anti-PPT](#reading-and-anti-ppt)
- [Performance and determinism](#performance-and-determinism)
- [UI-to-video translation](#ui-to-video-translation)
- [Never ship](#never-ship)

## Build order

Decide in this order:

1. Does the content need motion?
2. What single purpose does the motion serve?
3. What must remain still so the purpose reads?
4. What path and origin preserve spatial logic?
5. What frame band fits the role?
6. What curve fits that path?
7. Where does the motion settle, and how long is the readable hold?
8. How does it exit or bridge into the next shot?

A renderer choice cannot rescue a weak answer earlier in the sequence.

## Six purposes

| Purpose | Use it for | Reject when |
| --- | --- | --- |
| `orient` | Establishing where the subject is and how the frame is organized | The viewer already has the same spatial map |
| `explain` | Showing a mechanism, flow, grouping, filtering, or causal sequence | Movement decorates a finished result instead of explaining it |
| `emphasize` | Making one fact, number, or decision become dominant | Several elements compete for emphasis |
| `bridge` | Preserving continuity across scenes, cuts, or states | The transition has no relationship to either side |
| `confirm` | Giving a visible response to a prior event | The response repeats information without adding clarity |
| `delight` | Rewarding a rare, high-value moment | It recurs, delays reading, or exists only because it looks cool |

Write `delightReason` for every delight beat. Delete an unclassifiable beat.

## Repetition and focus

Translate interaction frequency into within-video repetition:

- A one-off reveal may carry more character.
- A pattern repeated in several scenes becomes shorter and quieter each time.
- Ambient loops stay low-salience and stop or soften while the viewer reads.
- A frame has one high-salience motion at a time. Supporting movement may overlap only when it reinforces the same focus.
- Text, data, and charts become stable before the viewer must judge them.

Use `salience: high` only for the current focal change. The linter warns when high-salience beats overlap; the visual review decides whether they genuinely compete.

## Timing bands

Frames are the source of truth. At 30fps:

| Role | Frames | Approximate time | Typical use |
| --- | ---: | ---: | --- |
| Micro accent | 4–8f | 133–267ms | check, underline, status response |
| Entry / exit | 8–15f | 267–500ms | title, label, object |
| Explanatory move | 12–24f | 400–800ms | aggregate, filter, compare, causal flow |
| Camera move | 24–90f | 0.8–3s | push, pan, depth change |
| Readable hold | ≥24f, then content-based | ≥800ms | subtitle, number, conclusion |

Use `timingReason` when an entry or exit exceeds its band. Longer is allowed when narration or meaning earns it; habit is not a reason.

For staggered groups, use 1–3 frames between items. Keep the group interactive or readable while the cascade finishes.

## Curves and physicality

Use these semantic tokens in the contract:

| Token | CSS curve | GSAP family | Role |
| --- | --- | --- | --- |
| `ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | `power3.out` | entering, exiting, system response |
| `ease-in-out-strong` | `cubic-bezier(0.77, 0, 0.175, 1)` | `sine.inOut` or a tuned custom curve | movement already on screen |
| `linear` | `linear` | `none` | progress, scan, constant travel |

Treat renderer families as implementation mappings, not mathematical equivalence.

- Block `ease-in` on entry: it delays the first visible response.
- Use back or spring only when the object has implied elasticity, momentum, or impact. Write `physicalReason`.
- Normalize entry scale against the final resting size. Keep it at or above `0.9`; a permanent layout scale is not an entrance scale.
- Carry motion into a settle. A camera move that cuts at peak velocity feels accidental.

## Spatial continuity

- Enter from the source or the next meaningful position, not from an arbitrary edge.
- Exit toward the destination or along the entry axis unless the story changes direction.
- Preserve screen direction across a cut when the same subject continues.
- Anchor transforms to the object or source that caused them.
- Use a shared color, shape, line, crop, or velocity as a bridge when scenes cannot share geometry.
- Use a hard cut when rhythm or argument needs a break; record that reason in the beat.

## Reading and Anti-PPT

Motion does not cure a static slide. A scene becomes Anti-PPT only when change carries meaning.

- Reveal the relationship, not a stack of cards.
- Sequence one causal fact at a time; hold after the decisive fact lands.
- Keep subtitles and key data still during their reading window.
- Use camera movement to reveal depth or hierarchy, not as constant wallpaper.
- Prefer a restrained secondary carrier—cursor path, crop, highlight, parallax layer—over multiple decorative entrances.
- Reject a long static card that only adds breathing, glow, or grain. Those are texture, not explanation.

## Performance and determinism

- Prefer `transform`, `opacity`, and justified `clip-path` for continuous movement.
- Treat animated layout properties as warnings; prove they remain stable at target resolution before accepting them.
- Avoid parent CSS variables that drive many descendants every frame.
- Register one deterministic paused timeline with the renderer. Avoid wall-clock timers, random values without fixed seeds, and animation started by page-load races.
- Run lint, validate, inspect, a render, and matching frame extraction after every timeline change.

Offline rendering may spend more than interactive UI, but preview jank and nondeterminism still hide defects.

## UI-to-video translation

| UI source idea | Vidio translation |
| --- | --- |
| Daily interaction frequency | Repetition within one video and viewer habituation |
| Feedback | Causal visual confirmation after an event |
| Interruptibility | Clean settle, reversible implication, and continuity at cuts |
| Trigger origin | Spatial source, destination, or shared bridge across shots |
| Sub-300ms UI budget | Role-specific frame bands plus a readable hold |
| Spring after gesture | Spring only for implied physical momentum |
| Reduced-motion media query | Motion safety and information that remains legible without movement |
| GPU-only interactive properties | Stable preview and deterministic render properties |
| Strict animation review | Contract hard gate plus evidence-based human verdict |

## Never ship

- A beat with no named purpose.
- Multiple unrelated high-salience changes at once.
- `ease-in` on entry or an object growing from normalized `scale(0)`.
- Back or spring easing with no physical reason.
- A camera move with no settle or readable hold.
- Text moving while the viewer must read it.
- The same fly-in choreography repeated through every scene.
- Ambient motion that competes with facts.
- A static card labeled Anti-PPT only because it has glow, grain, or breathing.
- A contract that describes different motion from the rendered source.
