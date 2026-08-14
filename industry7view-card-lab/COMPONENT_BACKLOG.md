# Industry 7View 视觉组件 Backlog

这份文件记录短视频视觉系统的候选组件。原则：不因为单次需求就新增组件，必须经过真实主题验证。

## 1. 已纳入标准组件

| 组件 | 状态 | 触发主题 | 说明 |
|---|---|---|---|
| HookCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 开头认知纠偏。 |
| LogisticsCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 生活化类比。 |
| CompareCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 误解 vs 真相。 |
| BusinessLoopCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 商业闭环/价值路径。 |
| TrackingChecklistCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 可收藏跟踪清单。 |
| ClosingQuoteCard | v1.0 已纳入 | 商业航天、人形机器人、创新药 | 结论金句和主站引导。 |
| DataHeroCard | v1.1 已纳入 | 创新药，后续预计高频 | 大数字/证据锚点。 |
| CoverCard | v1.2 已纳入 | 创新药，后续每条视频通用 | 发布封面 / 开场主视觉，作为顶层 `cover` 独立导出。 |
| EvidenceGridCard | v1.3 已纳入 | 创新药，后续预计高频 | 证据墙 / 案例墙，作为 `extras` 可选扩展卡独立导出。 |
| BrollPromptPack | v1.1 已文档化 | 商业航天、人形机器人、创新药、稀土永磁等 | 行业 B-roll 素材方向和 AI 生成提示词。 |
| CapCutAssemblyTemplate | v1.1 已文档化 | 商业航天粗剪经验抽象 | 七卡剪映粗剪轨道、时长、动画、音效模板。 |
| MotionRecipePack | v1.3 已文档化 | 创新药九卡动效规划 | 卡片入场、数字弹入、节点点亮、证据格依次出现和 Remotion 映射。 |
| RemotionPNGSequencer | v1.4 已纳入 | 创新药九卡视频验证、人形机器人 SRT 样本 | 复用导出的 PNG、口播视频和 SRT 字幕，可用 `timeline-rules.json` 生成卡片出现时间，减少剪映手工排版。 |

## 2. P1：下一阶段优先候选

| 候选组件 | 来源灵感 | 适用场景 | 为什么可能高复用 | 进入条件 |
|---|---|---|---|---|
| OrderValidationCard | 半导体设备、服务器电源、人形机器人压测 | 样机、送样、客户认证、小批量、批量交付、收入/毛利兑现 | B2B 制造业和硬科技主题经常不是“有没有故事”，而是“验证走到哪一步” | 已是 `promotion_candidate`；先用第三主题继续压测字段，再决定是否代码化 |
| SupplyChainShiftCard | CPO、服务器电源、半导体设备压测 | 利润池、设计权、供应链话语权、国产替代、系统方案迁移 | 多个主题反复出现“价值从 A 环节迁移到 B 环节”，BusinessLoop 只能部分承载 | 已是 `promotion_candidate`；先确认 `from/to/drivers/result` 字段足够稳定 |
| TechRouteCompareCard | CPO、服务器电源、固态电池、6G 等路线型主题 | 多技术路线、多商业路线、多产业化路径对比 | CompareCard 只能承载二元纠偏，路线型主题可能需要 2-3 条路线并列 | 继续观察；至少再通过一个路线型主题确认字段边界 |
| PipelineStageCard | 创新药、医疗器械、合成生物、商业航天型号研制 | 研发、验证、审批、放量、商业化等阶段推进 | 医药和长周期技术主题常需要表达“阶段推进”而不是订单兑现 | 继续观察；先区分它和 OrderValidationCard 的边界 |

## 3. P2：观察中候选

| 候选组件 | 来源灵感 | 适用场景 | 暂不立即做的原因 |
|---|---|---|---|
| SectionBreakCard | guizang 章节幕封 | 90 秒以上视频、系列视频、分段讲解 | 60-75 秒短视频未必需要章节幕。 |
| TimelineCard | guizang timeline / Swiss S11 | 发展历程、政策时间线、产品迭代 | 当前 BusinessLoop 可部分承担。 |
| RiskMatrixCard | 研究报告多空分歧 | 风险提示、多空框架、政策/技术/商业风险 | 目前 ClosingQuote + 口播可承担。 |
| RouteCompareCard | guizang 并列对比 | 技术路线对比、商业模式对比 | CompareCard 可承担轻量对比。 |

## 4. P3：暂不进入组件库

| 项目 | 原因 |
|---|---|
| 完整自动剪辑 | 强依赖单条素材，不适合作为当前阶段组件。 |
| 数字人口播情绪/停顿 | 需要按人设、声音、稿件单独调。 |
| BGM 选择 | 强依赖视频情绪和平台测试。 |
| 复杂 3D 镜头 | 成本高、复用低，容易偏离克制研究感。 |
| 完整网页版 PPT 自动生成 | guizang skill 已可承担，不应重复造。 |

## 5. guizang PPT skill 与本组件库的关系

```text
guizang PPT skill：负责生成横向网页 PPT，擅长封面、章节幕、数据大字报、图片网格、流程、对比、收束页。
industry7view-card-lab：负责生成短视频 9:16 图文卡 PNG，适合剪映装配。
```

可复用的不是 guizang 生成的整份 PPT，而是它的版式模式：

```text
封面 → CoverCard
章节幕 → SectionBreakCard
数据大字报 → DataHeroCard
图片网格 → EvidenceGridCard
流程 → BusinessLoopCard / TimelineCard
对比 → CompareCard / RouteCompareCard
收束页 → ClosingQuoteCard
```

## 6. 新组件立项规则

```text
1. 先记录，不立刻做。
2. 同一需求出现 2-3 次，再判断是否组件化。
3. 能用现有 7 卡解决的，不新增组件。
4. 能用剪映手工解决且低频的，不新增组件。
5. 一旦组件化，必须同步 CARD_SPEC.md、check-cards.mjs、README.md 和 QA 清单。
```
