# 车道白名单（生成文件）

真本源是同目录 `lane-map.json`。改 JSON 后跑 `python3 scripts/check_lane_map.py --write`。不要手改本文件。

认不出八条形态词：`fail_closed`。只问：这场片子是动效、宣传片、即梦、混剪、数字人、口播、二创，还是封面？

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

## 点名才加载

`animation-vocabulary`, `improve-animations`, `apple-design`, `find-animation-opportunities`
