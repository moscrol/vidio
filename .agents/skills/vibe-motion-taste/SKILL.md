---
name: vibe-motion-taste
description: Design, implement, audit, or review motion in fixed-timeline videos. Use for HyperFrames, GSAP, Remotion, HTML video compositions, transitions, camera moves, kinetic type, Anti-PPT work, motion-contract.json, or any request to make video motion feel intentional rather than merely animated.
---

# Vibe Motion Taste

Turn motion judgment into one project contract, then hold the renderer and review to it. Treat frames as the source of truth; UI animation values are source material, not video defaults.

## Workflow

1. **Read the project.** Read `brief.md`, the current composition, and any audio or cut timing. If no project contract exists, route through `vibe-director` first. Completion: audience, duration, fps, narrative purpose, constraints, and renderer are explicit.
2. **Gate the motion.** Inventory visible changes and assign one purpose to each: `orient`, `explain`, `emphasize`, `bridge`, `confirm`, or rare `delight`. Delete motion with no named purpose. Completion: each surviving beat has one focus and one purpose.
3. **Design in frames.** Read [references/motion-language.md](references/motion-language.md) completely before writing or changing a timeline. Choose the frame band, path, curve, settle, hold, and exit. Completion: text and data have stable reading windows; repeated or ambient movement stays subordinate.
4. **Write the contract.** Copy [templates/motion-contract.json](templates/motion-contract.json) into the composition root and describe intent, not selectors or renderer code. Keep `entry.fromScale` normalized to the final resting size. Completion: every beat is bounded by the composition duration and matches the intended timeline.
5. **Run the hard gate.** Execute:

   ```bash
   node .agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs <path>/motion-contract.json
   ```

   Fix every error before rendering. Carry warnings into the human review; never suppress them silently. Completion: zero errors.
6. **Implement with the selected renderer.** Load the relevant HyperFrames, GSAP, Remotion, WAAPI, CSS, or keyframe skill only now. Keep contract and code synchronized in the same change. Completion: renderer lint, validation, and inspection pass.
7. **Review the result.** Read [references/review-rubric.md](references/review-rubric.md) completely. Review at 1× mobile size, at 0.25× speed, and through matching keyframes. Completion: the report ends in explicit `BLOCK` or `APPROVE`; only `APPROVE` can ship or enter `library/`.

## Contract boundary

- Keep project state in `brief.md` and `motion-contract.json`; keep reusable judgment here.
- Let `vibe-director` select the video lane and renderer. This skill owns only motion purpose, timing, spatial continuity, and review.
- Keep external source history in `docs/sources/emilkowalski-skills.md`. Update this skill by deliberate translation; do not install or copy the upstream skill tree into the repository.
- Prefer deleting, reducing, or sequencing motion before adding polish.

## Required output

Return:

1. contract path and linter verdict;
2. renderer and exact composition checked;
3. human review path and verdict;
4. remaining warnings, if any, with their accepted reason.
