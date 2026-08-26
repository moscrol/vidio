---
name: promo-film-pipeline
description: >-
  产品宣传片九步管线。用户要宣传片、产品网址/截图成片、电影感产品视频时使用。在 vibe-director 选中「产品宣传片」车道之后执行；逐步走完事实→结构→底座→融合→转场→摄影→排版→声音→验收沉淀。
---

# promo-film-pipeline

把一个真产品做成一支能当电影看的竖屏宣传片。骨架用 `video-shotcraft` 的 promo-energy-arc（压印 → 单主角真 UI → 功能爬升 → 合影/收束 → CTA）。画面执行默认 HyperFrames。

每步结束要有可检查的产物，再进入下一步。组件是配工具包，不是主干；先定结构再插 `library/`。

## 九步

| # | 层 | 这一步完成的样子 | 可插组件 |
| --- | --- | --- | --- |
| 1 | 事实 | `assets/` 里是真截图/真产品事实；不荐股、不编数据 | — |
| 2 | 结构 | 分镜表写出压印→单主角→爬升→收束→CTA，切点有秒数 | video-shotcraft 镜头卡 |
| 3 | 底座 | 全片一套底（纸底或玻璃），不是每镜换皮肤 | `library/视频背景/做旧纸张-毛玻璃` 或 `aurora-玻璃质感` |
| 4 | 融合 | 真 UI 读作这个世界里的物件，不是贴上去的矩形 | `library/组件/真实UI-手账贴图` |
| 5 | 转场 | 全片一种转场语言 | `transitions-dev`；不要每切一镜换招 |
| 6 | 摄影 | 有运镜/景深/前景，不像 PPT | `library/镜头/电影摄影层` |
| 7 | 排版 | 字有声部（铺垫/关键词/角签），字不是主载体 | `library/组件/手绘圈注` |
| 8 | 声音 | 切点钉鼓点；有响度账 | `library/音效包/宣传片SFX钉帧` |
| 9 | 验收沉淀 | ffprobe + 关键帧 + **`质检/t0.png` 开幕落定**；用户认可的片段问一次再进 `library/` | vibe-director 的 manifest 模板 |

## 硬门槛

- 无人出镜，除非用户点名
- 真 UI 要标「真实界面」；金融向加「不构成投资建议」
- 样片门：lint → inspect → 8–10s，再整片 render
- 整片渲完必须 `python3 scripts/check_opening_frame.py <成片.mp4> --out 质检/t0.png`，人检字标已落定。空纸 / 淡入中 = 未过门
- 开幕字标 CSS 默认可见；GSAP 用 `set()` 钉住，不要 `fromTo(opacity:0)`
- 已经渲完、只想把 t=T 的落定帧铺回片头：`python3 scripts/pin_opening.py --input <成片.mp4> --at T --output <新成片.mp4>`（补救，不是正解）
- 不要用 `ra-video-production-director`

## 执行

1. 从 vibe-director 的 brief 读 `form: 产品宣传片`。没有 brief 就先回到导演。
2. 按表 1→9 做。某层已有 library 组件就复用，不要重做一套平行视觉。
3. 采集网页用 `website-to-hyperframes`。镜头词汇用 `video-shotcraft/references/shots/`。
4. 手感（曲线、时长、该不该动）问 `emil-design-eng` / `animate` / `review-animations`。
