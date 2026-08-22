# Industry 7View Video Design Manual

这份文档是短视频生产系统的总设计手册，作用类似 Stitch `design-md`：把分散的视觉规范、组件边界、动效原则和发布判断整理成 AI 可读取、可执行的参考手册。

## 0. 合同所有权（2026-08-22）

本文件保留 Industry 7View 的长期品牌意图和组件语义，不再作为每个项目的数值权威。生产项目先建立语言合同，再建立静态视觉合同，并按需进入运动合同：

| 决策 | 权威文件 |
| --- | --- |
| 品牌长期定位、固定组件语义 | 本文件与 `DESIGN_TOKENS.md` |
| 项目参考目标、来源状态、借用与排除边界 | 项目级 `reference-brief.md` |
| 项目规范词汇、别名、边界与验收 | 项目级 `design-vocabulary.json` |
| 项目视觉意图、静态取舍、规范词汇映射 | 项目级 `DESIGN.md` |
| 画布、语义色、字号、安全区、预算 | 项目级 `visual-contract.json`（数值单一事实源） |
| CSS / Remotion / Stitch 实现值 | 消费 `visual-contract.json`，不得自行另起 token |
| 时间、缓动、转场、空间连续性 | `motion-contract.json` |

自主设计的执行顺序：`vibe-director → vibe-design-language → reference-brief.md + design-vocabulary.json → vibe-visual-taste → DESIGN.md + visual-contract.json → vibe-motion-taste → motion-contract.json → renderer → hybrid QC`。语言层拥有来源边界与规范词汇，视觉层拥有静态数值，运动层拥有时间与缓动；无自主叠加设计的纯供应素材可跳过三道设计门禁。`DESIGN_TOKENS.md` 是默认品牌输入，项目合同可以为具体画幅收紧它，但必须记录取舍。

## 1. 定位

```text
Industry 7View 视频系统 = 产业研究口播 + 观点卡片 + 动态图形 + 少量 B-roll + 主站引导。
```

它不是纯 PPT，也不是纯 AI 视频。核心任务是把复杂产业判断压缩成适合短视频观看的结构化视觉表达。

## 2. 视觉风格

```text
Industry 7View 版 Swiss：克制、研究感、强结构、深蓝主导、金色强调数据。
```

以下是仓库级默认 token，以 `DESIGN_TOKENS.md` 为准；进入具体项目后必须写入 `visual-contract.json`，renderer 只消费项目合同：

```text
深蓝：#0f2747
辅助蓝：#174ea6
金色：#b8832d
浅纸底：#f6f7f9
白色卡面：#ffffff
主字体：Inter / Noto Sans SC
数字字体：JetBrains Mono
画布：1080x1920，9:16
```

## 3. 叙事层级

每条 60-75 秒短视频默认分为四层：

| 层级 | 作用 | 常见载体 |
|---|---|---|
| A-roll | 口播判断、情绪、转折、互动 | 真人/数字人口播 |
| Card | 观点锚点、数字、对比、清单 | PNG / Remotion / Stitch 转译组件 |
| B-roll | 场景补画、降低单调感、制造真实感 | 工厂、产线、机器人、设备、抽象动效 |
| Caption | 字幕和关键词强调 | 剪映字幕 / Remotion 字幕 |

## 4. 组件库边界

组件不只等于 PNG。组件库分为三种来源，详见 `VIDEO_COMPONENT_STRATEGY.md`：

```text
png：稳定兜底。
remotion：元素级动态组件。
stitch：外部设计资产或视觉探索来源，进入正式流程前需要转译。
```

## 5. 卡片类型

当前固定主线：

```text
00 CoverCard
01 HookCard
02 DataHeroCard
03 LogisticsCard
04 CompareCard
05 BusinessLoopCard
06 TrackingChecklistCard
07 ClosingQuoteCard
08 EvidenceGridCard optional
```

卡片选择原则：

```text
不是每个语义段都要出卡。
强判断、反常识、关键数字、A/B 对比、步骤闭环、可收藏清单、结论金句优先上屏。
承接句、解释性铺垫、互动问题可交给字幕、B-roll 或评论区。
```

## 6. 动效原则

动效必须服务理解，不追求无意义炫技。表内条目只描述意图，不是固定时长或 easing；具体帧级决定由 `vibe-motion-taste` 写入 `motion-contract.json`。

| 卡片 | 推荐动效 |
|---|---|
| CoverCard | 标题上浮、金色词延迟出现 |
| HookCard | 标题分行 stagger reveal，风险词强调 |
| DataHeroCard | 数字滚动、单位弹出、金色强调线 |
| CompareCard | 左右栏错位滑入，中间分割线生长 |
| BusinessLoopCard | 节点逐个点亮，路径推进 |
| TrackingChecklistCard | 逐项打勾，关键词短暂停留 |
| ClosingQuoteCard | 慢速 fade up，保留阅读时间 |
| EvidenceGridCard | 证据格逐个出现 |

## 7. B-roll 原则

B-roll 不替代观点，而是补足场景。

优先使用 B-roll 的段落：

```text
工厂、产线、搬运、测试、设备运行、成本下降、供应链迁移、死亡谷等具象或抽象场景。
```

不宜使用 B-roll 的段落：

```text
关键数字首次出现、A/B 核心对比、结论金句，这些应优先保留卡片或动态图形。
```

## 8. 生产流程

标准流程：

```text
口播视频 / SRT
→ 语义段落
→ card intent
→ reference-brief.md + design-vocabulary.json
→ design language hard gate
→ DESIGN.md + visual-contract.json
→ visual contract hard gate
→ motion-contract.json（需要运动时）
→ component strategy
→ cards.generated.js
→ timeline-rules.generated.json
→ Remotion render
→ static / motion hybrid QC
→ publish review
```

当前已验证路径：

```text
SRT → card-plan.generated.json → cards.generated.js → timeline-rules.generated.json → PNG overlay → MP4
```

下一阶段升级路径：

```text
SRT → card intent → recipe → Remotion native component / PNG fallback → MP4
```

## 9. 发布检查

发布前必须检查：

```text
1. 前 3 秒是否有强判断或反常识。
2. 卡片是否与口播对应段落完整对齐。
3. 卡片是否遮挡人脸、字幕或关键画面。
4. 2-4 秒内是否有画面变化。
5. 是否过度堆卡，缺少 B-roll 呼吸。
6. 数字、结论和风险提示是否可读。
7. 结尾是否有互动或主站引导。
8. `visual-contract.json` 是否为 0 error，warning 是否逐条记录。
9. 最终像素是否在 1×、25%、灰阶和安全区检查中通过。
```

详细清单以 `VIDEO_PUBLISH_CHECKLIST.md` 为准。

## 10. 与 Stitch Skills 的关系

Stitch skills 的价值不是替代当前工程，而是提供方法论：

| Stitch 能力 | 在本工程中的映射 |
|---|---|
| `design-md` | 方法已炼化为项目级 `DESIGN.md` + `visual-contract.json`；本文件只保留长期品牌与组件语义 |
| `enhance-prompt` | 把 SRT 段落增强为 card intent |
| `remotion` | 指导 nativeMotion 动态组件实现 |
| `stitch-loop` | 借鉴为 video-loop + report |
| `react-components` | 仅借鉴组件化思想，不直接接管 |
| `shadcn-ui` | 暂不进入视频系统 |

## 11. 当前下一步

```text
1. 保持 PNG overlay 稳定生产。
2. 让 card-plan 增加 component strategy 意识。
3. 先把 DataHeroCard 做成 Remotion 原生动态组件。
4. 再扩展 CompareCard 和 BusinessLoopCard。
5. Stitch 组件先作为视觉探索输入，确认复用价值后再转译为 PNG 或 Remotion 组件。
```
