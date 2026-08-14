# Industry 7View Variant Matrix v1.6

这份文档集中管理所有卡片组件的变体。它用于区分三类状态：已经代码支持、已经文档定义但未显式入参、未来观察中的候选变体。

## 1. 变体原则

```text
1. 变体必须来自真实使用场景，不因为单张卡好看就新增。
2. 每个组件优先控制在 3-5 个变体维度内。
3. 先补必需变体，再补后置变体。
4. 能通过内容字段解决的，不新增变体。
5. 能通过已有变体解决的，不新增组件。
```

## 2. 状态定义

| 状态 | 含义 | 处理方式 |
|---|---|---|
| Supported | 代码和校验已支持 | 可直接在 `cards.js` 使用 |
| Documented | 文档已定义，但代码未显式使用 `variant` 字段 | 先按当前模板和字段隐式处理 |
| Candidate | 真实主题暴露过，但未达到 2-3 次重复 | 记录到 `COMPONENT_GAP_LOG.md` |
| PromotionCandidate | 已达到 2-3 次重复，正在定义组件边界和字段 | 先更新 `CARD_SPEC.md`，不直接写代码 |
| Rejected | 不进入组件库 | 用文案、剪辑或 B-roll 解决 |

## 3. 全局变体

| 维度 | 可选值 | 状态 | 说明 |
|---|---|---|---|
| `theme` | `paper` / `navy` | Documented | 当前多由卡片类型决定，未统一开放 |
| `highlight` | `gold` / `risk` / `neutral` | Documented | 通过 `titleHtml` 中的 span class 隐式实现 |
| `footer` | `visible` / `hidden` | Documented | 多数卡片已有可选 footer 字段 |
| `meta` | `visible` / `hidden` | Documented | 多数卡片已有可选 meta 字段 |
| `timeline` | `included` / `coverOnly` | Supported | 由 `motion-plan.json` 控制 |

## 4. Pattern 变体矩阵

### 00 CoverCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `theme` | `navy` | Documented | 默认封面深蓝主视觉 |
| `badge` | `visible` / `hidden` | Documented | 是否显示角标 |
| `subtitle` | `visible` / `hidden` | Documented | 信息流标题需要解释时显示 |
| `timelineRole` | `coverOnly` / `intro` | Supported | 只做平台封面，或进入 0-2 秒开场 |

### 01 HookCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `emphasis` | `gold` / `risk` / `neutral` | Documented | 反常识词、风险词或中性判断 |
| `titleLines` | `1` / `2` / `3` | Documented | 控制标题信息密度 |
| `subtitle` | `visible` / `hidden` | Documented | 是否补充一句解释 |
| `hookType` | `mythBreak` / `strongClaim` / `question` | Candidate | 后续可用于 SRT 自动选卡 |

### 02 DataHeroCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `numberScale` | `normal` / `longNumber` | Documented | 长数字需要降低字号或拆单位 |
| `compare` | `visible` / `hidden` | Documented | 是否需要对比基准 |
| `unitPosition` | `inline` / `bottom` | Documented | 单位横排或下沉 |
| `dataType` | `price` / `marketSize` / `order` / `penetration` / `cost` / `ratio` | Candidate | 用于后续自动选择文案模板 |

### 03 LogisticsCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `analogyType` | `equation` / `metaphor` / `role` | Documented | A=B、A 像 B、A 扮演什么角色 |
| `orbitLine` | `visible` / `hidden` | Documented | 是否显示辅助线条 |
| `difficulty` | `basic` / `advanced` | Candidate | 区分大众科普和产业读者解释 |

### 04 CompareCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `connector` | `≠` / `→` / `=` | Documented | 否定、转化、等价 |
| `contrastMode` | `old-new` / `myth-truth` / `tech-business` | Documented | 旧认知 vs 新变量、误解 vs 真相、技术 vs 商业 |
| `sideLength` | `short` / `medium` | Candidate | 左右词组偏长时观察是否需要变体 |

### 05 BusinessLoopCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `stepCount` | `3` / `4` / `5` | Documented | 闭环节点数量 |
| `finalEmphasis` | `goldBg` / `goldBorder` / `navyBg` | Documented | 最后一步强调订单、付费、利润等兑现变量 |
| `loopType` | `valueChain` / `businessLoop` / `decisionPath` / `manufacturingPath` | Candidate | 产业链、商业闭环、决策路径、制造路径 |

### 06 TrackingChecklistCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `itemCount` | `3` / `4` | Documented | 跟踪变量数量 |
| `desc` | `short` / `medium` | Documented | 描述长短 |
| `trackingType` | `catalyst` / `risk` / `metric` / `milestone` | Candidate | 催化、风险、指标、里程碑 |

### 07 ClosingQuoteCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `theme` | `navy` / `paper` | Documented | 深色结论或浅色结论 |
| `url` | `visible` / `hidden` | Documented | 是否显示主站链接 |
| `disclaimer` | `visible` / `hidden` | Documented | 是否显示风险提示 |
| `closingType` | `quote` / `summary` / `cta` | Candidate | 金句、总结、互动引导 |

### 08 EvidenceGridCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `grid` | `2x2` / `2x3` | Documented | 4 条或 6 条证据 |
| `contentType` | `company` / `product` / `deal` / `technology` / `scenario` | Documented | 公司、产品、交易、技术、场景 |
| `media` | `textOnly` / `imageGrid` | Candidate | 是否需要图片证据墙 |
| `timelineRole` | `enabled` / `disabled` | Supported | 可导出但不一定进视频 |

## 5. 候选新 Pattern

以下只作为观察项，不代表已经决定新增。

| 候选组件 | 可能变体 | 来源场景 | 当前处理 |
|---|---|---|---|
| TimelineCard | `policy` / `technology` / `commercialization` | 发展历程、政策节点、产品迭代 | P2 观察 |
| RouteCompareCard | `techRoute` / `businessRoute` | 技术路线、模式对比 | 先用 CompareCard |
| RiskMatrixCard | `policy` / `tech` / `demand` / `valuation` | 多空分歧、风险提示 | 先用 ClosingQuote + 口播 |
| SupplyChainCard | `upstream-midstream-downstream` / `bottleneck` | 产业链位置、卡脖子环节 | 先用 BusinessLoop |
| OrderValidationCard | `customer` / `order` / `capacity` / `financial` | 订单兑现、客户验证、批量交付、财务兑现 | PromotionCandidate，已定义到 `CARD_SPEC.md` |
| SupplyChainShiftCard | `profitPool` / `designPower` / `localization` / `systemUpgrade` | 利润池、设计权、国产替代、系统方案迁移 | PromotionCandidate，已定义到 `CARD_SPEC.md` |
| PriceCycleCard | `resource` / `capacity` / `inventory` | 周期品、价格弹性 | 待真实主题验证 |

## 6. PromotionCandidate 边界摘要

### OrderValidationCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `validationType` | `customer` / `order` / `capacity` / `financial` | PromotionCandidate | 客户认证、订单兑现、产能交付、收入毛利验证 |
| `stageCount` | `4` / `5` / `6` | PromotionCandidate | 样机到收入的阶段数量 |
| `currentStatus` | `done` / `current` / `next` / `risk` | PromotionCandidate | 每个阶段的验证状态 |

适合回答“验证到哪一步”，不替代 TrackingChecklist 的“接下来跟踪什么”。

### SupplyChainShiftCard

| 维度 | 可选值 | 状态 | 使用场景 |
|---|---|---|---|
| `shiftType` | `profitPool` / `designPower` / `localization` / `systemUpgrade` | PromotionCandidate | 利润池、设计权、国产替代、系统方案迁移 |
| `driverCount` | `2` / `3` / `4` | PromotionCandidate | 迁移驱动因素数量 |
| `direction` | `upstream` / `downstream` / `system` / `localization` | PromotionCandidate | 价值和话语权迁移方向 |

适合回答“价值迁移到哪里”，不替代 BusinessLoop 的“价值如何形成”。

## 7. 下一步代码化建议

短期不强制给所有卡片增加 `variant` 字段。建议先按以下顺序推进：

```text
1. 保持现有 `cards.js` 可运行。
2. 在 `CARD_SPEC.md` 中继续记录变体边界。
3. 对高频且会影响渲染结构的变体，才进入 `cards.js` 显式字段。
4. 显式字段进入后，同步更新 `check-cards.mjs`。
5. 不为纯文案差异增加代码变体。
```
