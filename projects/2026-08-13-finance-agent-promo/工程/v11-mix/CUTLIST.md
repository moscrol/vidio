# v11 混剪 · 剪接表

utility intent：同一条「过载 → 接管 → 带来源的结论 → 对比聊天机器人 → CTA」骨架，用六种已渲风格硬切，证明风格可以换、戏不能散。

non-narrative refusal：不编新剧情、不加旁白、不在画面上打版本号。

**切点钉真实鼓点（R7，video-shotcraft music-beat-sync 方法论）**：`npx hyperframes beats` 测得
tonight-hiphop 非机器鼓点（网格残差 ±733ms），按「稀疏重音钉真实瞬态」处理。10.002 / 16.002 /
22.002 / 30.002 本就在拍上；5.0 与 27.0 卡半拍，切点移到真实瞬态 **5.145 / 26.859**。节拍存档
`beats/shared/bgm/tonight-hiphop.mp3.json`。

例外窗口（非 A 卷对齐）：

- **v07**：取 **17.4–23.4**——两次竖推之间的完整 6 秒（23.6 带 0.2s 推屏污染，17.8 开头 0.5s 近黑场）。
- **v08**：取 **6.543–11.4**——段尾停在 K2「超过极限」满构图（f299 验证），K1→K2 纸片抛掷收进段中；7–12 的旧窗口段尾是 K3 空场（内容 12.1s 才进场）。

| 成片 | 时长 | 源片 | 源码 | 这句戏 |
| --- | --- | --- | --- | --- |
| 0–5.145 | 5.1s | v02 bw-kinetic | 0–5.145 | 钩子：研报看不完 / 靠感觉 |
| 5.145–10.002 | 4.9s | v08 collage | 6.543–11.4 | 信息洪流（K2 极限镜） |
| 10.002–16.002 | 6s | finhot-demo | 0–6 | **真实 UI**：聚成一条流 → 高信号浮上来 |
| 16.002–22.002 | 6s | v07 dataviz | 17.4–23.4 | 带来源的结论 |
| 22.002–26.859 | 4.9s | v01 aurora-glass | 22.002–26.859 | 一堆 App 来回刷 vs FinHot |
| 26.859–30.0 | 3.1s | v10 velvet | 26.859–30 | CTA + 免责声明 |

音频（sound-design 方法论，SFX 钉帧全按素材**内部峰值**对齐）：

- BGM tonight-hiphop 0–30s · volume 0.38 · 1s 淡入 / 1.7s 淡出
- 切点 whoosh：`whoosh-fast`(峰值@0.721s) 钉 5.145 / 10.002 / 22.002，`swoosh-quick` 钉 16.002
- 10.002 产品入场加 `impact-zoom-quick`（0.40）
- 收束三拍：`riser-cine` 22.002 起铺满 VS 段 → `impact-deep-whoosh` 峰值钉 26.859（0.72，全片最响钉点）→ `sparkle` 28.05 余韵（轻素材提到 0.90）
- `swoosh-quick` 13.202 对应 finhot-demo 段内桌面→手机硬切
- 回测：五个切点窗口峰值全部高于 BGM 底（−4.2～−0.6dB vs 底 −5.5dB）；全片 max −0.6dB 无削波

切点工艺：除第一段外每段开头 4–6 帧 `rgbashift`；五个切点各叠 3 帧白闪；10.002 进 v06 位移略大。

角标遮盖（混剪不打版本号；DEMO / 免责声明保留）：

- v02 段：右上 `V02 · B/W`（仅 B1，t<3.42）画 `#0D0D0C` 块
- v10 段：左下 `V10 · VELVET` 用 delogo 抹掉，右侧「不构成投资建议」不动
- v08 改窗后脚标是 `OVERLOAD`，不再闪 `V08 · COLLAGE`

Studio 混剪台与 `assemble.sh` 都以本文件末尾 `edl` 块为真源。重跑：源片更新后，在本目录执行 `bash assemble.sh`。

```edl
bgm tonight-hiphop.mp3
volume 0.38
seg v02-bw-kinetic.mp4 0 5.145 钩子：研报看不完
seg v08-collage.mp4 6.543 11.4 信息洪流
seg finhot-demo.mp4 0 6 真实UI：聚成一条流，高信号浮上来
seg v07-dataviz.mp4 17.4 23.4 带来源的结论
seg v01-aurora-glass.mp4 22.002 26.859 一堆App来回刷 vs FinHot
seg v10-velvet.mp4 26.859 30 CTA + 免责声明
cover v02-bw-kinetic.mp4 760 28 280 52 #0D0D0C lt(t,3.42)
cover v10-velvet.mp4 60 1828 400 58 #07100C
```

注：GUI 混剪台读上表出无 SFX 的基础版；带 SFX 钉帧的正式版由 `assemble.sh` 出（SFX 表以脚本为真源）。
