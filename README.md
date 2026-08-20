# vidio — vibe motion 工作区

这个仓库是我的 **vibe motion** 工作区：把想法说给 AI agent，它组装仓库里的技能帮我实现成片。核心是三件事：**组件化**（可复用组件沉淀在 `library/`）、**自动化**（想法 → 路由 → 制作 → 质检一条链）、**可复用**（每个项目自包含，契约驱动）。

## 用法

直接对 agent 说想法，`vibe-director` 技能会接管全流程：

```text
我想做一个讲「AI 正在改变剪辑行业」的 30 秒竖屏动效视频。
用 video-shotcraft 给我的产品做一支宣传片。
用即梦拍一段金融 agent 帮人做决策的 10 秒。
把这个抖音视频洗一下做成我的口播稿。
继续做 projects/ 里昨天那个项目。
```

## 工作流

```text
想法
 └→ vibe-director（导演兼制片：先读戏，再选引擎）
     ├── 导演读戏（seedance-20 Director's Read：叙事十字段 / 非叙事拒绝编戏）
     ├── 按这场戏需要的画面选引擎，少问多做
     ├── 建项目 projects/<日期-主题>/（brief.md 契约 + 状态流转）
     ├── 查 library/ + video-shotcraft 镜头卡，能复用的直接复用
     ├── 按形态路由技能链：
     │     动效视频    emil-design-eng / animate → rn-motion-director → hyperframes → review-animations
     │     产品宣传片  video-shotcraft（UI 电影感）；生活场景拆给 Seedance
     │     生成影像    seedance-20（即梦/Seedance 提示词包，默认可粘贴不代跑）
     │     数字人口播  rachel-digital-human-production
     │     口播成片    ra-人话/ra-hook/ra-video-title → Kokoro 配音 → 字幕
     │     二创        ra-video-download → 逐字稿 → ra-洗稿 → 制作
     │     实拍混剪    openmontage-adapter（免费 stock 检索 → 拼装 → 质检）
     │     封面图文    rn-cover-skill / editorial-dot-cover / xhs-article-to-images
     ├── 样片门（本地渲 8–10s；付费 API / Seedance 必须等人确认）
     ├── 质检（ffprobe + 关键帧 + Anti-PPT / 读戏载体）
     └── 沉淀：通过质检的可复用片段问一次，进 library/ 登记
```

## 已安装的技能

技能本体**不整树入库**：CLI 安装的技能由 [skills CLI](https://skills.sh/) 管理并锁定在 `skills-lock.json`，在新环境用 `npx skills` 按锁文件恢复到 `.agents/skills/`（`.claude/skills/` 为符号链接）；权威源在 agent-memory 仓与本机技能目录。

| 来源 | 内容 |
| --- | --- |
| 本仓库自有 | `vibe-director` — 总调度：读戏、选引擎、项目契约、组件库 |
| [seedance-20](https://github.com/Emily2040/seedance-2.0) | Seedance 2.0 导演操作系统：Director's Read、提示词编译、序列续拍、即梦/方舟等多表面 |
| [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) | 电影感产品视频：152 张镜头卡、209 个动效预览、Remotion 实现、Ink Press 模板、BGM/SFX 库 |
| [rachel-digital-human-production](https://github.com/Jingyi-Wu-Richael/rachel-digital-human-production) | 数字人口播：MiniMax 声音克隆 + HeyGen 图生视频，15 秒预览门控 |
| [rnskill](https://github.com/Pluviobyte/rnskill)（54 个） | 内容生产全链：选题、洗稿、去 AI 味、配音、数字人、剪辑、字幕、封面、图文、动效导演、dbs 商业诊断 |
| [hyperframes](https://github.com/heygen-com/hyperframes) 全家桶 | HTML 视频合成：字幕、TTS 配音、转场、音频响应动画、网站转视频，及 gsap/animejs/lottie/three/waapi/css-animations/typegpu/tailwind 适配层。负责「怎么渲」，不负责动效手感 |
| [emilkowalski/skills](https://github.com/emilkowalski/skills)（11，MIT） | 动效品味基线（官方源；替换 uitripled 对 `emil-design-eng` / `animation-vocabulary` 的转抄）。成片默认：`emil-design-eng` → `animate` → `review-animations`。点名再用：`improve-animations`、`find-animation-opportunities`、`animation-vocabulary`、`apple-design`。不默认加载：`animate-expo`（RN/Expo）、`ask-sonner`、`pick-ui-library`、`prototype`（本仓是 UI 多版本切换器，会盖住全局那个 prototype skill） |
| 设计工程组（来自 [uitripled](https://github.com/moumen-soliman/uitripled) / [transitions.dev](https://github.com/jakubantalik/transitions.dev)） | `make-interfaces-feel-better`、`transitions-dev`、`transitions-polish` — 演示界面手感、21 个成品 CSS 转场；uitripled 组件库本体按需 clone 用于搭产品演示页 |
| [OpenMontage](https://github.com/calesthio/OpenMontage)（工具供给层） | `openmontage-adapter` — 只取它的 102 个 Python 工具，不用它的调度：实拍素材检索（Pexels/Pixabay）、WhisperX 逐词字幕、豆包/DashScope/Piper 等多家 TTS、免费配乐检索、参考片拆解、场景切分、画质增强、即梦代跑。本体 clone 到 `vendor/openmontage`（不入库，commit 锁在适配器技能里） |

## 目录结构

```text
vidio/
├── .agents/skills/     # 技能本体（按 skills-lock.json 恢复，不整树入库）
├── .claude/            # Claude Code 配置 + 技能符号链接
├── skills-lock.json    # CLI 安装技能的版本锁
├── projects/           # 每个视频项目一个目录（brief.md 契约驱动）
├── library/            # 可复用组件库（见 library/CATALOG.md）
├── studio/             # 本地 GUI 工作台（cd studio && npm install && npm start → localhost:4700）
├── vendor/             # 外部工具供给层（gitignore；OpenMontage 等按 commit 克隆）
├── ops/                # 短视频运营（账号策略、选题脚本、数据复盘，已并入 main）
├── 短视频演讲稿/        # 题材内容母稿（口播 / 分镜 / 短视频组）
├── industry7view-card-lab/  # 图文卡 + Remotion 生产管线
├── docs/               # 系统设计、工作流、术语、剪映清单
└── archive/            # 已完成分镜等归档（勿改）
```

## 运营区快速入口

- 运营：[`ops/README.md`](./ops/README.md)（原 `ops/short-video` 分支内容，已并入 `main`）
- 卡片/渲染：`cd industry7view-card-lab && npm run check`
- Agent 生产说明：[`.claude/CLAUDE.md`](./.claude/CLAUDE.md)

## 约定

- 项目渲染产物（`成片/`、`*.mp4`）不入库；组件库 `library/` 内的成品和技能自带素材例外。
- CLI 管理的技能不手工改动，升级用 `npx skills add`；`vibe-director` 是本仓库自有技能，可直接迭代。
- 部分环节需要 API 凭据（MiniMax / HeyGen / 火山 ASR / TikHub），缺了 agent 会提示去 Cloud Agents Secrets 添加。
