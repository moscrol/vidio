# Industry 7View Component Tree v1.6

这份文档定义 `industry7view-card-lab` 的组件树。它用于回答两个问题：现有组件处在哪一层；新增能力应该补 Token、Base、Combined、Pattern，还是只记录为工作流问题。

## 1. 分层原则

```text
Component Library
├── Foundation
├── Base
├── Combined
├── Pattern
└── Workflow
```

| 层级 | 作用 | 新增规则 |
|---|---|---|
| Foundation | 品牌视觉、尺寸、动效等设计决策 | 只有影响全局一致性时才新增 |
| Base | 最小可复用视觉原子 | 不包含业务判断和主题语义 |
| Combined | 由 Base 拼成的局部结构 | 至少被 2 个 Pattern 复用才抽象 |
| Pattern | 面向短视频表达场景的完整卡片 | 至少 2-3 个真实主题重复需要才新增 |
| Workflow | 生产、校验、剪辑和验收流程 | 不改变组件结构，只固化操作顺序 |

## 2. Foundation

| 模块 | 当前状态 | 说明 | 来源文件 |
|---|---|---|---|
| Color Tokens | 已固定，待独立文档化 | 深蓝、金色、浅纸底、白色卡面、风险色 | `DESIGN_TOKENS.md` |
| Typography Tokens | 已固定，待独立文档化 | Inter / Noto Sans SC / Noto Serif SC / JetBrains Mono | `DESIGN_TOKENS.md` |
| Spacing Tokens | 待标准化 | 卡片内边距、区块间距、列表间距 | `DESIGN_TOKENS.md` |
| Radius Tokens | 已固定 | 直角卡片，默认 `0px` | `DESIGN_TOKENS.md` |
| Motion Tokens | 待标准化 | 淡入、上浮、轻微缩放、退场 | `MOTION_RECIPE_PACK.md` |
| Canvas Tokens | 已固定 | 1080x1920，9:16 | `CARD_SPEC.md` |

## 3. Base

Base 是最小视觉原子，不应包含具体产业主题判断。

| 组件 | 状态 | 用途 | 复用位置 |
|---|---|---|---|
| BrandMark | 已实现，未独立代码化 | `INDUSTRY 7VIEW` 品牌角标 | 全部卡片 |
| TagPill | 已实现，未独立代码化 | 顶部短标签 | 全部卡片 |
| MetaLabel | 已实现，未独立代码化 | 英文/短语元信息 | Hook / DataHero / Quote / EvidenceGrid |
| GoldHighlight | 已实现，未独立代码化 | 金色强调词 | 标题和关键数字 |
| RiskHighlight | 已实现，未独立代码化 | 风险/否定强调 | 标题和风险提示 |
| FooterNote | 已实现，未独立代码化 | 底部说明、主站链接、风险提示 | 全部卡片 |
| NumberDisplay | 已实现，未独立代码化 | 大数字视觉锚点 | DataHero |
| MiniDivider | 已实现，未独立代码化 | 轻量分隔结构 | 多个卡片模板 |

## 4. Combined

Combined 是局部结构，负责减少重复拼装，但不直接表达完整视频语义。

| 组件 | 状态 | 说明 | 复用位置 |
|---|---|---|---|
| CardShell | 已实现，未独立代码化 | 统一画布、背景、边距、品牌角标 | 全部卡片 |
| CardHeader | 已实现，未独立代码化 | 顶部标签 + meta | 全部卡片 |
| TitleBlock | 已实现，未独立代码化 | 标题、高亮、换行控制 | Cover / Hook / Logistics / Checklist / Quote / EvidenceGrid |
| FooterBar | 已实现，未独立代码化 | 底部说明和链接 | 全部卡片 |
| EvidenceCell | 已实现，未独立代码化 | 证据格子 | EvidenceGrid |
| ChecklistItem | 已实现，未独立代码化 | 可收藏跟踪项 | TrackingChecklist |
| LoopStep | 已实现，未独立代码化 | 商业闭环节点 | BusinessLoop |
| ComparePair | 已实现，未独立代码化 | 左右对比结构 | Compare |

## 5. Pattern

Pattern 是完整卡片组件，面向短视频固定表达场景。

| 组件 | 状态 | 适用场景 | 是否标准正文 |
|---|---|---|---|
| CoverCard | v1.2 已纳入 | 发布封面 / 可选开场主视觉 | 否 |
| HookCard | v1.0 已纳入 | 开头反常识、强判断 | 是 |
| DataHeroCard | v1.1 已纳入 | 大数字证据锚点 | 是 |
| LogisticsCard | v1.0 已纳入 | 生活化类比、降低理解门槛 | 是 |
| CompareCard | v1.0 已纳入 | 误解 vs 真相、不是 A 而是 B | 是 |
| BusinessLoopCard | v1.0 已纳入 | 产业链、商业闭环、价值路径 | 是 |
| TrackingChecklistCard | v1.0 已纳入 | 可收藏跟踪清单 | 是 |
| ClosingQuoteCard | v1.0 已纳入 | 结论金句、主站引导、风险提示 | 是 |
| EvidenceGridCard | v1.3 已纳入 | 证据墙、案例墙、交易要素 | 可选 extras |

### Promotion Candidates

以下组件已通过真实主题压测达到 `promotion_candidate`，但尚未代码化。当前阶段只定义边界和字段，不进入 `cards.js`。

| 组件 | 状态 | 适用场景 | 与现有组件边界 |
|---|---|---|---|
| OrderValidationCard | promotion_candidate | 样机、送样、客户认证、小批量、收入确认、毛利验证 | 区分于 TrackingChecklist：它讲“验证到哪一步”，不是“接下来跟踪什么”。区分于 EvidenceGrid：它讲“顺序兑现链”，不是“并列证据点”。 |
| SupplyChainShiftCard | promotion_candidate | 利润池迁移、设计权迁移、供应链话语权迁移、国产替代、系统方案升级 | 区分于 BusinessLoop：它讲“价值迁移到哪里”，不是“价值如何形成”。区分于 SupplyChainCard：它讲“动态迁移”，不是“静态产业链全景”。 |

## 6. Workflow

| 工作流 | 状态 | 说明 | 入口 |
|---|---|---|---|
| CardDeckGeneration | 已工程化 | 从 `cards.js` 导出 PNG | `npm run export` |
| CardPlanFromSRT | 已工程化 | 从 SRT 生成卡片计划草稿 | `npm run video:card-plan` |
| CardsDraftFromPlan | 已工程化 | 从卡片计划生成 `cards.generated.js` | `npm run video:cards:draft` |
| TimelineFromSRT | 已工程化 | 用关键词规则生成 `motion-plan.json` | `npm run video:timeline` |
| TranscriptCardPlan | 已工程化 | 检查卡片与口播真实匹配 | `npm run video:transcript-plan` |
| RemotionOverlay | 已工程化 | 口播视频 + PNG overlay 渲染 MP4 | `npm run video:render` |
| CapCutAssembly | 已文档化 | 剪映人工装配模板 | `CAPCUT_ASSEMBLY_TEMPLATE.md` |
| VisualQA | 已文档化 | 导出后人工验收 | `CARD_QA_CHECKLIST.md` |

## 7. 新增组件判断

```text
1. 先判断能否通过文案压缩解决。
2. 再判断是否只是已有 Pattern 的 Variant。
3. 再判断是否只是 Props 不足。
4. 再判断是否应抽成 Combined。
5. 最后才判断是否新增 Pattern。
```

新增 Pattern 必须满足：

```text
1. 至少 2-3 个真实主题重复出现。
2. 现有 7 张正文卡和 extras 无法自然承载。
3. 它能被固定字段描述。
4. 它能进入 `CARD_SPEC.md` 和 `check-cards.mjs` 校验。
5. 它不会破坏 Industry 7View 的克制研究感。
```
