# Emil 动效品味炼化设计

## 背景

`feat/emilkowalski-skills` 当前把 `emilkowalski/skills` 的 11 个 skill 原文提交到了 `.agents/skills/`，总计约 3600 行。内容与上游一致，但没有回答 vidio 真正需要的问题：这些面向交互 UI 的规则，如何约束固定时间轴的视频、如何进入导演路由、如何被机检、以及怎样证明它改变了成片。

这也与仓库现有红线冲突：跨仓 skill 应锁定来源，不应整树 vendor。另一个已确认的缺口是，`AGENTS.md`、`README.md`、项目模板和 Studio 都引用 `.agents/skills/vibe-director/SKILL.md`，但该文件在本地 Gitea 的所有 vidio 分支与 agent-memory 中均不存在。

本次不做“安装上游 skill”，而是把上游的判断框架炼成 vidio 自己可执行、可验证、可升级的动效品味层。

## 目标

1. 建立仓库自有的 `vibe-motion-taste` 深模块，负责“为什么动、怎么动、何时停、如何审”。
2. 用结构化 `motion-contract.json` 把导演判断传给 HyperFrames / GSAP；渲染器只负责执行。
3. 建立混合门：客观违规自动失败，主观手感进入人工复核。
4. 恢复最小但完整的 `vibe-director` 路由接口，使仓库现有说明不再指向不存在的文件。
5. 用 FinHot 真实 UI 素材制作一组同内容、同长度的 8 秒基线版与炼化版，证明规则对成片有可见影响。
6. 保留上游来源、commit 和 MIT 许可证；移除仓内上游正文副本。

## 非目标

- 不重写 HyperFrames、GSAP 或 Remotion 的上游 skill。
- 不把 Emil 的交互 UI 时长表机械套到视频。
- 不修改已经验收的 FinHot v12 主片。
- 不迁移全部历史工程。
- 不纳入与视频无关的 `write-swift`、Sonner、UI 组件选型、Expo 手势与 UI picker 流程。
- 不把主观“高级感”伪装成全自动分数。

## 上游基线与取舍

审计基线：`https://github.com/emilkowalski/skills`，commit `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7`（2026-08-21）。

| 上游内容 | 本次吸收 | 处理方式 |
| --- | --- | --- |
| `emil-design-eng` | 动效目的、物理来源、曲线、性能、慢放复核 | 翻译为视频原则与人工复核表 |
| `animate` | 先判断是否该动，再选目的、属性、曲线、时长 | 变成 motion contract 生成顺序 |
| `review-animations` | 严格审查姿态、阻断与批准标准 | 拆成自动硬门与人工 verdict |
| `find-animation-opportunities` | 先拒绝无意义动效 | 改成“镜头里哪些信息不应动”的动静预算 |
| `improve-animations` | 先盘点、再分级、最后写修复计划 | 用于已有样片的差分审计 |
| `animation-vocabulary` | 统一术语 | 只保留视频有用的进退场、节拍、空间、连续性词汇 |
| `apple-design` | 空间连续性、速度继承、材质层级 | 只吸收适用于镜头与物件运动的部分 |
| `animate-expo` | 手势、触觉、JS/UI thread | 排除；固定视频无对应交互 |
| `ask-sonner` / `pick-ui-library` / `prototype` | 特定 UI 工具与工作流 | 排除 |
| `write-swift` | Swift 工程规范 | 排除 |

上游只作为知识来源，不成为运行时依赖。仓库保存来源说明与 MIT 许可证；未来升级通过旧、新 commit 差分重新评估，不覆盖 vidio 自有规则。

## 选择的架构

采用“独立品味契约”，而不是把规则塞进导演文档或分散修改渲染器。

```text
Emil source + pinned commit
            │  翻译，不复制
            ▼
    vibe-motion-taste
      ├─ motion language
      ├─ motion contract schema/template
      ├─ hard-gate linter
      └─ human review rubric
            │
            ▼
       vibe-director
      brief → motion-contract.json
            │
            ▼
 HyperFrames / GSAP / Remotion
            │
            ▼
   lint → render → frame review
```

边界如下：

- `vibe-director` 决定视频形态、叙事和引擎，并要求动效项目先产出 contract。
- `vibe-motion-taste` 决定动效目的、节拍、空间路径、曲线族、动静分配和审查方法。
- 渲染器消费决定，不重新发明品味规则。
- 项目自己的 `brief.md` 和 `motion-contract.json` 是事实源；skill 正文不是项目状态库。

## 从 UI 规则到视频规则的翻译

### 1. “使用频率”改为“画面重复频率”

交互 UI 的“每天出现 100 次就不要动画”不适用于成片。视频用以下问题替代：

- 这个动作在一条片里重复多少次？
- 它是主叙事动作、辅助连续性，还是常驻环境运动？
- 观众是否需要读字或判断数据？

重复动作越多，幅度和时长越小；常驻环境运动不能争夺主焦点；读数与字幕在信息进入可读状态后保持稳定。

### 2. 动效目的改为视频六类

每个 motion beat 必须选择一个主目的：

- `orient`：建立空间或镜头关系。
- `explain`：演示机制、流程或因果。
- `emphasize`：把注意力收束到一个事实。
- `bridge`：连接两个场景，避免无理由跳变。
- `confirm`：让前一动作得到视觉回应。
- `delight`：只用于低频高价值时刻，并写明克制理由。

无法归类的运动删除。

### 3. UI 毫秒表改为 30fps 节拍带

固定视频以帧为真源，毫秒只作显示：

| 运动角色 | 建议帧数 | 30fps 时长 | 用途 |
| --- | ---: | ---: | --- |
| 微强调 | 4–8f | 133–267ms | 勾选、下划线、轻反馈 |
| 进场 / 退场 | 8–15f | 267–500ms | 标题、标签、物件 |
| 解释性位移 | 12–24f | 400–800ms | 聚合、筛选、因果演示 |
| 镜头运动 | 24–90f | 0.8–3s | 推近、横移、景深变化 |
| 信息停留 | 按阅读量计算 | 通常 ≥ 24f | 字幕、数字、结论 |

超出建议带不是自动错误，但 contract 必须写 `timingReason`。

### 4. 曲线和物理性

- 进入、离开默认强 `ease-out`；禁止用 `ease-in` 延迟观众第一感知。
- 画面内移动与镜头重构用 `ease-in-out`。
- 进度、扫描、跑马灯使用 `linear`。
- 只有物件具有明确惯性或弹性时才用 spring / back；数据卡片不因“更活泼”而弹跳。
- 进退方向保持空间一致；硬切必须有叙事或节拍理由。
- 禁止 `scale(0)` 进场；需要缩放时从接近完整形态开始并配合 opacity。

### 5. 性能规则改为“预览流畅 + 渲染确定性”

- 高频逐帧运动优先 `transform`、`opacity`、必要时 `clip-path`。
- 连续动画布局属性、父级 CSS 变量驱动整棵子树、非确定性计时器进入警告。
- 离线渲染允许少量昂贵视觉效果，但必须在目标分辨率通过 lint、inspect 和关键帧复核。
- 不把交互端 `prefers-reduced-motion` 当固定视频硬门；改为运动安全、闪烁风险和“信息不能只靠运动表达”的人工检查。

## Motion Contract

每个动效工程根目录放置 `motion-contract.json`，版本从 `1` 开始。核心结构：

```json
{
  "version": 1,
  "composition": {
    "id": "finhot-motion-taste-proof",
    "fps": 30,
    "durationFrames": 240,
    "personality": "crisp-editorial",
    "primaryAudience": "mobile"
  },
  "beats": [
    {
      "id": "aggregate-sources",
      "range": [12, 78],
      "purpose": "explain",
      "focus": "source chips converge into the feed",
      "entry": {
        "properties": ["transform", "opacity"],
        "easing": "ease-out-strong",
        "durationFrames": 10,
        "fromScale": 0.95
      },
      "holdFrames": 28,
      "exit": { "mode": "bridge-to-next-scene" },
      "timingReason": "five sources must read as one causal sequence"
    }
  ]
}
```

契约描述意图和可审查事实，不复制渲染器代码。具体选择器和 GSAP 语句仍留在 composition 内。

## 混合门

### 自动硬失败

`lint-motion-contract.mjs` 对以下问题返回非零：

1. JSON 无效、版本不支持、必填字段缺失。
2. fps、总帧数或 beat 时间范围非法、越界。
3. beat 没有六类目的之一，或 `delight` 没有理由。
4. 进场使用 `ease-in`。
5. 进场 `fromScale < 0.9`，包括 `scale(0)`。
6. 短暂元素既无 exit，也未声明跨场景保留。
7. 超出节拍带却没有 `timingReason`。

### 自动警告

警告不阻止渲染，但必须进入 QC 报告：

- 连续动画布局属性。
- 同一时间有多个高显著性主动作。
- stagger 小于 1 帧或大于 3 帧且无理由。
- 镜头运动后没有稳定停留。
- 长时间静态卡片仅靠文字承载，可能触发 Anti-PPT。
- 多个场景重复同一进场套路。

### 人工复核

人工复核只回答机器不能可靠回答的问题：

- 一眼能否识别单一主焦点。
- 运动是否解释内容，而非给静态 PPT 加装饰。
- 进退方向、遮挡与切点是否连续。
- 字幕与数据在手机尺寸、1×速度下是否可读。
- 动效人格是否符合金融产品的克制、可信与清晰。
- 声音存在时，动作落点是否与节拍和因果同步。

输出明确 verdict：`BLOCK` 或 `APPROVE`，并列出证据帧与修复项。

## 导演路由修复

新增仓库自有 `.agents/skills/vibe-director/`，只恢复已经在 README、AGENTS、Studio 和项目文档中承诺的接口：

- 读 `brief.md`；没有则从模板创建。
- 按动效视频、产品宣传片、生成影像、数字人口播、口播成片、二创、实拍混剪、封面图文八条车道路由。
- 动效或含合成动效的车道必须加载 `vibe-motion-taste` 并生成 contract。
- 先样片、后全片；付费 API 仍需用户确认。
- 通过 QC 后才允许登记 `library/`。

同时补齐被现有文档引用的 `templates/brief.md` 与 `templates/manifest.json`。不在本次重造任何外部 skill 的实现。

## 8 秒 FinHot 证明项目

新建 `projects/2026-08-22-finhot-motion-taste-proof/`，不修改已验收的 `2026-08-13-finance-agent-promo`。

证明项目使用现有 FinHot 桌面与移动端真实 UI，制作两个 1080×1920、30fps、8 秒、无音频 composition：

- `baseline`：保留当前“卡片依次飞入 + 持续推近 + 硬切”的主要运动语法，只把时长统一到 8 秒。
- `distilled`：先建立空间、再解释聚合、稳定读字、用同一视觉因果桥接到排序结果；减少并发主动作，去掉无目的弹跳，给镜头运动明确 settle。

两版内容、素材、文案、配色和总时长相同，只改变 motion contract 与时间轴。这样差异可归因于品味层，而不是换设计。

交付证据：

- 两份 `motion-contract.json`。
- linter 输出。
- 两版各 4 张同时间点关键帧。
- 并排帧板与简短 QC verdict。
- 本地渲染的两个 mp4 作为工作区输出，不提交 Git。

## 文件变化

新增：

- `.agents/skills/vibe-motion-taste/SKILL.md`
- `.agents/skills/vibe-motion-taste/references/motion-language.md`
- `.agents/skills/vibe-motion-taste/references/review-rubric.md`
- `.agents/skills/vibe-motion-taste/schemas/motion-contract.schema.json`
- `.agents/skills/vibe-motion-taste/templates/motion-contract.json`
- `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.mjs`
- `.agents/skills/vibe-motion-taste/scripts/lint-motion-contract.test.mjs`
- `.agents/skills/vibe-director/SKILL.md`
- `.agents/skills/vibe-director/templates/brief.md`
- `.agents/skills/vibe-director/templates/manifest.json`
- `docs/sources/emilkowalski-skills.md`
- `third_party/licenses/emilkowalski-skills-MIT.txt`
- `projects/2026-08-22-finhot-motion-taste-proof/`

修改：

- `AGENTS.md`
- `README.md`
- `.cursor/rules/vibe-motion.mdc`
- `skills-lock.json`

移除：

- 当前分支新增的 11 个 Emil 上游 skill 正文目录。
- 当前分支新增的对应 `.claude/skills/*` 符号链接。
- `skills-lock.json` 中不再作为运行时依赖的 Emil skill 项。

## 错误处理

- contract 无效时不启动渲染，并输出 JSON path、规则编号和修复建议。
- 只有 warning 时允许渲染，但 QC 报告必须列出 warning，不得静默吞掉。
- 缺少 HyperFrames CLI 或浏览器依赖时，contract linter 与单元测试仍能独立运行；渲染步骤给出可重跑命令。
- 上游 commit 不可访问时使用已记录 commit，不猜测最新内容。
- 样片渲染失败不回退成“只交文档”；先换本地可用的 HyperFrames 调用方式并保留失败证据。

## 验收

### 结构

- 仓库不再提交 Emil 11 个 skill 的正文副本。
- 所有仓内文档引用的 `vibe-director` 与模板真实存在。
- 来源文档记录 URL、commit、取舍和 MIT 许可证路径。

### 自动化

- linter 的有效、缺目的、`ease-in`、`scale(0)`、越界与 warning 测试全部通过。
- baseline 与 distilled contract 均可解析；baseline 允许产生 warning，distilled 必须 0 error。
- HyperFrames lint、validate、inspect 对两版 composition 通过。

### 视觉

- 两版内容和时长一致。
- distilled 版每一段只有一个主焦点，文字有稳定阅读窗口。
- 聚合到排序的转场具有明确空间或因果连续性。
- distilled 版没有无理由弹跳、`scale(0)`、全场同时入场或长时间静态卡片。
- 关键帧在 1080×1920 下无裁切、重叠和溢出。

### 版本控制

- 设计、计划、实现和验证以增量提交落在 `feat/emilkowalski-skills`。
- 不改写现有分支历史，不触碰用户其他工作副本的未跟踪文件。
- 验证完成后推送到本机 Gitea；不自动合并 `main`。
