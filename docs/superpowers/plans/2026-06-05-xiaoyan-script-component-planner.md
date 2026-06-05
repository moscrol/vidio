# Xiaoyan Script Component Planner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local script that converts script/SRT/storyboard text into Xiaoyan component matching JSON and Markdown.

**Architecture:** A Node ESM script reads an input file, extracts voiceover segments, classifies each segment with deterministic keyword rules, drafts semantic component props, and writes JSON/Markdown into `xiaoyan/component-plans/`.

**Tech Stack:** Node.js ESM, Markdown/text parsing, existing package scripts.

---

## Files

```text
industry7view-card-lab/xiaoyan/scripts/generate-xiaoyan-component-plan.mjs
industry7view-card-lab/package.json
industry7view-card-lab/SCRIPT_TO_COMPONENT_WORKFLOW.md
```

## Tasks

- [ ] Create `generate-xiaoyan-component-plan.mjs`.
- [ ] Support Markdown, TXT, and SRT inputs.
- [ ] Generate both `.json` and `.md` outputs.
- [ ] Add `xiaoyan:component-plan` package script.
- [ ] Test on commercial aerospace and semiconductor equipment scripts.
- [ ] Update workflow docs with command examples.

## Verification

```bash
cd industry7view-card-lab
npm run xiaoyan:component-plan -- ../短视频演讲稿/商业航天/商业航天_AI口播稿.md
npm run xiaoyan:component-plan -- ../短视频演讲稿/半导体设备/半导体设备_AI口播稿.md
```

Expected:

```text
xiaoyan/component-plans/商业航天_AI口播稿.component-plan.md
xiaoyan/component-plans/商业航天_AI口播稿.component-plan.json
xiaoyan/component-plans/半导体设备_AI口播稿.component-plan.md
xiaoyan/component-plans/半导体设备_AI口播稿.component-plan.json
```

