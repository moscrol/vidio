---
name: stitch-to-video
description: Sub-flow of storyboard workflow. Translates chart descriptions from 分镜执行表 into animated MP4 via an approved visual contract → Stitch design → Remotion component → motion contract → render.
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
  ↓ Step 0: Load DESIGN.md + visual-contract.json → hard gate
  ↓ Step 1: enhance-prompt → translate description + visual contract → Stitch prompt
  ↓ Step 2: Stitch generates design
  ↓ Step 3: Download HTML + screenshot
  ↓ Step 4: Translate to Remotion component (structure may reuse; visual follows contract)
  ↓ Step 5: Load motion-contract.json → register + render MP4
```

**Key principle: the project visual contract determines style.** Topic supplies facts, media, and domain language; it does not automatically select a stereotyped palette, font, glass effect, or named-brand look. Existing Remotion components may provide structure, while Stitch explores one implementation of decisions already owned by the contract.

## Step 0: Resolve and validate visual direction

Resolve the current project or variant directory. It must contain both:

- `DESIGN.md` for intent, hierarchy, trade-offs, and evidence boundaries;
- `visual-contract.json` for all numeric tokens and budgets.

If either artifact is absent, invoke `vibe-visual-taste` before continuing. Then run:

```bash
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs <project-or-variant-dir>
```

Stop on any error. Record warnings in project QC. Extract the identity thesis, distinctive move, semantic palette, type roles, reading order, safe area, surface strategy, media policy, component purpose, and `avoid` list for Step 1.

## Step 1: Enhance Prompt

Translate the chart description into a Stitch-optimized prompt that cites the approved visual decisions. Do not invent a second design system inside the prompt.

**Input** (from storyboard): chart type, data, purpose, animation notes
**Output**: structured Stitch prompt with DESIGN SYSTEM section

**Prompt template:**

```markdown
A [content_purpose] data card for short-video B-roll. Vertical mobile design canvas (390x844); final implementation targets the contract canvas.

PROJECT VISUAL CONTRACT (REQUIRED):
- Visual thesis: [from DESIGN.md]
- Distinctive move: [from identity.distinctiveMove]
- Reading order: [from layout.readingOrder]
- Semantic palette: [role names and exact values from palette]
- Typography roles: [families and scale roles from typography]
- Geometry and depth: [from surfaces and components]
- Media treatment: [from media]
- Avoid: [from guardrails.avoid]

PAGE STRUCTURE:
1. [Section 1 from storyboard chart description]
2. [Section 2 from storyboard chart description]
...
```

**Enhancement rules:**
- Add only implementation terminology needed to express the contract; effects require a declared purpose and budget.
- Inject semantic role values from `visual-contract.json`, never a topic stereotype or ad-hoc color.
- Preserve the contract reading order and component purposes in numbered sections.
- Include the visual thesis and distinctive move in plain language.
- Include Chinese text labels where the storyboard specifies them
- Include the `avoid` list so Stitch cannot silently drift into glass, glow, gradients, or brand imitation.

## Step 2: Generate Stitch Design

Use Stitch MCP to generate the visual design.

**Default project:** `11811804841660798822` (has Nocturne design system)
**Design system asset:** `assets/0e5efe3dd49e4eb1ad55885b5501fd52`

The Stitch project is a transport and exploration surface, not the style authority. If its default Nocturne system conflicts with the project contract, create or select a neutral design system that implements the contract; never inherit Nocturne values merely because they are available.

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

**Structural reuse:** Check if an existing component's STRUCTURE matches the needed chart type. Reuse its data model and layout pattern when they preserve the contract. Visual tokens come from `visual-contract.json`; animation timing comes from `motion-contract.json`, not from the old component or Stitch screenshot.

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
- **Same structure, different project contract**: Create a component or theme variant that adapts the structure and consumes the approved tokens. Name new components by project and function, such as `{Project}{ChartType}.tsx`, not by a generic topic stereotype.
- **New structure**: Full new component following Stitch's layout.

**Mandatory patterns:**
- Resolution: **1080x1920**
- Frame-based animations via `useCurrentFrame()` / `useVideoConfig()`
- All data via props (never hardcoded)
- Use shared atmosphere components from `./shared/`
- Generate or map theme constants from `visual-contract.json`; no anonymous color, radius, font, or effect values
- Keep the final reading order, safe area, component purpose, and media crop consistent with the visual contract

**Animation timing:**

Load `vibe-motion-taste` and the project `motion-contract.json` before implementing any reveal, stagger, data animation, or exit. Use its frame ranges, purpose, continuity, easing, reduced-motion behavior, and density budget. If the motion contract is absent, stop and create it; do not fall back to canned reveal timings.

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
| Visual style mismatch | Compare rendered pixels with `DESIGN.md` and `visual-contract.json`; fix the prompt or implementation without changing the contract silently |
