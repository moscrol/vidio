# Industry 7View Remotion Video Pipeline v0.9

用途：把视频稿、口播视频、组件资产和 Remotion 时间线固定成一条可复用生产流程。当前 PNG 是稳定兜底路径，后续组件来源可以扩展为 Remotion 原生动态组件和 Stitch 转译组件。

## 当前状态（2026-05-24）

```text
v0.4  字幕/稿件驱动时间线               ✓ 已完成
v0.5  B-roll 插入                       ✓ 已完成（v0.9 中实现）
v0.7  组件来源策略 png/remotion/stitch  ✓ 已完成
v0.8  发布版闭环（intro/outro/水印）    ✓ 已完成
v0.9  B-roll 层 + 多 brolls 支持        ✓ 已完成
v1.0  真正动态卡片组件                  ✓ 已完成核心：DataHero/Compare/Loop/OrderValidation/SupplyChainShift
```

**发布版命令**：

```bash
npm run video:publish          # 出发布版（含片头/片尾/水印/B-roll/字幕）
npm run video:publish:cover    # 抽帧导出平台封面
```

**发布版输出**：

```text
output/publish/{slug}/
  video.mp4         发布版 1080x1920，可直接上传抖音/B站
  cover.png         平台封面
  metadata.json     标题/简介/标签建议
```

**B-roll 配置**：见 `BROLL_GUIDE.md`。



当前阶段不追求单条实验视频内容完全匹配，而是固定生产链路：

```text
视频稿 / 口播视频
→ card intent
→ component strategy
→ cards.js
→ PNG / Remotion native / Stitch converted
→ motion-plan.json
→ Remotion
→ MP4
```

## 1. 输入文件

### 1.1 卡片内容

```text
cards.js
```

负责定义：

```text
cover
cards[01-07]
extras[08]
```

### 1.2 口播视频

放在：

```text
public/
```

例如：

```text
public/0510-2.mov
```

要求：

```text
1080x1920
9:16
建议自带音频
如果已有字幕，可直接烧录在口播视频里
```

### 1.3 时间线

```text
motion-plan.json
```

负责定义：

```text
fps
width / height
talkingHeadVideoPath
talkingHeadDuration
segments
```

### 1.4 字幕时间轴

SRT 字幕放在：

```text
public/
```

例如：

```text
public/0510-2(1).srt
```

SRT 用来提供真实口播时间轴。当前 v0.4 不自动理解全稿，而是用 `timeline-rules.json` 里的关键词规则，从字幕里定位每张卡的出现时间。

## 2. motion-plan.json 结构

```json
{
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "talkingHeadVideoPath": "/0510-2.mov",
  "talkingHeadDuration": 71.233333,
  "segments": [
    {
      "cardId": "02-data-hero-card",
      "start": 8,
      "duration": 4,
      "recipe": "dataHero.numberEmphasis"
    }
  ]
}
```

字段说明：

| 字段 | 说明 |
|---|---|
| `cardId` | 对应导出的 PNG 文件名，不含 `.png`。 |
| `start` | 卡片出现的绝对秒数。 |
| `duration` | 卡片停留秒数。 |
| `recipe` | 动效配方名称，当前用于标记，后续可驱动具体动效。 |

如果某个 segment 没有写 `start`，脚本会按上一张卡结束时间自动顺排。

## 3. 命令

### 3.1 校验卡片数据

```bash
npm run check
```

### 3.2 校验视频时间线

```bash
npm run check:motion
```

### 3.3 用 SRT 生成时间线

如果要先从演讲稿判断“该生成哪些卡”，运行：

```bash
npm run video:card-plan
```

输出：

```text
card-plan.generated.json
```

它会把 SRT 合并为语义段，建议卡片类型、标题字段、来源字幕和生成理由。这个文件用于审核内容规划，避免固定九卡硬套。

确认卡片计划后，可以生成 `cards.js` 草稿：

```bash
npm run video:cards:draft
```

输出：

```text
cards.generated.js
```

它不会自动覆盖正式 `cards.js`。需要人工确认后再替换。

如果要一次性生成并验证 SRT 草稿，运行：

```bash
npm run video:from-srt:draft
```

输出：

```text
card-plan.generated.json
cards.generated.js
timeline-rules.generated.json
```

它会临时把 generated 文件放进沙箱验证链路，依次运行卡片校验、PNG 导出、SRT 时间线生成和 motion 校验。验证结束后会恢复正式 `cards.js`、`timeline-rules.json` 和 `motion-plan.json`，所以它适合用作新主题的预检，不适合作为最终发布命令。

人工确认 generated 草稿后，可以提升为正式文件：

```bash
npm run video:promote:draft
```

它会把 `cards.generated.js` 复制为 `cards.js`，把 `timeline-rules.generated.json` 复制为 `timeline-rules.json`，然后重新生成正式 `motion-plan.json` 并运行校验。若校验失败，脚本会恢复提升前的 `cards.js`、`timeline-rules.json` 和 `motion-plan.json`。

也可以从卡片计划生成时间线规则草稿：

```bash
npm run video:timeline:from-plan
```

输出：

```text
timeline-rules.generated.json
```

它不会自动覆盖正式 `timeline-rules.json`。需要人工确认后再替换。

新主题也可以从现有 `cards.js` 生成关键词规则草稿：

```bash
npm run video:timeline:draft
```

输出：

```text
timeline-rules.draft.json
```

人工检查 `keywords` 后，把可用规则复制到 `timeline-rules.json`。

然后生成正式时间线：

```bash
npm run video:timeline
```

流程：

```text
public/*.srt
→ timeline-rules.json
→ motion-plan.json
```

`timeline-rules.json` 示例：

```json
{
  "srtPath": "/0510-2(1).srt",
  "avoidOverlap": true,
  "minGap": 0.3,
  "segments": [
    {
      "cardId": "02-data-hero-card",
      "keywords": ["2 到 3 万美元"],
      "duration": 4,
      "recipe": "dataHero.numberEmphasis"
    }
  ]
}
```

规则说明：

| 字段 | 说明 |
|---|---|
| `srtPath` | 字幕文件路径，相对于 `public/`。 |
| `avoidOverlap` | 是否自动顺延重叠卡片。 |
| `minGap` | 自动顺延时，两张卡之间保留的最小间隔秒数。 |
| `keywords` | 匹配字幕文本的关键词，命中任意一个就取该字幕的开始时间。 |
| `duration` | 卡片停留秒数。 |
| `recipe` | 动效配方标记。 |

校验检查：

```text
motion-plan.json 是否存在
口播视频路径是否存在
cardId 是否存在于 cards.js
start / duration 是否为合法数字
卡片是否超出口播视频时长
对应 PNG 是否已经导出
```

### 3.4 渲染视频

```bash
npm run video:render
```

等价于：

```text
npm run export
npm run check:motion
npm run video:assets
remotion render
```

输出：

```text
output/video/card-deck-with-talk.mp4
```

## 4. 当前 v0.4 能力

```text
支持口播视频作为底层
支持 PNG 卡片作为上层 overlay
支持把组件来源扩展为 png / remotion / stitch
支持每张卡用 start 精准控制出现时间
支持从 SRT 字幕 + timeline-rules.json 生成 start 时间
支持自动顺延重叠卡片
支持自动复制 PNG 到 public/card-assets/{slug}/
支持自动生成 remotion/generated/card-video-data.ts
支持基础淡入、上浮、轻微缩放、退场
已定义 recipe 到原生动态组件的升级方向
```

## 5. 当前不做的事

```text
不自动判断稿子和卡片是否语义匹配
不自动理解整篇字幕语义
PNG 路径不拆分图片内部元素
当前正式渲染仍不做数字计数动画
当前正式渲染仍不做 BusinessLoop 节点逐个点亮
当前正式渲染仍不做 EvidenceGrid 证据格逐个出现
不插入 B-roll 视频
```

这些属于后续 v0.5+。

## 6. 标准生产流程

### Step 1：准备口播视频

把口播视频放到：

```text
public/
```

然后用 `ffprobe` 或播放器确认时长。

### Step 2：生成或替换 cards.js

用视频稿生成：

```text
cover + 7 cards + optional extras
```

同时根据 `VIDEO_COMPONENT_STRATEGY.md` 判断每张卡的组件来源：

```text
png：稳定兜底。
remotion：需要数字滚动、节点点亮、左右滑入等元素级动效。
stitch：来自 Stitch 的设计稿或组件，先转译为 PNG 或 Remotion 组件后进入流程。
```

### Step 3：导出 PNG

```bash
npm run export
```

### Step 4：填写 motion-plan.json

根据口播时间点填写：

```text
cardId
start
duration
recipe
```

### Step 5：校验

```bash
npm run check
npm run check:motion
```

### Step 6：渲染

```bash
npm run video:render
```

### Step 7：人工播放检查

重点检查：

```text
卡片是否挡住字幕/人脸/关键信息
卡片出现时机是否对齐口播
停留时间是否够读完
结尾链接是否留够阅读时间
封面是否应该只做平台封面而不进入时间线
```

## 7. 后续版本

### v0.4：字幕/稿件驱动时间线

从视频稿、字幕或 SRT 生成 `motion-plan.json` 的 `start` 时间。

### v0.5：B-roll 插入

支持：

```text
public/broll/*.mp4
```

并在 `motion-plan.json` 中配置 B-roll segment。

### v0.7：组件来源策略

支持：

```text
componentSource: png | remotion | stitch
renderMode: overlay | nativeMotion | stitchConverted
recipe: 继续作为动效配方入口
```

### v1.0：真正动态卡片组件

把部分 PNG overlay 升级为 Remotion React 组件：

```text
DataHeroMotion
BusinessLoopMotion
EvidenceGridMotion
```

实现：

```text
数字计数
节点逐个点亮
证据格逐个出现
动态图表
```
