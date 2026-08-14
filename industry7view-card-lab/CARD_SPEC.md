# Industry 7View Card Props & Variants Spec v1.6

这份文档定义 `industry7view-card-lab` 的卡片接口、变体边界和内容写作限制。后续换主题时，优先改 `cards.js`，不要重新设计颜色、字体、圆角和整体版式。

## 1. 固定原则

- **画布比例**：9:16 竖屏。
- **视觉风格**：Industry 7View 版 Swiss，深蓝主色、金色强调、浅纸底、直角卡片。
- **品牌角标**：统一使用 `INDUSTRY 7VIEW`。
- **内容入口**：所有主题内容从 `cards.js` 进入。
- **默认卡片数量**：1 张封面 + 7 张正文图文卡。
- **默认导出方式**：运行 `npm run export` 输出 PNG。

## 2. 全局数据结构

```ts
interface CardDeckData {
  project: string;
  brand: 'INDUSTRY 7VIEW';
  sourceUrl: string;
  cover: CoverCardProps;
  cards: CardData[];
  extras?: ExtraCardData[];
}
```

### 全局字段限制

| 字段 | 必填 | 限制 | 用途 |
|---|---|---:|---|
| `project` | 是 | 20 个中文字符以内 | 项目或视频名称 |
| `brand` | 是 | 固定为 `INDUSTRY 7VIEW` | 品牌角标 |
| `sourceUrl` | 是 | 不超过 80 个字符 | 主站文章链接 |
| `cover` | 是 | 固定 1 张 | 发布封面 / 开场主视觉 |
| `cards` | 是 | 固定 7 张 | 视频图文卡组 |
| `extras` | 否 | 0-N 张 | 可选扩展组件，不打乱正文七卡 |

## 3. 通用卡片字段

| 字段 | 类型 | 限制 | 说明 |
|---|---|---:|---|
| `id` | string | 必须唯一 | 导出 PNG 的文件名来源 |
| `type` | string | 仅允许固定类型 | 决定渲染模板 |
| `tag` | string | 6 个中文字符以内 | 顶部标签 |
| `meta` | string | 32 个字符以内 | 英文/短语元信息 |
| `title` | string | 28 个中文字符以内 | 普通标题 |
| `titleHtml` | string | 80 个字符以内 | 允许少量高亮的标题 |
| `subtitle` | string | 32 个中文字符以内 | 副标题 |
| `footer` | string | 36 个中文字符以内 | 底部说明 |
| `url` | string | 80 个字符以内 | 结尾卡链接 |
| `number` | string | 16 个字符以内 | 数据冲击卡主数字 |
| `unit` | string | 8 个字符以内 | 数据单位 |
| `label` | string | 36 个字符以内 | 数据解释 |
| `compareText` | string | 32 个字符以内 | 对比基准 |
| `insight` | string | 32 个字符以内 | 数据洞察 |
| `kicker` | string | 32 个字符以内 | 封面元信息 |
| `badge` | string | 12 个字符以内 | 封面角标 |
| `evidences` | array | 3-6 条 | 证据墙项目 |

### `titleHtml` 允许范围

只允许使用：

```html
<br />
<span class="gold">...</span>
<span class="risk">...</span>
```

不允许使用其他 HTML 标签、内联样式、脚本或外部资源。

## 4. 固定卡片顺序

```text
00-cover-card
01-hook-card
02-data-hero-card
03-logistics-card
04-not-a-is-b
05-business-loop
06-tracking-checklist
07-closing-quote
08-evidence-grid-card
```

`00-cover-card` 和 `08-evidence-grid-card` 不属于正文七卡叙事。正文默认仍是 01-07。

## 5. Card 00：CoverCard

### 用途

发布封面、B站/抖音封面、可选的视频 0-2 秒开场主视觉。CoverCard 不属于正文七卡叙事，不参与 01-07 的口播节奏。

CoverCard 和 HookCard 的区别：

| 组件 | 使用时机 | 主要目标 | 是否进入正文节奏 |
|---|---|---|---|
| `00-cover-card` | 发布前选择封面、平台缩略图、可选 0-2 秒开场 | 让用户在信息流里愿意点进来 | 否 |
| `01-hook-card` | 视频正式开头 0-3 秒 | 承接口播，快速抛出反常识判断 | 是 |

如果一条视频只需要一个正文开头，不需要单独封面，可以只在发布平台选择 `00-cover-card.png` 做封面，不放进剪映时间线。

### Props

```ts
interface CoverCardProps {
  id: '00-cover-card';
  type: 'cover';
  tag: string;
  kicker: string;
  titleHtml: string;
  subtitle?: string;
  badge?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `kicker` | 32 个字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `subtitle` | 32 个中文字符以内 |
| `badge` | 12 个字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
theme: navy
badge: visible / hidden
subtitle: visible / hidden
```

### 写作规则

- 封面标题要像信息流标题，不要像正文解释。
- 标题可以比 HookCard 更完整，但必须一眼读懂。
- 副标题优先压成一行，避免封面出现尴尬断行。
- `footer` 可写主站域名或主题 slug，不写完整内部路径。

## 6. Card 01：HookCard

### 用途

开头强判断，用于 0-3 秒抓住注意力，适合认知纠偏、反常识判断和主题定位。

### Props

```ts
interface HookCardProps {
  id: '01-hook-card';
  type: 'hook';
  tag: string;
  meta?: string;
  titleHtml: string;
  subtitle?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `subtitle` | 32 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
emphasis: gold / risk / neutral
titleLines: 1 / 2 / 3
subtitle: visible / hidden
```

### 写作规则

- 主标题只讲一个判断。
- 可以用 `≠`、`不是`、`真正问题是`制造转折。
- 不要在开头卡解释完整产业链。

## 7. Card 02：DataHeroCard

### 用途

用一个大数字作为证据锚点，证明产业变化已经发生。适合 BD 金额、市场规模、渗透率、成本下降、BOM 占比、订单数量等高冲击数据。

### Props

```ts
interface DataHeroCardProps {
  id: '02-data-hero-card';
  type: 'dataHero';
  tag: string;
  meta?: string;
  number: string;
  unit: string;
  label: string;
  compareText?: string;
  insight: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `number` | 16 个字符以内 |
| `unit` | 8 个中文字符以内 |
| `label` | 36 个中文字符以内 |
| `compareText` | 32 个中文字符以内 |
| `insight` | 32 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
numberScale: normal / longNumber
compare: visible / hidden
unitPosition: inline / bottom
```

### 写作规则

- 数字必须服务于一个判断，不做无上下文的数据堆砌。
- `label` 回答“这个数字是什么”。
- `compareText` 回答“和什么比”。
- `insight` 回答“这个数字说明什么”。

## 8. Card 03：LogisticsCard

### 用途

把复杂产业概念讲成人话，用生活化类比降低理解门槛。

### Props

```ts
interface LogisticsCardProps {
  id: '03-logistics-card';
  type: 'logistics';
  tag: string;
  meta?: string;
  titleHtml: string;
  subtitle?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `subtitle` | 36 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
analogyType: equation / metaphor / role
orbitLine: visible / hidden
```

### 写作规则

- 优先使用 `A = B` 或 `A 像 B`。
- 类比必须服务于理解，不要为了有趣而牺牲准确性。
- 底部说明负责把类比拉回产业判断。

## 9. Card 04：NotAIsB

### 用途

把错误理解和真实逻辑并排呈现，适合“不是 A，而是 B”的产业纠偏。

### Props

```ts
interface CompareCardProps {
  id: '04-not-a-is-b';
  type: 'compare';
  tag: string;
  oldText: string;
  newText: string;
  explain?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `oldText` | 8 个中文字符以内 |
| `newText` | 8 个中文字符以内 |
| `explain` | 24 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
connector: ≠ / → / =
contrastMode: old-new / myth-truth / tech-business
```

### 写作规则

- 左侧写大众误解，右侧写真正变量。
- 两侧字数尽量接近。
- 不要把完整句子塞进左右卡片。

## 10. Card 05：BusinessLoop

### 用途

展示产业链、商业闭环、价值流或决策流程。

### Props

```ts
interface BusinessLoopCardProps {
  id: '05-business-loop';
  type: 'loop';
  tag: string;
  title: string;
  steps: string[];
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `title` | 28 个中文字符以内 |
| `steps` | 3-5 个节点 |
| `steps[]` | 每个节点 8 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
stepCount: 3 / 4 / 5
finalEmphasis: goldBg / goldBorder / navyBg
```

### 写作规则

- 每个节点只写名词短语或动宾短语。
- 最后一个节点应落到收入、付费、成本、订单或利润。
- 如果超过 5 步，先合并流程，不新增节点。

## 11. Card 06：TrackingChecklist

### 用途

把视频结论转成可收藏的跟踪清单，适合“看三个变量”“跟踪四件事”。

### Props

```ts
interface TrackingChecklistCardProps {
  id: '06-tracking-checklist';
  type: 'checklist';
  tag: string;
  titleHtml: string;
  items: Array<{
    title: string;
    desc: string;
  }>;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `items` | 3-4 条 |
| `items[].title` | 8 个中文字符以内 |
| `items[].desc` | 18 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
itemCount: 3 / 4
desc: short / medium
```

### 写作规则

- 每条清单必须可观察、可跟踪。
- 不写泛泛而谈的形容词，例如“景气度好”“前景广阔”。
- 三条清单优先于四条清单。

## 12. Card 07：ClosingQuote

### 用途

收束观点、提供主站链接和风险提示，方便截图传播。

### Props

```ts
interface ClosingQuoteCardProps {
  id: '07-closing-quote';
  type: 'quote';
  tag: string;
  meta?: string;
  titleHtml: string;
  subtitle?: string;
  url?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `subtitle` | 32 个中文字符以内 |
| `url` | 80 个字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
theme: navy / paper
url: visible / hidden
disclaimer: visible / hidden
```

### 写作规则

- 主标题必须像一句可截图传播的结论。
- `footer` 默认保留风险提示或非投资建议。
- `url` 指向主站研究文章，不写内部路径。

## 13. Extra 08：EvidenceGridCard

### 用途

展示 3-6 个证据点、公司案例、产品场景、技术节点或交易要素。EvidenceGridCard 是可选扩展组件，放在 `extras` 中，不改变 01-07 正文七卡顺序。

### Props

```ts
interface EvidenceGridCardProps {
  id: '08-evidence-grid-card';
  type: 'evidenceGrid';
  tag: string;
  meta?: string;
  titleHtml: string;
  subtitle?: string;
  evidences: Array<{
    label: string;
    value: string;
  }>;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `titleHtml` | 1-3 行，80 个字符以内 |
| `subtitle` | 36 个中文字符以内 |
| `evidences` | 3-6 条 |
| `evidences[].label` | 12 个字符以内 |
| `evidences[].value` | 18 个字符以内 |
| `footer` | 36 个中文字符以内 |

### Variants

```text
grid: 2x2 / 2x3
contentType: company / product / deal / technology / scenario
```

### 写作规则

- 每个证据格只放一个短标签和一个短结论。
- 不在证据格里写完整句子。
- 适合回答“谁在买、买什么、怎么兑现、有哪些案例”。
- 如果证据需要图片，先用文字证据格验证结构，再考虑 EvidenceImageGrid 变体。

## 14. Candidate：OrderValidationCard

### 状态

`promotion_candidate`，已在 2-3 个真实主题中复现，但尚未代码化，不允许直接在 `cards.js` 中使用。

### 用途

展示一个产业机会从“故事/样品/送样”走向“客户验证/批量交付/收入毛利”的验证链条。它回答的问题不是“接下来要看什么”，而是“现在验证到哪一步”。

OrderValidationCard 和 TrackingChecklistCard 的区别：

| 组件 | 回答的问题 | 信息形态 | 典型场景 |
|---|---|---|---|
| `TrackingChecklistCard` | 接下来要跟踪什么 | 并列观察项 | Capex、订单、毛利率、政策、价格 |
| `OrderValidationCard` | 验证链条走到哪一步 | 阶段递进 | 样机、送样、认证、小批量、收入确认 |

OrderValidationCard 和 EvidenceGridCard 的区别：

| 组件 | 回答的问题 | 信息形态 | 典型场景 |
|---|---|---|---|
| `EvidenceGridCard` | 有哪些证据点 | 并列证据墙 | 公司、客户、产品、订单、案例 |
| `OrderValidationCard` | 证据是否形成兑现路径 | 顺序验证链 | 从客户导入到财务兑现 |

### Candidate Props

```ts
interface OrderValidationCardProps {
  id: string;
  type: 'orderValidation';
  tag: string;
  meta?: string;
  title: string;
  stages: Array<{
    label: string;
    status: 'done' | 'current' | 'next' | 'risk';
    desc?: string;
  }>;
  verdict?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `title` | 28 个中文字符以内 |
| `stages` | 4-6 个阶段 |
| `stages[].label` | 6 个中文字符以内 |
| `stages[].desc` | 14 个中文字符以内 |
| `verdict` | 24 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### 推荐阶段词

```text
样机 / 送样 / 客户认证 / 小批量 / 批量交付 / 收入确认 / 毛利验证
Demo / 产品 / 量产 / 稳定交付 / 客户付费
验证 / 装机 / 良率 / 复购 / 财报兑现
```

### 适用场景

- 人形机器人：从 Demo 到产品、量产、稳定交付。
- 服务器电源：从送样到认证、批量交付、收入和毛利兑现。
- 半导体设备：从样机到晶圆厂验证、装机、良率、收入确认。
- 高速铜缆、半导体设备、先进封装等 B2B 长认证周期主题。

### 不适用场景

- 只有并列公司名单，优先用 EvidenceGridCard。
- 只有未来观察变量，优先用 TrackingChecklistCard。
- 只有简单“订单多/收入高”一个证据，优先用 DataHeroCard。
- 只是情绪催化或题材传闻，不进入 OrderValidationCard。

### 写作规则

- 每个阶段必须是可验证动作，不写“前景广阔”“空间巨大”。
- `current` 只能有 1 个，表示当前验证卡位。
- 最后一阶段优先落到收入、毛利、复购、规模交付。
- 如果阶段超过 6 个，先合并为“客户验证”“交付兑现”“财务兑现”三段。

### 示例

```text
title：服务器电源，验证到哪一步？
stages：送样(done) / 认证(current) / 小批量(next) / 收入(next) / 毛利(risk)
verdict：不看故事，看兑现链条
```

## 15. Candidate：SupplyChainShiftCard

### 状态

`promotion_candidate`，已在 2-3 个真实主题中复现，但尚未代码化，不允许直接在 `cards.js` 中使用。

### 用途

展示产业链中的价值、利润池、话语权或设计权从一个环节迁移到另一个环节。它回答的问题不是“价值如何形成”，而是“价值和权力迁移到哪里”。

SupplyChainShiftCard 和 BusinessLoopCard 的区别：

| 组件 | 回答的问题 | 信息形态 | 典型场景 |
|---|---|---|---|
| `BusinessLoopCard` | 价值如何形成 | 因果闭环 / 商业路径 | 需求、成本、订单、利润 |
| `SupplyChainShiftCard` | 价值迁移到哪里 | 从 A 到 B 的结构迁移 | 模块厂到芯片厂、PSU 到系统方案、海外设备到国产链 |

SupplyChainShiftCard 和 SupplyChainCard 的区别：

| 组件 | 回答的问题 | 信息形态 | 典型场景 |
|---|---|---|---|
| `SupplyChainCard` | 产业链有哪些环节 | 静态上中下游 | 原料、制造、应用 |
| `SupplyChainShiftCard` | 哪些环节在变强/变弱 | 动态迁移 | 话语权、利润池、设计权、国产替代 |

### Candidate Props

```ts
interface SupplyChainShiftCardProps {
  id: string;
  type: 'supplyChainShift';
  tag: string;
  meta?: string;
  title: string;
  from: string;
  to: string;
  drivers: string[];
  result?: string;
  footer?: string;
}
```

### 字段限制

| 字段 | 限制 |
|---|---:|
| `tag` | 6 个中文字符以内 |
| `meta` | 32 个字符以内 |
| `title` | 28 个中文字符以内 |
| `from` | 10 个中文字符以内 |
| `to` | 10 个中文字符以内 |
| `drivers` | 2-4 条 |
| `drivers[]` | 8 个中文字符以内 |
| `result` | 24 个中文字符以内 |
| `footer` | 36 个中文字符以内 |

### 推荐迁移类型

```text
利润池迁移
设计权迁移
供应链话语权迁移
国产替代迁移
模块到系统方案迁移
单点零部件到平台能力迁移
```

### 适用场景

- CPO：模块厂向芯片厂、光引擎、先进封装迁移。
- 服务器电源：PSU 向 Power Shelf、HVDC、BBU、液冷、智能化系统迁移。
- 半导体设备：海外整机垄断向国产整机和核心零部件本土化迁移。
- 先进封装、半导体设备、服务器电源、高速铜缆等供应链重构主题。

### 不适用场景

- 只是静态产业链全景，优先用 BusinessLoopCard 或后续 SupplyChainCard。
- 只是公司名单，优先用 EvidenceGridCard。
- 只是“需求增加导致订单增加”，优先用 BusinessLoopCard。
- 迁移方向不明确，先用口播或 CompareCard。

### 写作规则

- `from` 和 `to` 必须是产业链环节，不写抽象情绪。
- `drivers` 只写迁移原因，例如“功耗瓶颈”“客户认证”“管制倒逼”。
- `result` 写迁移结果，例如“利润池上移”“国产链导入”“系统方案胜出”。
- 不要把完整产业链塞进一张迁移卡。

### 示例

```text
title：服务器电源，价值在上移
from：普通 PSU
to：机架级供电
drivers：功率暴涨 / HVDC / 液冷 / 客户认证
result：从模块供应商到系统方案商
```

## 16. 内容过长处理规则

按以下顺序处理：

```text
1. 先删修饰词。
2. 再把完整句改成名词短语。
3. 再把解释移到底部说明。
4. 再拆到下一张卡或 B-roll 字幕。
5. 最后才考虑新增变体或新组件。
```

不允许为了塞下文案而随意缩小字号、压缩行距或改变卡片结构。

## 17. 不允许修改的视觉规则

```text
颜色
字体
品牌角标位置
顶部标签位置
底部说明位置
卡片直角风格
整体网格背景
主标题字号层级
七张模板的基本结构
```

## 18. 新主题替换流程

```text
1. 复制当前 cards.js 作为备份。
2. 修改 project 和 sourceUrl。
3. 按七张固定模板替换内容字段。
4. 运行 npm run check。
5. 运行 npm run export。
6. 检查 output/{slug}/ 是否生成 9 张 PNG。
7. 放入剪映时间线做节奏验证。
8. 如果某张卡不够用，记录为组件缺口，不直接改视觉风格。
```

## 19. 组件缺口记录模板

| 日期 | 主题 | 卡片 | 问题类型 | 描述 | 处理方式 |
|---|---|---|---|---|---|
| YYYY-MM-DD | 主题名 | 04-business-loop | 文案过长 / 变体不足 / 新组件需求 | 具体问题 | 改文案 / 加变体 / 新增组件 / 暂不处理 |
| 2026-05-20 | 人形机器人 | 06-closing-quote | 视觉换行 | 字段校验通过，但标题含中英文和逗号时出现不理想换行。 | 改文案；后续导出后必须人工抽查 01/04/05/06。 |
| 2026-05-20 | 创新药 | 全部 | 跨行业验证 | 非硬科技/制造业主题也能套入现有 6 张卡，认知纠偏、类比、对比、价值路径、跟踪清单、结论卡均可用。 | 暂不新增组件；若后续多次需要突出大额 BD/市场规模，可考虑新增 DataHeroCard。 |
| 2026-05-20 | 创新药 | 02-data-hero-card | 新组件落地 | 大数字在产业研究中高频出现，适合作为独立证据锚点组件。 | 已纳入 v1.1 标准七卡结构。 |
| 2026-05-20 | 创新药 | 00-cover-card | 新组件落地 | 每条视频都需要发布封面/开场主视觉，封面不应打乱正文七卡叙事。 | 已纳入 v1.2，作为顶层 cover 独立导出。 |
| 2026-05-20 | 创新药 | 08-evidence-grid-card | 新组件落地 | 创新药主题需要展示全球药企买单、BD交易、临床资产、海外权益等多个证据点。 | 已纳入 v1.3，作为 extras 可选扩展卡独立导出。 |
