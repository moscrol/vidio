# Video Review Log

## 2026-05-21 Native Compare Passed and BusinessLoop Added

### Manual Review Result

```text
04-not-a-is-b / CompareMotion: Passed
```

人工播放检查通过项：

- 左右对比 Demo ≠ 产品 一眼能懂。
- 左卡、符号、右卡转场节奏可接受。
- 金色 ≠ 强调足够，未压过文字。
- 说明文字“中间隔着稳定、成本和客户付费。”可读。
- 与口播“Demo 和产品之间”对齐可接受。

### Native Component Progress

```text
DataHeroMotion: native
CompareMotion: native
BusinessLoopMotion: native
```

本次新增 `BusinessLoopMotion`，用于 `05-business-loop`。动效结构：

```text
标题淡入 → 金色闭环路径展开 → 节点逐个出现 → 最后节点深蓝/金色强调
```

### Validation

```text
npm run check
npm run video:assets
npm run check:motion
npm run video:render
npm run check
npm run check:motion
```

All passed.

### Render Metadata

```text
output/video/card-deck-with-talk.mp4
size≈28.9 MB
05-business-loop renderMode=native
```

## 2026-05-21 Humanoid Robot SRT Alignment Fix

### Publish Candidate

```text
status=Publish candidate v1
checklist=VIDEO_PUBLISH_CHECKLIST.md
decision=Needs final human playback review
```

### Output

```text
output/video/card-deck-with-talk.mp4
```

### Source

```text
public/0510-2(1).srt
motion-plan.json
timeline-rules.json
```

### Issue

卡片出现时间没有完整覆盖对应口播段落。旧逻辑只用第一条命中的字幕 cue 作为开始时间，并使用 `timeline-rules.json` 里的固定 `duration`，导致一段话还没说完，卡片已经消失。

### Fix

`scripts/generate-motion-plan-from-srt.mjs` 已改为优先使用 `sourceCueIndexes` 计算字幕窗口：

```text
start = 第一条 source cue 的 start
end = 最后一条 source cue 的 end
duration = end - start
```

如果规则没有 `sourceCueIndexes`，才回退到关键词匹配窗口。

### Timing Tweak Rule

轻微偏差不直接手改 `motion-plan.json`，优先在 `timeline-rules.json` 中对单张卡配置：

```text
startOffset：调整卡片出现时间。
endOffset：调整卡片消失时间。
minDuration：限制最短停留。
maxDuration：限制最长停留。
```

### 2026-05-21 Data Card Timing Tweak

人工审片反馈：`02-data-hero-card` 提前出现在“到现在还没真正出现”这句。修正方式：

```text
timeline-rules.json
02-data-hero-card sourceCueIndexes: [13, 14, 15] → [14, 15]
```

修正后数据卡时间：

```text
02-data-hero-card       35.433s  → 41.566s   duration 6.133s
```

该卡现在从“马斯克说过一个大实话”开始，不再覆盖上一句。

### Storyboard Deepening

纯卡片版适合验证 SRT/PNG/Remotion 管线，但发布版不应全程使用卡片。已输出剪映执行用分镜：

```text
/Users/lbq/Desktop/c c/视频/抖音/人形机器人第一条_分镜执行表.md
```

剪辑原则：

```text
A-roll：开头判断、反常识转折、风险提醒、互动提问。
B-roll：机器人动作、进工厂、搬箱子、拧螺丝、产线稳定工作、死亡谷概念画面。
动态图表/卡片：Demo≠产品、2-3万美元、量产流程、样品时代→产品时代。
```

### Current Timeline

```text
00-cover-card            0.000s  →  2.866s   duration 2.866s
01-hook-card             3.166s  →  9.599s   duration 6.433s
04-not-a-is-b            9.899s  → 17.066s   duration 7.167s
03-logistics-card       17.366s  → 26.399s   duration 9.033s
02-data-hero-card       35.433s  → 41.566s   duration 6.133s
05-business-loop        44.366s  → 52.266s   duration 7.900s
06-tracking-checklist   52.566s  → 59.200s   duration 6.634s
07-closing-quote        59.500s  → 67.133s   duration 7.633s
```

### Validation

```text
npm run video:timeline
npm run check:motion
npm run video:render
npm run check
npm run check:motion
```

All passed.

### Render Metadata

```text
duration=71.296000
size=31709679
```

### Review Frames

```text
output/video-review-aligned/00-cover-mid.jpg
output/video-review-aligned/01-hook-mid.jpg
output/video-review-aligned/04-compare-mid.jpg
output/video-review-aligned/03-logistics-mid.jpg
output/video-review-aligned/02-data-mid.jpg
output/video-review-aligned/05-loop-mid.jpg
output/video-review-aligned/06-checklist-mid.jpg
output/video-review-aligned/07-closing-mid.jpg
```

### Manual Review Checklist

- 卡片开始时间是否对应口播段落第一句。
- 卡片结束时间是否覆盖口播段落最后一句。
- 卡片是否遮挡人脸、字幕或关键画面。
- 过长卡片是否需要拆成两张，或降低透明度/缩小尺寸。
- 封面标题换行是否自然。
- 发布前按 `VIDEO_PUBLISH_CHECKLIST.md` 完成人工播放检查。
