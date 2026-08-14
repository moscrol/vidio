# Xiaoyan A-roll+B-roll Pipeline v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic local pipeline that converts A-roll media plus Whisper timestamp JSON into Xiaoyan edit-decision artifacts.

**Architecture:** Add a focused pipeline library for transcript normalization, beat grouping, and scene decisions, then expose it through one CLI script. The CLI writes JSON plus generated JS modules that the existing Xiaoyan composition layer can consume.

**Tech Stack:** Node.js ESM, ffprobe/ffmpeg metadata, existing Xiaoyan HyperFrames scene vocabulary.

---

### Task 1: Pipeline Library

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/aroll-broll-pipeline-lib.mjs`
- Test: `industry7view-card-lab/xiaoyan/scripts/aroll-broll-pipeline-lib.test.mjs`

- [x] Normalize Whisper JSON from segment/tokens into timed words.
- [x] Remove filler tokens.
- [x] Group words into caption beats.
- [x] Classify beats into A-roll or Xiaoyan component candidates.
- [x] Validate scene gaps and overlaps.

### Task 2: CLI Entrypoint

**Files:**
- Create: `industry7view-card-lab/xiaoyan/scripts/run-aroll-broll-pipeline.mjs`
- Modify: `industry7view-card-lab/package.json`

- [x] Accept `--aroll`, `--transcript`, `--script`, `--slug`, and `--out`.
- [x] Probe A-roll duration when available.
- [x] Write the normalized transcript, decision JSON, generated scene module, generated caption module, and summary README.

### Task 3: Fixture Run

**Files:**
- Create output under `industry7view-card-lab/xiaoyan/auto-edits/jimeng-semiconductor-test/`

- [x] Run the CLI against the existing Jimeng transcript and A-roll.
- [x] Validate generated JSON and scene timings.

### Task 4: Documentation and Commit

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/README.md`
- Add this spec and plan.

- [x] Document the new command and output contract.
- [x] Commit the pipeline implementation.
