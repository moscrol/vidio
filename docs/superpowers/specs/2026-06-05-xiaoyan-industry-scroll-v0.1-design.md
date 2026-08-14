# XiaoyanIndustryScroll v0.1 Design

## Goal

Build the third Xiaoyan hand-drawn motion component for Industry 7View: a reusable industry-chain scroll that explains a value path, upstream-to-downstream structure, or "who realizes value first" sequence.

The first sample should use the commercial aerospace script. A second props fixture should use semiconductor equipment.

## Why This Component

The current Xiaoyan component set covers:

| Component | Semantic Job |
|---|---|
| `XiaoyanProfitPipe` | 利润、成本、现金流、卡点 |
| `XiaoyanValidationChain` | 样机、验证、跑产、订单、兑现 |
| `XiaoyanIndustryScroll` | 产业链路径、上下游、谁先兑现 |

Commercial aerospace repeatedly uses a chain logic:

```text
低成本发射 -> 批量卫星制造 -> 低轨星座组网 -> 地面终端连接 -> 下游应用收费
```

This is not primarily a validation chain. It is an industry path and value-realization map.

## Non-Goals

```text
1. Do not build a full supply-chain database.
2. Do not list many company names.
3. Do not replace BusinessLoopMotion for Swiss-card output.
4. Do not express profit leakage or margin bottlenecks; use ProfitPipe for that.
5. Do not express customer validation stages; use ValidationChain for that.
```

## Component Boundary

`XiaoyanIndustryScroll` answers:

```text
一条产业链从哪里开始，到哪里兑现？
上游、中游、下游分别承担什么？
短期更容易先兑现的是哪一段？
```

It does not answer:

```text
利润阀门卡在哪里？
验证走到哪一步？
多条技术路线谁胜出？
风险因素如何做矩阵？
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

Validation rules:

```text
id: path-safe slug.
title: 4-16 Chinese characters preferred.
nodes: 4-6 items.
node.label: 2-8 Chinese characters preferred.
node.desc: optional, short phrase only.
highlightNode: must match one node label when present.
durationSeconds: default 8, allowed 6-10.
```

## Default Samples

Commercial aerospace:

```json
{
  "id": "industry-scroll-space",
  "topic": "商业航天",
  "title": "上天后怎么赚钱",
  "nodes": [
    {"label": "低成本发射", "role": "upstream"},
    {"label": "卫星制造", "role": "midstream"},
    {"label": "星座组网", "role": "midstream"},
    {"label": "地面终端", "role": "downstream"},
    {"label": "应用收费", "role": "application"}
  ],
  "highlightNode": "应用收费",
  "blueNote": "看完整链条",
  "redNote": "别只盯火箭",
  "footer": "商业航天不是能不能上天，而是上天之后能不能赚钱。",
  "durationSeconds": 8
}
```

Semiconductor equipment:

```json
{
  "id": "industry-scroll-semi",
  "topic": "半导体设备",
  "title": "造芯片先造机器",
  "nodes": [
    {"label": "核心零部件", "role": "upstream"},
    {"label": "整机设备", "role": "midstream"},
    {"label": "晶圆厂导入", "role": "midstream"},
    {"label": "稳定跑产", "role": "downstream"},
    {"label": "订单兑现", "role": "application"}
  ],
  "highlightNode": "订单兑现",
  "blueNote": "设备先过产线",
  "redNote": "别停在样机",
  "footer": "半导体设备的机会，不在传闻里，而在产线和订单里。",
  "durationSeconds": 8
}
```

## Visual Design

Canvas:

```text
1080x1920 vertical video.
Warm paper background.
Black hand-drawn ink as the base.
Blue annotation for direction.
Red annotation for wrong focus or common mistake.
Green or blue emphasis for highlightNode.
```

Xiaoyan:

```text
Flat 2D stick figure.
Always holds magnifier.
Position defaults to lower-left, inspecting the scroll path.
The figure must stay visually flatter than the scroll and nodes.
```

Industry scroll:

```text
A long horizontal hand-drawn parchment/scroll across the middle.
Nodes sit on the scroll from left to right.
Each node looks like a pinned hand label or small block.
The highlighted node is circled or underlined.
The chain should feel like a map, not a pipe and not a stage gate.
```

## Motion Design

Default 8-second sequence:

```text
0.0-0.8s: brand, topic, title appear.
0.8-1.5s: scroll unrolls across the canvas.
1.5-4.2s: nodes appear one by one from left to right.
4.2-5.4s: Xiaoyan scans the path with magnifier.
5.4-6.6s: highlightNode is circled; blue/red notes appear.
6.6-8.0s: footer appears and the full chain holds.
```

## Files

Expected implementation files:

```text
industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/index.html
industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/sample-props.json
industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/semi-props.json
industry7view-card-lab/xiaoyan/components/XiaoyanIndustryScroll/README.md
industry7view-card-lab/xiaoyan/scripts/render-xiaoyan-industry-scroll.mjs
```

Expected package script:

```text
xiaoyan:industry-scroll
```

## Verification

Required checks:

```text
1. Render commercial aerospace props.
2. Render semiconductor equipment props.
3. Verify output is 1080x1920.
4. Verify fps is 30.
5. Verify duration matches props within tolerance.
6. Save preview.png and render-report.md.
7. Inspect preview manually for: Xiaoyan flatness, magnifier presence, node readability, scroll-map semantics, and no style drift.
```

## Acceptance Criteria

```text
1. The clip reads as an industry path or scroll, not a profit pipe.
2. Xiaoyan remains a flat 2D stick figure and holds the magnifier.
3. Commercial aerospace and semiconductor props both render without layout collisions.
4. The highlighted node is visually distinct.
5. The footer remains readable.
6. Render script writes reports and fails on invalid dimensions or duration.
```

