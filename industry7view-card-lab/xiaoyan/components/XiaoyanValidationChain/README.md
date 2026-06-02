# XiaoyanValidationChain

`XiaoyanValidationChain` explains validation progress from prototype or demo to customer trust and commercial proof. It is for scripts that ask: "验证走到哪一步？"

## Render

Default semiconductor sample:

```bash
npm run xiaoyan:validation-chain
```

Humanoid robot sample:

```bash
node xiaoyan/scripts/render-xiaoyan-validation-chain.mjs xiaoyan/components/XiaoyanValidationChain/robot-props.json
```

## Props

```ts
type XiaoyanValidationChainProps = {
  id: string;
  topic: string;
  title: string;
  stages: Array<{
    label: string;
    desc?: string;
    state: 'done' | 'current' | 'next' | 'risk';
  }>;
  riskStage?: string;
  finalProof: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: number;
};
```

## QA

```text
1. Xiaoyan remains a flat 2D stick figure.
2. Xiaoyan holds the magnifier.
3. The component reads as a stage chain, not a business loop.
4. The red note points at the risk stage.
5. The final proof is visually distinct.
6. Stage labels stay short and readable.
```
