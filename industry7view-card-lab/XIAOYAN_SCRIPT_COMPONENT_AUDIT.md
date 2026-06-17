# Xiaoyan Script Component Audit

这份文档把真实演讲稿和分镜表映射到小研组件库。它不是创意清单，而是判断“复用现有组件、补 props、做变体，还是立项新组件”的审计记录。

## 1. 本轮结论

```text
不要继续随机生成新组件。
先用真实稿件压测语义场景，再只推进一个最高复用缺口。
```

本轮读到的材料：

| 主题 | 文件 | 主要语义 | 审计结论 |
|---|---|---|---|
| 半导体设备 | `短视频演讲稿/半导体设备/半导体设备_AI口播稿.md` | 从样机到客户敢用、从技术可用到订单兑现 | 强匹配 `XiaoyanValidationChain` |
| 半导体设备 | `短视频演讲稿/半导体设备/半导体设备_Remotion卡片规划.md` | 验证链是否能由 BusinessLoop 兜底 | 已证明需要手绘验证链 renderer |
| 商业航天 | `短视频演讲稿/商业航天/商业航天_AI口播稿.md` | 发射、组网、终端、下游收费的产业闭环 | 优先匹配 `XiaoyanIndustryScroll` 或 `XiaoyanProfitPipe` 变体 |
| 商业航天 | `短视频演讲稿/商业航天/商业航天不是发火箭_分镜执行表.md` | 五段闭环、三点跟踪、金句收束 | 暂不作为 ValidationChain 证据 |
| 人形机器人 | `抖音/人形机器人第一条_分镜执行表.md` | Demo 到产品、量产成本、工厂验证 | 中强匹配 `XiaoyanValidationChain` |
| 人形机器人 | `archive/completed-storyboards/机器人不是来跳舞的_分镜执行表.md` | 实验室样品到工厂产品，中间死亡谷 | 可作为 ValidationChain 第二压测主题 |

## 2. 组件判断规则

沿用 `SCRIPT_TO_COMPONENT_WORKFLOW.md`：

```text
1. 是否必须视觉化？
2. 是否已有 Swiss/Remotion 组件？
3. 是否需要小研解释层？
4. 是否已有 Xiaoyan Pattern？
5. 是否只是变体不足？
6. 是否多个主题都会用？
```

本轮新增判断：

```text
Xiaoyan 只承担“抽象产业逻辑解释”。
如果一段内容用 B-roll 更有真实感，不强行换成小研。
如果一段内容已有 Swiss 卡片清楚表达，小研只在需要 IP 资产沉淀或手绘解释时出现。
```

## 3. 半导体设备拆分表

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 0-3s | 很多人以为，半导体设备国产化，就是设备终于造出来了。 | hook | Hook | SwissCard / A-roll | `HookCard` / `CoverCard` | title: `造出来 ≠ 赢了` | 无 | use-existing |
| 3-15s | 真正的门槛，不在发布会，也不在实验室样机，而在晶圆厂敢不敢用。 | compare | Compare | SwissCard + B-roll | `CompareMotion` | left: `实验室样机`; right: `晶圆厂敢用` | 无 | use-existing |
| 15-45s | 从能跑通到能赚钱，中间隔着一条很长的验证链。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | `OrderValidationMotion` 可兜底 | stages: 样机 / 客户验证 / 小批量导入 / 长期跑产 / 批量订单; riskStage: 长期跑产; finalProof: 收入和毛利兑现 | 小研手绘验证链未代码化 | candidate-component |
| 45-65s | 别只问有没有国产替代故事，要问三个问题。 | checklist | TrackingChecklist | SwissCard | `TrackingChecklistCard` | items: 头部晶圆厂验证 / 重复订单 / 收入毛利兑现 | 无 | use-existing |
| 65-75s | 晶圆厂敢用、产线跑得稳、客户愿意继续下单。 | quote | ClosingQuote | A-roll / SwissCard | `ClosingQuoteCard` | quote: `真正的国产化，在产线和订单里` | 无 | use-existing |

半导体设备结论：

```text
这是 XiaoyanValidationChain 的最强样本。
它不是“商业闭环”，而是“阶段门槛”。
BusinessLoop 可以临时兜底，但语义不够精准。
```

## 4. 商业航天拆分表

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 0-7s | 商业航天不是发火箭，火箭只是太空物流车。 | hook / compare | Hook / Compare | SwissCard / A-roll | `HookCard` / `CompareMotion` | left: `发火箭`; right: `太空物流车` | 无 | use-existing |
| 7-13s | 真正值钱的，是卫星上天之后，能不能持续收费。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | `XiaoyanProfitPipe` | factors: 发射成本 / 组网速度 / 终端连接 / 应用付费; bottleneck: 应用付费; resultLabel: 持续收费 | 需要测试 ProfitPipe 商业航天 props | add-props |
| 13-21s | 低成本发射、批量制造、星座组网、地面终端、下游收费。 | chain | XiaoyanIndustryScroll | HyperFrames / SwissCard | `BusinessLoopMotion` 可兜底 | nodes: 低成本发射 / 批量制造 / 星座组网 / 地面终端 / 应用收费; highlightNode: 应用收费 | 小研产业链卷轴未代码化 | candidate-component |
| 21-36s | 火箭、卫星、测控、终端分别是什么。 | analogy / chain | Logistics / IndustryScroll | B-roll + SwissCard | `LogisticsCard` / `BusinessLoopMotion` | analogies: 物流车 / 基站 / 指挥中心 / 路由器 | 无 | use-existing |
| 42-54s | 看三个问题：成本、组网、付费。 | checklist | TrackingChecklist | SwissCard | `TrackingChecklistCard` | items: 成本下降 / 按期组网 / 持续付费 | 无 | use-existing |
| 54-70s | 不是能不能上天，而是上天之后能不能赚钱。 | quote | ClosingQuote | A-roll | `ClosingQuoteCard` | quote: `上天之后，能不能赚钱？` | 无 | use-existing |

商业航天结论：

```text
商业航天不是 ValidationChain 的好证据。
它更适合压测 XiaoyanIndustryScroll 和 XiaoyanProfitPipe 的商业闭环变体。
下一步不应为商业航天新增单独组件。
```

## 5. 人形机器人拆分表

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 0-3s | 机器人不是来跳舞的，是来干活的。 | hook | Hook | A-roll / SwissCard | `HookCard` / `CoverCard` | title: `不是跳舞，是干活` | 无 | use-existing |
| 9-16s | 那些全是 Demo。Demo 和产品之间，隔着十万八千里。 | compare | Compare / NoiseFilter | SwissCard / XiaoyanSketch | `CompareMotion` | left: `Demo`; right: `产品` | 小研过滤器可观察，但不优先 | use-existing |
| 16-33s | 真正拐点是能不能进工厂、搬箱子、拧螺丝、客户付钱。 | validation | XiaoyanValidationChain | HyperFrames / B-roll | `BusinessLoopMotion` 可兜底 | stages: Demo / 进工厂 / 稳定干活 / 客户验收 / 付钱; riskStage: 稳定干活; finalProof: 客户愿意付钱 | 小研验证链未代码化 | candidate-component |
| 35-52s | 量产目标价、百万台级别成本、成本可能远高于目标价。 | economics | XiaoyanProfitPipe | HyperFrames / DataHero | `XiaoyanProfitPipe` / `DataHeroMotion` | factors: BOM成本 / 产线效率 / 稳定性 / 售价; bottleneck: 成本; resultLabel: 量产毛利 | 需要 ProfitPipe 机器人 props 压测 | add-props |
| 52-66s | 实验室样品到工厂产品，中间叫死亡谷。 | validation / timeline | XiaoyanValidationChain | HyperFrames / B-roll | `CompareMotion` / 时间线模板 | stages: 实验室样品 / 小批量试用 / 工厂稳定运行 / 成本下降 / 产品时代; riskStage: 死亡谷; finalProof: 工厂产品 | 与半导体设备形成重复需求 | candidate-component |
| 66-71s | 先进入工厂，还是先进入家庭？ | quote / interaction | A-roll | A-roll | 无 | question: `先工厂？还是先家庭？` | 无 | one-off |

人形机器人结论：

```text
它不是半导体设备那种严格客户认证链，但同样是“从 Demo 到客户付费”的阶段门槛。
可以作为 XiaoyanValidationChain 的第二主题压测。
```

## 6. 下一组件排序

| 排名 | 候选 | 证据 | 结论 |
|---:|---|---|---|
| 1 | `XiaoyanValidationChain` | 半导体设备强匹配；人形机器人中强匹配；既有 `OrderValidationCard` 已是 promotion_candidate | v0.1 已实现并完成双 props 渲染 |
| 2 | `XiaoyanIndustryScroll` | 商业航天强匹配；未来产业链拆解高频 | v0.1 已实现并完成双 props 渲染 |
| 3 | `XiaoyanProfitPipe` props 扩展 | 商业航天持续收费、人形机器人成本量产都可复用 | 先补样例 props，不急新增结构 |
| 4 | `XiaoyanNoiseFilter` | Demo vs 产品、概念 vs 兑现等反复出现 | 目前 CompareMotion 足够，继续观察 |
| 5 | `XiaoyanSupplyShift` | 已有 SupplyChainShift promotion_candidate | 等 Swiss 侧字段更稳定后再做小研版 |

## 7. XiaoyanValidationChain v0.1 建议边界

适用口播：

```text
从 A 到 B，中间隔着一串阶段门槛。
不是有没有故事，而是验证走到哪一步。
不是做出来，而是客户敢用、稳定交付、收入毛利兑现。
```

不适用口播：

```text
静态产业链全景。
利润从哪里来。
多技术路线并列比较。
纯风险矩阵。
```

建议 props：

```ts
type XiaoyanValidationChainProps = {
  id: string;
  topic: string;
  title: string;
  stages: Array<{
    label: string;
    desc?: string;
    state: 'done' | 'current' | 'next' | 'risk';
  }>;
  riskStage?: string;
  finalProof: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: number;
};
```

默认动效：

```text
0-1s：纸底和标题出现，小研拿放大镜站在左下或右下。
1-4s：阶段门依次画出，节点按 done/current/next/risk 区分。
4-6s：放大镜扫到 riskStage，红色批注出现。
6-8s：终点 finalProof 点亮，底部结论出现。
```

视觉边界：

```text
小研仍然是二维火柴人。
阶段门、传送带、产线、晶圆厂/工厂对象可以轻微立体。
不要做成厚重金融卡片。
不要做成七眼或外星角色。
```

## 8. 本轮执行建议

```text
1. 把本审计文档纳入组件库资产。
2. 把 XiaoyanProfitPipe v0.1 注册进 XIAOYAN_COMPONENT_LIBRARY.md。
3. 新建 XiaoyanValidationChain v0.1 design spec。
4. 用户确认 spec 后，再写 implementation plan。
5. 只用半导体设备做第一条样片，人形机器人作为第二组 props。
```

## 9. XiaoyanValidationChain v0.1 验证记录

| 主题 | props | 输出 | 状态 |
|---|---|---|---|
| 半导体设备 | `xiaoyan/components/XiaoyanValidationChain/sample-props.json` | `outputs/xiaoyan-validation-chain-v0.1/semi/xiaoyan-validation-chain.mp4` | 已通过 |
| 人形机器人 | `xiaoyan/components/XiaoyanValidationChain/robot-props.json` | `outputs/xiaoyan-validation-chain-v0.1/robot/xiaoyan-validation-chain.mp4` | 已通过 |

验证结果：

```text
1. HyperFrames lint / inspect / render 均成功。
2. ffprobe 显示 1080x1920、30fps、8.000000 秒。
3. 小研保持二维平面火柴人，并持续拿着放大镜。
4. 画面语义读作阶段验证链，不是利润管道或商业闭环。
```

## 10. XiaoyanIndustryScroll v0.1 验证记录

| 主题 | props | 输出 | 状态 |
|---|---|---|---|
| 商业航天 | `xiaoyan/components/XiaoyanIndustryScroll/sample-props.json` | `outputs/xiaoyan-industry-scroll-v0.1/space/xiaoyan-industry-scroll.mp4` | 已通过 |
| 半导体设备 | `xiaoyan/components/XiaoyanIndustryScroll/semi-props.json` | `outputs/xiaoyan-industry-scroll-v0.1/semi/xiaoyan-industry-scroll.mp4` | 已通过 |

验证结果：

```text
1. HyperFrames lint / inspect / render 均成功。
2. ffprobe 显示 1080x1920、30fps、8.000000 秒。
3. 小研保持二维平面火柴人，并持续拿着放大镜。
4. 画面语义读作产业链卷轴/地图，不是利润管道或验证门。
```
