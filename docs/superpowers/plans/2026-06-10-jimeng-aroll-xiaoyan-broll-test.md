# Jimeng A-roll Xiaoyan B-roll Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a 28.816667-second vertical test video that combines the approved Jimeng digital-human A-roll with three existing Xiaoyan full-screen B-roll scenes.

**Architecture:** Create an isolated HyperFrames composition that imports the existing Gate Lens, Risk Domino, and Validation Scroll renderers and shared visual system. Use the Jimeng file as the sole audio source and master duration, with scene cuts at 5, 11, 15, 21, and 26.5 seconds.

**Tech Stack:** HyperFrames, ES modules, CSS, local Whisper transcription, ffmpeg, Node validation.

---

### Task 1: Prepare Source Media And Transcript

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/media/aroll.mp4`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/transcript.json`

- [ ] Transcode the 704×1248 60fps source to 720×1280 30fps H.264 while preserving AAC audio.
- [ ] Run local HyperFrames transcription with Chinese language and `large-v3`.
- [ ] Review transcript timestamps and derive subtitle groups for the three Xiaoyan sections.

### Task 2: Build The Isolated Test Composition

**Files:**
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/index.html`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/composition.js`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/scenes.js`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/captions.js`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/styles.css`
- Create: `industry7view-card-lab/xiaoyan/finished/JimengXiaoyanBrollTestV1/validate-scenes.test.mjs`

- [ ] Define the exact 0–5, 5–11, 11–15, 15–21, 21–26.5, and 26.5–28.816667 timeline.
- [ ] Import the existing Xiaoyan renderer modules instead of duplicating their implementation.
- [ ] Mount only Gate Lens, Risk Domino, and Validation Scroll.
- [ ] Display captions only during Xiaoyan full-screen sections.
- [ ] Add A-roll cover framing, subtle brand cover over the lower-right watermark, and paper transitions.
- [ ] Copy the approved avatar PNG assets into the composition media folder.

### Task 3: Validate And Render

**Files:**
- Output: `/Users/a77/Documents/Codex/2026-06-01/skill/outputs/jimeng-xiaoyan-broll-test-v1/jimeng-xiaoyan-broll-test-v1.mp4`

- [ ] Run the scene test.
- [ ] Run HyperFrames lint and inspect.
- [ ] Render the composition at 720×1280, 30fps.
- [ ] Verify duration, video/audio codecs, and dimensions with ffprobe.
- [ ] Extract frames at 2, 7, 12, 17, 23, and 27.5 seconds.
- [ ] Inspect all frames for cropping, subtitle overlap, watermark treatment, and scene continuity.
- [ ] Commit only the new composition source and plan; keep generated media ignored.

