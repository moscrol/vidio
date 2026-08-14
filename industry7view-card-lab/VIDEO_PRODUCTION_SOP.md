# Industry 7View Video Production SOP

用途：把 `industry7view-card-lab` 从图文卡生成器升级为短视频生产系统。本文定义从研究母稿到发布版短视频的标准流程、输入输出、人工确认点和禁止事项。

## 1. 当前定位

```text
研究母稿
→ 视频 brief
→ 口播稿 / SRT
→ 卡片选择
→ B-roll 选择
→ Remotion 图文卡
→ 剪映发布版
→ 发布复盘
```

当前系统不追求全自动剪辑，而是提供一条可复用、可检查、可人工把关的生产链路。

## 2. 输入材料

每条视频开工前，优先准备以下材料：

| 输入 | 必需 | 用途 |
|---|---|---|
| 网站母稿 | 是 | 提供主题判断、产业链、数据和主站链接 |
| 口播稿 | 是 | 决定视频叙事和口播节奏 |
| SRT 字幕 | 推荐 | 用于生成卡片时间线和校验口播匹配 |
| 口播视频 | 推荐 | 用作 Remotion / 剪映底层 A-roll |
| B-roll 素材 | 推荐 | 提供真实场景、情绪和节奏变化 |
| 卡片 brief | 是 | 决定哪些地方上卡，哪些地方不上卡 |

如果没有 SRT，不应声称卡片已经与口播精确对齐；只能生成结构草稿和剪辑建议。

## 3. 标准生产流程

### Step 1：确认主题判断

先把主题压成一句话：

```text
这个视频只回答一个问题：____。
```

示例：

```text
商业航天不是发火箭，而是低成本发射、星座组网和下游付费形成闭环。
```

这一句决定后面所有素材取舍。

### Step 2：填写视频 brief

使用 `TOPIC_TO_VIDEO_BRIEF_TEMPLATE.md`。

必须先确认：

```text
1. 3 秒钩子是什么。
2. 一个核心数字是什么。
3. 一个误解纠偏是什么。
4. 一个商业路径是什么。
5. 三个跟踪指标是什么。
6. 结尾金句是什么。
7. 哪些段落必须留给 B-roll。
```

没有 brief，不直接改 `cards.js`。

### Step 3：判断卡片密度

60-75 秒视频通常只上 3-5 张卡。

优先上卡的段落：

```text
1. 关键数字。
2. 概念纠偏。
3. 商业闭环。
4. 跟踪清单。
5. 结尾金句。
```

优先不上卡的段落：

```text
1. 情绪判断。
2. 反问互动。
3. 真实场景更有说服力的段落。
4. 已经连续出现两张信息卡之后。
5. 只有过渡语，没有新结构信息。
```

### Step 4：生成或修改卡片内容

卡片内容仍以 `cards.js` 为入口。

新主题可以使用现有流程：

```bash
npm run video:card-plan
npm run video:cards:draft
npm run video:timeline:from-plan
```

如果有完整 SRT，可以使用：

```bash
npm run video:from-srt:draft
```

人工确认后再执行：

```bash
npm run video:promote:draft
```

### Step 5：导出 PNG / 准备 Remotion

常规校验：

```bash
npm run check
npm run export
npm run check:motion
```

渲染：

```bash
npm run video:render
```

Remotion 输出不等于发布版。它是发布版中的动态图文卡轨道或预览样片。

### Step 6：剪映发布版装配

发布版应由以下部分组成：

```text
A-roll / 数字人口播
+ B-roll
+ 少量动态图文卡
+ 字幕
+ 音效
+ 封面
```

使用 `PUBLISH_EDITING_TEMPLATE.md` 安排轨道和节奏。

### Step 7：发布前检查

发布前至少检查：

```text
1. 前 3 秒是否能听懂主题判断。
2. 卡片是否挡脸或挡核心 B-roll。
3. 画面是否连续 8 秒以上没有变化。
4. 是否卡片过密。
5. 结尾是否有清晰观点或互动。
6. 是否保留“不构成投资建议”。
7. 主站链接是否正确。
```

## 4. 人工确认点

| 环节 | 必须确认什么 |
|---|---|
| brief | 是否只讲一个主题判断 |
| card-plan | 选卡是否服务口播，而不是硬套七卡 |
| cards.generated.js | 是否混入旧主题 fallback |
| timeline-rules | 卡片是否出现在对应口播段落 |
| motion-plan | 卡片是否过长、过密、重叠 |
| MP4 回放 | 节奏、遮挡、可读性、口播匹配 |
| 剪映发布版 | A-roll / B-roll / 卡片是否平衡 |

## 5. 禁止事项

```text
1. 不因为时间线有空白就强行补卡。
2. 不把 60-75 秒视频做成全程卡片轮播。
3. 不为单条视频立刻新增组件。
4. 不在成稿中暴露内部路径、raw、Obsidian 或个人数据库称呼。
5. 不手改 generated 文件当作长期正式资产。
6. 不在没有 SRT 的情况下声称时间线已经精确对齐。
```

## 6. 当前推荐工作流

```text
1. 先填 TOPIC_TO_VIDEO_BRIEF_TEMPLATE.md。
2. 决定 3-5 张必须上屏的卡。
3. 用 BROLL_ASSET_SYSTEM.md 选择 B-roll。
4. 生成 cards / timeline 草稿。
5. Remotion 输出动态图文卡预览。
6. 按 PUBLISH_EDITING_TEMPLATE.md 做发布版。
7. 发布后把问题记录到 VIDEO_REVIEW_LOG.md 或 COMPONENT_GAP_LOG.md。
```

## 7. 升级后的判断标准

以前判断系统是否成功：

```text
能不能生成漂亮卡片。
```

现在判断系统是否成功：

```text
能不能稳定把一个产业研究主题转成可发布、可复用、可复盘的 60-75 秒短视频。
```
