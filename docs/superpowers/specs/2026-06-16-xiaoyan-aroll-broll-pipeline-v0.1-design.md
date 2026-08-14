# Xiaoyan A-roll+B-roll Pipeline v0.1 Design

## Goal

Build a personal-creator version of the AI video workflow: turn an existing A-roll video plus Whisper timestamp JSON into a Xiaoyan edit-decision package that can drive HyperFrames or Remotion assembly.

## Scope

v0.1 is a local, deterministic pipeline. It does not call paid APIs, regenerate digital humans, or run multi-agent review. It creates the contract that those later steps can plug into.

## Inputs

- A-roll MP4 path.
- Whisper JSON with token, word, or segment timestamps.
- Optional clean script text for better captions.
- Output slug.

## Outputs

Inside `industry7view-card-lab/xiaoyan/auto-edits/<slug>/`:

- `transcript.normalized.json`: normalized timed words and caption beats.
- `edit-decision.json`: A-roll/B-roll timeline, component choices, captions, and source paths.
- `scenes.generated.js`: generated Xiaoyan scene timeline module.
- `captions.generated.js`: generated caption module.
- `README.md`: human-readable summary and next commands.

## Decision Rules

- Keep the first 4-5 seconds and final 2-3 seconds as A-roll.
- Prefer Xiaoyan B-roll for semantic beats involving validation, risk, industrial chain, economics, or proof.
- Keep B-roll clips between 4 and 7 seconds where possible.
- Remove filler tokens such as `嗯`, `啊`, `呃`, `um`, and `uh` from the normalized transcript.
- Use the existing semiconductor Xiaoyan scene vocabulary in v0.1:
  - `XiaoyanGateLens`
  - `XiaoyanRiskDomino`
  - `XiaoyanValidationScroll`

## Non-goals

- No automatic LUT/color page.
- No Figma MCP round trip.
- No final 4K render.
- No automatic API transcription. Whisper JSON is accepted as input; transcription can remain a separate command.

## Validation

- Unit-test the parser and decision maker with a small fixture.
- Run the pipeline on the existing Jimeng A-roll test transcript.
- Parse generated JSON files.
- Validate generated scene timing for gaps and overlaps.
