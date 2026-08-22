---
status: 待制作
form: 动效视频
platform: 抖音
ratio: "9:16"
duration_target_s: 30
fps: 30
engine: hyperframes
voice: none
audience: 待填写
primary_lane: motion-composition
facts_status: 待核验
---

# 一句话

用一句话写清观众、内容变化和最终收益。

# 事实与来源

| Claim | Source | Status |
| --- | --- | --- |
| 待填写 | 待填写 | 待核验 |

# 导演读戏

- 观众进入画面前知道什么：
- 结束时应理解或感到什么：
- 叙事冲突或 utility intent：
- 禁止编造或不得出现：

# 视觉与声音约束

- 人物：默认无人出镜
- 视觉人格：
- 字幕与安全区：
- 声音、节拍或静音理由：

# 分镜与引擎

| # | Time | Purpose | Visual | Engine |
| ---: | --- | --- | --- | --- |
| 1 | 0–8s | orient | 待填写 | hyperframes |

# 项目路径

- 素材：`assets/`
- 工程：`工程/`
- 成片：`成片/`（不入 Git）
- 质检：`质检/`
- 参考简报：`工程/<variant>/reference-brief.md`
- 设计词汇：`工程/<variant>/design-vocabulary.json`
- 动效契约：`工程/<variant>/motion-contract.json`

# 验收

- 规格：比例、分辨率、帧率、时长与编码正确。
- 内容：所有事实可追溯，演示数据已标注。
- 设计语言：两份语言产物同目录，linter verdict 为 `APPROVE`（0 errors）；warnings 已逐条交给下游。
- 动效：contract 0 errors，渲染检查通过，人工 verdict 为 `APPROVE`。
- 画面：手机尺寸可读，无裁切、重叠、溢出或未授权人物。
