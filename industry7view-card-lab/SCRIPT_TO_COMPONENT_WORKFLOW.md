# Script To Component Workflow

这份文档定义“演讲稿 / 分镜表 → 组件库调用”的工作流。目标是让每条 Industry 7View 视频都先复用现有组件，再判断是否补新组件，避免随机生成和风格漂移。

## 1. 输入材料

优先级从高到低：

```text
1. 分镜执行表
2. AI 口播稿
3. SRT 字幕
4. 主题 brief
5. 已有卡片规划
```

## 2. 输出格式

每次分析演讲稿，都输出一张组件匹配表：

| 字段 | 说明 |
|---|---|
| `time` | 时间段，若没有 SRT 可用段落序号 |
| `voiceover` | 对应口播 |
| `intent` | hook / compare / chain / validation / data / checklist / quote / b-roll |
| `semanticComponent` | 语义组件，如 OrderValidation / BusinessLoop / XiaoyanProfitPipe |
| `renderer` | SwissCard / XiaoyanSketch / HyperFrames / Remotion / B-roll |
| `existingComponent` | 可直接复用的现有组件 |
| `propsDraft` | 组件字段草案 |
| `gap` | 是否存在组件缺口 |
| `decision` | use-existing / add-variant / add-props / candidate-component / one-off |

## 3. 意图识别规则

| 口播信号 | intent | 优先组件 |
|---|---|---|
| “很多人以为 / 但真正” | compare / hook | `HookCard` / `CompareMotion` |
| “不是 A，而是 B” | compare | `CompareMotion` / `XiaoyanNoiseFilter` |
| “一条链 / 从 A 到 B” | chain | `BusinessLoopMotion` / `XiaoyanIndustryScroll` |
| “样机、验证、导入、跑产、订单” | validation | `OrderValidationMotion` / `XiaoyanValidationChain` |
| “看三个问题 / 跟踪变量” | checklist | `ChecklistMotion` / `XiaoyanChecklistInspect` |
| “成本、现金流、利润” | economics | `XiaoyanProfitPipe` / `BusinessLoopMotion` |
| “核心数字 / 12-24 个月 / 1000 亿” | data | `DataHeroMotion` |
| “结论金句 / 真正的终点” | quote | `QuoteMotion` / A-roll |
| 真实场景、工厂、设备、人物动作 | b-roll | B-roll prompt / 素材库 |

## 4. 判断顺序

每个候选镜头按这个顺序判断：

```text
1. 是否必须视觉化？
   否：交给 A-roll 字幕或 B-roll。

2. 是否已有 Swiss/Remotion 组件？
   是：优先复用。

3. 是否需要小研解释层？
   是：选 Xiaoyan Pattern。

4. 是否已有 Xiaoyan Pattern？
   是：补 props。

5. 是否只是变体不足？
   是：记录 add-variant。

6. 是否多个主题都会用？
   是：进入 candidate-component。
   否：one-off，不进组件库。
```

## 5. Prompt 模板

```text
请基于以下组件库清单，分析这段演讲稿应该如何调用组件。

组件库清单：
- SwissCard: HookCard, DataHeroCard, CompareCard, BusinessLoopCard, OrderValidationCard, TrackingChecklistCard, ClosingQuoteCard, EvidenceGridCard
- Xiaoyan Pattern: XiaoyanProfitPipe, XiaoyanValidationChain, XiaoyanIndustryScroll, XiaoyanNoiseFilter, XiaoyanSupplyShift
- B-roll: factory, lab, product, chart screen, real-world scene

演讲稿：
{paste_script}

请按表格输出：
time / voiceover / intent / semanticComponent / renderer / existingComponent / propsDraft / gap / decision

要求：
1. 先复用已有组件，不要凭空新建。
2. 如果现有组件不够，只指出最小缺口。
3. 小研只用于解释抽象产业逻辑，不要全片常驻。
4. 每个小研镜头最多 3-5 个节点、1-3 个批注、1 句底部结论。
5. 明确哪些镜头适合 HyperFrames 动效，哪些只适合静态图或 B-roll。
```

## 6. 半导体设备样例

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 0-3s | 很多人以为，半导体设备国产化，就是设备终于造出来了。 | hook | Hook | SwissCard | `HookCard` | title: `造出来 ≠ 赢了` | 无 | use-existing |
| 3-15s | 真正的门槛，不在发布会，也不在实验室样机，而在晶圆厂敢不敢用。 | compare | Compare | SwissCard + B-roll | `CompareMotion` | old: `实验室样机`; new: `晶圆厂敢用` | 无 | use-existing |
| 15-45s | 从能跑通到能赚钱，中间隔着一条很长的验证链。 | validation | OrderValidation / XiaoyanValidationChain | XiaoyanSketch or Remotion | `OrderValidationMotion` exists | stages: 样机/客户验证/小批量导入/长期跑产/批量订单 | 小研手绘 renderer 未代码化 | candidate-component |
| 45-65s | 别只问有没有国产替代故事，要问三个问题。 | checklist | TrackingChecklist | SwissCard | `ChecklistMotion` | items: 头部晶圆厂验证/重复订单/收入毛利兑现 | 无 | use-existing |
| 65-75s | 真正的终点不是做出来，而是晶圆厂敢用、产线跑得稳、客户继续下单。 | quote | ClosingQuote | A-roll or SwissCard | `QuoteMotion` | titleHtml: `真正的国产化，在产线和订单里` | 无 | use-existing |

## 7. Gap Log 写法

当发现缺口，不立刻写代码，先记录：

```text
Gap: XiaoyanValidationChain renderer
Triggered by: 半导体设备验证链
Existing fallback: OrderValidationMotion
Why fallback is not enough: 瑞士卡片清楚但缺少小研手绘解释层，和 IP 资产沉淀无关
Fields likely stable: stages, riskStage, finalProof, footer
Need one more validation: 人形机器人量产链 / 商业航天成本-组网-付费链
Decision: candidate-component
```

## 8. 验收标准

```text
1. 每段口播都有明确 renderer，不出现“随便生成图”。
2. 组件复用优先，缺口只记录最小缺口。
3. 小研镜头不超过全片 20%-30%。
4. 每个新增候选组件能列出字段、边界、复用主题。
5. 真正进入代码前，至少经过 2 个主题压测。
```

