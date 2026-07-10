# Industry 7View 短视频视觉组件地图

这份文件定义短视频视觉系统的组件层级。`industry7view-card-lab` 当前只工程化了图文卡组件，但完整短视频视觉组件库还应包含封面、章节幕、证据墙、B-roll 信息图、动态图表、剪映执行模板等可复用资产。

## 1. 组件分层

| 层级 | 名称 | 当前状态 | 说明 |
|---|---|---|---|
| Foundation | Design Tokens | 已固定 | 深蓝、金色、浅纸底、直角、字体、9:16。 |
| Pattern | Cover + Seven Card Deck | 已工程化 | `cards.js` 驱动的 1 张封面 + 7 张正文图文卡，已支持 PNG 导出。 |
| Pattern | Deck / PPT Layouts | 未工程化 | 可参考 guizang PPT skill 的封面、章节幕、数据大字报、图片网格、流程、对比、收束页。 |
| Pattern | B-roll Prompt Pack | 已文档化 | `BROLL_PROMPT_PACK.md` 已沉淀行业 B-roll 素材方向和 AI 生成提示词。 |
| Pattern | Motion Recipe Pack | 已文档化 | `MOTION_RECIPE_PACK.md` 已定义卡片入场、数字弹入、节点点亮和 Remotion 映射。 |
| Pattern | Remotion PNG Sequencer | 已工程化 v0.4 | 复用导出的 PNG、口播视频和 SRT 字幕，可通过 `timeline-rules.json` 生成卡片出现时间。 |
| Workflow | Shot Script | 已有工作流 | `docs/system/短视频分镜工作流.md` 定义了分镜执行表结构。 |
| Workflow | CapCut Assembly Template | 已文档化 | `CAPCUT_ASSEMBLY_TEMPLATE.md` 已从商业航天粗剪清单抽象为七卡通用装配模板。 |
| Skill | Visual Assembly Skill | 待沉淀 | 重复 3 次以上后可沉淀为专用 Skill。 |

## 2. guizang PPT skill 可复用什么

guizang PPT skill 不是用来替代当前卡片系统的。它更适合提供更高一级的页面版式和视觉模式。

| guizang PPT 输出 | 对短视频的复用方式 | 是否值得做成组件 |
|---|---|---|
| 封面页 | 抖音/B站封面、视频开场 0-2 秒 | 已完成为 `CoverCard` |
| 章节幕封 | 视频段落转场、系列视频章节页 | 是 |
| 数据大字报 | 已转化为 `DataHeroCard` | 已完成 |
| 图片网格 | 证据墙、公司/产品/场景拼图 | 是，观察中 |
| 左文右图 | 观点 + B-roll 或截图解释 | 是，观察中 |
| 流程 / Pipeline | 产业链路径、商业闭环、技术路线 | 已部分由 `BusinessLoopCard` 承担 |
| 并列对比 | 误解 vs 真相、旧模式 vs 新模式 | 已部分由 `CompareCard` 承担 |
| 收束页 / Big Quote | 结尾金句、主站引导 | 已由 `ClosingQuoteCard` 承担 |
| 22 个 Swiss Layout | 长视频/发布会式网页 PPT | 暂不进入短视频 v1.1 |

## 3. 当前已工程化组件

```text
01 HookCard
02 DataHeroCard
03 LogisticsCard
04 CompareCard
05 BusinessLoopCard
06 TrackingChecklistCard
07 ClosingQuoteCard
00 CoverCard
08 EvidenceGridCard
```

这些组件适合 60-75 秒短视频中的“固定信息节点”。

## 4. 还没工程化但可能复用的组件

| 候选组件 | 用途 | 来源灵感 | 优先级 |
|---|---|---|---|
| CoverCard | 视频封面 / 开场主视觉 | guizang 封面页 + 当前 HookCard | 已工程化 |
| SectionBreakCard | 段落转场 / 系列章节幕 | guizang 章节幕封 | P2 |
| EvidenceGridCard | 多图证据墙 / 公司案例墙 | guizang 图片网格 | 已工程化 |
| BrollPromptPack | 按行业生成 B-roll 提示词组 | 分镜工作流 | 已文档化 |
| TimelineCard | 时间线 / 产业阶段 / 发展历程 | guizang timeline / Swiss S11 | P2 |
| RiskMatrixCard | 风险路径 / 多空分歧 | 研究报告常见结构 | P2 |
| MotionRecipePack | 卡片进入/退出动效规范 | Remotion / HyperFrame | 已文档化 |
| CapCutAssemblyTemplate | 剪映轨道、时长、动画、音效模板 | 商业航天粗剪清单 | 已文档化 |

## 5. 判断是否新增组件的标准

新增组件必须同时满足：

```text
1. 至少 2-3 个真实主题都需要。
2. 现有 7 张卡无法自然承载。
3. 它不是单条视频的剪辑细节。
4. 它能用固定字段描述。
5. 它能被 check 脚本或 QA 清单验证。
```

## 6. 当前阶段结论

```text
v1.1 已完成“短视频图文卡组件”。
下一阶段不是继续随机加卡，而是补齐封面、证据墙、B-roll prompt、剪映装配模板这四类高复用资产。
```
