# 商业航天_AI口播稿 Xiaoyan Component Plan

- Source: `../短视频演讲稿/商业航天/商业航天_AI口播稿.md`
- Generated at: 2026-06-05T14:11:22.176Z
- Segment count: 77

| time | voiceover | intent | semanticComponent | renderer | existingComponent | propsDraft | gap | decision |
|---|---|---|---|---|---|---|---|---|
| 段落 1 | 商业航天，真不是发火箭。火箭只是太空物流车。它负责把卫星送上去。 | hook | Hook | SwissCard / A-roll | HookCard | {"title":"商业航天，真不是发火箭。火箭只是太空物流车。它负…"} | 无 | use-existing |
| 段落 2 | 但真正值钱的，是卫星上天之后，能不能持续收费。你可以把它想成一条链。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 3 | 低成本发射。批量制造卫星。低轨星座组网。地面终端连接。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["低成本发射","批量制造","星座组网","地面终端"],"highlightNode":"地面终端"} | 无 | add-props |
| 段落 4 | 最后，下游应用付费。火箭像快递车。卫星像天上的基站。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 5 | 测控系统像交通指挥中心。地面终端像你手里的卫星路由器。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["地面终端"],"highlightNode":"地面终端"} | 无 | add-props |
| 段落 6 | 真正收钱的，是卫星宽带、应急通信、遥感数据、导航增强。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"卫星 / 地面站 / 终端"} | 无 | use-existing |
| 段落 7 | 所以商业航天不是单一军工概念。它更像太空版新基建。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"所以商业航天不是单一军工概念。它更像太空版新基建…"} | 无 | use-existing |
| 段落 8 | 最容易看错的地方，就是盯着火箭起飞鼓掌。 | context | A-roll | A-roll / subtitles | 无 | {"note":"最容易看错的地方，就是盯着火箭起飞鼓掌。"} | 无 | one-off |
| 段落 9 | 但火箭只是入口，不是终点。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"但火箭只是入口，不是终点。"} | 无 | use-existing |
| 段落 10 | 一句话，商业航天不是能不能上天，而是上天之后能不能赚钱。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"一句话，商业航天不是能不能上天，而是上天之后能不能赚钱。"} | 无 | use-existing |
| 段落 11 | 20 万颗卫星，是什么概念？ | data | DataHero | SwissCard | DataHeroMotion | {"number":"20万颗","label":"20 万颗卫星，是什么概念？"} | 无 | use-existing |
| 段落 12 | 现在天上的星链，也就几千颗。 | context | A-roll | A-roll / subtitles | 无 | {"note":"现在天上的星链，也就几千颗。"} | 无 | one-off |
| 段落 13 | 但中国在 2026 年初，向国际电联申报了多个低轨星座计划。 | data | DataHero | SwissCard | DataHeroMotion | {"number":"2026年","label":"但中国在 2026 年初，向国际电联申报了多个低轨星座计…"} | 无 | use-existing |
| 段落 14 | 总规模超过 20 万颗。这不是为了好看。这是太空版占座。 | data | DataHero | SwissCard | DataHeroMotion | {"number":"20万颗","label":"总规模超过 20 万颗。这不是为了好看。这是太空版占座。"} | 无 | use-existing |
| 段落 15 | 低轨卫星有个特点。离地球近，时延低。适合做卫星互联网。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"卫星 / 地面站 / 终端"} | 无 | use-existing |
| 段落 16 | 但低轨轨道和频率，不是无限的。国际规则很现实。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"但低轨轨道和频率，不是无限的。国际规则很现实。"} | 无 | use-existing |
| 段落 17 | 谁先申报，谁先发射，谁先占用。谁就更容易拿到好位置。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 18 | 晚了，优质轨道和频段就被别人占走。 | context | A-roll | A-roll / subtitles | 无 | {"note":"晚了，优质轨道和频段就被别人占走。"} | 无 | one-off |
| 段落 19 | 所以 GW 星座、千帆星座、鸿鹄星座都在加速。 | context | A-roll | A-roll / subtitles | 无 | {"note":"所以 GW 星座、千帆星座、鸿鹄星座都在加速。"} | 无 | one-off |
| 段落 20 | GW 规划接近 1.3 万颗。千帆长期目标也是万颗级。 | data | DataHero | SwissCard | DataHeroMotion | {"number":"1.3万颗","label":"GW 规划接近 1.3 万颗。千帆长期目标也是万颗级。"} | 无 | use-existing |
| 段落 21 | 这不是单纯发射竞赛。这是基础设施卡位。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"这不是单纯发射竞赛。这是基础设施卡位。"} | 无 | use-existing |
| 段落 22 | 最狠的地方在于，星座不是发一颗就结束。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"最狠的地方在于，星座不是发一颗就结束。"} | 无 | use-existing |
| 段落 23 | 它要批量制造，连续发射，持续补网。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 24 | 一句话，商业航天突然加速，不是因为概念热了，而是窗口期到了。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"一句话，商业航天突然加速，不是因为概念热了，而是窗口期到了。"} | 无 | use-existing |
| 段落 25 | SpaceX 最强的，不是火箭。而是闭环。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"SpaceX 最强的，不是火箭。而是闭环。"} | 无 | use-existing |
| 段落 26 | 很多人看到猎鹰 9 号回收，会觉得这就是商业航天的终点。其实不是。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"很多人看到猎鹰 9 号回收，会觉得这就是商业航天…"} | 无 | use-existing |
| 段落 27 | 火箭复用，只解决一个问题。把上天成本打下来。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["成本"],"bottleneck":"成本","resultLabel":"利润"} | 无 | add-props |
| 段落 28 | 真正厉害的是下一步。低成本发射，把星链卫星批量送上去。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["低成本发射"],"highlightNode":"低成本发射"} | 无 | add-props |
| 段落 29 | 星链组网之后，用户开始付月费。 | context | A-roll | A-roll / subtitles | 无 | {"note":"星链组网之后，用户开始付月费。"} | 无 | one-off |
| 段落 30 | 这些现金流，又反过来支持下一代火箭和卫星。这就形成一个循环。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["现金流"],"resultLabel":"现金流"} | 无 | add-props |
| 段落 31 | 低成本发射。批量组网。用户付费。现金流反哺研发。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["低成本发射"],"highlightNode":"低成本发射"} | 无 | add-props |
| 段落 32 | 这才是 SpaceX 的核心。打个比方。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"这才是 SpaceX 的核心。打个比方。"} | 无 | use-existing |
| 段落 33 | 只会发火箭，像快递车跑一趟赚一次运费。 | context | A-roll | A-roll / subtitles | 无 | {"note":"只会发火箭，像快递车跑一趟赚一次运费。"} | 无 | one-off |
| 段落 34 | 但星链像路由器装进用户家里，每个月都能收网费。 | context | A-roll | A-roll / subtitles | 无 | {"note":"但星链像路由器装进用户家里，每个月都能收网费。"} | 无 | one-off |
| 段落 35 | 中国商业航天现在还在前半段。发射、组网、制造，正在加速。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 36 | 但真正的下游付费，还没有完全跑通。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 37 | 所以别只问谁能发射。要问谁能形成现金流闭环。别急着找火箭股。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["现金流"],"resultLabel":"现金流"} | 无 | add-props |
| 段落 38 | 商业航天短期更容易兑现的，可能不是火箭。 | compare | Compare | SwissCard / A-roll | CompareMotion | {"title":"商业航天短期更容易兑现的，可能不是火箭。"} | 无 | use-existing |
| 段落 39 | 从全球太空经济结构看，发射服务占比并不高。火箭是入口。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 40 | 但更大的价值池，在地面设备、卫星服务和下游应用。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 41 | 短期最确定的，是组网前就要采购的东西。比如 T/R 组件。 | context | A-roll | A-roll / subtitles | 无 | {"note":"短期最确定的，是组网前就要采购的东西。比如 T/R 组件。"} | 无 | one-off |
| 段落 42 | 它是相控阵天线的核心。低轨卫星要高速通信，离不开它。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"卫星 / 地面站 / 终端"} | 无 | use-existing |
| 段落 43 | 再比如通信载荷、相控阵芯片、测控系统、地面站、终端模组。 | context | A-roll | A-roll / subtitles | 无 | {"note":"再比如通信载荷、相控阵芯片、测控系统、地面站、终端模组。"} | 无 | one-off |
| 段落 44 | 卫星还没真正收费前，这些设备就要先买。打个比方。你要开一万个快递站。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["收费"],"bottleneck":"收费","resultLabel":"利润"} | 无 | add-props |
| 段落 45 | 谁先赚钱？ | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["需求","成本","价格","付费","利润"],"bottleneck":"成本","resultLabel":"利润"} | 无 | add-props |
| 段落 46 | 不一定是最后收快递费的人。 | context | A-roll | A-roll / subtitles | 无 | {"note":"不一定是最后收快递费的人。"} | 无 | one-off |
| 段落 47 | 而是先卖货架、扫码枪、运输车和调度系统的人。 | context | A-roll | A-roll / subtitles | 无 | {"note":"而是先卖货架、扫码枪、运输车和调度系统的人。"} | 无 | one-off |
| 段落 48 | 这就是商业航天的短期逻辑。当然，公司名不要硬背。先记住三类环节。 | checklist | TrackingChecklist | SwissCard | TrackingChecklistCard | {"items":["变量一","变量二","变量三"]} | 无 | use-existing |
| 段落 49 | 星上核心器件。地面通信设备。测控和终端系统。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"真实产业场景"} | 无 | use-existing |
| 段落 50 | 这只是产业链映射，不构成投资建议。卫星上天，不等于赚钱。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 51 | 这是商业航天最容易被忽略的一句话。很多公司能证明，我能造卫星。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"这是商业航天最容易被忽略的一句话。很多公司能证明，我能造卫星。"} | 无 | use-existing |
| 段落 52 | 我能发卫星。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"卫星 / 地面站 / 终端"} | 无 | use-existing |
| 段落 53 | 但还没证明，我能持续收钱。业内有个判断很扎心。 | context | A-roll | A-roll / subtitles | 无 | {"note":"但还没证明，我能持续收钱。业内有个判断很扎心。"} | 无 | one-off |
| 段落 54 | 商业发射的卫星里，真正能提供有效服务应用的，可能不足 30%。 | data | DataHero | SwissCard | DataHeroMotion | {"number":"30%","label":"商业发射的卫星里，真正能提供有效服务应用的，可能不足 3…"} | 无 | use-existing |
| 段落 55 | 这意味着什么？ | context | A-roll | A-roll / subtitles | 无 | {"note":"这意味着什么？"} | 无 | one-off |
| 段落 56 | 上天只是第一关。能用，才是第二关。有人买单，才是第三关。 | checklist | TrackingChecklist | SwissCard | TrackingChecklistCard | {"items":["变量一","变量二","变量三"]} | 无 | use-existing |
| 段落 57 | 最怕的是，市场把三件事混在一起。发射成功，直接等于业绩兑现。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 58 | 星座组网，直接等于用户付费。名字里有航天，直接等于商业航天。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"上天后怎么赚钱","nodes":["星座组网"],"highlightNode":"星座组网"} | 无 | add-props |
| 段落 59 | 这就很危险。2026 年初，板块已经出现过这种情况。 | data | DataHero | SwissCard | DataHeroMotion | {"number":"2026年","label":"这就很危险。2026 年初，板块已经出现过这种情况。"} | 无 | use-existing |
| 段落 60 | 一些公司大涨后，又公告澄清。有的收入占比很低。有的只是零部件业务。 | context | A-roll | A-roll / subtitles | 无 | {"note":"一些公司大涨后，又公告澄清。有的收入占比很低。有的只是零部件业务…"} | 无 | one-off |
| 段落 61 | 有的根本没有实质参与。 | context | A-roll | A-roll / subtitles | 无 | {"note":"有的根本没有实质参与。"} | 无 | one-off |
| 段落 62 | 所以商业航天长期逻辑强。 | context | A-roll | A-roll / subtitles | 无 | {"note":"所以商业航天长期逻辑强。"} | 无 | one-off |
| 段落 63 | 但短期必须看真实订单、收入占比、毛利率和现金流。 | validation | XiaoyanValidationChain | HyperFrames / XiaoyanSketch | XiaoyanValidationChain | {"title":"验证链","stages":["样机","客户验证","稳定跑产","订单兑现"],"riskStage":"客户验证","finalProof":"订单兑现"} | 无 | add-props |
| 段落 64 | 这只是产业研究，不构成投资建议。不用天天追发射。 | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"火箭发射 / 发射场"} | 无 | use-existing |
| 段落 65 | 看商业航天，盯三个变量就够了。第一个，可回收火箭能不能稳定复用。 | checklist | TrackingChecklist | SwissCard | TrackingChecklistCard | {"items":["变量一","变量二","变量三"]} | 无 | use-existing |
| 段落 66 | 不是试一次成功。而是多次复用，成本真的降下来。 | economics | XiaoyanProfitPipe | HyperFrames / XiaoyanSketch | XiaoyanProfitPipe | {"title":"利润管道","factors":["成本"],"bottleneck":"成本","resultLabel":"利润"} | 无 | add-props |
| 段落 67 | 因为没有低成本发射，万颗星座就是昂贵梦想。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["低成本发射"],"highlightNode":"低成本发射"} | 无 | add-props |
| 段落 68 | 第二个，千帆和 GW 能不能按期组网。低轨频轨资源有窗口期。 | checklist | TrackingChecklist | SwissCard | TrackingChecklistCard | {"items":["组网"]} | 无 | use-existing |
| 段落 69 | 发射频次跟不上，商业计划就会变形。第三个，下游有没有真实付费。 | chain | XiaoyanIndustryScroll | HyperFrames / XiaoyanSketch | XiaoyanIndustryScroll | {"title":"产业链路径","nodes":["上游","中游","下游","应用兑现"],"highlightNode":"应用兑现"} | 无 | add-props |
| 段落 70 | 卫星宽带终端卖给谁？ | b-roll | B-roll | B-roll | 素材库 / AI B-roll prompt | {"scene":"卫星 / 地面站 / 终端"} | 无 | use-existing |
| 段落 71 | 月费多少？ | context | A-roll | A-roll / subtitles | 无 | {"note":"月费多少？"} | 无 | one-off |
| 段落 72 | 遥感数据谁买？ | context | A-roll | A-roll / subtitles | 无 | {"note":"遥感数据谁买？"} | 无 | one-off |
| 段落 73 | 复购率怎么样？ | context | A-roll | A-roll / subtitles | 无 | {"note":"复购率怎么样？"} | 无 | one-off |
| 段落 74 | 这些问题，比“今天又发了几颗”更重要。商业航天最怕被讲成星辰大海。 | context | A-roll | A-roll / subtitles | 无 | {"note":"这些问题，比“今天又发了几颗”更重要。商业航天最怕被讲成星辰大海…"} | 无 | one-off |
| 段落 75 | 星辰大海当然浪漫。 | context | A-roll | A-roll / subtitles | 无 | {"note":"星辰大海当然浪漫。"} | 无 | one-off |
| 段落 76 | 但产业研究要看账本。可回收火箭，是成本账。星座组网，是进度账。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"但产业研究要看账本。可回收火箭，是成本账。星座组网，是进度账。"} | 无 | use-existing |
| 段落 77 | 用户付费，是收入账。三本账对上了，商业航天才从题材变成生意。 | quote | ClosingQuote | A-roll / SwissCard | ClosingQuoteCard | {"quote":"用户付费，是收入账。三本账对上了，商业航天才从题材变成生意。"} | 无 | use-existing |

## Summary

- Hook: 1
- XiaoyanIndustryScroll: 12
- B-roll: 12
- Compare: 8
- A-roll: 21
- ClosingQuote: 6
- DataHero: 6
- XiaoyanProfitPipe: 6
- TrackingChecklist: 4
- XiaoyanValidationChain: 1
