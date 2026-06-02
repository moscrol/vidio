# Xiaoyan Component Library

这份文档把“小研 IP”纳入 Industry 7View 的长期视频组件库。它不是替代现有 Remotion 卡片系统，而是在现有 `industry7view-card-lab` 之上新增一层“手绘产业研究解释组件”。

## 1. 建库原则

文章里的方法论可以直接迁移到这里：

```text
先定义组件树、变体、属性、Token
再让 AI / Codex / HyperFrames / Remotion 按规范生成
最后用真实稿件压测，缺什么补什么
```

小研组件库要解决的问题：

```text
1. 避免每次生成小研视觉时风格漂移。
2. 避免同一个产业逻辑反复重新设计。
3. 把演讲稿中的抽象判断稳定映射成可复用视觉组件。
4. 让 Remotion、HyperFrames、AI 概念图使用同一套字段。
```

不要解决的问题：

```text
1. 不负责完整自动剪辑。
2. 不替代 B-roll、A-roll、瑞士卡片系统。
3. 不把每个一次性画面都组件化。
4. 不把小研做成全片常驻吉祥物。
```

## 2. 组件树

```text
Xiaoyan Component Library
├── Foundation
├── Base
├── Combined
├── Pattern
└── Workflow / Skills
```

### 2.1 Foundation

Foundation 只放全局设计决策，改它会影响所有小研组件。

| 模块 | 规则 | 当前状态 |
|---|---|---|
| Canvas Token | 9:16 视频默认 `1080x1920`；横图素材可用 16:9 | 已固定 |
| Paper Token | 白色或微暖纸底，留白充足 | 已固定 |
| Ink Token | 黑色手绘线稿为主 | 已固定 |
| Annotation Token | 蓝色=解释/方向，红色=风险/卡点，绿色=兑现/利润 | 已验证 |
| Xiaoyan IP Token | 二维火柴人、圆头、黑线身体、永远拿放大镜 | 已固定 |
| Object Depth Token | 小研必须平面，研究对象可轻微立体 | 已固定 |
| Motion Token | 画线、节点弹出、手写箭头、放大镜轻摆 | 待沉淀 |
| Typography Token | 正式生产需 `@font-face` 固定中文字体 | 待补 |

### 2.2 Base

Base 是最小视觉原子，不含具体行业判断。

| 组件 | 用途 | 变体 |
|---|---|---|
| `XiaoyanFigure` | 固定 IP 本体 | pose: stand / crouch / lean / point / inspect |
| `Magnifier` | 小研固定道具 | size: sm / md / lg；state: idle / scan / highlight |
| `HandLabel` | 手写中文短标签 | color: ink / blue / red / green |
| `HandArrow` | 手写方向箭头 | color: blue / red / ink；direction: left / right / up / down |
| `SketchBox` | 手绘标签盒 | size: sm / md / lg；emphasis: normal / active / risk |
| `SketchNode` | 流程节点原子 | state: idle / active / done / risk |
| `SketchLine` | 手绘连接线 | type: solid / dashed / pipe / conveyor |

Base 层禁忌：

```text
不要在 Base 里写“半导体”“商业航天”“订单兑现”这种业务语义。
不要把 Base 做成完整卡片。
不要让 Base 自带结论文案。
```

### 2.3 Combined

Combined 是局部结构，可被多个 Pattern 复用。

| 组件 | 结构 | 适用 |
|---|---|---|
| `XiaoyanObserver` | XiaoyanFigure + Magnifier + focus mark | 小研观察任意对象 |
| `AnnotatedPath` | SketchLine + HandArrow + HandLabel | 单向路径、资金流、验证链 |
| `ValveGroup` | 阀门对象 + 标签 + 卡点批注 | 利润、成本、需求、供给 |
| `StageGate` | 检测门/关卡 + 阶段标签 + 状态 | 验证链、审批链、量产链 |
| `NoiseFilter` | 噪音桶 + 筛网 + 真变量标签 | 题材噪音过滤 |
| `IndustryScroll` | 横向产业链卷轴 + 节点 | 上中下游拆解 |

抽象规则：

```text
一个结构至少被 2 个 Pattern 使用，再进入 Combined。
如果只服务单条视频，先留在 Pattern 内部。
```

### 2.4 Pattern

Pattern 是完整表达场景，直接接演讲稿。

| 组件 | 适用口播 | 主要字段 | 当前判断 |
|---|---|---|---|
| `XiaoyanProfitPipe` | 利润从哪里来、成本/价格/竞争如何影响利润 | factors, bottleneck, result | v0.1 已代码化并通过双 props 渲染 |
| `XiaoyanValidationChain` | 样机到订单、从技术可用到客户敢用 | stages, riskStage, finalProof | 下一优先组件，进入 v0.1 设计 |
| `XiaoyanIndustryScroll` | 拆产业链、上中下游、谁先兑现 | nodes, highlightNode, direction | P1 |
| `XiaoyanNoiseFilter` | 热点噪音 vs 真实变量 | noiseItems, realVariables | P1 |
| `XiaoyanSupplyShift` | 利润池/话语权/价值迁移 | from, to, drivers, result | P1 |
| `XiaoyanChecklistInspect` | 看订单、收入、现金流等检查项 | items, activeItem, verdict | P2 |
| `XiaoyanLongShortBalance` | 短期催化 vs 长期价值 | shortFactors, longFactors | P2 |

## 3. 变体规则

所有小研 Pattern 至少有这些通用变体：

| 维度 | 可选值 | 说明 |
|---|---|---|
| `format` | static / motion / remotion | 静态图、HyperFrames 动效、Remotion 组件 |
| `density` | light / standard / dense | 控制文字数量和节点数量 |
| `xiaoyanPosition` | right / left / bottom-right | 小研位置 |
| `annotationLevel` | none / minimal / standard | 红蓝批注数量 |
| `objectDepth` | flat / slight-3d | 研究对象立体程度 |
| `tone` | serious / light / warning | 研究语气 |

控制原则：

```text
每个组件最多 3-5 个主要变体维度。
先稳定必需变体，再补可选变体。
宁可少变体，也不要让 AI 乱发挥。
```

## 4. Props / 数据结构

所有小研组件都遵循同一份基础字段：

```ts
type XiaoyanBaseProps = {
  id: string;
  topic: string;
  coreJudgment: string;
  format?: 'static' | 'motion' | 'remotion';
  density?: 'light' | 'standard' | 'dense';
  xiaoyanAction?: 'inspect' | 'point' | 'filter' | 'pull' | 'weigh' | 'label';
  xiaoyanPosition?: 'right' | 'left' | 'bottom-right';
  annotations?: Array<{
    text: string;
    color: 'ink' | 'blue' | 'red' | 'green';
    target?: string;
  }>;
  footer?: string;
};
```

`XiaoyanValidationChain` 字段：

```ts
type XiaoyanValidationChainProps = XiaoyanBaseProps & {
  type: 'xiaoyanValidationChain';
  stages: Array<{
    label: string;
    desc?: string;
    state?: 'done' | 'current' | 'next' | 'risk';
  }>;
  riskStage?: string;
  finalProof?: string;
};
```

`XiaoyanProfitPipe` 字段：

```ts
type XiaoyanProfitPipeProps = XiaoyanBaseProps & {
  type: 'xiaoyanProfitPipe';
  factors: string[];
  bottleneck?: string;
  resultLabel?: string;
};
```

v0.1 已实现字段：

```ts
type XiaoyanProfitPipeV01Props = {
  id: string;
  topic: string;
  title: string;
  factors: string[];
  bottleneck?: {
    label: string;
    targetFactor?: string;
  };
  resultLabel?: string;
  blueNote?: string;
  redNote?: string;
  footer?: string;
  durationSeconds?: number;
};
```

已验证样例：

| props | 主题 | 结果 |
|---|---|---|
| `sample-props.json` | 利润管道默认样例 | 已渲染 1080x1920 MP4 和 preview |
| `cashflow-props.json` | 现金流回款样例 | 已渲染 1080x1920 MP4 和 preview |

渲染入口：

```bash
cd industry7view-card-lab
npm run xiaoyan:profit-pipe
node xiaoyan/scripts/render-xiaoyan-profit-pipe.mjs xiaoyan/components/XiaoyanProfitPipe/cashflow-props.json
```

后续只补 props，不新增结构：

```text
商业航天：发射成本 / 组网速度 / 终端连接 / 应用付费。
人形机器人：BOM 成本 / 产线效率 / 稳定性 / 售价。
```

## 5. 与现有 Remotion 卡片库的关系

现有 Swiss/Remotion 卡片负责“结构化结论”，小研组件负责“解释动作”。

| 现有组件 | 小研对应组件 | 关系 |
|---|---|---|
| `BusinessLoopMotion` | `XiaoyanProfitPipe` / `XiaoyanIndustryScroll` | 价值路径可用小研解释 |
| `OrderValidationMotion` | `XiaoyanValidationChain` | 同一语义，视觉风格分为瑞士版和手绘版 |
| `SupplyChainShiftMotion` | `XiaoyanSupplyShift` | 同一字段可双渲染 |
| `ChecklistMotion` | `XiaoyanChecklistInspect` | 清单可变成小研检查表 |
| `CompareMotion` | `XiaoyanNoiseFilter` | 误解/真相可变成过滤器 |

建议策略：

```text
同一段口播先判断语义组件，再决定视觉 renderer。
renderer 可以是 SwissCard、XiaoyanSketch、HyperFramesClip 或 B-roll。
不要按工具决定组件，要按口播语义决定组件。
```

## 6. 演讲稿到组件的分析流程

输入：

```text
演讲稿 / SRT / 分镜表
```

输出：

```text
semanticComponent
renderer
props
missingComponentGap
```

分析步骤：

```text
1. 按句子切分口播。
2. 提取每句的表达意图：hook / data / compare / chain / checklist / quote。
3. 判断是否已有组件可承载。
4. 如果已有 Swiss 组件可承载，先用 Swiss。
5. 如果需要解释抽象产业逻辑，再选择 Xiaoyan Pattern。
6. 如果没有合适组件，写入 Gap Log，不立刻新增。
7. 同一 Gap 在 2-3 个真实主题重复出现，再升级为 Pattern。
```

## 7. 组件缺口判断

新增组件前必须问：

```text
1. 能否用文案压缩解决？
2. 能否用现有 Pattern 的变体解决？
3. 是否只是 props 不够？
4. 是否应该抽成 Combined？
5. 是否至少 2-3 个真实主题都需要？
6. 是否能被固定字段描述？
7. 是否能被 lint / inspect / QA 验收？
```

## 8. 当前优先级

P0：先固化基础规则

```text
1. Xiaoyan IP Token
2. HandLabel / HandArrow / SketchNode / XiaoyanObserver
3. 中文字体 @font-face 方案
4. HyperFrames lint + inspect + render 流程
```

P1：先做三个高频 Pattern

```text
1. XiaoyanValidationChain
2. XiaoyanIndustryScroll
3. XiaoyanProfitPipe props 扩展
```

当前推进顺序：

```text
已完成：XiaoyanProfitPipe v0.1
下一步：XiaoyanValidationChain v0.1 design spec
暂缓：XiaoyanIndustryScroll，等待商业航天和更多产业链稿件压测
```

拆分审计入口：

```text
XIAOYAN_SCRIPT_COMPONENT_AUDIT.md
```

P2：观察后再做

```text
1. XiaoyanNoiseFilter
2. XiaoyanSupplyShift
3. XiaoyanChecklistInspect
```

## 9. Skill 沉淀规则

重复 3 次以上的稳定动作沉淀成 Skill：

| Skill | 触发条件 | 内容 |
|---|---|---|
| `xiaoyan-script-to-component` | 每次给演讲稿都要拆组件 | 句子意图识别、组件匹配、缺口记录 |
| `xiaoyan-hyperframes-render` | 每次做小研动效都要跑 | lint、inspect、render、截图验收 |
| `xiaoyan-style-qa` | 每次生成小研图都要查 | 是否二维、是否拿放大镜、是否手绘、是否金融研究感 |

不要太早沉淀 Skill。先用 2-3 条真实视频验证，再固化。

## 10. 验收标准

```text
1. 小研必须是二维平面火柴人。
2. 小研必须拿放大镜，并参与解释动作。
3. 研究对象可以略立体，但不能抢走主题。
4. 画面不能像金融营销海报。
5. 文字必须少：节点 3-5 个，批注 1-3 个，底部结论 1 句。
6. 动效必须通过 `npx hyperframes lint` 和 `npx hyperframes inspect`。
7. 视频输出必须能被 `ffprobe` 验证尺寸、帧率、时长。
8. 组件字段必须能复用到至少 2 个主题。
```
