# XiaoyanValidationChain v0.1 Design

## Goal

Build the next Xiaoyan hand-drawn motion component for Industry 7View: a reusable validation-chain clip that explains how a technology moves from demo or prototype to customer trust, stable production, orders, revenue, and margin.

The first sample should use the semiconductor equipment script. A second props fixture should use the humanoid robot script.

## Why This Component

Existing docs already mark `OrderValidationCard` as a promotion candidate. The new audit confirms the same semantic need in Xiaoyan style:

| Theme | Repeated Need | Fit |
|---|---|---|
| Semiconductor equipment | 样机 -> 客户验证 -> 小批量导入 -> 长期跑产 -> 批量订单 -> 收入毛利兑现 | Strong |
| Humanoid robots | Demo -> 进工厂 -> 稳定干活 -> 客户验收 -> 付钱 / 量产 | Medium-strong |

Commercial aerospace is not a primary validation-chain sample. It should remain an `IndustryScroll` or `ProfitPipe` case.

## Non-Goals

```text
1. Do not build a full script-to-video automation system.
2. Do not replace Swiss/Remotion cards.
3. Do not render all Xiaoyan P1 components in this iteration.
4. Do not make Xiaoyan a constant full-video mascot.
5. Do not use commercial aerospace as the first validation-chain sample.
```

## Component Boundary

`XiaoyanValidationChain` answers:

```text
验证走到哪一步？
从技术可用到客户敢用，中间卡在哪里？
最后怎样证明它从题材变成生意？
```

It does not answer:

```text
产业链上下游怎么分布？
利润从哪里流出来？
多条技术路线谁胜出？
风险因素如何做矩阵？
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

Validation rules:

```text
id: path-safe slug.
title: 4-16 Chinese characters preferred.
stages: 4-6 items.
stage.label: 2-8 Chinese characters preferred.
stage.desc: optional, short phrase only.
riskStage: must match one stage label when present.
finalProof: one short phrase, used at the terminal node.
durationSeconds: default 8, allowed 6-10.
```

## Default Samples

Semiconductor equipment:

```json
{
  "id": "validation-chain-semi",
  "topic": "半导体设备",
  "title": "从样机到订单",
  "stages": [
    {"label": "样机", "state": "done"},
    {"label": "客户验证", "state": "current"},
    {"label": "小批量导入", "state": "next"},
    {"label": "长期跑产", "state": "risk"},
    {"label": "批量订单", "state": "next"}
  ],
  "riskStage": "长期跑产",
  "finalProof": "收入和毛利兑现",
  "blueNote": "看验证进度",
  "redNote": "卡在产线信任",
  "footer": "真正的国产化，在产线和订单里。",
  "durationSeconds": 8
}
```

Humanoid robots:

```json
{
  "id": "validation-chain-robot",
  "topic": "人形机器人",
  "title": "从 Demo 到产品",
  "stages": [
    {"label": "Demo", "state": "done"},
    {"label": "进工厂", "state": "current"},
    {"label": "稳定干活", "state": "risk"},
    {"label": "客户验收", "state": "next"},
    {"label": "批量付费", "state": "next"}
  ],
  "riskStage": "稳定干活",
  "finalProof": "客户愿意付钱",
  "blueNote": "不是动作炫技",
  "redNote": "死亡谷在稳定性",
  "footer": "会跳舞的是样品，能干活不坏的才是产品。",
  "durationSeconds": 8
}
```

## Visual Design

Canvas:

```text
1080x1920 vertical video.
White or slightly warm paper background.
Hand-drawn black linework.
Blue annotation for explanation.
Red annotation for bottleneck or risk.
Green annotation for final proof if needed.
```

Xiaoyan:

```text
Flat 2D stick figure.
Round head, black line body, no uncanny facial detail.
Always holds a magnifier.
Position defaults to bottom-left or bottom-right.
The figure can lean, inspect, or point, but stays flat.
```

Validation chain object:

```text
A horizontal or diagonal sequence of hand-drawn stage gates.
Each gate is slightly dimensional, but not glossy or corporate.
Done stages are light ink/blue.
Current stage is blue-highlighted.
Risk stage gets red hand annotation.
Final proof lights up at the terminal end.
```

Typography:

```text
Use fixed Chinese font via @font-face if available.
Keep node text short.
No paragraph-heavy cards.
```

## Motion Design

Default 8-second sequence:

```text
0.0-0.8s: paper, title, topic tag appear.
0.8-1.5s: Xiaoyan enters with magnifier and looks at the first stage.
1.5-4.2s: stage gates draw in one by one.
4.2-5.6s: magnifier scans the riskStage; red note appears.
5.6-7.0s: finalProof terminal node lights up.
7.0-8.0s: footer appears; all elements hold for preview capture.
```

## Files

Expected implementation files:

```text
industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/index.html
industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/sample-props.json
industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/robot-props.json
industry7view-card-lab/xiaoyan/components/XiaoyanValidationChain/README.md
industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-validation-chain.mjs
```

Expected package script:

```text
xiaoyan:validation-chain
```

## Verification

Required checks:

```text
1. Render default semiconductor props.
2. Render robot props.
3. Verify output is 1080x1920.
4. Verify fps is 30.
5. Verify duration matches props within tolerance.
6. Save preview.png and render-report.md.
7. Inspect preview manually for Xiaoyan flatness, magnifier presence, readable stages, and no style drift.
```

## Acceptance Criteria

```text
1. Xiaoyan remains a flat 2D stick figure and holds the magnifier.
2. The component clearly reads as a stage validation chain, not a business loop.
3. Semiconductor equipment and humanoid robot props both render without layout collisions.
4. No node contains long paragraph text.
5. The riskStage annotation targets the intended stage.
6. The finalProof is visually distinct from intermediate stages.
7. The render script writes a machine-readable report and fails on invalid dimensions or duration.
```

