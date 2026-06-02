# XiaoyanProfitPipe

`XiaoyanProfitPipe` expresses profit, cash flow, and commercial realization logic with Xiaoyan inspecting a hand-drawn pipe.

## Use When

- The script asks where profit comes from.
- The script explains demand, cost, price, competition, or cash-flow realization.
- The script asks whether a hot theme can become real business.

## Do Not Use For

- Full industry-chain maps.
- Prototype-to-order validation chains.
- Data hero cards.
- Final quote cards.

## Props

```ts
type XiaoyanProfitPipeProps = {
  id: string;
  topic: string;
  title?: string;
  factors: string[];
  bottleneck?: {
    label: string;
    targetFactor?: string;
  };
  resultLabel: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: 6 | 8;
};
```

## Render

This command is added by the render automation task.

```bash
npm run xiaoyan:profit-pipe
```

## Output Contract

Each render writes:

```text
xiaoyan/renders/<props.id>/
  xiaoyan-profit-pipe.mp4
  preview.png
  props.json
  render-report.md
```

## v0.1 Acceptance

- Default props render to 1080x1920 MP4.
- Alternate props render without editing SVG or HTML.
- HyperFrames lint has 0 errors.
- HyperFrames inspect has 0 layout issues.
- Xiaoyan remains a flat 2D stick figure with magnifier.
