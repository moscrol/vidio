---
name: vibe-director
description: Direct video work from an idea or existing project through brief, lane selection, sample, production, QC, and reusable-library promotion. Use for making, editing, remixing, animating, scripting, or planning videos; digital humans; talking-head content; product promos; Seedance/Jimeng footage; motion graphics; or continuing any project in vidio.
---

# Vibe Director

Own the production decision, not every tool. Read the material, choose one primary lane, create the project contract, and load only the skills that lane needs.

## Workflow

1. **Resolve the project.** Continue an existing `projects/<date>-<slug>/brief.md` when named. Otherwise create a project from [templates/brief.md](templates/brief.md). Use the current Asia/Taipei date and keep rendered media outside Git. Completion: one project directory and one authoritative brief.
2. **Read the piece.** Separate facts, audience promise, narrative, utility demonstration, and visual constraints. For narrative footage, use an installed director-read reference when available. For non-narrative UI or data demonstration, state the utility intent and refuse invented plot. Completion: the brief explains what the viewer should understand or feel, and what may not be fabricated.
3. **Choose one primary lane.** Use the routing table below. Add a secondary lane only when a shot cannot be made honestly by the primary lane. Completion: every shot or segment names its engine; no duplicate pipeline owns the same decision.
4. **Bind visual taste.** For any authored cover, card, UI demo, chart, typography frame, or promo visual, load `vibe-visual-taste` and write project-level `DESIGN.md` plus `visual-contract.json` before renderer code. Pure supplied footage with no designed overlay may skip this step. Completion: the visual contract has zero errors and a representative hero frame is defined.
5. **Bind motion taste.** For animation, compositing, UI movement, transitions, kinetic type, or camera moves, load `vibe-motion-taste` and write `motion-contract.json` after the visual contract. Completion: the motion contract passes with zero errors and does not override visual ownership.
6. **Make a sample.** Render a local 8–10 second representative sample before the full piece; a static deliverable uses one representative final-size frame instead. Paid APIs, voice cloning, generated people, and external publishing require explicit user authorization. Completion: sample metadata, current keyframes or frame, and a review verdict exist.
7. **Produce and verify.** Build with the selected engine, run its lint/validate/inspect loop, render final resolution, inspect matching keyframes, and record `BLOCK` or `APPROVE`. Completion: every brief acceptance item has evidence.
8. **Promote reuse.** After approval, ask once before moving a reusable component into `library/`. Copy [templates/manifest.json](templates/manifest.json), record provenance and parameters, and keep the original project intact. Completion: catalog and manifest agree.

## Routing table

| Primary lane | Choose when | Typical capability |
| --- | --- | --- |
| Motion composition | Typography, data, UI, diagrams, transitions, HTML video | `vibe-visual-taste` → `vibe-motion-taste` → HyperFrames / GSAP / Remotion |
| Product promo | A real product or page is the subject | `vibe-visual-taste` → product-video shotcraft; generated life scenes may become a secondary lane |
| Generated footage | The shot needs a camera, place, object, or impossible live-action image | Seedance / Jimeng prompt and sequence workflow |
| Digital human | A supplied or approved avatar presents the piece | digital-human production workflow with a preview gate |
| Talking-head finish | Script, voice, subtitles, and editorial B-roll carry the video | human-language/script → voice → captions → edit |
| Derivative work | A reference video must be transcribed and rewritten | download → transcript → rewrite → production; preserve source attribution |
| Live-action montage | Stock, supplied clips, ASR, TTS, or ffmpeg assembly dominate | OpenMontage tools only; keep vidio routing and QC |
| Cover / image post | The deliverable is a cover or image series | `vibe-visual-taste` → cover or article-to-images workflow |

If a routed external skill is absent, report the missing capability and use an installed compatible tool only when it preserves the brief. Never invent a skill path or claim an unavailable API ran.

## Workspace rules

- Create projects only under `projects/<YYYY-MM-DD>-<slug>/`; create reusable components only under `library/`.
- Default to no visible person. Add people, avatars, reflections, or recognizable faces only when the brief authorizes them.
- Use real UI and real claims for product demonstrations. Mark mock data and never fabricate financial performance or customer evidence.
- Keep `*.mp4`, `*.mov`, `*.mp3`, bulk frames, caches, and secrets out of Git. Commit contracts, source, representative evidence, and pointers.
- Treat OpenMontage as a tool supply. Keep its onboarding, pipeline, and project state outside vidio.
- Treat the renderer as an executor. Static hierarchy and tokens come from `vibe-visual-taste`; motion purpose and timing come from `vibe-motion-taste`, not from whichever library is convenient.

## Handoff

Report the project path, primary lane, sample/final artifacts, automated checks, human verdict, paid or missing capabilities, and reusable components proposed or promoted.
