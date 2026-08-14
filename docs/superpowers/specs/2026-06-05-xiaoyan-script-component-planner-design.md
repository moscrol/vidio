# Xiaoyan Script Component Planner Design

## Goal

Create a lightweight local planner that reads an Industry 7View script, SRT, or storyboard Markdown file and generates a Xiaoyan component matching table.

The planner answers:

```text
这段口播应该用 SwissCard、Xiaoyan 组件、B-roll，还是不上组件？
如果用 Xiaoyan，应该调用 ProfitPipe、ValidationChain、IndustryScroll 中的哪一个？
props 草案是什么？
```

## Non-Goals

```text
1. Do not call an LLM.
2. Do not edit cards.js.
3. Do not render MP4.
4. Do not automatically decide a final timeline.
5. Do not create new components from one-off script fragments.
```

## Inputs

```text
1. Markdown script or storyboard.
2. SRT file.
3. Plain text pasted into a .txt file.
```

## Outputs

For each input, write:

```text
xiaoyan/component-plans/<slug>.component-plan.json
xiaoyan/component-plans/<slug>.component-plan.md
```

The Markdown table columns follow `SCRIPT_TO_COMPONENT_WORKFLOW.md`:

```text
time / voiceover / intent / semanticComponent / renderer / existingComponent / propsDraft / gap / decision
```

## Classification Rules

```text
样机、验证、导入、跑产、订单 -> validation -> XiaoyanValidationChain
一条链、从 A 到 B、上中下游、终端、应用收费 -> chain -> XiaoyanIndustryScroll
成本、利润、现金流、付费、毛利 -> economics -> XiaoyanProfitPipe
不是 A，而是 B / 很多人以为 -> compare/hook -> SwissCard first
看三个问题 / 跟踪变量 -> checklist -> SwissCard first
核心数字 -> data -> SwissCard first
真实场景、工厂、设备、动作 -> b-roll
结论金句 / 你觉得 -> quote / A-roll
```

## Decisions

```text
use-existing: Swiss/Remotion/B-roll is enough.
add-props: existing Xiaoyan component is enough; create props draft.
candidate-component: repeated gap but no implemented Xiaoyan component.
one-off: do not componentize.
```

## Acceptance Criteria

```text
1. Commercial aerospace script maps its main chain segment to XiaoyanIndustryScroll.
2. Semiconductor equipment script maps its validation-chain segment to XiaoyanValidationChain.
3. Economics segments map to XiaoyanProfitPipe where appropriate.
4. Generated Markdown is readable without opening JSON.
5. Script exits non-zero for missing input files.
6. No render outputs are created.
```

