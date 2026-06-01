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

```bash
npm run xiaoyan:profit-pipe
```
