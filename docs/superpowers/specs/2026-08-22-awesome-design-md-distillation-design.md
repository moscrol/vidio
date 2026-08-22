# Awesome DESIGN.md 视觉品味炼化设计

日期：2026-08-22  
状态：已批准实施（用户已授权“按照最优路径推进，不用问”）  
目标仓库：`vidio`  
上游：`VoltAgent/awesome-design-md`

## 1. 问题

`awesome-design-md` 的真正价值不是 74 套可复制的品牌皮肤，而是一个可迁移的方法：把视觉气质、语义色、排版、布局、组件、深度、正反例和输出适配写成 agent 可读的设计契约。

直接把上游目录放进 `.agents/skills/` 会制造四个问题：

1. Vidio 会从自己的视觉语言退化为“挑一个品牌照着做”。
2. 品牌专有字体、字标和视觉身份不应成为默认生成资产。
3. 上游格式并不稳定：审计树有 74 个 `DESIGN.md`，其中 64 个带 YAML frontmatter、10 个使用另一套编号章节；README 声称存在 `preview.html`，当前树实际为 0 个。
4. 纯 Markdown 能指导 agent，却不能稳定阻断低对比、字体过载、强调色泛滥和同时争抢焦点等问题。

本次任务因此不是安装一个外部设计库，而是补齐 Vidio 当前缺失的“静态视觉品味层”。现有 `vibe-motion-taste` 负责时间和运动；新层负责单帧画面在运动前应该长什么样。

## 2. 备选方案

### A. 整包 vendor 74 套 DESIGN.md

优点：最快得到大量风格名。  
缺点：上下文和维护成本高，鼓励品牌仿制，格式漂移进入运行时，无法形成 Vidio 自己的判断。  
结论：拒绝。

### B. 只在仓库根新增一份 `DESIGN.md`

优点：简单，符合上游“Markdown 给 agent 读”的概念。  
缺点：多项目仓库会互相污染；没有机器门禁；无法表达某个项目与默认 Industry 7View 品牌之间的差异。  
结论：不采用。

### C. 项目级设计说明 + 可执行视觉契约（采用）

为 Vidio 新建自有 `vibe-visual-taste`：

```text
brief.md
  → DESIGN.md                 # 为什么这样设计，只写意图、取舍和例子
  → visual-contract.json      # 具体 token 与可执行门槛
  → lint-visual-contract.mjs
  → renderer
  → static-frame QC
  → vibe-motion-taste         # 需要运动时再进入时间轴契约
```

`DESIGN.md` 与 JSON 不重复维护数值：

- `DESIGN.md` 是视觉意图和取舍的权威来源，引用语义 token 名，不重复写 hex、字号和安全区数字。
- `visual-contract.json` 是渲染实现的数值权威来源。
- 两者在同一次改动里更新。linter 同时要求它们存在，并检查 `DESIGN.md` 的必需章节与 JSON 的硬约束。

## 3. 炼化边界

### 3.1 吸收

- 视觉气质必须先命名，再选择样式。
- 色板使用“角色 + 值 + 用途”，不使用无语义颜色堆。
- 字体按显示、正文、数据、标签分工。
- 布局显式记录网格、留白、安全区和阅读顺序。
- 组件写用途、状态、几何和视觉优先级。
- 深度来自明确的表面层级、边框、材质或媒体，而不是默认阴影。
- 每个系统同时写 `do` 与 `avoid`，让 agent 能判断偏离。
- 输出适配从网页 breakpoint 翻译为 9:16、16:9、封面和移动端安全区。

### 3.2 不吸收

- 不复制 74 份品牌正文、品牌色板、字标、专有字体名称或品牌 prompt。
- 不提供“做成 Apple / Nike / Stripe / Runway 一模一样”的路由。
- 不把网页 hover、表单、导航等交互细节原样塞进视频系统。
- 不把上游 README 中与当前审计树不一致的 preview 声明当成事实。
- 不安装上游为运行时 skill，不写入 `skills-lock.json`。

### 3.3 来源与许可证

新增：

- `docs/sources/voltagent-awesome-design-md.md`
- `third_party/licenses/voltagent-awesome-design-md-MIT.txt`

来源记录固定审计 commit、审计日期、树内实测数量、吸收与排除范围、更新方法。当前树只作为知识来源；运行时依赖为无。

## 4. 自有 skill

目录：

```text
.agents/skills/vibe-visual-taste/
├── SKILL.md
├── agents/openai.yaml
├── references/visual-language.md
├── references/review-rubric.md
├── schemas/visual-contract.schema.json
├── scripts/lint-visual-contract.mjs
├── scripts/lint-visual-contract.test.mjs
└── templates/
    ├── DESIGN.md
    └── visual-contract.json
```

`.claude/skills/vibe-visual-taste` 只放指向上述目录的符号链接。

### 4.1 触发范围

以下请求自动触发：

- 视觉风格、设计系统、`DESIGN.md`、色板、字体、网格、材质；
- 图文卡、封面、UI 演示、动态图表、宣传片视觉底座；
- “高级感”“不像模板”“品牌统一”“别像 AI 生成”；
- 对已有画面做静态视觉审查。

它不负责动画时间、转场或运镜；这些继续由 `vibe-motion-taste` 负责。

### 4.2 工作流

1. 读 `brief.md`、真实素材、已有品牌资料和目标输出。
2. 将画面意图压成一句可反驳的视觉命题，并列出一个 distinctive move。
3. 先定信息层级和阅读顺序，再定 token。
4. 从模板生成项目级 `DESIGN.md` 与 `visual-contract.json`。
5. 运行视觉 contract hard gate，修完 error；warning 必须进入质检记录。
6. 实现静态英雄帧；需要运动时才交给 `vibe-motion-taste`。
7. 以 1× 输出尺寸、缩略图、灰阶和关键安全区做人工复核，给 `BLOCK` 或 `APPROVE`。

## 5. 视觉契约

`visual-contract.json` 使用下列顶层结构：

```json
{
  "version": "1.0",
  "name": "project-visual-system",
  "canvas": {},
  "identity": {},
  "palette": {},
  "typography": {},
  "layout": {},
  "surfaces": {},
  "media": {},
  "components": [],
  "guardrails": {},
  "accessibility": {}
}
```

### 5.1 Canvas

- `width`、`height`、`fps`、`backgroundRole`。
- `fps` 为与视频项目对齐的元数据；静态项目仍可为 30。

### 5.2 Identity

- `voice`：1–4 个自有气质词。
- `hierarchyPrinciple`：画面注意力如何排序。
- `distinctiveMove`：一个能识别本系统的视觉动作，但不属于动画。
- `brandImitation`：必须为 `false`。
- `inspirationMode`：必须为 `method-only` 或 `original`。

### 5.3 Palette

固定语义键：

- `background`
- `surface`
- `textPrimary`
- `textMuted`
- `accent`
- `warning`

每个值必须为六位 hex。另有 `maxAccentCoveragePct`，表示强调色在完整画面的面积预算。

### 5.4 Typography

- `families`：`display`、`body`、`data`、`label` 的字体与 fallback。
- `scale`：`hero`、`title`、`body`、`label`、`source` 的 `sizePx`、`lineHeight`、`weight`、`maxLines`。
- 字体角色可以共享同一 family；视觉差异优先来自字号、字重、字距与语义，而不是无节制换字体。

### 5.5 Layout

- `safeAreaPx` 四边安全区。
- `gridColumns` 与 `gutterPx`。
- `readingOrder`。
- `maxFocalElements`：同一时刻的高显著性焦点预算。
- `maxPanels`：同帧主要承载面数量。

### 5.6 Surfaces 与 Media

- `radiusScalePx`、`borderStrategy`、`shadowStrategy`。
- `effects` 每项含 `name`、`purpose`、`maxCoveragePct`；渐变、玻璃、辉光、模糊必须说明用途。
- `sourcePolicy` 区分真实 UI、公开素材、生成图和占位图。
- `treatment` 与 `cropPolicy` 说明媒体如何融入底座。

### 5.7 Components 与 Guardrails

- 每个组件有 `name`、`purpose`、`priority` 和 `geometry`。
- `do` 与 `avoid` 各至少三条。
- 规则描述结果，不绑定 CSS selector 或某个 renderer。

## 6. Linter

命令：

```bash
node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs <project-or-variant-dir>
```

输入目录中必须同时有 `DESIGN.md` 与 `visual-contract.json`。

### 6.1 Error

| Code | 条件 |
| --- | --- |
| `VVT001` | JSON 不能解析或缺必需字段 |
| `VVT002` | `DESIGN.md` 缺 Intent、Hierarchy、Tokens、Components、Media、Do/Avoid、Review 章节 |
| `VVT003` | 缺语义色或颜色不是六位 hex |
| `VVT004` | 主文字对背景或 surface 对比度低于 4.5:1 |
| `VVT005` | 竖屏 1080 基准下正文、标签或来源字号低于最低可读比例 |
| `VVT006` | `brandImitation` 不是 `false`，或 inspiration mode 非法 |
| `VVT007` | 安全区越界、阅读顺序为空、组件缺 purpose |
| `VVT008` | `do` / `avoid` 不足三条 |

### 6.2 Warning

| Code | 条件 |
| --- | --- |
| `VVT101` | 实际使用超过三个字体 family |
| `VVT102` | 强调色面积预算超过 18% |
| `VVT103` | `maxFocalElements` 大于 1 |
| `VVT104` | 同一系统声明超过三个 surface effect |
| `VVT105` | radius scale 超过三个值 |
| `VVT106` | effect 缺视觉目的或覆盖预算 |

warning 不静默忽略；基线证明可以有意保留，生产方案必须在 QC 中逐条解释。

### 6.3 测试

依赖仅 Node 标准库。测试至少覆盖：

- 合法契约通过；
- 必需章节缺失；
- 非法 hex；
- 低对比；
- 字号过小；
- 品牌仿制闸；
- 安全区越界；
- 组件无 purpose；
- 字体过载、强调色过量、多焦点、effect 和 radius warnings。

## 7. 路由整合

生产链改为：

```text
vibe-director
  → vibe-visual-taste
  → DESIGN.md + visual-contract.json
  → vibe-motion-taste（有运动时）
  → motion-contract.json
  → renderer
  → hybrid QC
```

修改：

- `AGENTS.md`
- `README.md`
- `.cursor/rules/vibe-motion.mdc`
- `.agents/skills/vibe-director/SKILL.md`
- `.claude/skills/stitch-to-video/SKILL.md`
- `studio/server.mjs`
- `industry7view-card-lab/VIDEO_DESIGN.md`
- `docs/system/industry7view-video-system-design.md`

Stitch、HyperFrames、GSAP 和 Remotion 都消费已经做出的视觉/运动决定；它们不自行选择“Apple 风”“玻璃拟态”或主题刻板色板。

## 8. FinHot 静态 A/B 证明

目录：`projects/2026-08-22-finhot-visual-taste-proof/`。

两版锁定相同内容：

- 同一张 FinHot 真实 UI 截图；
- 同一主标题、三项信息和免责声明；
- 同一 1080×1920 画布；
- 不使用动画，隔离静态视觉系统变量。

### 8.1 基线版

故意保留常见 AI SaaS 风格：多种强调色、玻璃层、辉光、渐变、四套圆角、多个同时争抢焦点的模块。契约必须零 error，但应稳定产生 5–6 条 warning。

### 8.2 炼化版

采用 Vidio 自有“研究编辑台”语言：纸白底、深墨蓝、单一证据金、信息栏与 UI 截图形成主从、标签/正文/数据字体分工、一个 distinctive evidence rail。契约必须零 error、零 warning。

### 8.3 证据

- 用本机 Chrome 对两份最终 HTML 以 1080×1920 截图。
- 对截图做 2-up 对照板，输出到当前 Codex 任务 `outputs/`。
- 人工检查 1×、25% 缩略图、灰阶层级、安全区、来源和免责声明可读性。
- `质检/QC.md` 必须以明确 `APPROVE` 或 `BLOCK` 结束。

## 9. 验收

全部满足才可推送：

1. 当前树不包含上游 74 份 `DESIGN.md` 正文。
2. 来源记录、审计 commit 和 MIT 副本齐全。
3. `vibe-visual-taste` 通过 `quick_validate.py`。
4. linter 单测全部通过。
5. 模板与炼化版为 0 error / 0 warning。
6. 基线版只有已声明的 warning，0 error。
7. 两份 HTML 无运行时错误，最终截图为 1080×1920。
8. 对照板来自最终截图，人工 QC 为 `APPROVE`。
9. `node --check studio/server.mjs`、JSON 解析与 `git diff --check` 通过。
10. 工作树干净，远端分支 SHA 与本地一致；不自动合并 `main`。

## 10. 非目标

- 不做 74 套品牌选择器。
- 不新增 Figma/Stitch/付费 API 依赖。
- 不重写整个 Industry 7View 卡片系统。
- 不把本轮静态证明升级成完整视频。
- 不把品牌近似度当成验收指标；验收的是层级、可读性、一致性和独特性。
