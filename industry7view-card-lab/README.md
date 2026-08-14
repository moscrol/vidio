# Industry 7View Card Lab

这是当前主用的 Industry 7View 短视频生产系统，用于把产业研究主题转成 9:16 竖屏短视频所需的 brief、图文卡、B-roll 方案、Remotion 预览和剪映发布版结构。

## 当前定位

- 主风格：Industry 7View 版 Swiss
- 用途：抖音 / B站 / 视频号 / 小红书短视频生产，兼容公众号配图和剪映素材
- 画布：9:16 竖屏
- 第一套样板：商业航天第一条
- 当前阶段：从 Remotion 图文卡组件库升级为短视频生产系统

## 文件说明

```text
index.html          # 预览页面与卡片模板
cards.js            # 内容数据，后续换主题主要改这里
VIDEO_PRODUCTION_SOP.md # 从研究母稿到发布版短视频的标准生产流程
TOPIC_TO_VIDEO_BRIEF_TEMPLATE.md # 每个主题开工前填写的短视频 brief 模板
BROLL_ASSET_SYSTEM.md # B-roll 镜头体系、搜索关键词和 AI 生成提示词规则
PUBLISH_EDITING_TEMPLATE.md # A-roll / B-roll / 卡片 / 字幕 / 音效的发布版剪辑模板
CARD_SPEC.md        # 卡片字段、变体、字数限制和复用边界
COMPONENT_TREE.md   # 组件树：Foundation / Base / Combined / Pattern / Workflow
DESIGN_TOKENS.md    # 品牌色、字体、间距、圆角、动效和画布 Token
VIDEO_DESIGN.md     # 视频系统总设计手册：视觉、叙事、动效、发布判断
VIDEO_COMPONENT_STRATEGY.md # 组件来源策略：png / remotion / stitch
REMOTION_COMPONENT_PLAYBOOK.md # 已验证 Remotion 组件的适用场景、失败模式和复用规则
VARIANT_MATRIX.md   # 各卡片组件的变体状态和候选变体
COMPONENT_GAP_LOG.md # 真实主题暴露的组件缺口、决策状态和压测模板
CARD_PROMPT_TEMPLATE.md # 从研究稿/口播稿生成七卡 cards.js 的提示词模板
CARD_QA_CHECKLIST.md # 导出后的人工视觉验收清单
VIDEO_REVIEW_LOG.md # 视频渲染后的时间线与视觉验收记录
VIDEO_PUBLISH_CHECKLIST.md # 发布前审片、文案和复盘清单
VISUAL_COMPONENT_MAP.md # 短视频视觉组件地图
COMPONENT_BACKLOG.md # 候选组件、优先级和立项规则
CAPCUT_ASSEMBLY_TEMPLATE.md # 七卡剪映粗剪装配模板
BROLL_PROMPT_PACK.md # 行业 B-roll 素材方向和 AI 生成提示词
MOTION_RECIPE_PACK.md # 卡片进入视频后的动效配方和 Remotion 映射
REMOTION_VIDEO_PIPELINE.md # 口播视频 + 卡片 overlay 的 Remotion 生产流程
motion-plan.json     # Remotion 纯卡片视频的卡片顺序和停留时间
timeline-rules.json  # SRT 字幕生成卡片时间线的关键词规则
check-cards.mjs     # cards.js 字段校验脚本
check-motion-plan.mjs # motion-plan.json 时间线校验脚本
export-cards.mjs    # 一键导出 PNG 脚本
package.json        # 导出脚本依赖与命令
remotion/           # Remotion v0.1 纯卡片视频渲染入口
scripts/            # 资产准备脚本
examples/           # 已验证主题样例 cards.js
output/             # PNG 和 MP4 输出目录，运行导出/渲染后生成
```

## 使用方式

### 标准生产流程

每条视频先从 brief 开始，不直接改 `cards.js`：

```text
TOPIC_TO_VIDEO_BRIEF_TEMPLATE.md
```

确认主题判断、卡片密度和 B-roll 段落后，再进入图文卡和时间线生成。

完整流程见：

```text
VIDEO_PRODUCTION_SOP.md
```

发布版剪辑参考：

```text
BROLL_ASSET_SYSTEM.md
PUBLISH_EDITING_TEMPLATE.md
```

### 预览

```bash
python3 -m http.server 8787
```

浏览器打开：

```text
http://localhost:8787
```

### 换主题

只改 `cards.js` 中的内容字段：

- `tag`
- `titleHtml`
- `subtitle`
- `steps`
- `items`
- `footer`
- `url`

不要随意改颜色、字体和布局，否则会破坏统一风格。

修改前先看：

```text
CARD_SPEC.md
```

它定义了 1 张封面 + 7 张正文卡 + 可选扩展卡的用途、必填字段、可选字段、字数限制、允许变体和文案过长时的处理规则。

### 校验

修改 `cards.js` 后先运行：

```bash
npm run check
```

它会检查：

- `cards.js` 是否包含 1 张封面 + 7 张固定正文卡片，以及可选 `extras`
- 卡片顺序和 `type` 是否正确
- 必填字段是否缺失
- 标题、步骤、清单和底部说明是否明显过长
- `titleHtml` 是否包含不允许的 HTML 标签
- `output/{slug}/` 中是否存在对应 PNG

### 导出 PNG

首次使用需要安装依赖：

```bash
npm install
```

然后运行：

```bash
npm run check
npm run export
```

输出到按主题区分的目录：

```text
output/{slug}/
```

### 渲染 Remotion 视频

Remotion 会复用已导出的 PNG，按 `motion-plan.json` 自动排成视频。

```bash
npm run video:render
```

流程等价于：

```text
cards.js → npm run export → public/card-assets/{slug}/ → Remotion → output/video/card-deck-with-talk.mp4
```

如需调整每张卡出现时间、停留时间或顺序，修改：

```text
motion-plan.json
```

如果需要叠加口播视频，把视频放在 `public/` 目录，并在 `motion-plan.json` 中配置：

```json
{
  "talkingHeadVideoPath": "/0510-2.mov",
  "talkingHeadDuration": 71.233333
}
```

当前 v0.6 支持口播视频底层 + 卡片 PNG 上层叠加，也支持用 SRT 字幕和 `timeline-rules.json` 生成卡片出现时间。PNG 仍是稳定兜底路径；后续组件来源不再限定为 PNG，可按 `VIDEO_COMPONENT_STRATEGY.md` 逐步接入 Remotion 原生动态组件和 Stitch 转译组件。

如果已经导出 SRT 字幕，可以先生成时间线：

```bash
npm run video:timeline
```

如果要先从演讲稿判断“该生成哪些卡”，运行：

```bash
npm run video:card-plan
```

输出文件是 `card-plan.generated.json`，用于审核卡片类型、标题、来源字幕和生成理由。

如果要一次性生成并验证 SRT 草稿，可以运行：

```bash
npm run video:from-srt:draft
```

它会生成 `card-plan.generated.json`、`cards.generated.js`、`timeline-rules.generated.json`，并临时用 generated 文件跑 `check`、`export`、`video:timeline`、`check:motion`。结束后会恢复正式 `cards.js`、`timeline-rules.json` 和 `motion-plan.json`。

人工确认草稿后，可以提升为正式文件：

```bash
npm run video:promote:draft
```

它会把 `cards.generated.js` 提升为 `cards.js`，把 `timeline-rules.generated.json` 提升为 `timeline-rules.json`，再生成并校验正式 `motion-plan.json`。如果校验失败，会自动恢复提升前的正式文件。

确认卡片计划后，可以生成 `cards.js` 草稿：

```bash
npm run video:cards:draft
```

输出文件是 `cards.generated.js`。它不会自动覆盖正式 `cards.js`。

也可以从卡片计划生成时间线规则草稿：

```bash
npm run video:timeline:from-plan
```

输出文件是 `timeline-rules.generated.json`。它不会自动覆盖正式 `timeline-rules.json`。

如果是新主题，可以先从 `cards.js` 自动生成一份关键词草稿：

```bash
npm run video:timeline:draft
```

输出文件是 `timeline-rules.draft.json`。人工确认关键词后，再复制到 `timeline-rules.json`。

渲染前可以单独校验时间线：

```bash
npm run check:motion
```

详细流程见：

```text
REMOTION_VIDEO_PIPELINE.md
```

## 与旧组件库的关系

`../remotion-charts` 是旧的涂鸦简笔风格 Remotion 实验库，适合亲和型、手绘科普视频。

本系统是当前主用的 Industry 7View 品牌风格，适合产业研究、数据卡、风险提示和视频矩阵统一视觉。

建议：保留旧库作 archive/legacy，不再作为默认短视频视觉系统。
