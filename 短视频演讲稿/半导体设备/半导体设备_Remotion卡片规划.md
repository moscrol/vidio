# 半导体设备 Remotion 卡片规划

## 压测目标

用半导体设备作为第三主题，验证当前视频系统能否从“主题研究”稳定转成“发布版短视频结构”。本次重点不是增加卡片数量，而是测试现有 `BusinessLoopMotion` 是否能表达“验证到订单”的阶段链，或是否需要新增 `OrderValidationCard`。

## 主线判断

半导体设备国产化，最难的不是实验室把设备造出来，而是晶圆厂敢不敢让它进产线、稳定跑产，并形成批量订单。

## 建议卡片数量

3-4 张。

不建议全程卡片轮播。35-50 秒应优先留给 B-roll，展示晶圆厂、设备调试、量测检测、良率监控等真实场景。

## 卡片 00：CoverCard

cardId：`00-cover-card`

类型：CoverCard

是否必须上屏：是

建议时长：2.5-3.5 秒

建议口播：

“很多人以为，半导体设备国产化，就是设备终于造出来了。”

建议字段：

```text
kicker：INDUSTRY 7VIEW / SEMI EQUIPMENT
titleHtml：半导体设备<br/>不是造出来就赢了
subtitle：真正的门槛，是晶圆厂敢不敢用
badge：半导体设备
```

画面任务：开场定调，建立“造出来 ≠ 赢了”的冲突。

## 卡片 01：CompareMotion

cardId：`04-not-a-is-b` 或新建同类型槽位

类型：compare

是否必须上屏：是

建议时长：5-7 秒

建议口播：

“真正的门槛，不在发布会，也不在实验室样机，而在晶圆厂敢不敢用。”

建议字段：

```text
titleHtml：能跑通 ≠ 敢上产线
leftLabel：实验室样机
leftText：参数跑通 / 单点验证 / 发布会展示
rightLabel：晶圆厂验证
rightText：稳定跑产 / 良率不掉 / 客户敢复购
explain：半导体设备的商业化，不是看样机，而是看产线信任。
```

画面任务：纠偏，避免观众把“做出来”误认为“商业兑现”。

## 卡片 02：OrderValidation 候选卡

cardId：建议先复用 `05-business-loop`

类型：loop 兜底；候选新组件为 `OrderValidationCard`

是否必须上屏：是

建议时长：8-11 秒

建议口播：

“从能跑通到能赚钱，中间隔着一条很长的验证链：样机、客户验证、小批量导入、长期跑产、批量订单。”

建议字段：

```text
titleHtml：从样机到订单<br/>中间隔着验证链
steps：
1. 样机
2. 客户验证
3. 小批量导入
4. 稳定跑产
5. 批量订单
footer：设备国产化的核心，是从技术可用走向客户敢用。
```

画面任务：本次压测核心。观察 `BusinessLoopMotion` 的闭环动效是否适合表达阶段门槛。

潜在问题：

- BusinessLoop 更像商业循环，而验证链是单向阶段门。
- 如果路径动画让观众误以为这是闭环，需要记录为 `OrderValidationCard` 的新增理由。
- 如果 5 个节点仍然清晰可读，可先继续用 loop 兜底。

## 卡片 03：TrackingChecklistCard

cardId：`06-tracking-checklist`

类型：checklist

是否必须上屏：是

建议时长：6-8 秒

建议口播：

“看这个行业，别只问有没有国产替代故事，要问三个问题。”

建议字段：

```text
titleHtml：半导体设备<br/>看三个信号
items：
1. 进验证：有没有进入头部晶圆厂验证
2. 有复购：有没有从首台套变成重复订单
3. 能兑现：收入和毛利有没有真正兑现
footer：题材变生意，要看验证、复购和兑现。
```

画面任务：把产业判断转成可跟踪指标。

## 卡片 04：ClosingQuote 可选

cardId：`07-closing-quote`

类型：quote

是否必须上屏：否

建议时长：4-6 秒

建议口播：

“晶圆厂敢用、产线跑得稳、客户愿意继续下单，这才是从题材变成生意的那一刻。”

建议字段：

```text
quote：真正的国产化，在产线和订单里
caption：不是发布会结束，而是客户复购开始
```

画面任务：如果结尾 A-roll 画面不够强，可以用金句卡收束；如果 A-roll 表现好，则不用上屏。

## 不建议使用的卡片

### DataHeroMotion

当前口播只有“12-24 个月”这个数字，但它不是整条视频唯一主判断。可作为字幕出现，不强制上 DataHero。

### LogisticsCard

“半导体设备像施工机械”这种类比容易拉远主线。本条不优先使用。

### EvidenceGridCard

公司名单会把视频带向荐股或产业链罗列，不适合本条“验证门槛”主线。

## B-roll 空窗建议

### 3-15 秒

洁净室、设备装机、工程师调试。目的：说明晶圆厂为什么谨慎。

### 35-50 秒

晶圆流片、缺陷检测、量测设备、良率曲线、设备维护。目的：承接“为什么稳定性重要”，避免连续卡片。

### 65-75 秒

A-roll 回收观点，或使用晶圆厂产线慢镜头 + 强字幕。

## 建议时间线

```text
0.0-3.0s：CoverCard
3.0-8.0s：A-roll / B-roll，建立晶圆厂真实场景
8.0-15.0s：CompareMotion
15.0-26.0s：OrderValidation 候选卡 / BusinessLoopMotion 兜底
26.0-45.0s：B-roll，讲验证成本、良率、稳定性
45.0-55.0s：TrackingChecklistCard
55.0-70.0s：A-roll / B-roll + 结尾强字幕
```

## 压测记录模板

```text
主题：半导体设备
口播时长：待生成音频后确认
是否有 SRT：待生成
使用组件：CoverCard / CompareMotion / BusinessLoopMotion 或 OrderValidation 候选 / TrackingChecklistCard

需要观察：
1. BusinessLoopMotion 是否能表达单向验证链。
2. 是否需要新增 OrderValidationCard。
3. 35-50 秒 B-roll 空窗是否自然。
4. 卡片是否过密。
5. 是否误导成公司名单或荐股视频。
```

## 进入 Remotion 前置条件

1. 先用 AI 口播稿生成音频。
2. 根据音频生成 SRT。
3. 将 SRT 和口播视频放入 `public/` 后再跑 `video:from-srt:draft`。
4. 人工检查 `card-plan.generated.json`，确认没有混入旧主题 fallback。
5. 再决定是否 promote 到正式 `cards.js` 和 `timeline-rules.json`。

风险提示：仅作产业研究和内容创作参考，不构成投资建议。
