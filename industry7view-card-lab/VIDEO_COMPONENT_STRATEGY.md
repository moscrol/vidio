# Video Component Strategy

这份文档定义短视频组件库的来源、复用边界和进入视频流水线的方式。当前目标不是把组件库限制为 PNG，而是允许 `png`、`remotion`、`stitch` 三类组件共同存在，并通过统一的卡片语义和时间线进入发布视频。

## 1. 核心原则

```text
1. 先判断口播语义，再选择组件来源。
2. 组件来源服务表达，不反过来绑架内容。
3. PNG 负责稳定兜底，Remotion 负责动态图形，Stitch 负责外部设计资产和视觉探索。
4. 所有来源必须回到 Industry 7View token：深蓝、金色、浅纸底、白卡、9:16。
5. 任何新组件进入正式流程前，必须有字段边界、适用场景和校验规则。
```

## 2. 三类组件来源

| 来源 | 适用场景 | 优点 | 风险 | 当前状态 |
|---|---|---|---|---|
| `png` | 已验证七卡、快速换主题、发布前稳定合成 | 稳定、可视化一致、导出链路成熟 | 只能做整张图淡入/缩放，内部元素不可动 | 默认兜底 |
| `remotion` | 数据卡、对比卡、闭环卡、清单卡、动态图表 | 元素级动画、数字滚动、节点点亮、转场可编程 | 开发成本高，需要维护 tokens 和校验 | 优先升级方向 |
| `stitch` | 外部设计稿、Stitch 生成组件、视觉探索稿、产品演示式动画 | 可引入更丰富设计资产和布局灵感 | 不能直接接管当前 SRT/卡片流程，需要转译 | 候选来源 |

## 3. 推荐字段模型

后续 `cards.js` 或 `card-plan.generated.json` 可逐步增加以下字段，不要求一次性改完：

```json
{
  "id": "02-data-hero-card",
  "type": "dataHero",
  "componentSource": "png",
  "renderMode": "overlay",
  "recipe": "dataHero.numberEmphasis",
  "stitchRef": null
}
```

字段含义：

| 字段 | 说明 |
|---|---|
| `componentSource` | `png`、`remotion`、`stitch` 三选一，表示组件资产来源。 |
| `renderMode` | `overlay`、`nativeMotion`、`brollOverlay`、`stitchConverted` 等渲染方式。 |
| `recipe` | 动效配方，连接 timeline-rules、motion-plan 和 Remotion 组件。 |
| `stitchRef` | 如果来自 Stitch，记录项目、页面、组件或导出文件引用。 |

## 4. 选择规则

### 4.1 继续使用 PNG

适合：

```text
封面、金句、低频卡片、尚未定义字段边界的新组件、需要快速发布的主题。
```

### 4.2 升级为 Remotion 原生组件

优先：

```text
DataHeroCard：数字滚动、单位弹出、背景网格微动。
CompareCard：左右滑入、分割线生长、关键词强调。
BusinessLoopCard：节点逐个点亮、路径推进、当前步骤放大。
TrackingChecklistCard：逐项打勾、风险/通过状态切换。
```

### 4.3 引入 Stitch 组件

适合：

```text
1. Stitch 生成了比现有卡片更适合的布局。
2. 外部设计稿包含可复用的信息图结构。
3. 需要快速探索新视觉，但不想污染主组件库。
```

进入正式流程前必须转译为其中一种形态：

```text
Stitch 静态设计 → PNG 资产 → 走现有 overlay。
Stitch 设计结构 → Remotion 组件 → 走 nativeMotion。
Stitch 设计规范 → VIDEO_DESIGN.md / tokens → 只吸收规则，不进入渲染。
```

## 5. 流程位置

新的生产链路应理解为：

```text
SRT / 口播稿
→ card intent
→ component strategy
→ cards.generated.js / timeline-rules.generated.json
→ png / remotion / stitchConverted
→ motion-plan.json
→ Remotion render
→ publish review
```

## 6. 当前落地优先级

```text
P0：保留 PNG overlay 作为稳定发布路径。
P1：让 recipe 真正驱动 Remotion 原生动态组件。
P2：DataHeroCard 先支持 nativeMotion。
P3：CompareCard、BusinessLoopCard 支持 nativeMotion。
P4：Stitch 组件先作为设计探索和转译来源，不直接接管渲染。
```
