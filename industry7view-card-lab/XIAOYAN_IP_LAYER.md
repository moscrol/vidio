# Xiaoyan IP Layer

Purpose: define how the Industry 7View video system uses the "Xiaoyan" IP, where it fits in the production workflow, and how it works with existing Swiss cards, A-roll, B-roll, Remotion, and HyperFrames.

## 1. Positioning

Xiaoyan does not replace the existing card system. Xiaoyan is the "industry research explanation layer" for Industry 7View.

```text
Xiaoyan turns complex industry logic into visible research actions.
```

The existing production line remains the main line:

```text
script / SRT / AI voiceover
-> card intent
-> cards.js
-> timeline-rules.json
-> motion-plan.json
-> Remotion
-> publishable MP4
```

Xiaoyan enters between content judgment and visual execution:

```text
cognitive anchor in the script
-> explanatory shot in the storyboard
-> Xiaoyan concept image / Xiaoyan motion clip
-> Remotion timeline
```

## 2. Fixed IP Rules

Xiaoyan must keep these visual identifiers:

```text
1. Flat 2D stick figure.
2. Small round head.
3. Black single-line body.
4. Thin line arms and legs.
5. Minimal expression.
6. Always holding a round magnifying glass.
7. Xiaoyan is flat; the research object may be slightly dimensional.
```

Avoid:

```text
1. 3D character body.
2. Manga-boy feeling.
3. Heavy clothing.
4. Alien, monster, robot, or multi-eye design.
5. Overly cute mascot feeling.
6. Finance-success-guru feeling.
7. Standing beside the content as decoration.
```

Core visual contrast:

```text
flat Xiaoyan studies dimensional industry systems.
```

## 3. Relationship With Existing Cards

Existing Swiss cards continue to handle structured information:

| Component | Role |
|---|---|
| CoverCard | Platform cover / opening judgment |
| HookCard | Counter-intuitive hook |
| DataHeroCard | One key number |
| CompareCard | Misunderstanding vs truth |
| BusinessLoopCard | Business loop / industry path |
| TrackingChecklistCard | Follow-up variables |
| ClosingQuoteCard | Ending quote |
| EvidenceGridCard | Evidence wall / case wall |

Xiaoyan handles explanation actions:

| Xiaoyan Scene | Role |
|---|---|
| Pulling an industry-chain scroll | Explain upstream/midstream/downstream |
| Filtering hot-topic noise | Separate noise from real variables |
| Inspecting a profit pipe | Explain profit flow, cost, price, competition |
| Mapping company labels | Show company mapping without stock-picking implication |
| Weighing short vs long term | Separate short-term catalysts and long-term value |
| Inspecting valves | Explain supply, demand, capacity, and pricing bottlenecks |

Best combination:

```text
Swiss cards state the conclusion.
Xiaoyan concept visuals explain why.
B-roll adds reality.
A-roll builds trust.
```

## 4. When To Use Xiaoyan

Prefer Xiaoyan when the script says or implies:

```text
first, break down the industry chain
the real variable is not X, but Y
where does the money come from
where does profit flow
where is the bottleneck
hot topic, but watch realization
from concept to order
from prototype to mass production
from company story to financial verification
separate short-term catalyst from long-term value
```

Do not force Xiaoyan when:

```text
Pure data impact: prefer DataHero.
Strong opening judgment: prefer A-roll or HookCard.
Real factory/product/event scene: prefer B-roll.
Ending quote: prefer ClosingQuote.
Parallel evidence: prefer EvidenceGrid.
Trust/emotion-heavy sentence: prefer A-roll.
```

## 5. Suggested Video Rhythm

For a 60-90 second video:

```text
0-3s
A-roll / HookCard
Give the counter-intuitive judgment.

3-12s
Xiaoyan concept motion / CompareCard
Explain the misunderstanding.

12-30s
BusinessLoop / Xiaoyan industry-chain visual / B-roll
Explain the structure or business loop.

30-50s
DataHero / EvidenceGrid / B-roll
Give key evidence or data.

50-70s
TrackingChecklist / Xiaoyan balance visual
Tell viewers what to track next.

70-90s
ClosingQuote / A-roll
Close the argument and invite response.
```

Rules:

```text
Do not use cards for the whole video.
Do not use Xiaoyan for the whole video.
Do not let Xiaoyan overpower the content.
Every visual change must help understanding.
```

## 6. Storyboard Fields

Add these fields when Xiaoyan may be involved:

```text
visualLayer: A-roll / B-roll / SwissCard / XiaoyanConcept / HyperFramesClip
xiaoyanAction: inspect / pull / push / filter / label / weigh / check
researchObject: industry-chain scroll / profit pipe / noise filter / company map / long-short balance
assetSource: png / svg / hyperframes / remotion-native
reuseLevel: one-off / candidate-component / standard-component
```

Example:

| Time | Voiceover | visualLayer | xiaoyanAction | researchObject | assetSource |
|---|---|---|---|---|---|
| 6-10s | Do not just watch whether the theme is hot; watch where profit flows. | XiaoyanConcept | check | profit pipe | hyperframes |
| 18-24s | Upstream price hikes do not always mean midstream profits. | SwissCard + Xiaoyan | point | supply-demand valve | remotion-native |

## 7. Static Image Prompt Template

```text
16:9 horizontal Chinese editorial concept illustration, pure white background, black hand-drawn line art, lots of whitespace, small red/blue/green handwritten Chinese annotations.

The main character is Industry7View original IP "Xiaoyan": an extremely simple flat 2D stick-figure research analyst, small round head, black single-line body, thin line arms and legs, minimal expression, always holding a round magnifying glass. Xiaoyan must be flat 2D line art. No 3D body, no detailed face, no manga boy feeling, no alien, no monster, no robot, no cute mascot.

The research object can be slightly dimensional: industry-chain scroll, data blocks, sticky notes, valves, company map, balance scale, with light perspective, paper thickness, or subtle shadow. Create the contrast of "flat Xiaoyan studying a dimensional industry system".

Topic: {topic}
Core meaning: {one judgment}
Composition type: {industry-chain scroll / noise filter / profit pipe / company map / long-short balance}
Xiaoyan action: {what Xiaoyan inspects with the magnifying glass}
Visual elements: {chain, ruler, labels, valves, map, route, etc.}
Chinese annotation words: {3-6 short labels}

Style: industry researcher's sketch, clean, credible, lightly humorous. Avoid PPT, commercial illustration, childish cuteness, complex architecture diagram, big upper-left title, stock-promotion poster.
```

## 8. QA Checklist

Before using a Xiaoyan asset:

```text
1. Is Xiaoyan a flat 2D stick figure?
2. Is Xiaoyan holding the magnifying glass?
3. Is Xiaoyan doing the core action?
4. Did we avoid 3D character, manga boy, alien, robot, or mascot feeling?
5. Is the research object more dimensional than Xiaoyan?
6. Are Chinese annotations short, precise, and sparse?
7. Did we avoid stock-picking or finance-marketing implications?
8. Does the visual help explain industry logic?
```

## 9. Promotion To Component Library

A Xiaoyan scene can become a Remotion native component only when:

```text
1. It appears in at least 2-3 real topics.
2. Existing Swiss cards cannot carry it naturally.
3. It has stable fields.
4. It has clear limits for text, nodes, and actions.
5. Native motion creates obvious value.
6. PNG or HyperFrames remains available as fallback.
```

Priority candidates:

```text
XiaoyanSupplyChainScroll
XiaoyanNoiseFilter
XiaoyanProfitPipe
XiaoyanMappingMap
XiaoyanLongShortBalance
```

