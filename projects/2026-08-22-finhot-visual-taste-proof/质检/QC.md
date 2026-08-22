# FinHot 视觉品味炼化 A/B 质检 · 2026-08-22

> 结论：同一内容和真实产品截图下，炼化版用“单一主张 → 证据轨 → 产品实证 → 来源”建立了更稳定、可辨识且不依赖品牌仿制的静态视觉秩序。基线仅作为受控反例保留，炼化版可进入生产链。

## 实验锁定

- `node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs projects/2026-08-22-finhot-visual-taste-proof`：**APPROVE · 0 error / 0 warning**。`reference-brief.md` 与 `design-vocabulary.json` 已成为视觉合同之前的上游门禁。
- `node verify-proof.mjs`：**PASS**。两版可见文字逐字一致、共同引用同一张截图、canvas contract 一致，最终帧和对照板尺寸正确。
- 共同截图 SHA-256：`63d71a9677fc948a0ba5675798dca90b5602b8e964619245205a0aea280a4a97`，与既有 motion proof 源文件一致。
- 两版均为 1080×1920 静态 HTML；没有动画、音频、网络字体、生成图或运行时请求。
- 本轮只改语言/视觉合同与来源说明；锁定文案、共享截图字节、两版 HTML、全部质检 PNG 与对照板均未修改，历史像素判定继续有效。
- 两版 `DESIGN.md` 与本 QC 消费 `TERM-001`、`TERM-002`、`TERM-003`、`TERM-004`、`TERM-005`：基线明确记录受控违反项，炼化版明确记录五项约束；visual-contract JSON 只拥有数值与媒体策略，不重定义词义。
- `reference-brief.md` 将截图记为 `SUPPLIED`，只确认本地证明用途且不假设可再分发；两份 visual contract 的 `sourcePolicy: supplied-local-proof-only` 与该边界一致。

## 当前复核命令

| 命令 | 当前结果 |
| --- | --- |
| `node .agents/skills/vibe-design-language/scripts/lint-design-language.mjs projects/2026-08-22-finhot-visual-taste-proof` | `APPROVE` · 0 errors · 0 warnings |
| `node projects/2026-08-22-finhot-visual-taste-proof/verify-proof.mjs` | PASS · identical content, shared asset, fixed canvas, final captures |
| `node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs projects/2026-08-22-finhot-visual-taste-proof/baseline` | `Summary: 0 error(s), 5 warning(s)`（下方既有受控变量） |
| `node .agents/skills/vibe-visual-taste/scripts/lint-visual-contract.mjs projects/2026-08-22-finhot-visual-taste-proof/distilled` | `Summary: 0 error(s), 0 warning(s)` |

## 自动门槛

| 项目 | 基线版 | 炼化版 |
| --- | --- | --- |
| visual contract error | **0** | **0** |
| visual contract warning | 5（受控变量） | **0** |
| 最终截图 | 1080×1920 · 1,319,370 bytes | 1080×1920 · 406,702 bytes |
| 内容/资产/canvas verifier | PASS | PASS |

基线 warning：

- `VVT101`：4 个字体 family；
- `VVT102`：强调色预算 32%；
- `VVT103`：允许 3 个同时焦点；
- `VVT104`：4 个 surface effects；
- `VVT105`：4 个 radius values。

这些 warning 是本次对照变量，不是被忽略的生产债务。炼化版全部回到默认预算内。

## 像素检查

| 检查 | 观察 | 判定 |
| --- | --- | --- |
| 1× 最终尺寸 | 两版主标题、三项证据、产品状态、来源和免责声明均完整；炼化版先看到一个判断，再沿同一金色证据轨下读 | PASS |
| 25% 缩略图 | 两版标题仍可辨；基线三个等强玻璃面板缩成同权重模块，炼化版仍保持“标题 → 有序证据 → 产品”的单轴层级 | PASS；炼化版更稳定 |
| 灰阶 | 两版基础对比可读；基线依赖的青/紫/粉差异明显减弱，炼化版仍靠字号、规则、留白和阅读顺序维持层级 | PASS；炼化版不依赖色相承载结构 |
| 安全区 | 基线必要内容位于 64/84/64/96 边界内；炼化版位于 72/88/72/104 边界内，页脚未越过底部安全线 | PASS |
| 产品证据 | 两版都保留 FinHot 导航、“全部动态”选中态和第一组 feed 行，不改变真实 UI 状态 | PASS |
| 来源与免责声明 | 两版均在最终尺寸和灰阶检查中可读，且没有用效果覆盖 | PASS |
| 原创边界 | 两份合同均 `brandImitation: false`；炼化版的证据轨来自内容关系，不是某个品牌的字标、专有字体或完整页面构图 | PASS |

## 证据文件

- `baseline.png`：最终受控基线。
- `distilled.png`：最终炼化帧。
- `comparison.png`：由上述两张最终帧生成的 2-up 对照板。
- `thumbnail-25pct.png`：25% 阅读层级检查。
- `grayscale.png`：去色后的结构检查。

基线只可用于回归对照，不能进入模板或组件库。炼化版满足 0 error / 0 warning、内容真实性、静帧可读性和非仿制边界。

**Decision: APPROVE**
