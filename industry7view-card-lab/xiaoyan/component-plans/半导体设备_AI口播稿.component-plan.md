# 半导体设备_AI口播稿 Xiaoyan Component Plan

- Source: `../短视频演讲稿/半导体设备/半导体设备_AI口播稿.md`
- Generated at: 2026-06-05T14:11:22.310Z
- Segment count: 18

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 段落 1 | 很多人以为，半导体设备国产化，就是设备终于造出来了。 | hook | Hook | SwissCard / A-roll | HookCard | {"title":"很多人以为，半导体设备国产化，就是设备终于造出来…"} | 无 | use-existing |
| 段落 2 | 但真正的门槛，不在发布会，也不在实验室样机，而在晶圆厂敢不敢用。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机"],"finalProof":"商业兑现"} | 无 | add-props |
| 段落 3 | 为什么？ | context | A-roll | A-roll / subtitles | 无 | {"note":"为什么？"} | 无 | one-off |
| 段落 4 | 因为芯片制造不是普通工厂，一台设备只要不稳定，就可能影响良率、污染晶圆，甚至拖慢整条产线。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 5 | 所以半导体设备从“能跑通”到“能赚钱”，中间隔着一条很长的验证链。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"从样机到订单","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 6 | 第一步，是样机做出来。第二步，是送到客户那里验证。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机"],"finalProof":"商业兑现"} | 无 | add-props |
| 段落 7 | 第三步，是小批量导入，看它能不能在真实工艺里稳定运行。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["小批量导入"],"finalProof":"商业兑现"} | 无 | add-props |
| 段落 8 | 第四步，是长期跑产，看良率、稳定性、维护成本和备件供应能不能扛住。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["长期跑产"],"riskStage":"长期跑产","finalProof":"商业兑现"} | 无 | add-props |
| 段落 9 | 最后，才是批量订单、收入确认和毛利兑现。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["批量订单","收入确认","毛利兑现"],"riskStage":"收入确认","finalProof":"批量订单"} | 无 | add-props |
| 段落 10 | 这就是为什么半导体设备公司最硬的壁垒，不只是技术参数，而是客户认证和产线信任。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"从样机到订单","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 11 | 一个设备进入晶圆厂认证，常见周期可能是 12 到 24 个月。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 12 | 所以看这个行业，别只问有没有国产替代故事，要问三个问题。 | checklist | TrackingChecklist | SwissCard | TrackingChecklistCard | {"items":["变量一","变量二","变量三"]} | 无 | use-existing |
| 段落 13 | 第一，有没有进入头部晶圆厂验证？ | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 14 | 第二，有没有从首台套变成重复订单？ | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 15 | 第三，收入和毛利有没有真正兑现？ | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["毛利"],"resultLabel":"毛利"} | 无 | add-props |
| 段落 16 | 半导体设备国产化，真正的终点不是“我们做出来了”。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"半导体设备国产化，真正的终点不是“我们做出来了”。"} | 无 | use-existing |
| 段落 17 | 而是晶圆厂敢用、产线跑得稳、客户愿意继续下单。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"而是晶圆厂敢用、产线跑得稳、客户愿意继续下单。"} | 无 | use-existing |
| 段落 18 | 这才是从题材，变成生意的那一刻。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"这才是从题材，变成生意的那一刻。"} | 无 | use-existing |

## Summary

- Hook: 1
- XiaoyanValidationChain: 11
- A-roll: 1
- TrackingChecklist: 1
- XiaoyanProfitPipe: 1
- ClosingQuote: 3
