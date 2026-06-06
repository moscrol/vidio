# Xiaoyan Motion Components

This directory contains the hand-drawn Xiaoyan IP motion track for Industry 7View.

The library now includes reusable component samples plus a full 90.2-second
semiconductor equipment production.

## Production Split

- HyperFrames owns Xiaoyan hand-drawn motion clips.
- Remotion owns final timeline assembly, A-roll, B-roll, captions, and audio.

## Render Command

This command is added by the render automation task.

```bash
npm run xiaoyan:profit-pipe
```

Render the complete semiconductor equipment video:

```bash
npm run xiaoyan:semiconductor:v2
```

The production alternates the original A-roll with seven full-screen Xiaoyan
explanation scenes. Xiaoyan occupies about 73% of the timeline, while the
original voice track remains the single timing source.

```text
xiaoyan/finished/SemiconductorFinishedV2/
  scenes.js                 # timeline contract
  captions.js               # Xiaoyan scene captions
  scenes/                   # seven reusable full-screen scene modules
  composition.js            # deterministic scene assembly
  styles.css                # shared Xiaoyan visual system
```

Final output:

```text
../../outputs/semiconductor-finished-v2/
  semiconductor-equipment-xiaoyan-v2.mp4
  semiconductor-xiaoyan-v2-visual.mp4
  qa-*.png
  ffprobe.json
  render-report.md
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
