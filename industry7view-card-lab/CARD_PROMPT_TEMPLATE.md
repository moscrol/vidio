# Industry 7View 封面 + 七卡生成 Prompt 模板

用途：把一篇研究文章、演讲稿或短视频口播稿，稳定转换成 `industry7view-card-lab/cards.js` 可用的数据。

## 1. 输入格式

```text
主题名称：
主站链接：
目标视频标题：
核心口播稿：
核心数据：
核心类比：
常见误解：
真实逻辑：
产业路径 / 商业闭环：
跟踪变量：
风险提示：
```

如果输入材料不完整，优先从研究文章或演讲稿中提取，不要凭空编造数据。

## 2. 输出要求

输出必须是可直接替换 `cards.js` 的 JS 数据：

```js
window.INDUSTRY7VIEW_CARDS = {
  project: '',
  brand: 'INDUSTRY 7VIEW',
  sourceUrl: '',
  cover: {
  },
  cards: [
  ],
};
```

不得输出解释性废话、内部路径或素材来源文件名。

## 3. 封面 + 七卡映射规则

| 卡片 | 目标 | 内容来源 |
|---|---|---|
| 00 CoverCard | 发布封面 / 开场主视觉 | 信息流标题、主题分类、核心判断 |
| 01 HookCard | 一句反常识判断 | 开头 3 秒钩子 |
| 02 DataHeroCard | 一个最强数据证据 | 市场规模、订单、BD、渗透率、成本、BOM 等 |
| 03 LogisticsCard | 生活化类比 | “A 像 B”或“A = B” |
| 04 CompareCard | 误解 vs 真相 | 大众误区和真实变量 |
| 05 BusinessLoopCard | 价值路径 | 产业链、商业闭环、技术路线、兑现路径 |
| 06 TrackingChecklistCard | 三个跟踪变量 | 可观察、可验证、可复盘的指标 |
| 07 ClosingQuoteCard | 一句话结论 | 可截图传播的最终判断 |
| 08 EvidenceGridCard | 可选证据墙 | 公司案例、交易要素、产品场景、技术节点 |

## 4. 每张卡写法

### 00 CoverCard

```text
titleHtml：像信息流标题，一眼读懂。
subtitle：尽量一行，解释主题判断。
badge：系列编号，例如 第一条。
footer：主站域名或主题 slug，不写内部路径。
```

### 01 HookCard

```text
格式：主题 ≠ 常见误解
要求：3 秒内看懂，只讲一个判断。
```

### 02 DataHeroCard

```text
number：只写数字，不写单位。
unit：写单位，例如 亿美元、%、亿元、万台。
label：这个数字是什么。
compareText：和什么比较。
insight：这个数字说明什么。
```

### 03 LogisticsCard

```text
格式：主题 = 类比物
要求：类比必须准确，不能为了有趣而失真。
```

### 04 CompareCard

```text
oldText：大众误解，8 字以内。
newText：真实变量，8 字以内。
explain：一句解释，24 字以内。
```

### 05 BusinessLoopCard

```text
steps：3-5 个节点，每个节点 8 字以内。
最后一个节点必须落到订单、付费、收入、利润、放量、成本或兑现。
```

### 06 TrackingChecklistCard

```text
items：优先 3 条。
每条必须是可观察变量，不写“前景好”“景气度高”这种泛词。
```

### 07 ClosingQuoteCard

```text
titleHtml：一句可截图传播的结论。
subtitle：一句补充解释。
url：主站文章链接。
footer：风险提示或非投资建议。
```

### 08 EvidenceGridCard（可选）

```text
放在 extras 中，不放进 cards 七卡正文数组。
evidences：3-6 条，每条包含 label 和 value。
label：证据类型，例如 BD交易、临床资产、海外权益。
value：短结论，例如 首付款、差异化数据、全球定价。
```

## 5. 压缩规则

```text
1. 先删形容词。
2. 再把完整句改成名词短语。
3. 再把解释移到 subtitle / footer。
4. 仍然过长时，换更短表达。
5. 不要为了塞字改变布局。
```

## 6. 生成后必须执行

```bash
npm run check
npm run export
npm run check
```

## 7. 导出后人工抽查

必须抽查：

```text
01 HookCard：3 秒内能否看懂？
02 DataHeroCard：数字和单位是否一眼可读？
05 BusinessLoopCard：流程是否过密？
06 TrackingChecklistCard：清单是否可收藏？
07 ClosingQuoteCard：是否像一句结论？
```

字段校验通过不等于视觉合格。
