# industry7view 短视频视觉组件库设计文档

> 目标：为抖音、B站短切片、公众号配图和网站研究内容建立统一的视频视觉系统。  
> 核心原则：不要每条视频随机设计，而是用固定的 Design Token、组件、模板和装配规则生产图文卡与 B-roll。  
> 适用场景：产业研究、A股题材拆解、技术趋势科普、风险提示、跟踪清单。

---

## 1. 设计目标

### 1.1 为什么要做组件库

AI 生成图文卡和视频片段时，如果每次只靠单次提示词，很容易出现：

- **视觉漂移**：颜色、字体、圆角、布局每条视频都不一样。
- **表达漂移**：同样是风险提示，一次像新闻，一次像课程 PPT，一次像营销海报。
- **复用困难**：每次都要重新描述“我要什么风格”。
- **品牌割裂**：抖音、公众号、B站和主站 `industry7view.com` 看起来不像同一个体系。

所以短视频视觉系统要像网站组件库一样管理：

```text
Design Token → Base Component → Combined Component → Pattern Component → Video Scene
```

### 1.2 最终工作流

```text
研究母稿 / 矩阵素材包
  ↓
speech-to-shorts：生成抖音短视频组
  ↓
storyboard-decision：生成分镜执行表
  ↓
video-visual-system：匹配视觉组件 + 生成图文卡 prompt + B-roll prompt
  ↓
Remotion / HyperFrame / Figma / 剪映模板：生成图文卡与动态图表
  ↓
剪映：数字人/真人口播 + 图文卡 + B-roll + 字幕 + 音效
  ↓
抖音 / B站短切片 / 公众号配图 / 主站分发
```

---

## 2. 品牌视觉定位

### 2.1 风格关键词

```text
industry7view 版瑞士国际主义
产业研究感
数据感
克制科技感
可截图传播
可信、冷静、专业
```

### 2.2 不采用的风格

- **不做纯深空科幻风**：容易变成泛科技素材，和主站浅色知识库风格割裂。
- **不做炫酷金融 K 线风**：容易像荐股号，降低可信度。
- **不做卡通插画风**：适合科普，但不适合产业研究和投资者语境。
- **不做纯黑白 Swiss**：高级但冷，和网站现有深蓝/金色体系不完全一致。

### 2.3 推荐风格

```text
浅灰背景 + 白色卡片 + 深蓝主色 + 金色数据强调 + 强网格对齐
```

视觉上要像 `industry7view.com` 的短视频版本：

- **背景**：浅灰、干净、有留白。
- **承载层**：白色卡片、细边框、轻阴影。
- **主色**：深蓝，代表研究、可信、长期。
- **强调色**：金色，专门用于数字、结论、关键变量。
- **风险色**：红色只用于“不等于”“风险”“透支”等强警示。

---

## 3. Design Token

### 3.1 颜色 Token

```text
color.bg.main        = #f6f7f9
color.surface        = #ffffff
color.text.primary   = #111827
color.text.muted     = #5f6b7a
color.line           = #e5e7eb

color.brand.navy     = #0f2747
color.brand.blue     = #174ea6
color.brand.deep     = #103a82
color.brand.gold     = #b8832d
color.brand.soft     = #eef4ff

color.data.bg        = #fff7e6
color.data.border    = #f0c46c
color.risk.red       = #e53935
color.success.green  = #0f766e
```

### 3.2 字体 Token

```text
font.title   = Inter / Noto Sans SC / PingFang SC
font.body    = Inter / Noto Sans SC / PingFang SC
font.number  = JetBrains Mono / SF Mono / Menlo
font.quote   = Noto Serif SC / Source Han Serif SC
```

### 3.3 字号 Token：9:16 竖屏

```text
text.hero        = 96-132px
text.title       = 64-88px
text.subtitle    = 40-52px
text.body        = 34-42px
text.caption     = 24-30px
text.source      = 20-24px
text.tag         = 22-28px
```

### 3.4 间距 Token

```text
space.screen.x   = 72px
space.screen.y   = 96px
space.card        = 40px
space.block       = 32px
space.inline      = 16px
space.tight       = 8px
```

### 3.5 圆角与阴影

```text
radius.card       = 0px
radius.badge      = 999px
radius.small      = 0px
shadow.card       = 0 28px 80px rgba(15, 39, 71, 0.10)
shadow.light      = none / 极轻阴影
```

v1.0 定版采用更接近瑞士网格系统的直角卡片，不再使用大圆角。圆角只保留给极少数功能型胶囊标签，例如网页预览页的说明性 `pill`，不作为视频卡片主体风格。

### 3.6 动效 Token

```text
motion.fast       = 180ms
motion.normal     = 300ms
motion.slow       = 600ms
motion.ease       = cubic-bezier(0.22, 0.61, 0.36, 1)
```

视频节奏：

- **钩子卡**：0.2-0.4 秒入场。
- **数据卡**：数字先出现，解释后出现。
- **流程图**：节点逐个亮起，每个 0.4-0.8 秒。
- **风险卡**：符号或关键词用重击音强调。
- **结尾卡**：至少停留 1.5 秒，方便用户截图。

### 3.7 v1.0 固定实现规范

当前已经通过 HTML 预览、PNG 导出和剪映粗剪验证的版本，固定为：

```text
版本名：Industry 7View Video Card System v1.0
主目录：/Users/lbq/Desktop/c c/视频/industry7view-card-lab/
内容数据：cards.js
预览模板：index.html
导出脚本：export-cards.mjs
PNG 输出：output/
旧风格归档：/Users/lbq/Desktop/c c/视频/archive/legacy-doodle/
```

#### v1.0 固定项

- **画布比例**：9:16 竖屏，导出后用于 1080×1920 视频。
- **品牌角标**：统一使用 `INDUSTRY 7VIEW`，放在右上角。
- **顶部标签**：左上角深蓝底白字，用于标记卡片语义，例如 `商业航天`、`商业闭环`、`跟踪清单`。
- **背景系统**：浅纸底 + 极细网格线，保持研究感和截图传播感。
- **主色系统**：深蓝 `#0f2747` 承担主标题和关键判断，金色 `#b8832d` 只强调关键变量、编号、数字和结论。
- **字体系统**：Inter / Noto Sans SC 负责中文标题和正文，JetBrains Mono 负责编号、元数据和链接。
- **卡片形态**：直角、细边框、克制阴影，不使用大圆角、厚阴影、渐变炫光。
- **版式结构**：顶部品牌区 + 中部内容区 + 底部说明区，模块之间必须留安全距离，视觉中心保持在卡片中部。
- **底部说明**：用于一句话补充、主站导流或风险提示，不承载主要观点。
- **数据驱动**：以后换主题主要改 `cards.js`，不直接改视觉结构。
- **导出方式**：运行 `npm run export`，输出 6 张 PNG 到 `output/`。

#### v1.0 六张固定模板

```text
01-hook-card             开头强判断 / 认知纠偏
02-logistics-card        生活化类比 / 概念讲成人话
03-not-a-is-b            不是 A，而是 B / 误解翻转
04-business-loop         流程闭环 / 商业模式拆解
05-tracking-checklist    三变量跟踪 / 收藏清单
06-closing-quote         结论金句 / 主站导流 / 风险提示
```

#### v1.0 可复用字段

后续新主题优先替换以下字段：

```text
project       项目或视频名称
sourceUrl     主站文章链接
tag           卡片标签
meta          元数据说明
titleHtml     主标题，允许少量 span 高亮
subtitle      副标题
oldText       误解侧文本
newText       真实逻辑侧文本
explain       一句话解释
steps         闭环流程节点
items         跟踪清单项目
footer        底部说明或风险提示
url           结尾卡主站链接
```

#### v1.0 不建议频繁改动项

```text
颜色
字体
品牌角标位置
顶部标签位置
底部说明位置
卡片圆角
整体网格
主标题字号层级
六张模板的基本结构
```

这些内容属于品牌资产，不属于单条视频创作变量。

---

## 4. 组件库结构

```text
industry7view-video-system
│
├── 01-foundation
│   ├── design-tokens
│   ├── typography
│   ├── color
│   ├── spacing
│   ├── motion
│   └── brand-rules
│
├── 02-base-components
│   ├── TextBlock
│   ├── NumberBlock
│   ├── Tag
│   ├── Badge
│   ├── SourceNote
│   ├── RiskNote
│   └── LogoLockup
│
├── 03-combined-components
│   ├── DataCard
│   ├── CompareCard
│   ├── ChainLayer
│   ├── QuoteCard
│   ├── TimelineStep
│   └── MetricBadgeGroup
│
├── 04-pattern-components
│   ├── V01_HookCard
│   ├── V02_NotAIsB
│   ├── V03_DataHero
│   ├── V04_IndustryChain
│   ├── V05_RiskEquation
│   └── V06_TrackingChecklist
│
└── 05-skills
    ├── video-card-assembly-skill
    ├── broll-prompt-skill
    ├── storyboard-to-components-skill
    └── visual-qa-skill
```

---

## 5. Base Components

### 5.1 TextBlock

**用途**：承载标题、副标题、解释语、金句。

**属性**：

```text
type: hero / title / subtitle / body / caption
weight: regular / medium / bold / black
color: primary / muted / navy / gold / risk
align: left / center
maxLines: 1 / 2 / 3
```

**使用规则**：

- 一张卡片内最多一个 `hero`。
- 主标题最多两行。
- 不要把完整口播塞进图文卡。

### 5.2 NumberBlock

**用途**：承载大数字，例如 `20万颗`、`87次`、`324颗`。

**属性**：

```text
number: string
unit: string
label: string
source: string
emphasis: gold / blue
```

**使用规则**：

- 数字必须足够大。
- 单位和解释不能抢数字。
- 数据来源放底部小字。

### 5.3 Tag

**用途**：产业方向、公司类别、指标标签。

**属性**：

```text
text: string
variant: default / blue / gold / risk / muted
size: sm / md / lg
```

**使用规则**：

- 公司名尽量作为标签，不要作为主体大标题。
- 一屏标签不超过 8 个。

### 5.4 SourceNote

**用途**：数据来源、主站链接、风险提示小字。

**属性**：

```text
text: string
position: bottom-left / bottom-center
```

**使用规则**：

- 不能抢主信息。
- 风险提示和来源信息必须可读。

### 5.5 RiskNote

**用途**：不构成投资建议、产业链映射提醒、风险边界。

**标准文案**：

```text
本文仅作产业研究和知识整理，不构成投资建议。
```

---

## 6. Combined Components

### 6.1 DataCard

由 `NumberBlock + TextBlock + SourceNote` 组合。

**适合**：市场空间、卫星数量、发射次数、成本下降。

### 6.2 CompareCard

由两个 `TextBlock` 和一个连接符组成。

**适合**：

```text
商业航天 ≠ 发火箭
卫星上天 ≠ 公司赚钱
真受益 ≠ 蹭概念
```

### 6.3 ChainLayer

由层级标题、标签组和箭头组成。

**适合**：上游/中游/下游，或流程闭环。

### 6.4 MetricBadgeGroup

由多个 `Tag` 或 `Badge` 组成。

**适合**：三变量、五问题、四场景。

---

## 7. Pattern Components：六类核心模板

## V01_HookCard：强判断封面卡

### 用途

前三秒钩子，快速建立冲突和判断。

### 典型句式

```text
商业航天 ≠ 发火箭
机器人 ≠ 表演节目
固态电池 ≠ 换个材料
卫星上天 ≠ 公司赚钱
```

### 字段

```text
topic: 主题
category: 产业方向
title: 强判断标题
highlight: 需要强调的关键词
subtitle: 一句话解释
brand: industry7view
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏短视频图文卡。

组件：V01_HookCard
品牌风格：industry7view 版瑞士国际主义
背景：#f6f7f9
主卡片：白色，细边框 #e5e7eb
主色：深蓝 #0f2747
强调色：金色 #b8832d
字体：无衬线，中文大标题极粗，数字用等宽字体

内容：
- 顶部标签：[产业方向]
- 主标题：[一句强判断，最多14个字]
- 高亮词：[需要强调的词]
- 副标题：[一句解释，最多20字]
- 角标：industry7view

要求：
- 9:16，1080x1920
- 一屏只放一个观点
- 不要插画，不要复杂背景
- 不要渐变，不要阴影过重
- 适合作为抖音前三秒钩子
```

---

## V02_NotAIsB：不是 A，而是 B

### 用途

认知纠偏，把大众误解翻转为产业本质。

### 字段

```text
wrongLabel: 大众误解
rightLabel: 真实逻辑
connector: ≠ / →
explain: 一句话解释
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏短视频图文卡。

组件：V02_NotAIsB
主题：[主题]
左侧内容：你以为是 [A]
右侧内容：真正是 [B]
连接符：≠ 或 →
底部解释：[一句话解释]

视觉要求：
- 左侧用浅灰卡片，表示“误解”
- 右侧用深蓝卡片，表示“真实逻辑”
- 关键字用金色强调
- 整体为瑞士网格风，强对齐，大留白
- 不要过多装饰
- 字必须大，手机上清晰可读
```

---

## V03_DataHero：大数字冲击卡

### 用途

市场空间、关键数据、规模冲击。

### 字段

```text
number: 核心数字
unit: 单位
label: 数字说明
analogy: 生活化解释
source: 数据来源
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏数据卡。

组件：V03_DataHero
核心数字：[数字]
单位：[单位]
数字说明：[这是什么数字]
生活类比：[用一句话解释这个数字有多大]
数据来源：[来源，可放小字]

视觉要求：
- 数字占屏幕 35%-45% 高度
- 数字使用 JetBrains Mono 或等宽字体
- 数字颜色用金色 #b8832d
- 背景浅灰，主信息卡白色
- 顶部保留产业标签
- 底部小字写来源，不要抢主信息
```

---

## V04_IndustryChain：产业链 / 闭环图

### 用途

产业链映射、谁先受益、商业模式拆解。

### 字段

```text
title: 标题
layers: [
  {name: 上游/第一步, items: [...]},
  {name: 中游/第二步, items: [...]},
  {name: 下游/第三步, items: [...]}
]
note: 风险或解释
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏产业链结构图。

组件：V04_IndustryChain
主题：[主题]
标题：[标题]

三层结构：
1. 上游：[关键词1] / [关键词2] / [关键词3]
2. 中游：[关键词1] / [关键词2] / [关键词3]
3. 下游：[关键词1] / [关键词2] / [关键词3]

视觉要求：
- 三层纵向排列
- 每层是白色卡片
- 层级标题用深蓝
- 关键词用标签形式
- 可以用细线箭头表示传导
- 不要堆公司名
- 如果出现公司名，只作为小标签放角落
```

---

## V05_RiskEquation：风险不等式

### 用途

风险提示、反共识、避免荐股化。

### 字段

```text
equations: [
  {left: A, right: B},
  {left: C, right: D}
]
warning: 风险提示
disclaimer: 不构成投资建议
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏风险提示卡。

组件：V05_RiskEquation
标题：[风险标题]
风险不等式：
- [A] ≠ [B]
- [C] ≠ [D]
- [E] ≠ [F]

底部提示：
这只是产业链映射，不构成投资建议。

视觉要求：
- 背景可以略深，使用深蓝 #0f2747
- 文字用白色
- “≠” 使用金色 #b8832d
- 每条不等式独立成行
- 字要非常大，适合截图传播
- 不要复杂图标，不要股票 K 线
```

---

## V06_TrackingChecklist：三变量跟踪表

### 用途

普通人怎么跟踪、投资者看什么、后续观察指标。

### 字段

```text
title: 标题
variables: [
  {name: 变量1, watch: 看什么, meaning: 说明什么},
  {name: 变量2, watch: 看什么, meaning: 说明什么},
  {name: 变量3, watch: 看什么, meaning: 说明什么}
]
closing: 结尾金句
```

### 图文卡提示词

```text
请生成一张 9:16 竖屏跟踪清单卡。

组件：V06_TrackingChecklist
标题：[普通人怎么跟踪这个行业]

三个变量：
1. [变量名]：看 [指标]，说明 [意义]
2. [变量名]：看 [指标]，说明 [意义]
3. [变量名]：看 [指标]，说明 [意义]

视觉要求：
- 三张纵向卡片
- 每张卡左侧是编号 01/02/03
- 中间是变量名
- 下方是解释
- 编号用金色
- 标题用深蓝
- 整体清爽，像研究清单，不像课程 PPT
```

---

## 8. B-roll 生成规范

### 8.1 B-roll 类型

```text
B01_RealFootage：真实素材型
B02_AIGeneratedRealistic：AI 仿真实拍型
B03_AbstractMotion：抽象动态图形型
B04_ScreenLikeData：屏幕/数据界面型
B05_ApplicationScene：应用场景型
```

### 8.2 通用 AI B-roll 英文模板

```text
9:16 vertical video, 4 seconds, cinematic industrial documentary style,
realistic Chinese high-tech manufacturing or infrastructure scene,
clean lighting, slow camera push-in, no text, no logo, no watermark,
high detail, stable composition, professional, restrained, not over-futuristic.

Scene content: [具体画面]
Camera movement: [slow push-in / slow side tracking / top-down pan]
Visual style: realistic documentary, clean industrial technology, calm and credible.
```

### 8.3 通用中文模板

```text
9:16 竖屏视频，4 秒，真实纪录片风格，产业科技场景，画面干净，光线克制，镜头缓慢推进，不要文字，不要水印，不要品牌 Logo，不要过度科幻，不要卡通，不要炫光。

画面内容：[具体画面]
镜头运动：[缓慢推进 / 横向滑动 / 俯拍下移]
风格要求：真实、专业、克制、可信。
```

### 8.4 负面提示词

```text
low quality, blurry, cartoon, anime, text, watermark, logo, over futuristic,
unrealistic, messy background, distorted object, fake brand, flickering, noisy image,
stock market candlestick, exaggerated neon, sci-fi spaceship fantasy
```

中文负面提示：

```text
不要低清，不要模糊，不要卡通，不要二次元，不要文字，不要水印，不要品牌 Logo，不要过度科幻，不要背景杂乱，不要结构畸形，不要股票 K 线，不要夸张霓虹。
```

---

## 9. 分镜到视觉组件的映射规则

### 9.1 基础映射

| 分镜内容 | 优先组件 | 说明 |
|---|---|---|
| 开头强判断 | V01_HookCard | 3 秒内建立冲突 |
| “不是 A，而是 B” | V02_NotAIsB | 认知纠偏 |
| 核心数据、规模、比例 | V03_DataHero | 数字必须放大 |
| 产业链、闭环、流程 | V04_IndustryChain | 纵向结构更适合竖屏 |
| 风险、不等于、误区 | V05_RiskEquation | 强截图价值 |
| 三个变量、五个问题 | V06_TrackingChecklist | 收藏价值 |
| 真实产业场景 | B01 / B02 | 补充真实感 |
| 抽象传导关系 | B03 | 用动态图形表达 |

### 9.2 A-roll 与图文卡比例

推荐结构：

```text
A-roll：45%-55%
图文卡/动态图表：25%-35%
B-roll：20%-30%
```

每 2-4 秒必须有画面变化，但不要每秒都换，避免信息噪音。

### 9.3 什么时候不用 B-roll

以下场景优先用图文卡，不强行用 B-roll：

- 风险提示。
- 复杂产业链。
- 三变量跟踪。
- 公司映射。
- 数据来源说明。

---

## 10. 商业航天样板：第一条视频视觉包

视频标题：

```text
商业航天不是发火箭，真正的问题是上天之后能不能赚钱
```

主站链接：

```text
https://industry7view.com/research/commercial-space/
```

### 10.1 分镜组件匹配

| 镜号 | 时间 | 内容 | 推荐组件 | 资产类型 |
|---|---:|---|---|---|
| 01 | 0-3s | 商业航天 ≠ 发火箭 | V01_HookCard | 图文卡 + A-roll |
| 02 | 3-7s | 火箭只是太空物流车 | B01_RealFootage + TagOverlay | 火箭 B-roll |
| 03 | 7-13s | 火箭飞得高 ≠ 持续收费 | V02_NotAIsB | 对比卡 |
| 04 | 13-21s | 五段商业闭环 | V04_IndustryChain | 动态流程图 |
| 05 | 21-29s | 火箭/卫星/测控/终端类比 | V04_IndustryChain + B03 | 类比卡 + 抽象 B-roll |
| 06 | 29-36s | 卫星宽带/应急通信/遥感/导航 | B05_ApplicationScene + MetricBadgeGroup | 四场景 B-roll |
| 07 | 36-42s | 不是军工概念，是太空基础设施 | V02_NotAIsB | 大字判断卡 |
| 08 | 42-54s | 看三个问题 | V06_TrackingChecklist | 三变量卡 |
| 09 | 54-63s | 上天之后能不能赚钱 | V01_HookCard / QuoteCard | 金句卡 |
| 10 | 63-70s | 评论区互动 | QuestionCard | 互动卡 |

### 10.2 样板卡 01：开头 HookCard

字段：

```text
category: 商业航天
title: 商业航天 ≠ 发火箭
highlight: ≠
subtitle: 真正问题是上天之后能不能赚钱
brand: industry7view
```

生成提示词：

```text
请生成一张 9:16 竖屏短视频图文卡。

组件：V01_HookCard
品牌风格：industry7view 版瑞士国际主义
背景：#f6f7f9
主卡片：白色，细边框 #e5e7eb，直角卡片
主色：深蓝 #0f2747
强调色：金色 #b8832d
风险色：#e53935
字体：Inter + Noto Sans SC，中文大标题极粗

内容：
- 顶部标签：商业航天
- 主标题：商业航天 ≠ 发火箭
- 高亮：≠ 用金色
- “发火箭”可以用风险红轻微强调
- 副标题：真正问题是上天之后能不能赚钱
- 角标：industry7view

要求：
- 9:16，1080x1920
- 一屏只放一个观点
- 强网格对齐，大留白
- 不要火箭插画，不要复杂背景
- 适合作为抖音前三秒钩子
```

### 10.3 样板卡 02：火箭 = 太空物流车

字段：

```text
label: 火箭 = 太空物流车
explain: 负责把卫星送上去，但不是终点
```

B-roll 建议：优先真实火箭发射素材或可商用素材库。

叠加卡提示词：

```text
在火箭发射 B-roll 上叠加一张半透明白色信息卡。
内容：火箭 = 太空物流车
副文案：负责把卫星送上去，但不是终点
风格：industry7view 版瑞士国际主义，深蓝文字，金色强调“物流车”，直角信息卡，底部左侧出现。
```

### 10.4 样板卡 03：火箭飞得高 ≠ 持续收费

字段：

```text
wrongLabel: 火箭飞得高
rightLabel: 持续收费
connector: ≠
explain: 真正值钱的是可持续商业闭环
```

生成提示词：

```text
请生成一张 9:16 竖屏短视频图文卡。

组件：V02_NotAIsB
主题：商业航天
左侧内容：火箭飞得高
右侧内容：持续收费
连接符：≠
底部解释：真正值钱的是可持续商业闭环

视觉要求：
- 左侧卡片浅灰，表示旧认知
- 右侧卡片深蓝，表示新逻辑
- “持续收费”用金色强调
- 中间“≠”放大
- 背景 #f6f7f9
- 不要复杂火箭背景
```

### 10.5 样板卡 04：商业航天五段闭环

字段：

```text
title: 商业航天不是单点，而是闭环
steps:
1. 低成本发射
2. 批量卫星制造
3. 低轨星座组网
4. 地面终端连接
5. 下游应用收费
```

生成提示词：

```text
请生成一张 9:16 竖屏流程图卡。

组件：V04_IndustryChain
标题：商业航天不是单点，而是闭环
流程：
1. 低成本发射
2. 批量卫星制造
3. 低轨星座组网
4. 地面终端连接
5. 下游应用收费

视觉要求：
- 五个节点纵向排列
- 每个节点是白色卡片
- 节点之间用细箭头连接
- 当前重点节点可用金色描边
- 最后“下游应用收费”用金色强调
- 适合做节点依次亮起的动态图
```

### 10.6 样板 B-roll 01：低轨卫星与地面通信网络

中文提示词：

```text
近地轨道上的多颗小型通信卫星围绕地球运行，卫星向地面站和城市用户终端发出细微光线连接，画面包含地面天线、控制中心屏幕和用户终端示意，中景到远景，真实纪录片风格，商业科技感，画面干净，竖屏9:16，不要文字，不要水印，不要品牌Logo，不要过度科幻。
```

英文提示词：

```text
Multiple small communication satellites orbiting Earth in low orbit, sending subtle light connections to ground stations and urban user terminals, including ground antenna, mission control screens and terminal devices, medium to wide shot, realistic documentary style, clean commercial technology look, vertical 9:16, no text, no watermark, no brand logo, not over-futuristic.
```

### 10.7 样板 B-roll 02：卫星应用服务四场景

中文提示词：

```text
四宫格科技场景拼接画面：海上船舶通过卫星通信联网，山区救援队使用便携终端通信，城市遥感地图在屏幕上显示，汽车导航定位路线发光，中景，真实商业科技风格，画面干净，竖屏9:16，不要文字，不要水印，不要品牌Logo。
```

英文提示词：

```text
Four-panel technology montage: a ship at sea connected by satellite communication, a mountain rescue team using a portable communication terminal, an urban remote sensing map displayed on a screen, a car navigation route glowing on a map, realistic commercial technology style, clean composition, vertical 9:16, no text, no watermark, no brand logo.
```

### 10.8 样板卡 05：三个跟踪变量

字段：

```text
title: 商业航天看三个变量
variables:
1. 成本有没有降：看可回收火箭复用是否稳定
2. 星座有没有起来：看 GW / 千帆等低轨星座是否按期组网
3. 用户有没有付钱：看卫星宽带、遥感数据、应急通信是否形成真实付费
```

生成提示词：

```text
请生成一张 9:16 竖屏跟踪清单卡。

组件：V06_TrackingChecklist
标题：商业航天看三个变量

三个变量：
1. 成本有没有降：看可回收火箭复用是否稳定
2. 星座有没有起来：看低轨星座是否按期组网
3. 用户有没有付钱：看下游服务是否形成真实付费

视觉要求：
- 三张纵向白色卡片
- 左侧编号 01/02/03 用金色
- 变量名用深蓝粗体
- 解释文字用灰色
- 背景浅灰
- 底部角标 industry7view
```

### 10.9 样板卡 06：结论金句

字段：

```text
title: 上天之后，能不能赚钱？
subtitle: 商业航天的核心不是发射新闻，而是商业闭环
```

生成提示词：

```text
请生成一张 9:16 竖屏结论金句卡。

主题：商业航天
主标题：上天之后，能不能赚钱？
副标题：核心不是发射新闻，而是商业闭环
品牌：industry7view

视觉要求：
- 背景深蓝 #0f2747
- 主标题白色，关键词“赚钱”用金色
- 副标题用浅灰
- 画面极简，强留白
- 适合视频结尾停留 1 秒以上
```

---

## 11. 组件缺口记录

后续每做一条视频，都要记录：

```text
这条视频用了哪些已有组件？
哪些组件不够用？
是缺 Base、Combined，还是 Pattern？
是缺新组件，还是缺已有组件的变体？
这个缺口是否连续出现 3 次以上？
如果出现 3 次以上，是否沉淀成 Skill？
```

### 缺口记录模板

```text
## 视频：[标题]

### 已使用组件
- V01_HookCard
- V02_NotAIsB
- V04_IndustryChain

### 缺口
- 缺少：[组件名]
- 类型：Base / Combined / Pattern
- 原因：[为什么现有组件不够]
- 是否高频：第几次出现

### 处理决策
- [ ] 临时组合即可
- [ ] 补一个变体
- [ ] 新增 Combined Component
- [ ] 新增 Pattern Component
- [ ] 沉淀成 Skill
```

---

## 12. 视觉验收标准

每张图文卡发布前检查：

- [ ] 一屏只讲一个观点。
- [ ] 主标题手机上 1 秒内能读懂。
- [ ] 没有把完整口播塞进画面。
- [ ] 深蓝、金色、浅灰、白卡符合品牌色。
- [ ] 风险提示没有被弱化。
- [ ] 没有出现像荐股广告的 K 线、涨停、暴富暗示。
- [ ] 公司名如出现，只作为产业链映射，不作为推荐。
- [ ] 底部风险提示或来源小字可读。
- [ ] 图文卡可以截图单独传播。
- [ ] 和网站、公众号、B站风格能看出同一品牌。

---

## 13. 给 Coding Agent / 设计 Agent 的总提示词

```text
你是 industry7view 的短视频视觉系统设计师。

请根据下面的短视频分镜，生成：
1. 每个镜头应该使用的视觉组件
2. 每张图文卡的内容字段
3. 每张图文卡的生成提示词
4. 每个 B-roll 镜头的生成提示词
5. 是否需要 Remotion 动态图表
6. 剪映合成建议

品牌视觉系统：
- 风格：industry7view 版瑞士国际主义
- 背景：#f6f7f9
- 主卡片：#ffffff
- 主色：#0f2747
- 强调色：#b8832d
- 数据色：#174ea6 / #b8832d
- 字体：Inter + Noto Sans SC，数据用 JetBrains Mono
- 原则：一屏一个观点，一卡一个主信息，少装饰，大字号，强对齐

可用视觉组件：
- V01_HookCard：前三秒强判断
- V02_NotAIsB：不是A而是B
- V03_DataHero：大数字冲击
- V04_IndustryChain：三层产业链 / 闭环流程
- V05_RiskEquation：风险不等式
- V06_TrackingChecklist：三变量跟踪清单

请严格基于这些组件生成，不要凭空新增模板。
如果现有组件不够用，请指出最小缺口，而不是临时发明新风格。

分镜如下：
[粘贴分镜表]
```

---

## 14. 下一步落地建议

### 14.1 第一阶段：v1.0 已跑通并固定

商业航天第一条视频已经完成 6 张图文卡，并通过 HTML 预览、PNG 导出和剪映粗剪验证：

```text
01-hook-card.png
02-logistics-card.png
03-not-a-is-b.png
04-business-loop.png
05-tracking-checklist.png
06-closing-quote.png
```

结论：

```text
卡片放进视频后和口播节奏基本匹配。
视觉风格符合 Industry 7View 的产业研究内容。
v1.0 可以作为后续主题的默认图文卡系统。
```

后续新主题优先复用当前 `cards.js` 数据结构，不重新设计卡片风格。

### 14.2 当前固定资产

```text
固定资产：
- 6 张卡片模板
- cards.js 数据字段
- HTML 预览页
- Playwright PNG 导出脚本
- 剪映粗剪执行清单结构
- B-roll 通用提示词
- 图文卡视觉验收标准

不固定资产：
- 每条视频的数字人口播表现
- 单条视频的停顿剪辑
- 具体音效选择
- BGM 类型
- B-roll 是否使用真实素材或 AI 生成
- 每条视频最终成片节奏
```

原则：

```text
可复用的东西进入组件库。
单条视频才需要调的东西，不进入 v1.0 固定规范。
```

### 14.3 第二阶段：只工程化高复用动效

不是把整条视频自动化，而是优先把最适合复用的图文卡动效转成 Remotion / HyperFrame 模板：

```text
HookCardMotion          标题轻微推近 / 关键词弹入
NotAIsBMotion           左右卡片分步出现 / ≠ 强调
BusinessLoopMotion      01-05 节点依次亮起
TrackingChecklistMotion 三张清单依次出现
ClosingQuoteMotion      结论金句慢推近 / 金色词强调
```

暂不优先工程化：

```text
数字人口播停顿优化
真人口播节奏修剪
每条视频的 BGM 选择
复杂 3D 镜头
完整自动剪辑
```

原因是这些内容强依赖单条视频素材，不适合作为 v1.0 组件库固定资产。

### 14.4 第三阶段：沉淀为 Skill

当同一流程重复 3 次以上，新增一个专门 Skill：

```text
industry7view-video-visual-system
```

它的职责：

- 读取分镜执行表。
- 自动匹配视觉组件。
- 生成图文卡 prompt。
- 生成 B-roll prompt。
- 输出 Remotion / HyperFrame 组件调用清单。
- 输出剪映执行清单。

---

## 15. 当前版本决策

当前 v1.0 已固定：

- Design Token
- 6 个已验证 Pattern Component
- `cards.js` 数据驱动内容结构
- HTML 预览模板
- Playwright PNG 导出脚本
- B-roll Prompt 模板
- 分镜映射规则
- 商业航天第一条样板视觉包
- 剪映粗剪执行清单

当前 v1.0 不纳入固定规范：

- 完整 Figma 组件库
- 复杂 3D 动画
- 自动发布
- 大量风格变体
- 与主站代码强绑定
- 数字人口播的停顿、断句和情绪优化
- 单条视频的 BGM、音效和 B-roll 细节选择

版本边界：

```text
v1.0 固定“卡片如何长得一致、如何换内容、如何导出素材”。
v1.0 不固定“每条视频怎么剪得更有顿挫、数字人怎么优化、BGM 怎么选”。
```

核心判断：

```text
guizang ppt skill 用来提供视觉语言和版式灵感，但不直接替代当前 HTML 卡片系统。
industry7view-card-lab 是当前主用图文卡生产系统。
HyperFrame / Remotion 用来承接后续高复用动效模板。
剪映用来合成数字人、B-roll、字幕和音效。
industry7view-video-system 用来保证所有输出稳定、统一、可复用，避免每条视频重新设计。
```

---

## 16. 对照《AI 设计组件库和 Skills》查漏补缺

参考文章的核心框架：

```text
阶段一：先搭组件库
  - 组件树
  - 组件变体
  - 组件属性
  - Design Token 映射
  - 组件结构文档

阶段二：基于真实页面/真实项目装配
  - 用真实任务暴露缺口
  - 区分缺 Base、Combined、Pattern、变体还是属性
  - 记录补充建议

阶段三：沉淀 Skills
  - 组件使用 Skill
  - 页面/视频装配 Skill
  - 对话 Skill
  - 验收 Skill
```

### 16.1 当前已经具备的部分

| 维度 | 当前状态 | 说明 |
|---|---|---|
| 组件树 | 已有初版 | 文档第 4 节已经按 Foundation / Base / Combined / Pattern / Skills 分层。 |
| Design Token | 已有初版 | 颜色、字体、字号、间距、圆角、动效已经定义，且已按 v1.0 修正为直角体系。 |
| Pattern Component | 已有可运行版本 | `industry7view-card-lab` 已经落地 6 张卡片，并可导出 PNG。 |
| 真实项目验证 | 已完成第一轮 | 商业航天第一条已经经过 HTML 预览、PNG 导出、剪映粗剪验证。 |
| 旧风格隔离 | 已完成 | 涂鸦风 Remotion 和 MP4 已归档到 `archive/legacy-doodle/`。 |
| 使用文档 | 部分完成 | `README.md` 和剪映粗剪执行清单已经存在。 |

### 16.2 当前缺口

#### 缺口 A：组件变体还没有系统定义

目前只有 6 张固定模板，但每张模板的可控变体还没有明确。

需要补：

```text
HookCard variants:
- emphasis: risk / gold / neutral
- titleLines: 1 / 2 / 3
- subtitle: visible / hidden

LogisticsCard variants:
- analogyType: equation / metaphor / role
- orbitLine: visible / hidden

NotAIsB variants:
- connector: ≠ / → / =
- contrastMode: old-new / myth-truth / tech-business

BusinessLoop variants:
- stepCount: 3 / 4 / 5
- finalEmphasis: goldBg / goldBorder / navyBg

TrackingChecklist variants:
- itemCount: 3 / 4
- desc: short / medium

ClosingQuote variants:
- theme: navy / paper
- url: visible / hidden
- disclaimer: visible / hidden
```

原则：

```text
先定义 3-5 个真实会用到的变体维度。
不要为了“丰富”而制造大量变体。
```

#### 缺口 B：组件属性还没有形成正式接口

`cards.js` 已经是数据驱动，但还没有明确每类卡片必须字段、可选字段和字段限制。

需要补：

```text
每个 card type 的 schema：
- required fields
- optional fields
- max length
- allowed html span
- fallback rule
- overflow rule
```

示例：

```text
BusinessLoopCardProps:
- id: string
- type: 'loop'
- tag: string, max 6 Chinese chars
- title: string, max 22 Chinese chars
- steps: string[], length 3-5, each max 8 Chinese chars
- footer: string, max 28 Chinese chars
```

这个缺口优先级很高，因为它直接影响后续换主题是否稳定。

#### 缺口 C：Token 还没有同时映射到代码和提示词

当前文档有 Token，HTML 里也有 CSS 变量，但还没有一张“Token 映射表”。

需要补：

```text
设计 Token 名称
CSS 变量名
实际色值/数值
用于哪些组件
Image2 / Figma / Remotion 提示词里怎么表达
```

示例：

| Token | CSS 变量 | 值 | 用途 | 提示词表达 |
|---|---|---|---|---|
| color.brand.navy | `--navy` | `#0f2747` | 标题、品牌、深色卡 | 深蓝主色，研究感 |
| color.brand.gold | `--gold` | `#b8832d` | 编号、关键变量、结论词 | 金色强调，少量使用 |
| radius.card | hardcoded | `0px` | 主卡片、列表项 | 直角卡片，不使用圆角 |

#### 缺口 D：缺少“组件缺口记录”的真实表格化机制

文档第 11 节有缺口记录模板，但还没有固定到每次视频生产流程里。

需要补：

```text
每做完一条视频，都新增一条组件缺口记录：
- 主题
- 使用了哪些卡
- 哪张卡不够用
- 是内容超长、布局不够、变体不够，还是需要新组件
- 处理方式：改文案 / 加变体 / 新增组件 / 暂不处理
```

这个机制比“凭感觉继续设计”更重要。

#### 缺口 E：还没有视觉 QA 自动检查

当前主要靠人工看预览。后续至少需要一个半自动检查清单。

短期先人工检查：

```text
- 是否所有 PNG 都成功导出
- 是否 6 张卡都存在
- 是否有文字贴边或重叠
- 是否有标题超过 3 行
- 是否底部说明遮挡主体
- 是否出现旧风格圆角/涂鸦/过度科幻
```

中期可以做脚本检查：

```text
node check-cards.mjs
```

检查：

```text
cards.js 字段是否完整
steps 是否超过 5 个
footer 是否过长
titleHtml 是否包含未允许标签
output 是否包含 6 张 PNG
```

#### 缺口 F：Skills 还没有拆成 4 类

参考文章建议沉淀四类 Skill。对应到当前视频系统，应该是：

```text
1. 组件使用 Skill
   判断某个分镜该用 HookCard、LoopCard、Checklist 还是 B-roll。

2. 视频装配 Skill
   把分镜执行表转成 PNG/B-roll/剪映时间线。

3. 对话 Skill
   约束 Agent 不要乱发明新风格，先复用已有卡片，再指出最小缺口。

4. 验收 Skill
   判断问题属于文案过长、组件变体不足、布局缺陷，还是单条剪辑问题。
```

当前 v1.0 先不急着创建 Skill 文件，但要从下一条视频开始积累触发条件和验收标准。

### 16.3 优先级排序

#### 高优先级：现在就该补

```text
1. 为 6 张卡补 props/schema 文档。
2. 为 6 张卡补 variants 文档。
3. 增加 Token 映射表：文档 token ↔ CSS 变量 ↔ AI 提示词。
4. 增加 cards.js 字段限制和写作规范。
```

原因：

```text
这些都属于可复用资产。
补完以后，下一条视频换主题会更稳定。
```

#### 中优先级：做第二条视频时补

```text
1. 组件缺口记录表。
2. 视觉 QA 检查清单。
3. Image2 / B-roll prompt 与卡片字段的映射模板。
```

原因：

```text
这些需要第二条、第三条视频来验证，不适合凭空设计过细。
```

#### 低优先级：暂不做

```text
1. 完整 Figma 组件库。
2. 完整 Remotion 动效系统。
3. 数字人口播停顿优化 Skill。
4. 自动剪映工程生成。
5. 大量风格变体。
```

原因：

```text
这些要么依赖更多真实样本，要么当前投入产出比不高。
```

### 16.4 当前最应该做的下一步

不是继续改视觉，也不是马上做数字人口播优化。

下一步应该补齐：

```text
Industry 7View Card Props & Variants Spec v1.0
```

建议新增到 `industry7view-card-lab/README.md` 或单独创建：

```text
/Users/lbq/Desktop/c c/视频/industry7view-card-lab/CARD_SPEC.md
```

内容包括：

```text
1. 六张卡的用途
2. 每张卡的 required fields
3. 每张卡的 optional fields
4. 每个字段的字数限制
5. 每张卡允许的 variants
6. 文案过长时的处理规则
7. 不允许修改的视觉规则
8. 新主题替换流程
```

这个文件补完后，组件库才从“能跑的模板”升级为“可长期复用的组件库”。
