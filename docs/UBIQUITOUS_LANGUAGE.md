# Ubiquitous Language — 短视频 B-roll 生产

## 视频素材

| Term | Definition | Aliases to avoid |
|------|-----------|------------------|
| **A-roll** | 数字人口播画面，承载叙述主线 | 口播、主画面、数字人视频 |
| **B-roll** | 覆盖在A-roll之上的补充画面，用于视觉化讲解内容——包括图表、概念动画、新闻截图等 | 素材、辅助画面 |
| **讲稿** | 短视频的完整文字内容，约250-300字，包含口播文本和视觉指示 | 文案、稿子、演讲稿 |
| **分镜执行表** | 将讲稿拆解为逐个镜头的执行清单，标注每个镜头的类型、内容、时长、B-roll方案 | 分镜表、storyboard |
| **炸点** | 观众想截屏分享的金句，每条视频至少一处 | 爆点、金句、记忆点 |

## 工具与组件

| Term | Definition | Aliases to avoid |
|------|-----------|------------------|
| **Remotion** | React框架，通过代码生成视频MP4，用于渲染6种动态图表模板（NumberImpactCard、ComparisonChart等）。Version 4.x，使用 `Config` API。**组件视觉风格由 Stitch 设计驱动，不得自行定制** | remotion-charts |
| **Stitch MCP** | Google Project Stitch的MCP服务器。**所有动态图表的视觉设计源**——先用 Stitch 生成图表 UI 视觉方案，再据此编写 Remotion 组件。使用项目 `11811804841660798822` + Nocturne设计系统（ruby #e0115f + gold #ffdb3c + dark #131313）。Stitch 是 UI 工具，不适合生成 B-roll 概念图（对非 UI 主体缺乏上下文理解）。generation可能超时，超时后检查 list_screens 确认是否已生成 | stitch |
| **Timing 时序系统** | `src/timing.ts`，定义每个图表组件中各个元素的入场时间（秒），使动画与口播音频同步。组件通过 `timing` prop 接收，不传则使用默认编排。render.ts 按分镜执行表的秒级位置注入 | 动画时序、音画同步 |
| **B-roll 色彩策略** | B-roll 不通过 Stitch 生成概念图，而是将 Nocturne 设计系统色值（gold #ffdb3c 边缘光、ruby #e0115f 指示灯、dark #131313 背景）直接写入即梦/可灵 prompt，剪映合成时统一调色对齐 | AI画面色彩 |
| **stitch-to-video skill** | 封装了"增强提示词→Stitch生成设计→下载设计稿→翻译为Remotion组件→渲染MP4"完整管线的子流程 skill，位于 `.claude/skills/stitch-to-video/SKILL.md` | Stitch管线 |
| **storyboard-decision skill** | Claude skill，将讲稿拆解为分镜执行表，输出图表JSON和AI提示词 | 分镜skill |
| **即梦AI** | AI图像生成工具，用于按prompt生成概念画面 | 即梦 |
| **剪映** | 视频编辑工具，负责最终合成、音效、字幕、调色 | CapCut |

## 管线阶段

| Term | Definition | Aliases to avoid |
|------|-----------|------------------|
| **分镜拆解** | 从讲稿生成分镜执行表的过程，由 storyboard-decision skill 执行 | 拆分镜 |
| **Stitch设计** | Stitch MCP 根据增强提示词生成图表的 HTML+截图视觉方案，作为 Remotion 组件的视觉参考 | 出图、设计稿 |
| **图表渲染** | Remotion根据 Stitch 视觉方案编写组件并渲染动态图表MP4的过程 | 渲染 |
| **最终合成** | 在剪映中将A-roll、B-roll、音效、字幕组合成完整视频的过程 | 合成、剪辑 |

## Relationships

- 一份**讲稿**经**分镜拆解**产生一张**分镜执行表**
- 一张**分镜执行表**中的代码生成图表 → 先走 **Stitch设计** 出视觉方案 → 再走 **图表渲染** 出 MP4
- **Stitch设计**是强制步骤：所有动态图表必须先用 Stitch 生成视觉方案，不得跳过直接用 Remotion 组件
- Remotion组件复用需用户许可，禁止擅自沿用现有组件的默认视觉
- **A-roll** + **B-roll** 在**剪映**中完成**最终合成**
- 每个**炸点**需要对应的**B-roll**强化视觉冲击
- **B-roll**不是全程覆盖，只在关键信息点切入

## Flagged ambiguities

- "stitch" 在当前对话中有歧义：用户可能指的是视频拼接概念，也可能指 **Stitch MCP**（Google Stitch 的 HTTP MCP 服务器）。当前项目已配置 Stitch MCP 用于生成图表设计，因此 "用 Stitch 做图表" 指的是调用 Stitch MCP 生成视觉设计。
- "素材" 被同时用于指代 B-roll 视频素材和原始演讲稿素材——统一用 **B-roll** 指前者，**讲稿** 指后者。

## Example dialogue

> **Dev:** "这条讲稿**分镜拆解**出来有4个图表镜头，用**Remotion**渲染大概多久？"
> **User:** "这4个都是**NumberImpactCard**模板，批量渲染2分钟搞定。"
> **Dev:** "那另外2个概念画面镜头，我用**即梦AI**的prompt直接跑？"
> **User:** "对，**分镜执行表**里已经标好了prompt，直接复制过去。最后全部进**剪映**和**A-roll**一起**最终合成**。"
> **Dev:** "**炸点**处必须覆盖**B-roll**，其他叙述句可以留**A-roll**？"
> **User:** "对，观众需要看到数字人的脸建立信任。**B-roll**是把抽象概念变成眼睛能看的东西。"
