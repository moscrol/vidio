---
name: vibe-director
description: >-
  vidio 总调度。用户给选题、做视频、做内容、洗稿、数字人、宣传片、动效、即梦或 Seedance 时先走这里：读戏、选车道、建 projects/<日期-slug>/brief.md，再把执行交给对应技能。不要创建 01-内容生产/。
---

# vibe-director

导演兼制片。先读这场戏要什么画面，再选引擎。默认少问多做：能填的默认值写进 `brief.md` 就开工。

车道白名单真本源：[lane-map.json](lane-map.json)。改表后跑 `python3 scripts/check_lane_map.py --write`。

## 默认值（没说就用）

- 画幅 `9:16`，平台抖音，目标 15–30 秒
- 无人出镜（含生成人形）；用户点名才解禁
- 项目目录 `projects/<YYYY-MM-DD>-<slug>/`，日期用 Asia/Shanghai
- 直接制作；只有用户说「先存着」才走选题卡
- Seedance / 即梦：先交可粘贴提示词包，不代跑付费 API
- 样片门：本地先渲 8–10 秒；整片 MP4 和付费 API 等人确认

复制 [templates/brief.md](templates/brief.md) 到项目根，填 frontmatter。可复用件查 `library/CATALOG.md`。

## 读戏

会出画面的请求，先读 `.agents/skills/seedance-20/references/directors-read.md`。

- 叙事（有人在追求/选择/转折）→ 填十字段，再选车道
- 非叙事（说明、抽象动效、产品功能演示）→ 只写 `utility intent` + `non-narrative refusal`，不要编戏
- 本仓库默认多数选题是非叙事动效或产品功能演示

读戏完成的判据：`form` 是 `lane-map.json` 八条之一，且 `engine` / `duration_target_s` 已填。对不上八条形态词就停，不建项目。

## 车道（说什么 → 加载谁）

按用户原话里的形态词选一条，不要并行开两条主链。只加载该车道 `load` 里的技能。

<!-- BEGIN GENERATED: lane-map -->
认不出形态就停，只问一句：这场片子是动效、宣传片、即梦、混剪、数字人、口播、二创，还是封面？

| 形态 | 何时 | 加载 | 不加载 |
| --- | --- | --- | --- |
| 动效视频 | 抽象概念、知识口播动效；用户原话出现「动效」 | `emil-design-eng` → `animate` → `rn-motion-director` → `hyperframes` → `hyperframes-cli` → `review-animations` | `animate-expo` |
| 产品宣传片 | 产品网址 / 截图 / 桌面或网页 App / 「宣传片」 | `promo-film-pipeline` → `video-shotcraft` → `website-to-hyperframes` → `transitions-dev` | 把宣传片做成 PPT 翻卡 |
| 生成影像 | 即梦 / Seedance / 文生视频 / 图生视频 / 首尾帧 | `seedance-20`；用户确认代跑 才加 `openmontage-adapter` | 未确认就打付费 API |
| 实拍混剪 | 真素材 / 纪录片感 / 免费 stock | `openmontage-adapter` | OpenMontage 的 pipeline / Backlot |
| 数字人口播 | 人像 + 口播稿，且用户点名「数字人」 | `rachel-digital-human-production` | `heygen-digital-avatar` |
| 口播成片 | 已有口播录像，或只要配音不要肖像 | `ra-人话` → `ra-local-talking-head-cut` → `hyperframes-media` | `tts-skill` |
| 二创 | 参考视频 URL + 「洗稿」「做成我的」 | `ra-video-wash-pipeline` → `ra-洗稿` → `openmontage-adapter` | 源标题进成片 |
| 封面图文 | 独立图文封面 / 小红书图 / 标题图。成片开幕、成片封面、0:00 字标不算本车道 | `rn-cover-skill` → `editorial-dot-cover` → `skill-cover` → `xhs-article-to-images` | 把成片开幕做成 5:2 编辑图 / 用旁路 PNG 代替成片 t=0 |
<!-- END GENERATED: lane-map -->

用户说「成片封面 / 开幕 / 0:00 字标」时**不要**进封面图文车道。留在本片车道：开幕字标 CSS 默认可见（GSAP 用 `set()`，不要 `fromTo(opacity:0)`），渲完抽 `质检/t0.png`。已经渲完、只想钉死开幕，用 `python3 scripts/pin_opening.py`。

点名 `animation-vocabulary` / `improve-animations` / `apple-design` / `find-animation-opportunities` 才加载。

## 硬覆盖

这些覆盖一切上游技能：

1. 项目落在 `projects/`，组件落在 `library/`
2. 本机已有 IndexTTS2 和参考 WAV 才加载 `tts-skill`
3. 用户给了自己的 Twin id 才加载 `heygen-digital-avatar`
4. OpenMontage 只当工具箱，见 `openmontage-adapter`
5. 金融向内容不荐股；演示片保留「不构成投资建议」
6. 成片 `*.mp4` 不入库
7. 不加载 `ra-video-production-director`（它会建 `01-内容生产/`）

## 开工步骤

1. 读戏，把用户原话对上白名单一条。完成：`form` 已定且在 `lane-map.json`。对不上就停，只问一句形态。
2. `mkdir` 项目，写入 `brief.md`（status: 制作中）。完成：目录里有 brief、`assets/`、`工程/`、`质检/`。
3. 查 `library/` 能复用的先复用；宣传片逐步走 `promo-film-pipeline` 九步。
4. 只加载该车道 `load` 里的技能。动效车道的曲线/时长以 `animate` 为准，HyperFrames 只负责渲。
5. 样片门：`npx hyperframes lint` → `inspect` → 本地 8–10 秒 render。付费 API 先问。
6. 质检：ffprobe 画幅/时长、无人出镜、Anti-PPT（字不是主载体）、brief 合规、**`python3 scripts/check_opening_frame.py <成片.mp4> --out 质检/t0.png` 后人检开幕字标已落定**。完成：`质检/` 有记录且有 `t0.png`。
7. 用户认可后再问一次是否沉淀进 `library/`。复制 [templates/manifest.json](templates/manifest.json)。

## Seedance

细节见 [references/seedance-adapter.md](references/seedance-adapter.md)。默认输出提示词包，不代跑。
