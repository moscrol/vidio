# Industry 7View Component Gap Log

这份文档记录真实主题暴露出的组件缺口。它不是需求池，而是判断“该改文案、补变体、补属性、抽 Combined，还是新增 Pattern”的证据库。

## 1. 记录原则

```text
1. 只记录真实主题中出现的问题。
2. 不因为单次视频需求直接新增组件。
3. 同类缺口出现 2-3 次后，再考虑组件化。
4. 能改文案解决的，优先改文案。
5. 只是剪辑节奏或 B-roll 素材问题，不进入组件库。
```

## 2. 问题类型

| 类型 | 含义 | 默认处理 |
|---|---|---|
| `copy_too_long` | 文案过长、换行尴尬 | 先压缩文案 |
| `variant_gap` | 现有组件能表达，但缺少变体 | 记录到 `VARIANT_MATRIX.md` |
| `props_gap` | 需要新增字段才能表达 | 评估是否更新 `CARD_SPEC.md` 和校验脚本 |
| `combined_gap` | 多个 Pattern 重复出现同一局部结构 | 考虑抽 Combined |
| `pattern_gap` | 现有 Pattern 无法自然承载 | 累计 2-3 个主题后再新增 |
| `timeline_gap` | 卡片出现时间、停留时长、口播匹配问题 | 处理 `timeline-rules.json` 或 `motion-plan.json` |
| `editing_gap` | 剪映/B-roll/BGM/字幕问题 | 记录到剪辑模板，不进组件库 |

## 3. 决策状态

| 状态 | 含义 |
|---|---|
| `resolved_copy` | 通过文案压缩解决 |
| `watching` | 继续观察，不新增 |
| `promotion_candidate` | 已在 2-3 个真实主题中复现，准备定义组件边界和字段，但尚未写代码 |
| `documented_variant` | 已进入变体矩阵 |
| `spec_update_needed` | 需要更新 `CARD_SPEC.md` |
| `code_update_needed` | 需要更新模板或校验脚本 |
| `rejected` | 不进入组件库 |
| `promoted` | 已正式组件化 |

## 4. 缺口记录

| 日期 | 主题 | 组件/环节 | 问题类型 | 描述 | 出现次数 | 决策状态 | 下一步 |
|---|---|---|---|---|---:|---|---|
| 2026-05-20 | 人形机器人 | ClosingQuoteCard | `copy_too_long` | 字段校验通过，但标题含中英文和逗号时出现不理想换行。 | 1 | `resolved_copy` | 导出后继续人工抽查 00/01/02/05/06/07/08。 |
| 2026-05-20 | 创新药 | 全部 | `pattern_validation` | 非硬科技/制造业主题也能套入现有卡组，认知纠偏、类比、对比、价值路径、跟踪清单、结论卡均可用。 | 1 | `watching` | 不新增组件，继续跨行业验证。 |
| 2026-05-20 | 创新药 | DataHeroCard | `pattern_gap` | 大数字在产业研究中高频出现，适合作为独立证据锚点组件。 | 2 | `promoted` | 已纳入 v1.1 标准正文结构。 |
| 2026-05-20 | 创新药 | CoverCard | `pattern_gap` | 每条视频都需要发布封面/开场主视觉，封面不应打乱正文七卡叙事。 | 2 | `promoted` | 已纳入 v1.2，作为顶层 cover 独立导出。 |
| 2026-05-20 | 创新药 | EvidenceGridCard | `pattern_gap` | 创新药主题需要展示全球药企买单、BD 交易、临床资产、海外权益等多个证据点。 | 2 | `promoted` | 已纳入 v1.3，作为 extras 可选扩展卡。 |
| 2026-05-20 | 人形机器人 | EvidenceGridCard | `timeline_gap` | 成本疑问片段可匹配 EvidenceGrid，但进入视频会破坏口播节奏。 | 1 | `rejected` | 保留 PNG 导出，时间线中 disabled。 |
| 2026-05-20 | 人形机器人 | CardPlanFromSRT | `workflow_gap` | 固定九卡硬套导致部分 PNG 与讲稿不匹配。 | 1 | `promoted` | 已增加 card-plan、transcript-card-plan 和 SRT 匹配检查。 |
| 2026-05-21 | CPO 共封装光学 | RouteCompareCard | `pattern_gap` | 演讲稿需要表达可插拔、LPO/NPO、CPO、OIO 等多技术路线迁移，现有 CompareCard 只能承载二元纠偏。 | 1 | `watching` | 先用 CompareCard 表达“长期必选 ≠ 现在爆发”，等高速铜缆/光模块/先进封装等主题复现后再决定是否新增。 |
| 2026-05-21 | CPO 共封装光学 | TimelineCard | `pattern_gap` | CPO 叙事包含博通量产、英伟达 CPO 交换机、台积电 COUPE、2028-2030 大规模部署等强时间线。 | 1 | `watching` | 先用 BusinessLoop 或口播承担，复现 2-3 次后再组件化。 |
| 2026-05-21 | CPO 共封装光学 | SupplyChainShiftCard | `pattern_gap` | CPO 核心投资逻辑是产业链话语权从模块厂向芯片厂、光引擎和先进封装迁移，普通 BusinessLoop 不完全自然。 | 1 | `watching` | 先用 BusinessLoop 表达“速率升级→功耗瓶颈→CPO 上桌→话语权上移→利润重分配”。 |
| 2026-05-21 | CPO 共封装光学 | RiskMatrixCard | `pattern_gap` | 演讲稿风险包含爆炸半径、估值、800G 过剩、云厂商 Capex 等多维风险，ClosingQuote 只能做结论收束。 | 1 | `watching` | 短视频先用口播 + ClosingQuote，图文素材可用 EvidenceGrid 临时代替。 |
| 2026-05-21 | 服务器电源 | OrderValidationCard | `pattern_gap` | 演讲稿反复强调送样、客户认证、批量交付、高功率收入、毛利率兑现，现有 TrackingChecklist/EvidenceGrid 能替代但不够聚焦订单验证链条。 | 2 | `watching` | 升级为重点观察；若高速铜缆、半导体设备或先进封装再次复现“样品→认证→批量→收入→毛利”链条，再考虑 promote。 |
| 2026-05-21 | 服务器电源 | SupplyChainShiftCard | `pattern_gap` | 服务器电源从普通 PSU 走向高功率 PSU、Power Shelf、HVDC、BBU、液冷和智能化系统，复现“供应商角色升级/利润池迁移”需求。 | 2 | `watching` | 暂用 BusinessLoop 承载；与 CPO 共同构成第二次复现，等第三个主题验证后再决定是否新增 Pattern。 |
| 2026-05-21 | 服务器电源 | RouteCompareCard | `pattern_gap` | 技术路线包含 12V/48V→400V/800V、SiC/GaN、PSU/Power Shelf/HVDC/BBU、风冷/液冷，但第一条视频不一定需要完整路线图。 | 2 | `watching` | 继续观察；当前只作为轻度复现，优先用 CompareCard 或口播处理。 |
| 2026-05-21 | 服务器电源 | RiskMatrixCard | `pattern_gap` | 风险包括 AI 服务器出货、供应链份额、价格战、技术路线变化、估值提前反映等多维变量，短视频可暂用口播和 ClosingQuote。 | 2 | `watching` | 继续观察；暂不新增风险矩阵组件。 |
| 2026-05-21 | 半导体设备 | OrderValidationCard | `pattern_gap` | 半导体设备判断核心是样机、晶圆厂验证、装机、良率、收入和毛利，第三次复现“验证链条”表达需求。 | 3 | `promotion_candidate` | 准备定义组件边界和字段，先不写代码；需区分 TrackingChecklist 的“看什么”和 OrderValidation 的“验证到哪一步”。 |
| 2026-05-21 | 半导体设备 | SupplyChainShiftCard | `pattern_gap` | 半导体设备从海外整机垄断走向国产整机、核心零部件本土化和晶圆厂导入，第三次复现供应链话语权/利润池迁移。 | 3 | `promotion_candidate` | 准备定义组件边界和字段，先不写代码；需区分 BusinessLoop 的“价值如何形成”和 SupplyChainShift 的“价值迁移到哪里”。 |
| 2026-05-21 | 半导体设备 | RouteCompareCard | `pattern_gap` | 设备分类包含光刻、刻蚀、薄膜、清洗、CMP、量测、离子注入、测试，但更像分类地图，不一定是路线演进。 | 3 | `watching` | 继续观察，暂不新增；后续判断是否需要拆成 RouteCompareCard 与 CategoryMapCard。 |
| 2026-05-21 | 半导体设备 | RiskMatrixCard | `pattern_gap` | 风险包含光刻突破不及预期、Capex 下行、核心零部件受限、估值偏高、国产化低于预期。 | 3 | `watching` | 继续用口播和 ClosingQuote 解决，暂不新增。 |

## 5. 当前观察中的候选缺口

| 候选 | 可能来源主题 | 为什么观察 | 当前替代方案 |
|---|---|---|---|
| TimelineCard | 政策驱动、技术路线、产业进程 | 发展节点可能比 BusinessLoop 更适合时间序列 | 先用 BusinessLoop 或口播承担 |
| RouteCompareCard | CPO、高速铜缆、固态电池、3D 打印 | 技术路线对比可能超出简单 `不是 A 而是 B` | 先用 CompareCard |
| RiskMatrixCard | 创新药、商业航天、周期资源品 | 多空分歧和风险路径可能需要矩阵表达 | 先用 ClosingQuote + 口播 |
| SupplyChainCard | 稀土永磁、半导体设备、服务器电源 | 产业链上中下游和瓶颈环节可能高频 | 先用 BusinessLoop |
| SupplyChainShiftCard | CPO、先进封装、服务器电源、半导体设备 | 价值链话语权和利润池迁移可能不是普通产业链全景 | `promotion_candidate`，先用 BusinessLoop |
| OrderValidationCard | 人形机器人、服务器电源、AI 算力、半导体设备 | 客户、订单、认证、批量、收入和毛利验证可能高频 | `promotion_candidate`，先用 TrackingChecklist + EvidenceGrid |
| PriceCycleCard | 稀土永磁、锂电材料、铝离子电池 | 价格、库存、供给弹性可能需要周期表达 | 待真实主题验证 |

## 6. CPO 共封装光学压测详情

```text
主题：CPO 共封装光学
口播稿/SRT：/Users/lbq/Desktop/c c/知识库/raw/CPO共封装光学-演讲稿.md
主站链接：https://industry7view.com/research/optical-module-cpo/

1. 页面/视频拆解：
- 开头钩子：光模块行业的“印钞机”可能易主。
- 数据证据：2026 年 CPO 替代率约 3%；英伟达向 Lumentum、Coherent、Marvell 合计投资 60 亿美元；CPO 功耗降低约 40%。
- 类比解释：传统光模块像走廊尽头的翻译机，CPO 是把翻译机搬到芯片旁边。
- 误解纠偏：长期必选不等于现在爆发；3.2T 以上 CPO 可能是唯一选择，但大规模部署在 2028-2030 年。
- 价值路径：速率升级 → 功耗瓶颈 → CPO 上桌 → 设计权上移 → 利润重分配。
- 跟踪清单：台积电 COUPE 量产、英伟达 CPO 交换机出货、3.2T 光模块量产时间表、云厂商 CPO 试点、北美云厂商 Capex。
- 结论收束：CPO 是光通信确定的终局，但终局到来之前的路比市场定价更长。
- 可选证据墙：博通、英伟达、台积电、天孚通信、Coherent、Marvell。

2. 已有组件可承载：
- CoverCard：是，用于“终局确定，但别急着追”。
- HookCard：是，用于“光模块印钞机可能易主”。
- DataHeroCard：是，优先使用“3%”表达时间差，而不是只用“60 亿美元”表达热度。
- LogisticsCard：是，用于“翻译机搬到芯片旁边”的类比。
- CompareCard：是，但只适合承载“长期必选 ≠ 现在爆发”这一层二元纠偏。
- BusinessLoopCard：勉强可用，用于表达价值路径和利润重分配。
- TrackingChecklistCard：是，跟踪指标非常清晰。
- ClosingQuoteCard：是，适合承载结尾金句。
- EvidenceGridCard：是，适合作为证据墙导出，但不一定进入 60-75 秒视频时间线。

3. 缺口判断：
- 文案问题：DataHero 的 label 可能偏长，需压缩成“2026 替代率”。
- 变体问题：CompareCard 可能需要路线型变体，但先不加。
- Props 问题：暂无必须新增字段。
- Combined 问题：暂无。
- Pattern 问题：RouteCompareCard、TimelineCard、SupplyChainShiftCard、RiskMatrixCard 进入观察。
- 时间线/剪辑问题：EvidenceGridCard 信息密度高，可能只导出备用，不强行上屏。

4. 处理决定：
- 立即处理：不新增代码，不新增卡片模板。
- 继续观察：RouteCompareCard、TimelineCard、SupplyChainShiftCard、RiskMatrixCard。
- 不进入组件库：单条视频里为了讲完整公司名单而增加的名单卡，先用 EvidenceGrid 或口播解决。
```

## 7. 服务器电源压测详情

```text
主题：服务器电源
口播稿/SRT：/Users/lbq/Desktop/c c/知识库/raw/服务器电源-演讲稿.md
主站链接：https://industry7view.com/research/server-power-supply/

1. 页面/视频拆解：
- 开头钩子：AI 算力不只卡 GPU、光模块和先进制程，所有芯片最后都要吃电。
- 数据证据：AI 单机柜功率走向 100kW+；80 PLUS 钛金典型效率约 96%；数据中心电费可占运营成本 30%-50%；欧陆通数据中心电源收入 20.15 亿元、高功率数据中心电源收入 12.99 亿元。
- 类比解释：以前像给普通居民楼供电，现在像给小型工厂供电；服务器电源是“电力版光模块”。
- 误解纠偏：服务器电源不是普通配套件，而是 AI 数据中心电力瓶颈下的关键战略部件。
- 价值路径：GPU 功耗提升 → 机柜功率暴涨 → 高效供电刚需 → 客户认证放量 → 订单和毛利兑现。
- 跟踪清单：云厂商 Capex、GB200/GB300/Rubin 平台放量、高功率电源收入、毛利率、认证从送样到批量、HVDC/BBU 标配化。
- 结论收束：服务器电源以前是配角，现在正在变成 AI 数据中心的电力主角。
- 可选证据墙：100kW+ 机柜、96% 效率、30%-50% 电费占比、欧陆通收入兑现、麦格米特进入 GB200/Blackwell 供应链、SiC/GaN、HVDC/BBU。

2. 已有组件可承载：
- CoverCard：是，用于“AI 算力最后都要吃电”。
- HookCard：是，用于“AI 算力不只卡 GPU，还卡电”。
- DataHeroCard：是，优先使用“100kW+”表达机柜功率跃迁。
- LogisticsCard：是，用于“居民楼供电变小型工厂供电”的类比。
- CompareCard：是，用于“不是配套件，而是电力瓶颈”。
- BusinessLoopCard：是，用于表达功率提升到订单毛利兑现的价值路径。
- TrackingChecklistCard：是，跟踪指标非常清晰。
- ClosingQuoteCard：是，适合承载“从配角变主角”的结尾。
- EvidenceGridCard：是，适合作为订单和数据证据墙，但不一定进入短视频主时间线。

3. 缺口判断：
- 文案问题：DataHero 需避免同时塞入 100kW、96%、30%-50% 等多个数字，第一条只保留一个主数字。
- 变体问题：TrackingChecklist 可承载验证指标，但无法表达“认证阶段推进”的链条感。
- Props 问题：暂无必须新增字段。
- Combined 问题：暂无。
- Pattern 问题：OrderValidationCard 明显增强；SupplyChainShiftCard 第二次复现；RouteCompareCard 和 RiskMatrixCard 轻度复现。
- 时间线/剪辑问题：EvidenceGridCard 信息密度较高，建议作为备用图文卡或非主时间线卡。

4. 处理决定：
- 立即处理：不新增代码，不新增卡片模板。
- 继续观察：OrderValidationCard、SupplyChainShiftCard、RouteCompareCard、RiskMatrixCard。
- 不进入组件库：单纯公司名单展示不新增名单卡，先用 EvidenceGrid 或口播解决。
```

## 8. 半导体设备压测详情

```text
主题：半导体设备
口播稿/SRT：无直接半导体设备演讲稿；参考主站母稿和光刻机演讲稿
主站链接：https://industry7view.com/research/semiconductor-equipment/

1. 页面/视频拆解：
- 开头钩子：芯片国产化，真正难的不只是芯片，而是造芯片的机器。
- 数据证据：全球半导体设备年市场 1000 亿美元+；单条 12 寸晶圆产线投资 100-200 亿美元；部分关键设备国产化率从 5% 跃升到 30-50%。
- 类比解释：半导体设备是芯片工厂里的精密画笔；光刻负责画线，刻蚀负责挖坑，薄膜沉积负责上颜色，清洗负责擦干净。
- 误解纠偏：不是有样机就叫国产化成功，而是要进入晶圆厂、通过验证、稳定跑产线、最后变成收入。
- 价值路径：出口管制 → 国产替代 → 晶圆厂招标 → 客户验证 → 装机放量 → 收入兑现。
- 跟踪清单：晶圆厂 Capex、设备招标、客户验证、良率稳定、装机数量、收入确认、国产化率。
- 结论收束：半导体设备的机会不在传闻里，而在产线和财报里。
- 可选证据墙：ASML、北方华创、中微公司、盛美上海、拓荆科技、华海清科、中科飞测、长川科技。

2. 已有组件可承载：
- CoverCard：是，用于“芯片国产化，先要机器国产化”。
- HookCard：是，用于“最难的不是芯片，而是造芯片的机器”。
- DataHeroCard：是，但第一条只能选一个主数字，建议用“1000 亿美元+”或“5%→30-50%”。
- LogisticsCard：是，用于“精密画笔/纳米城市”的类比。
- CompareCard：是，用于“不是样机突破，而是产线验证”。
- BusinessLoopCard：是，用于表达管制倒逼到收入兑现的价值路径。
- TrackingChecklistCard：是，用于 Capex、招标、验证、良率、装机、收入等观察变量。
- ClosingQuoteCard：是，用于“机会不在传闻里，而在产线和财报里”。
- EvidenceGridCard：是，适合作为设备类型或核心公司证据墙。

3. 缺口判断：
- 文案问题：DataHero 不应堆叠多个大数字，需围绕一条视频主观点选择数字锚点。
- 变体问题：EvidenceGrid 可承载分类，但若设备分类长期高频，可能需要 CategoryMapCard。
- Props 问题：暂无必须新增字段。
- Combined 问题：暂无。
- Pattern 问题：OrderValidationCard 与 SupplyChainShiftCard 已达到 promotion_candidate；RouteCompareCard 与 RiskMatrixCard 继续 watching。
- 时间线/剪辑问题：无直接 SRT，暂不判断时间线。

4. 处理决定：
- 立即处理：新增 `promotion_candidate` 决策状态。
- 准备 promote：OrderValidationCard、SupplyChainShiftCard。
- 继续观察：RouteCompareCard、RiskMatrixCard、可能的 CategoryMapCard。
- 不进入组件库：单纯公司名单卡和设备名堆叠，先用 EvidenceGrid 解决。
```

## 9. 每次新主题压测模板

```text
主题：
口播稿/SRT：
主站链接：

1. 页面/视频拆解：
- 开头钩子：
- 数据证据：
- 类比解释：
- 误解纠偏：
- 价值路径：
- 跟踪清单：
- 结论收束：
- 可选证据墙：

2. 已有组件可承载：
- CoverCard：是/否
- HookCard：是/否
- DataHeroCard：是/否
- LogisticsCard：是/否
- CompareCard：是/否
- BusinessLoopCard：是/否
- TrackingChecklistCard：是/否
- ClosingQuoteCard：是/否
- EvidenceGridCard：是/否

3. 缺口判断：
- 文案问题：
- 变体问题：
- Props 问题：
- Combined 问题：
- Pattern 问题：
- 时间线/剪辑问题：

4. 处理决定：
- 立即处理：
- 继续观察：
- 不进入组件库：
```
