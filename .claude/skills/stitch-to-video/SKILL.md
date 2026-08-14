---
name: stitch-to-video
description: Sub-flow of storyboard workflow. Translates chart descriptions from 分镜执行表 into animated MP4 via enhance-prompt → Stitch design → Remotion component → render. Topic-aware visual style.
allowed-tools:
  - "mcp__stitch*"
  - "Bash"
  - "Read"
  - "Write"
  - "Edit"
---

# Stitch to Video — Dynamic Chart Production Sub-Flow

You are a chart production specialist within the storyboard pipeline. You take chart descriptions from 分镜执行表 and produce animated MP4 clips via Stitch → Remotion. This skill replaces Python/Matplotlib and hand-made 剪映 templates for "代码生成" dynamic charts.

## Trigger

Invoke when the storyboard workflow (分镜工作流) produces chart specs marked as "代码生成", or when the user directly requests chart video generation:
- "生成图表", "出图", "做个图表视频", "B-roll chart"
- Processing a 分镜执行表 with dynamic charts
- User says "stitch-to-video"

## Architecture

```
分镜执行表 图表描述
  ↓ Step 0: Identify topic → determine visual style
  ↓ Step 1: enhance-prompt → translate description + topic style → Stitch prompt
  ↓ Step 2: Stitch generates design
  ↓ Step 3: Download HTML + screenshot
  ↓ Step 4: Translate to Remotion component (structure reuses existing, visual follows Stitch)
  ↓ Step 5: Register + render MP4
```

**Key principle: Topic determines visual style, not the chart type.** The same "number card" chart for a robotics topic uses industrial aesthetics, while for a finance topic uses market dashboard aesthetics. Existing Remotion components provide structural templates; Stitch provides topic-specific visual design.

## Step 0: Identify Topic & Visual Direction

Before generating anything, determine the visual direction based on the video topic:

| Topic Category | Visual Atmosphere | Color Mood | Typography Feel |
|---|---|---|---|
| 机器人/工业 | Precision engineering dashboard | Steel blue, amber, charcoal | Industrial, monospace data |
| 金融/财经 | Market terminal, trading floor | Ruby red, gold, deep navy | Financial, high-contrast |
| 科技/消费电子 | Clean product launch, Apple-style | White, slate, single accent | Minimalist, geometric |
| 新能源/汽车 | Energy dashboard, EV interface | Green, electric blue, dark | Modern, sustainable |
| 医药/生物 | Clinical, lab-grade precision | Teal, white, cool neutral | Scientific, clean |
| 通用知识科普 | Balanced, approachable | Blue accent, warm gray | Friendly, readable |

This topic→style mapping feeds into enhance-prompt (Step 1).

## Step 1: Enhance Prompt

Translate the chart description from the storyboard into a Stitch-optimized prompt, injecting the topic's visual style.

**Input** (from storyboard): chart type, data, purpose, animation notes
**Output**: structured Stitch prompt with DESIGN SYSTEM section

**Prompt template:**

```markdown
A cinematic dark-themed [topic_category] data card for short video B-roll. Vertical mobile layout (390x844).

DESIGN SYSTEM (REQUIRED):
- Platform: Mobile, Dark theme
- Atmosphere: [topic visual atmosphere from Step 0 table]
- Background: [topic base color] with subtle gradient
- Primary Accent: [topic primary color] for emphasis
- Secondary Accent: [topic secondary color] for highlights
- Surface: Translucent glass panels with backdrop-filter: blur(12px)

PAGE STRUCTURE:
1. [Section 1 from storyboard chart description]
2. [Section 2 from storyboard chart description]
...
```

**Enhancement rules:**
- Add UI/UX terminology the storyboard doesn't have (glassmorphism, backdrop-filter, gradient strokes)
- Inject color values from the topic's visual direction
- Structure into numbered sections with clear hierarchy
- Add atmosphere keywords (e.g., "precision engineering", "market terminal")
- Include Chinese text labels where the storyboard specifies them

## Step 2: Generate Stitch Design

Use Stitch MCP to generate the visual design.

**Default project:** `11811804841660798822` (has Nocturne design system)
**Design system asset:** `assets/0e5efe3dd49e4eb1ad55885b5501fd52`

For topics that need a different design system than Nocturne, create a new design system via `create_design_system` first.

Call `generate_screen_from_text` with:
- `projectId`: the project ID
- `designSystem`: the design system asset ID
- `prompt`: the enhanced prompt from Step 1

## Step 3: Download Assets

```bash
# HTML
curl -sL -o ".stitch/designs/{name}.html" "{htmlCode.downloadUrl}"

# Screenshot (append =w{width} for full resolution)
curl -sL -o ".stitch/designs/{name}.png" "{screenshot.downloadUrl}=w{width}"
```

Review the screenshot. If quality is poor, refine prompt and regenerate.

## Step 4: Translate to Remotion Component

Create a `.tsx` file in `remotion-charts/src/components/`.

**Structural reuse:** Check if an existing component's STRUCTURE matches the needed chart type. Reuse its layout pattern, animation timing, and shared components. But apply the topic-specific visual style from the Stitch design.

| Chart Structure | Existing Template | When to Use |
|---|---|---|
| Big number + label | `NumberImpactCard` | Any single metric highlight |
| Left vs right cards | `ComparisonChart` | Any binary comparison |
| Horizontal bar progression | `StitchGDP` | Any data with progressive values |
| 3-point list | `ThreePointFramework` | Any 3-item framework |
| Timeline nodes | `TimelineChart` | Any chronological sequence |
| Step-by-step flow | `ProcessFlowChart` | Any sequential process |
| Hub-and-spoke | `IndustryChainChart` | Any center+satellite structure |

**When to create new vs. reuse:**
- **Same structure, different topic**: Create a new component file that adapts the template's structure but applies the topic's visual style from Stitch. Name it `{Topic}{ChartType}.tsx` (e.g., `FinanceNumberCard.tsx`).
- **New structure**: Full new component following Stitch's layout.

**Mandatory patterns:**
- Resolution: **1080x1920**
- Frame-based animations via `useCurrentFrame()` / `useVideoConfig()`
- All data via props (never hardcoded)
- Use shared atmosphere components from `./shared/`
- Use theme constants from `../styles/theme` for base values, override with topic-specific colors

**Animation timing:**
- Title reveal: 0.08–0.35s
- Card/content reveal: 0.12–0.5s
- Staggered reveals: `stagger(index, baseDelay, interval)`
- Bar/data animations: `springProgress(t, delay, duration)`
- Exit fade: last 12% of duration

## Step 5: Register + Render

Register in `remotion-charts/src/Root.tsx`:
```tsx
import { ComponentName } from './components/ComponentName';

<Composition
  id="ComponentName"
  component={ComponentName as React.FC<any>}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ /* data from storyboard */ }}
/>
```

Render:
```bash
cd remotion-charts && pnpm remotion render ComponentName "../chart_{name}.mp4" --codec=h264
```

Preview with ffmpeg frame extraction:
```bash
ffmpeg -y -i "chart_{name}.mp4" -vf "select=eq(n\,30)+eq(n\,75)+eq(n\,120)" -vsync vfr .stitch/designs/preview_%d.png
```

## Batch Mode (from Storyboard)

When processing a full 分镜执行表, extract all "代码生成" chart specs and process them sequentially:

1. Parse §6 (动态图表设计) of the storyboard
2. For each chart: run Steps 0→5
3. Collect all output MP4s
4. Report summary with file paths and durations

## File Locations

```
视频/
├── .stitch/designs/           ← Stitch design downloads
├── remotion-charts/src/
│   ├── components/
│   │   ├── shared/            ← Reusable atmosphere effects
│   │   └── {Topic}{Type}.tsx  ← Topic-specific chart components
│   ├── styles/
│   │   ├── theme.ts           ← Base theme constants
│   │   └── animations.ts      ← Timing functions
│   └── Root.tsx               ← Composition registry
└── chart_*.mp4                ← Rendered outputs
```

## Troubleshooting

| Issue | Fix |
|---|---|
| Stitch timeout | Use existing project with design system; simplify prompt |
| `defineConfig` error | Use `Config` from `@remotion/cli/config`, not `defineConfig` |
| Component not found | Check import in Root.tsx and file path |
| Blurry text | Use 1080x1920, not Stitch's 390x844 |
| Visual style mismatch | Verify topic direction in Step 0; refine enhance-prompt |
