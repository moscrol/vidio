# 科普短视频制作风格：案例优先 + 可选产线

as-of: 2026-07-11  
目的：避免「空洞讲原理」；对齐宝玉式 AI 科普与可用 skill。

---

## 1. 为什么上一条容易「空」

纯卡片念五层定义 = 说明书。观众要的是：

> **有人翻车了 → 我认出自己 → 你给一个能带走的结构**

原理必须挂在**具体案例**上，案例必须可感知（开发现场、一句 AI 胡说、一个错误升级）。

---

## 2. 案例驱动结构（替换纯原理流）

```
0–3s   案例钩子（翻车现场，禁止先背定义）
3–12s  把这句 AI 输出拆开（哪句是事实/解释/预测/权限）
12–22s 抽出通式（五层/第一性）—— 只留 1 张结构图
22–28s 我项目里怎么挡的（1 个落点即可）
28–32s 可复用场景 + 开放问题
```

**硬规则：**

- 前 10 秒不许出现「所谓五层防幻觉是指…」  
- 必须有一句**可复述的错例**（数字对但结论乱升级）  
- 结构名（五层）放在案例之后，当「给错例起的名字」

### 五层防幻觉 · 推荐主案例（来自 tutor 本轮场景）

AI 说：

> 储能成交额 +20%，属于健康分歧，明天会回流，A 是最强标的。

拆法（画面可做成四格打勾/打叉）：

| 句子 | 地位 |
|------|------|
| 成交额 +20% | 可核验事实 |
| 健康分歧 | 解释 |
| 明天回流 | 预测 |
| A 最强 | 选择/建议 |

口播金句：**「数字对了，也不能把后面整段一起升级。」**

这比「生成不是真相」六个字更有戏，两者可并存：标题用金句，正片用拆句。

---

## 3. X / 宝玉式科普里可学的点

### 宝玉（@dotey）

观察其高互动内容（转述 Claude Code / Fable 等）：

| 手法 | 怎么用在我们片里 |
|------|------------------|
| **具体例子打穿概念** | 宝可梦/工具调用：不是空讲「要给工具」，而是「aw 结尾的名字」 |
| **先别人的坑/演讲，再提炼** | 我们：先 AI 胡说现场，再命名五层 |
| **PPT/动画当讲解介质** | 用 PPT 流或 HTML 动画讲结构，不是纯黑底大字 |
| **反面教材也拆** | 只秀工程数字、不讲用户价值会翻车 → 类比「只讲五层名词、不讲你会踩的坑」 |

### 其它常见有效规律（运营向，L2）

- 前 3 秒：**场景/翻车**，不是目录  
- 中间：**信息压缩 + 可操作拆解**  
- 结尾：**可迁移问题**，不是「关注我」  
- 知识科普难在「和现实接榫」；接榫优先于体系完整

---

## 4. vibe-motion 是什么（在我们仓库里）

本机**没有单独安装名为 vibe-motion 的 skill 目录**。  
它是 **deepfomo 样片 README 引用的方法论**：

> HTML/CSS/JS **确定性动画** + `window.seek(t)` + 无头浏览器逐帧截图 + ffmpeg  
> （非 AI 文生视频）

对应资产：

| 路径 | 用途 |
|------|------|
| `vidio` 分支 `deepfomo/*` · `deepfomo-kit` | 问答流式 UI 成片（案例演示极强） |
| `vidio/.agents/skills/hyperframes*` | 同类：HTML 时间线 composition |
| 001 现有 `cards.html` | 静态卡，缺「案例动画」 |

**和空洞卡片的区别：** vibe-motion/deepfomo 让观众**看见过程**（打字、思考、流式结论），原理附着在过程上。

**建议产线：**

1. **案例主片**：deepfomo-kit / HyperFrames 演「一句胡说怎么被拆」或「Agent 如何先证据后结论」  
2. **结构副卡**：1 张五层图（PPT 或 HTML）  
3. **不要**五张全是定义卡

---

## 5. PPT 流 skill（你记得的那个）

本机已找到：

| Skill | 位置 | 特点 |
|-------|------|------|
| **pptx**（Grok） | `~/.grok/skills/pptx/` | 读/写/改 `.pptx`，PptxGenJS 管线 |
| **Presentations**（Codex） | `~/.codex/plugins/cache/openai-primary-runtime/presentations/…/skills/presentations/` | 叙事规则硬要求 + 渲染 slide PNG + 模板库 |
| **baoyu-design**（宝玉） | **已装** `~/.agents/skills/baoyu-design`（软链 Claude/Grok） | HTML 设计/PPT 讲解流、动画、export-as-video / export-as-pptx；`make-a-deck`、`animated-video` 等子技能 |

宝玉套：优先用 **baoyu-design** 做案例讲解 deck / 动画；配图可用其 `generate-images` 或本机 imagine。

**PPT 流适合我们的用法：**

```
口播脚本（案例+拆句）
  → presentations/pptx 出 5～8 页竖屏或横屏讲解幻灯
  → 导出每页 PNG / 录屏翻页
  → 剪映对齐口播
```

比纯大字卡更有「课」的质感，又比 full remotion 便宜。

---

## 6. 推荐组合（针对 001 重做）

| 层级 | 方案 |
|------|------|
| **叙事** | 案例拆句为主，五层为命名 |
| **画面 A（优先）** | PPT 流 6 页：翻车句 → 四格拆解 → 第一性一句 → 五层一图 → 项目落点 → 可复用 |
| **画面 B（加分）** | vibe-motion 式：假 AI 气泡逐字吐出错误长句，再逐段变灰/打标签 |
| **画面 C** | deepfomo 真案例脱敏 UI（金融时必须非投顾角标） |

**不推荐：** 再让 agent 渲五张定义卡拼成片。

---

## 7. 给成片 agent 的交接（更新）

```
不要只做定义卡。
主线：AI 胡说案例拆句（成交额+20%…）→ 再点题「生成不是真相/五层」。
优先：pptx 或 presentations 做讲解页；或 HyperFrames/deepfomo-kit 做过程动画。
参考：ops/douyin/production-style.md + scripts/001-…（口播需按案例优先改写）。
```

### 001 已交付（baoyu-design · 2026-07-11）

| 产物 | 路径 |
|------|------|
| 竖屏 HTML deck（1080×1920 · 6 页 · data-anim） | `designs/ep001-anti-hallucination/index.html` |
| 可编辑 PPTX（含 16 个入场动画 + 口播备注） | `designs/ep001-anti-hallucination/ep001-anti-hallucination.pptx` |
| 剪映用 PNG（@2x · 2160×3840） | `designs/ep001-anti-hallucination/slides/slide-01…06.png` |
| 本地预览 | `python3 -m http.server 4311 --directory designs` → `http://localhost:4311/ep001-anti-hallucination/index.html` |
| 口播脚本 | `ops/douyin/scripts/001-五层防幻觉-生成不是真相.md` |

**成片下一步：** 口播录音 / TTS 对齐时间轴 → 剪映叠 PNG 或 PPT 录屏翻页 → 角标「架构演示 · 非投资建议」全程保留。

---

## 8. 下一步

1. ~~001 口播/分镜案例优先版~~ ✅  
2. ~~baoyu-design 6 页竖屏 deck + PPTX + PNG~~ ✅  
3. 口播/配音 + 剪映时间轴（视频 agent 或本地）  
4. 可选：HyperFrames/deepfomo 做「气泡吐句→打标」过程动画增强
