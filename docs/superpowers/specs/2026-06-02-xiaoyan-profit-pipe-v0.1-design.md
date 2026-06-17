# XiaoyanProfitPipe v0.1 Design

## Status

Approved design direction:

```text
Dual-track production:
HyperFrames produces Xiaoyan hand-drawn IP motion clips.
Remotion remains the final orchestration/compositing layer.
```

The first standard Xiaoyan component is `XiaoyanProfitPipe`.

## Goal

Build the first stable Xiaoyan motion component from the already validated "profit pipe" sample.

The v0.1 target is intentionally narrow:

```text
Given structured props, generate one 6-8 second 9:16 HyperFrames MP4
in the Xiaoyan hand-drawn style.
```

This phase does not attempt full video automation. It proves that one Xiaoyan component can be generated, rendered, inspected, and reused without visual drift.

## Non-Goals

v0.1 does not include:

- Full script-to-video automation.
- Remotion final assembly.
- A complete Xiaoyan primitive engine.
- Rebuilding the old Remotion card deck.
- Supporting every Xiaoyan concept component.
- Figma integration.

The old Remotion card system remains a reference asset for fields, timing, and rendering lessons. It no longer defines the primary visual style.

## Component Boundary

`XiaoyanProfitPipe` expresses profit, cash flow, and commercial realization logic.

Use it when the script asks:

- Where does profit come from?
- Which factor blocks profit?
- How do demand, cost, price, and competition affect realization?
- Does a hot theme become real business?
- Can the profit or cash-flow valve open?

Do not use it for:

- Full industry-chain maps. Use a future `XiaoyanIndustryScroll`.
- Prototype-to-order validation chains. Use a future `XiaoyanValidationChain`.
- Parallel evidence walls. Use EvidenceGrid or B-roll.
- Pure data impact. Use DataHero or A-roll.
- Final quotes. Use A-roll or ClosingQuote.

## Visual Direction

The visual baseline is the approved profit-pipe V2 sample:

- White or warm-white paper background.
- Black hand-drawn line art.
- A horizontal pipe as the main research object.
- Hand-drawn valves and labels.
- Sparse red and blue annotations.
- Xiaoyan appears as a flat 2D stick figure.
- Xiaoyan always holds a magnifying glass.
- Xiaoyan observes the final profit/realization node.

The component must avoid:

- Swiss-card UI styling.
- Dense cards inside the drawing.
- Dark dashboard backgrounds.
- 3D character body.
- Mascot or manga styling.
- Finance-marketing poster language.
- Overcrowded text.

## Props

```ts
type XiaoyanProfitPipeProps = {
  id: string;
  topic: string;
  title?: string;
  factors: string[];
  bottleneck?: {
    label: string;
    targetFactor?: string;
  };
  resultLabel: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: 6 | 8;
};
```

### Field Rules

- `id` is a stable render identifier.
- `topic` describes the business topic for metadata and file naming.
- `title` is optional and should stay short.
- `factors` should contain 3-5 labels. The default pattern is `需求 / 成本 / 价格 / 竞争 / 利润`.
- `bottleneck.label` is the red annotation text.
- `bottleneck.targetFactor` maps the red annotation to one factor when possible.
- `resultLabel` names the final realization node, such as `利润`, `现金流`, or `订单兑现`.
- `blueNote` is the direction or method annotation, such as `看流向`.
- `redNote` is the risk or bottleneck annotation, such as `卡点`.
- `footer` is one concise conclusion sentence.
- `durationSeconds` defaults to `6`.

## Sample Props

```json
{
  "id": "profit-pipe-default",
  "topic": "产业研究利润流向",
  "title": "利润水管",
  "factors": ["需求", "成本", "价格", "竞争", "利润"],
  "bottleneck": {
    "label": "卡点",
    "targetFactor": "成本"
  },
  "resultLabel": "利润",
  "blueNote": "看流向",
  "redNote": "卡点",
  "footer": "题材热不热先放一边，利润阀门能不能打开，才是产业研究要看的问题。",
  "durationSeconds": 6
}
```

## Project Structure

Add the Xiaoyan component track under `industry7view-card-lab/xiaoyan`.

```text
industry7view-card-lab/
  xiaoyan/
    components/
      XiaoyanProfitPipe/
        index.html
        sample-props.json
        README.md
    renders/
    scripts/
      render-xiaoyan-profit-pipe.mjs
```

`index.html` is the HyperFrames composition source. It should contain:

- `data-composition-id`
- `data-width="1080"`
- `data-height="1920"`
- `data-duration`
- `data-start="0"`
- `window.__timelines[compositionId]`

`sample-props.json` is the canonical v0.1 fixture.

`render-xiaoyan-profit-pipe.mjs` renders the component from props and writes outputs into `xiaoyan/renders/`.

## Rendering Flow

The v0.1 flow is:

```text
sample-props.json
-> HyperFrames composition
-> npx hyperframes lint
-> npx hyperframes inspect
-> npx hyperframes render
-> ffprobe verification
-> preview screenshot
```

Expected output:

```text
xiaoyan/renders/profit-pipe-default/
  xiaoyan-profit-pipe.mp4
  preview.png
  props.json
  render-report.md
```

## Remotion Integration

Remotion is not modified in v0.1.

The future integration point is simple:

```text
XiaoyanProfitPipe props
-> HyperFrames MP4
-> Remotion final composition as a video layer
```

Remotion keeps responsibility for:

- A-roll.
- B-roll.
- Captions and SRT alignment.
- Final video timeline.
- Audio and voiceover.
- Platform-ready MP4 export.

HyperFrames owns:

- Xiaoyan sketch motion clips.
- Component-level render QA.
- Hand-drawn IP style fidelity.

## QA Standard

Every render must pass these checks:

- Xiaoyan is a flat 2D stick figure.
- Xiaoyan holds a magnifying glass.
- The main object is a hand-drawn pipe, not a card UI.
- The research object is slightly more dimensional than Xiaoyan.
- There are no more than 5 factor labels.
- There are no more than 2 annotations plus 1 footer sentence.
- The footer does not overflow or clip.
- `npx hyperframes lint` has 0 errors.
- `npx hyperframes inspect` has 0 layout issues.
- `ffprobe` confirms 1080x1920, 30fps, and 6-8 seconds.

Warnings about fonts should be fixed before production by adding deterministic Chinese `@font-face` assets. They may be tolerated in v0.1 only if the render visually matches the approved sample.

## Success Criteria

v0.1 is successful when:

1. `XiaoyanProfitPipe` can render from the sample props.
2. The output MP4 visually matches the approved hand-drawn Xiaoyan style.
3. The render process is repeatable from a script.
4. The output includes MP4, preview PNG, props JSON, and render report.
5. The component can accept at least one alternate props file without manual SVG rewiring.

## Implementation Notes

Start by componentizing the existing approved V2 sample. Do not over-abstract early.

Use light internal boundaries so later components can extract shared primitives:

- Xiaoyan figure.
- Magnifier.
- Hand label.
- Hand arrow.
- Pipe path.
- Valve/tag group.

Only extract those into shared Base components after `XiaoyanValidationChain` or `XiaoyanIndustryScroll` needs the same primitive.

