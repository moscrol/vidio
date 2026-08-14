# XiaoyanIndustryScroll

`XiaoyanIndustryScroll` explains industry-chain paths: where the chain begins, where value is realized, and which node deserves attention.

## Render

Default commercial aerospace sample:

```bash
npm run xiaoyan:industry-scroll
```

Semiconductor equipment sample:

```bash
node xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs xiaoyan/components/XiaoyanIndustryScroll/semi-props.json
```

## Props

```ts
type XiaoyanIndustryScrollProps = {
  id: string;
  topic: string;
  title: string;
  nodes: Array<{
    label: string;
    desc?: string;
    role?: 'upstream' | 'midstream' | 'downstream' | 'application';
  }>;
  highlightNode?: string;
  direction?: 'left-to-right' | 'upstream-to-downstream';
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: number;
};
```

## QA

```text
1. The visual reads as scroll/map, not pipe or validation gates.
2. Xiaoyan stays flat and holds the magnifier.
3. The highlighted node is visually distinct.
4. Node labels remain short and readable.
5. The footer stays inside the safe area.
```
