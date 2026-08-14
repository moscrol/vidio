# Industry 7View Video Design Manual

这份文档是短视频生产系统的总设计手册，作用类似 Stitch `design-md`：把分散的视觉规范、组件边界、动效原则和发布判断整理成 AI 可读取、可执行的参考手册。

## 1. 定位

```text
Industry 7View 视频系统 = 产业研究口播 + 观点卡片 + 动态图形 + 少量 B-roll + 主站引导。
```

它不是纯 PPT，也不是纯 AI 视频。核心任务是把复杂产业判断压缩成适合短视频观看的结构化视觉表达。

## 2. 视觉风格

```text
Industry 7View 版 Swiss：克制、研究感、强结构、深蓝主导、金色强调数据。
```

基础 token 以 `DESIGN_TOKENS.md` 为准：

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

动效必须服务理解，不追求无意义炫技。

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
→ component strategy
→ cards.generated.js
→ timeline-rules.generated.json
→ motion-plan.json
→ Remotion render
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
```

详细清单以 `VIDEO_PUBLISH_CHECKLIST.md` 为准。

## 10. 与 Stitch Skills 的关系

Stitch skills 的价值不是替代当前工程，而是提供方法论：

| Stitch 能力 | 在本工程中的映射 |
|---|---|
| `design-md` | 维护本文件和 tokens / component docs |
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
