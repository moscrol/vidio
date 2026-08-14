# Xiaoyan Asset Pipeline

Purpose: define how Xiaoyan assets are created, named, stored, tested, and inserted into the Industry 7View video production system.

## 1. Architecture

Recommended relationship:

```text
Remotion = main production engine
HyperFrames = motion lab
Xiaoyan = explanation layer
```

Do not make HyperFrames and Remotion do the same job.

Use Remotion for:

```text
publishable timeline
SRT alignment
existing card components
AI voiceover / talking-head video composition
B-roll insertion
final MP4 render
```

Use HyperFrames for:

```text
Xiaoyan motion prototypes
hand-drawn annotation motion
intro / section transition clips
one-off high-quality explainers
15-second style tests
```

## 2. Asset Types

### 2.1 Static PNG

Use for:

```text
article illustrations
low-frequency concept visuals
fast validation
stable Remotion overlay fallback
```

Pros:

```text
fast
stable
easy to insert into the current pipeline
```

Cons:

```text
internal elements cannot animate
character consistency depends on prompt quality
```

Suggested path:

```text
public/xiaoyan/images/
```

### 2.2 SVG / React Character Component

Use for:

```text
fixed Xiaoyan body
consistent magnifying-glass identity
reusable pose library
native Remotion scenes
```

Suggested path:

```text
remotion/components/xiaoyan/
```

Priority files:

```text
XiaoyanStickFigure.tsx
XiaoyanWithMagnifier.tsx
XiaoyanInspecting.tsx
XiaoyanPointing.tsx
XiaoyanPullingScroll.tsx
Magnifier.tsx
```

### 2.3 HyperFrames Clip

Use for:

```text
intro animation
section transition
hand-drawn explanation
high-quality Xiaoyan motion segment
```

Recommended flow:

```text
HyperFrames HTML
-> render MP4 / WebM / PNG sequence
-> place under public/xiaoyan/clips/
-> reference in Remotion as B-roll or overlay
```

Suggested path:

```text
public/xiaoyan/clips/
```

### 2.4 Remotion Native Component

Use after a Xiaoyan scene has repeated across topics.

Priority components:

```text
XiaoyanConceptScene
XiaoyanSupplyChainScroll
XiaoyanNoiseFilter
XiaoyanProfitPipe
XiaoyanChecklistGuide
```

Suggested path:

```text
remotion/components/xiaoyan/
```

## 3. Naming Rules

Use stable, searchable names.

### Static Images

```text
public/xiaoyan/images/{topic-slug}/{index}-{scene-slug}.png
```

Example:

```text
public/xiaoyan/images/semiconductor-equipment/01-supply-chain-scroll.png
```

### HyperFrames Clips

```text
public/xiaoyan/clips/{scene-slug}/{version}.mp4
```

Example:

```text
public/xiaoyan/clips/noise-filter/v1.mp4
```

### Remotion Components

```text
remotion/components/xiaoyan/Xiaoyan{SceneName}.tsx
```

Example:

```text
remotion/components/xiaoyan/XiaoyanProfitPipe.tsx
```

## 4. Storyboard To Asset Decision

Use this decision table:

| Storyboard Need | Preferred Asset |
|---|---|
| One key number | DataHeroMotion |
| Misunderstanding vs truth | CompareMotion |
| Business loop / value path | BusinessLoopMotion |
| Real product/factory/event | B-roll |
| Conceptual industry explanation | XiaoyanConcept |
| Hand-drawn motion / transition | HyperFramesClip |
| Repeated Xiaoyan scene | Remotion native Xiaoyan component |

Default rule:

```text
If it is structural and repeated, move toward Remotion native.
If it is expressive and exploratory, use HyperFrames.
If it is urgent or one-off, use PNG.
```

## 5. Suggested Motion Plan Extension

Keep existing `segments` compatible, but allow Xiaoyan segments to be identified explicitly.

Candidate shape:

```json
{
  "cardId": "xiaoyan-profit-pipe-01",
  "start": 12.4,
  "duration": 4.5,
  "recipe": "xiaoyan.profitPipe.inspect",
  "componentSource": "hyperframes",
  "renderMode": "brollOverlay",
  "assetPath": "/xiaoyan/clips/profit-pipe/v1.mp4"
}
```

For PNG fallback:

```json
{
  "cardId": "xiaoyan-supply-chain-scroll-01",
  "start": 8.0,
  "duration": 4.0,
  "recipe": "xiaoyan.supplyChain.pan",
  "componentSource": "png",
  "renderMode": "overlay",
  "assetPath": "/xiaoyan/images/robotics/01-supply-chain-scroll.png"
}
```

For future Remotion native:

```json
{
  "cardId": "xiaoyan-noise-filter-01",
  "start": 16.0,
  "duration": 5.0,
  "recipe": "xiaoyan.noiseFilter.reveal",
  "componentSource": "remotion",
  "renderMode": "nativeMotion",
  "componentName": "XiaoyanNoiseFilter"
}
```

## 6. First Three Standard Scenes

Build these first.

### 6.1 Supply Chain Scroll

Purpose:

```text
Explain upstream, midstream, downstream, and company mapping.
```

Visual:

```text
Flat Xiaoyan stands beside a slightly dimensional scroll.
Xiaoyan uses the magnifying glass to inspect one segment.
Labels are short: 上游 / 中游 / 下游 / 公司映射.
```

Asset priority:

```text
1. PNG sample
2. HyperFrames 3-5s motion clip
3. Remotion native component after reuse
```

### 6.2 Noise Filter

Purpose:

```text
Filter hot-topic noise and keep true variables.
```

Visual:

```text
Flat Xiaoyan pulls or holds a slightly dimensional sieve.
Noise words enter: 概念 / 传闻 / 情绪 / 涨停.
Real variables fall out: 订单 / 产能 / 价格 / 渗透率.
```

Asset priority:

```text
1. HyperFrames clip
2. PNG fallback
3. Remotion native component if reused
```

### 6.3 Profit Pipe

Purpose:

```text
Explain where profit flows and which valves block realization.
```

Visual:

```text
Flat Xiaoyan crouches beside a slightly dimensional pipe.
Pipe labels: 需求 / 成本 / 价格 / 竞争 / 利润.
Xiaoyan uses the magnifying glass to inspect one valve.
```

Asset priority:

```text
1. HyperFrames clip
2. Remotion native component
3. PNG fallback
```

## 7. HyperFrames To Remotion Flow

Recommended process:

```text
1. Write HyperFrames scene as isolated HTML.
2. Render to MP4 or WebM.
3. Save under public/xiaoyan/clips/{scene-slug}/.
4. Add a segment in motion-plan.json.
5. Let Remotion place it as B-roll or overlay.
6. Review final MP4 for timing, occlusion, and readability.
```

HyperFrames should not own:

```text
full publish timeline
SRT alignment
card sequencing
final long-form render
```

## 8. Remotion Integration Options

### Option A: Video Clip Layer

Fastest path.

```text
HyperFrames renders MP4.
Remotion uses it like B-roll.
```

Good for:

```text
intro
transition
one-off Xiaoyan explainer
```

### Option B: PNG Overlay

Most stable fallback.

```text
Generated image enters existing PNG overlay flow.
```

Good for:

```text
static concept visual
article image reuse
quick publishing
```

### Option C: Native Remotion Component

Best for repeated scenes.

```text
Xiaoyan SVG/React components animate with interpolate().
```

Good for:

```text
repeated supply-chain scroll
repeated profit-pipe explanation
repeated checklist guide
```

## 9. QA Before Publish

Check every Xiaoyan segment:

```text
1. Does the segment explain one clear idea?
2. Is Xiaoyan still flat and simple?
3. Is the magnifying glass visible?
4. Does the research object have slightly more dimension than Xiaoyan?
5. Are labels readable on 1080x1920 mobile video?
6. Does the clip cover subtitles, face, or key B-roll details?
7. Is the segment shorter than it needs to be?
8. Does it avoid stock-picking implication?
9. Does it fit the rhythm of the voiceover?
```

## 10. Implementation Phases

### Phase 1: Documentation

Add:

```text
XIAOYAN_IP_LAYER.md
XIAOYAN_ASSET_PIPELINE.md
```

### Phase 2: Three Samples

Create:

```text
Supply Chain Scroll
Noise Filter
Profit Pipe
```

### Phase 3: Remotion Clip Insertion

Add:

```text
public/xiaoyan/clips/
motion-plan segment support
review in rendered MP4
```

### Phase 4: Component Promotion

Add:

```text
remotion/components/xiaoyan/
XiaoyanStickFigure.tsx
Magnifier.tsx
scene components
```

### Phase 5: Production Rule

Every new video should produce:

```text
1. storyboard review
2. Xiaoyan shot list
3. component mapping table
4. motion-plan level timing proposal
```

