# Industry 7View Motion Recipe Pack v1.0

用途：把 `industry7view-card-lab` 的静态 PNG 卡片，转成剪映可执行、未来 Remotion 可工程化的短视频动效规范。

这份文件不替代 `CARD_SPEC.md`。`CARD_SPEC.md` 定义静态卡片长什么样；本文件定义这些卡片进入视频后怎么动、什么时候动、动多久、和口播/字幕如何配合。

## 1. 定位

```text
cards.js             内容结构
CARD_SPEC.md         静态视觉规格
MOTION_RECIPE_PACK   动效语法
CAPCUT_TEMPLATE      剪映装配流程
Remotion             未来自动生成视频的工程实现
```

当前阶段：先固定 motion recipe，再用剪映验证，最后再决定是否做 Remotion 组件。

## 2. 全局动效原则

### 2.1 品牌气质

Industry 7View 的动效不是网红模板，也不是纯科技炫技。

```text
克制
研究感
短促
清晰
有证据感
不花哨
不弹跳过度
```

### 2.2 动效目标

每个动效必须服务一个目标：

| 目标 | 说明 |
|---|---|
| 建立层级 | 先让观众看到最重要的信息 |
| 跟随口播 | 口播讲到哪里，画面点亮到哪里 |
| 降低理解成本 | 把复杂信息拆成逐步出现 |
| 强化记忆点 | 金色强调只用于核心数据/结论 |
| 保持节奏 | 每 2-4 秒画面有一次轻微变化 |

### 2.3 禁止动效

```text
大幅弹跳
夸张旋转
频繁闪烁
霓虹描边
花字飞入
表情包式抖动
过度粒子特效
无意义转场
```

### 2.4 推荐参数

| 参数 | 建议值 |
|---|---:|
| 入场时长 | 0.25-0.45s |
| 出场时长 | 0.15-0.25s |
| 元素错峰 | 0.08-0.16s |
| 上浮位移 | 12-24px |
| 缩放范围 | 0.96-1.04 |
| 持续停留 | 2.5-4s |
| 复杂卡停留 | 4-6s |

### 2.5 缓动风格

```text
ease-out：入场
ease-in：出场
ease-in-out：轻微镜头推近
spring：只用于数字/节点轻微强调，不用于大面积弹跳
```

## 3. 全局时间轴建议

60-75 秒短视频中，卡片不是连续 PPT 播放，而是穿插在口播和 B-roll 中。

```text
00-cover-card          只做平台封面；可选 0-2s 开场
01-hook-card           0-3s
02-data-hero-card      6-12s
03-logistics-card      12-18s
04-not-a-is-b          20-28s
05-business-loop       30-42s
08-evidence-grid-card  42-50s，可选
06-tracking-checklist  50-62s
07-closing-quote       62-75s
```

实际顺序可以根据口播调整。正文七卡仍是主结构，`08-evidence-grid-card` 是可选证据补充。

## 4. Card Motion Recipes

## 4.1 CoverCard：平台封面 / 可选开场

### 使用时机

```text
平台支持单独上传封面：只做封面，不进时间线。
平台不方便单独设封面：放在视频 0-2 秒。
```

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 背景静止出现 |
| 0.10s | kicker 淡入 |
| 0.18s | 主标题整体从下方 16px 上浮 |
| 0.35s | 金色标题行轻微亮起 |
| 0.55s | subtitle 淡入 |
| 0.75s | badge 淡入 |
| 1.80s | 整体轻微暗出，切正文 |

### 剪映做法

```text
如果只做封面：不加动效，直接作为平台封面上传。
如果进时间线：使用“渐显”+ 轻微关键帧上移，不加夸张转场。
```

### Remotion 映射

```text
<CoverCardMotion />
props: cover
animation: titleFadeUp, goldLineEmphasis, subtitleFade
```

## 4.2 HookCard：3 秒反常识钩子

### 使用时机

视频正式开头，用来承接口播第一句强判断。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 卡片整体淡入 |
| 0.10s | meta 淡入 |
| 0.18s | 主标题第一行上浮出现 |
| 0.32s | 金色/红色关键词出现 |
| 0.52s | subtitle 出现 |
| 2.50s | 保持静止，方便阅读 |
| 2.80s | 快速淡出或硬切 B-roll |

### 剪映做法

```text
整张 PNG：渐显 0.3s。
如果要更细：标题区域用复制层+蒙版做上浮，但 v1 阶段可不做。
```

### Remotion 映射

```text
<HookCardMotion />
animation: staggerTitleReveal, keywordAccentPulse
```

## 4.3 DataHeroCard：数据冲击

### 使用时机

口播讲到核心数据时出现。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 卡片淡入 |
| 0.10s | meta 出现 |
| 0.20s | number 计数或缩放出现 |
| 0.45s | unit 淡入 |
| 0.65s | label 出现 |
| 0.95s | compareText 出现 |
| 1.20s | insight 深蓝块出现 |
| 3.50s | 保持静止 |

### 剪映做法

```text
低成本：整张 PNG 渐显 + 轻微放大 100%→103%。
进阶：数字单独做文字层计数，覆盖 PNG 数字区域。
```

### Remotion 映射

```text
<DataHeroMotion />
animation: numberCounter, unitFade, insightBlockReveal
```

## 4.4 LogisticsCard：生活化类比

### 使用时机

把复杂概念变成类比时出现。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 卡片淡入 |
| 0.15s | 标题出现 |
| 0.40s | 金色类比词强调 |
| 0.65s | subtitle 出现 |
| 0.90s | orbit-line 轻微横向展开 |
| 3.00s | 保持静止 |

### 剪映做法

```text
整张 PNG 渐显。
如果需要动态：用线条素材覆盖 orbit-line，做 0.4s 横向拉伸。
```

### Remotion 映射

```text
<LogisticsCardMotion />
animation: metaphorReveal, orbitLineGrow
```

## 4.5 CompareCard：误解 vs 真相

### 使用时机

纠偏大众误解时出现。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 左侧 old box 出现 |
| 0.25s | 中间 ≠ 出现 |
| 0.45s | 右侧 new box 出现 |
| 0.75s | explain 出现 |
| 3.00s | 保持静止 |

### 剪映做法

```text
整张 PNG 可直接硬切。
进阶：用三个裁切层分别控制 old / ≠ / new 依次出现。
```

### Remotion 映射

```text
<CompareCardMotion />
animation: oldNewReveal, symbolPop, explanationFade
```

## 4.6 BusinessLoopCard：价值路径

### 使用时机

讲产业链、商业闭环、技术路线、兑现路径时出现。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 标题淡入 |
| 0.30s | step 01 点亮 |
| 0.55s | step 02 点亮 |
| 0.80s | step 03 点亮 |
| 1.05s | step 04 点亮 |
| 1.30s | final step 金色强调 |
| 4.50s | 保持静止 |

### 剪映做法

```text
低成本：整张 PNG 停留 4-6 秒。
进阶：给每个 step 覆盖半透明深蓝块，逐个取消遮罩。
```

### Remotion 映射

```text
<BusinessLoopMotion />
animation: sequentialStepHighlight, finalStepAccent
```

## 4.7 TrackingChecklistCard：收藏清单

### 使用时机

视频后半段，给观众一个可收藏的跟踪框架。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 标题出现 |
| 0.30s | item 01 出现 |
| 0.55s | item 02 出现 |
| 0.80s | item 03 出现 |
| 1.10s | footer 出现 |
| 4.00s | 保持静止 |

### 剪映做法

```text
整张 PNG 渐显即可。
进阶：三条清单分别用裁切层依次出现。
```

### Remotion 映射

```text
<ChecklistMotion />
animation: checklistStaggerReveal
```

## 4.8 ClosingQuoteCard：结尾金句

### 使用时机

收束观点、给主站链接和风险提示。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 背景淡入 |
| 0.20s | small-label 出现 |
| 0.40s | quote title 慢入 |
| 0.80s | gold 关键词轻微强调 |
| 1.10s | subtitle 出现 |
| 1.40s | url-pill 出现 |
| 4.50s | 保持静止 |

### 剪映做法

```text
整张 PNG 渐显 0.4s。
末尾停留足够久，方便截图和阅读链接。
```

### Remotion 映射

```text
<ClosingQuoteMotion />
animation: quoteFadeUp, urlDelayedReveal
```

## 4.9 EvidenceGridCard：证据墙

### 使用时机

当口播需要展示多个证据点、案例、交易要素或技术节点时出现。

### 动效配方

| 时间 | 动作 |
|---|---|
| 0.00s | 卡片淡入 |
| 0.15s | title 出现 |
| 0.40s | subtitle 出现 |
| 0.65s | evidence 01 出现 |
| 0.80s | evidence 02 出现 |
| 0.95s | evidence 03 出现 |
| 1.10s | evidence 04 出现 |
| 1.40s | footer 出现 |
| 4.50s | 保持静止 |

### 剪映做法

```text
低成本：整张 PNG 渐显。
进阶：把四个证据格分别裁切成层，按 0.15s 间隔出现。
```

### Remotion 映射

```text
<EvidenceGridMotion />
animation: gridStaggerReveal, evidenceItemAccent
```

## 5. 剪映执行规则

### 5.1 低成本版本

适合快速出片。

```text
所有 PNG 作为完整图片层。
每张卡加 0.25-0.35s 渐显。
复杂卡停留更久。
卡片之间用硬切或极短淡入淡出。
```

### 5.2 进阶版本

适合打磨重点视频。

```text
DataHeroCard：数字单独做文字层计数。
BusinessLoopCard：步骤逐个点亮。
EvidenceGridCard：证据格逐个出现。
ClosingQuoteCard：结尾链接延迟出现。
```

### 5.3 和字幕的关系

用户已有 AI 视频稿字幕，所以 motion recipe 不负责生成字幕。

规则：

```text
字幕永远不能挡主标题、数字、证据格。
字幕可放下 20%-25% 安全区。
当 PNG 底部已经有 footer 时，字幕要避开 footer。
如果口播和卡片文字重复，字幕可简化，只保留关键词。
```

## 6. Remotion 工程化映射

未来如果做 Remotion，建议保持数据源一致：

```text
cards.js
  cover
  cards[]
  extras[]
```

对应组件：

```text
<CoverCardMotion />
<HookCardMotion />
<DataHeroMotion />
<LogisticsCardMotion />
<CompareCardMotion />
<BusinessLoopMotion />
<ChecklistMotion />
<ClosingQuoteMotion />
<EvidenceGridMotion />
```

建议新增中间层：

```text
motion-plan.json
```

结构：

```json
{
  "fps": 30,
  "durationSeconds": 70,
  "segments": [
    {
      "cardId": "01-hook-card",
      "start": 0,
      "duration": 3,
      "recipe": "hook.staggerTitleReveal"
    }
  ]
}
```

## 7. 是否进入 Remotion 的判断标准

只有满足以下条件，才进入 Remotion 工程化：

```text
1. 至少 3 条视频使用同一套 motion recipe。
2. 剪映手工动效验证过，不显廉价。
3. 卡片字段已经稳定。
4. 每条视频的时间轴规律可复用。
5. 用户确认需要批量自动生成 MP4。
```

否则先用剪映执行，不急着工程化。

## 8. 下一步

建议用创新药当前 9 张 PNG 做一次剪映验证：

```text
00-cover-card.png          只做封面
01-hook-card.png           3s
02-data-hero-card.png      4s
03-logistics-card.png      3s
04-not-a-is-b.png          3s
05-business-loop.png       5s
08-evidence-grid-card.png  5s
06-tracking-checklist.png  4s
07-closing-quote.png       5s
```

验证重点：

```text
动效是否克制
字幕是否冲突
B-roll 是否抢戏
证据墙是否需要动态拆层
DataHero 是否值得做数字计数
BusinessLoop 是否值得逐步点亮
```
