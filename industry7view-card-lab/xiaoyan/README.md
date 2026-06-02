# Xiaoyan Motion Components

This directory contains the hand-drawn Xiaoyan IP motion track for Industry 7View.

The first supported component is `XiaoyanProfitPipe`.

## Production Split

- HyperFrames owns Xiaoyan hand-drawn motion clips.
- Remotion owns final timeline assembly, A-roll, B-roll, captions, and audio.

## Render Command

This command is added by the render automation task.

```bash
npm run xiaoyan:profit-pipe
```

## Alternate Props

```bash
node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
```

Use alternate props to verify that the component is reusable and not hard-wired to one SVG label set.

The command renders the canonical sample props into:

```text
xiaoyan/renders/profit-pipe-default/
  xiaoyan-profit-pipe.mp4
  preview.png
  props.json
  render-report.md
```

## QA Rules

- Xiaoyan is flat 2D line art.
- Xiaoyan holds a magnifying glass.
- The main object is a hand-drawn pipe, not a Swiss card.
- The render passes HyperFrames lint and inspect.
- `ffprobe` confirms 1080x1920, 30fps, and 6 seconds for the default sample.
