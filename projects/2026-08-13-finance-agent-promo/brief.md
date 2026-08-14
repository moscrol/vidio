---
status: 已完成          # v12-finhot-film 用户认可（R14 后「这版做的不错」）；组件已沉淀 library/
form: 产品宣传片
platform: 抖音
ratio: "9:16"
duration_target_s: 30
engine: mixed           # v11 混剪：ffmpeg 硬切已渲成片；单版仍是 hyperframes
voice: none             # 本轮无配音；用户提供音色样本后可换 minimax-clone
caption_style: hyperframes
reuse:
  - library/视频背景/aurora-玻璃质感
  - library/组件/打字机命令行
  - library/组件/任务清单打勾
  - library/组件/手绘圈注
  - library/视频背景/做旧纸张-毛玻璃      # v12 沉淀
  - library/组件/真实UI-手账贴图          # v12 沉淀
  - library/镜头/电影摄影层               # v12 沉淀
  - library/镜头/发布会合影收场           # v12 沉淀
  - library/音效包/宣传片SFX钉帧          # v11/v12 沉淀
---

# 主推成片（R9–R16：v12 单一视觉系统，已验收）

`成片/v12-finhot-film.mp4` · 工程 `工程/finhot-film/`（分镜表 design.md + 声音层 sound.sh）。
按 video-shotcraft promo-energy-arc 骨架：品牌压印 → 真 UI 单主角 → 聚/滤/查功能爬升（呼吸字卡）→ 发布会合影 → CTA。全片一套做旧纸张 + 烧橙 + 毛玻璃、一种竖推转场、切点踩鼓点。v11 混剪降级为风格拼盘存档。R16 总检见 `质检/QC.md`，证据帧 `质检/v12/r16/`。

# 产品定稿（R8：FinHot，用户真产品）

- **产品：FinHot**（[github.com/linxiaoqi5111-del/finhot](https://github.com/linxiaoqi5111-del/finhot)）——本地优先的金融信息流阅读器：**聚**（RSS/微博/雪球/公众号/X 一条时间线）→ **滤**（质量打分，弱信号下沉）→ **懂**（AI 摘要+中译，BYOK）→ **查**（公告/互动易/问询函回源头）。**明确不荐股**——与片尾「不构成投资建议」天然一致。
- **真实 UI 已取材**：`assets/finhot/`（在线站 finhot.industry7view.com/public 移动 1080×1920 + 桌面 1440×1800 截屏，repo 自带 timeline/entry-detail）。混剪 10–16s 段已换成真 UI 2.5D 运镜（`工程/finhot-demo/`），HUD 标「真实界面 · 内容来自公开信源」。
- 叙事从「问答 agent」校准为「信息分层」：VS 镜改「一堆 App 来回刷 vs FinHot」，v07 旗标镜改「先看源头，再看热闹」，CTA 副文案改「开源 · 本地优先 · 数据在你自己机器上」。
- 混剪可见四版（v02/v07/v01/v10）+ 新段已全部 FinHot 化并重渲；**v03/v04/v05/v06/v08/v09 工程仍是问盘/agent 叙事**——定风格后再统一改渲。
- 早期「问盘 WENPAN」是 agent 代拟工作名（R6），已被真产品名取代。

# 十版风格候选（画廊存档，已关闭）

产品名已定为 **FinHot**；主推成片是 v12，不再等「问盘」认可。十版 + v11 混剪留作风格拼盘。

成片：`成片/v01`–`v10` + **`成片/v11-mix.mp4` 混剪试刀** + **`成片/v12-finhot-film.mp4` 主推**（本地，不入库）· 工程：`工程/demo` + `工程/v02`–`v10` + `工程/v11-mix` + `工程/finhot-film` · 质检：`质检/QC.md` + `质检/v12/r16/`。

规格：1080×1920 · 30s · 30fps · H.264+AAC · 无配音 · 无人出镜 · DEMO 标注 · 末帧钉住 CTA 与「不构成投资建议」。
v01 加厚五处动效；十版末镜淡出已清零。OpenMontage 以工具供给层接入，调度仍是 vibe-director。

v11 混剪：同一条脚本硬切 v02→v08→v06→v07→v01→v10（剪接表 `工程/v11-mix/CUTLIST.md` 的 `edl` 块是真源，重跑 `bash assemble.sh`）。v08 取源 **7–12s** 避免与钩子同句；角标用 drawbox 盖掉。源片音轨丢掉，全片 tonight-hiphop。

本项目 status = 已完成。画廊 v03–v09 仍是问盘/agent 旧叙事，不挡 v12 交付。

| 版本 | 风格 | 特色组件 | BGM |
| --- | --- | --- | --- |
| v01 aurora-glass | uitripled 玻璃拟态 | aurora 背景、玻璃卡片、光标犹豫 | tech-house |
| v02 bw-kinetic | 黑白打字机大字 | 滑块硬切、词墙、盖章、跑马灯 | tonight-hiphop |
| v03 swiss-grid | 瑞士网格浅色 | 计数器、柱状图、方框勾选表单 | house-vibez |
| v04 terminal | 终端 CRT 绿字 | 命令打字、日志流、报告框、扫描线 | tech-house |
| v05 editorial | 暖纸杂志编辑部 | 报头、印章、剪报卡、目录点线、脚注 | cat-walk |
| v06 dark-saas | 暗紫 SaaS 设备壳 | 手机壳、通知堆叠、进度环、数据吸入 | g-eazy |
| v07 dataviz | 深海军数据剧场 | 折线绘制、环形图、甘特、证据旗标 | house-vibez |
| v08 collage | 牛皮纸拼贴手账 | 胶带贴纸、手绘圈、彩色便签、涂鸦箭头 | cat-walk |
| v09 blueprint | 工程蓝图线稿 | 图签、尺寸标注、系统图、超限阴影区 | tech-house |
| v10 velvet | 墨绿香槟金奢华 | 罗马数字、徽章双环、光扫掠、雕刻列表 | g-eazy |
| v11 mix | 六版硬切混剪 | v02钩子→v08洪流→v06设备→v07结论→v01对比→v10 CTA | tonight-hiphop |

成片在 `成片/v*.mp4`（本地，不入库）；质检帧在 `质检/v*/`；工程在 `工程/v*/`。
已沉淀 9 个组件进 `library/`（见 CATALOG.md）；宣传片工作流技能 `promo-film-pipeline`。

# Demo v0.1（已交付，待确认）

- 成片：`成片/finance-agent-promo-demo-v0.mp4`（1080×1920 · 30s · 30fps · H.264 + BGM）
- 工程：`工程/demo/`（HyperFrames，全片六镜均为 HTML 合成；无配音，金句字幕承载叙事）
- v0.1 质感：按 uitripled 视觉语言重制——aurora 多层色块（蓝紫青氛围）+ 噪点颗粒 +
  晕影 + 玻璃卡片（backdrop-blur + 1px 高光描边），金色保持唯一焦点强调色
- 质检：`质检/frame-*.png` 六帧全查——字体正常、无人出镜、光标悬停「确认下单」成立、字幕不压内容
- BGM：video-shotcraft 资产库 bgm-tech-house（Mixkit 免费商用）
- 占位待换：产品名（brand-chip）、指令示例、任务清单文案、结论三条、用时数字

# 一句话

宣传用户自己的金融 agent：30 秒抖音竖屏，让目标用户在 5 秒内认出自己的痛，
在 20 秒内看懂这个 agent 替他干了什么活。

# 导演读戏

**整片定位**：混合车道，**全片无人出镜**（用户偏好，硬约束）。开场钩子是
叙事（被信息量压垮的瞬间——由屏幕、光标、物件承载，人不入画）；
产品演示是非叙事（utility intent：证明"一句指令 → 自动跑完 → 给带来源的结论"）。

**镜头 1（叙事，Seedance）**——读戏记录在 `工程/seedance/clips/clip-01.md`。

**镜头 3-4（非叙事）**：
- utility intent：让观众看见 agent 接到指令后自己翻数据、对比、产出一页带
  来源的结论，全程不需要人追问。
- non-narrative refusal：不给 agent 编人格、不演"AI 觉醒"、不加剧情反转；
  界面演示不出现编造的收益率、荐股结论、客户名。

# 脚本 v1（口播，约 140 字 ≈ 30 秒；【】内待用户补事实）

1. （钩子·现象前置）每天盯盘好几个小时，研报堆到看不完，真正做决定那一刻，
   还是靠感觉。
2. （情绪）信息量早就超过一个人能处理的极限了。
3. （出场）我做了一个金融 agent，把这些活交给机器。
4. （演示）打开它，说一句【真实指令示例，如：帮我查一下今天XX板块异动的原因】，
   它自己去翻【数据源：财报/公告/研报/行情】，两分钟给你一页结论，
   每个判断后面都跟着来源。
5. （差异）它和聊天机器人的区别是：不等你一句句追问，自己把活干完。
6. （CTA）评论区说一个你最想让它盯的事，我拿真实数据跑给你看。

> 脚本已按 ra-人话 硬禁令自查：无"不是A而是B"壳、无命令式模板开头、
> 无冒号讲义腔。第 4 步的能力描述**必须**换成产品真实能力，不得保留想象。

# 分镜（逐镜 engine）

全片无人出镜；镜头 1 的压力由光标悬停又移开、窗口堆叠、凉茶便签承载。

| # | 时间 | 画面 | engine |
| --- | --- | --- | --- |
| 1 | 0–4s | 深夜无人书房，屏幕信息越滚越快，光标在「确认」上悬停又移开 | seedance |
| 2 | 4–8s | 信息洪流可视化：K线、快讯、研报碎片涌来把画面填满，一句字幕压住 | hyperframes |
| 3 | 8–16s | 产品演示：输入一句指令 → agent 自动拆任务/翻数据（真实 UI 优先；无 UI 则用 uitripled 搭演示页再运镜） | remotion（video-shotcraft） |
| 4 | 16–22s | 结果特写：一页结论逐条亮起，来源标注放大 | 同上 |
| 5 | 22–27s | 差异对比：左边聊天框等人追问，右边 agent 任务列表自己跑完 | hyperframes（转场可用 transitions-dev 片段） |
| 6 | 27–30s | 产品名 + slogan + CTA 字卡 | hyperframes |

# 参考

- 镜头 2/5 可复用 video-shotcraft 镜头卡的数据流/分屏词汇（制作时检索）。
- 暂无竞品参考链接。

# 待用户补的事实（R8 已补齐；配音仍可选）

1. ~~产品名 + 一句话定位~~ → **FinHot**，本地优先的金融信息流阅读器（聚/滤/懂/查，不荐股）
2. ~~真实指令 / 执行过程~~ → 叙事改为信息分层，不再用问答 agent 指令
3. ~~可展示界面~~ → `assets/finhot/`（finhot.industry7view.com/public + repo 截图）
4. ~~合规红线~~ → 片尾钉「演示画面 · 不构成投资建议」；不出现荐股/收益率
5. 配音：本轮无 VO（用户提供音色样本后可换 minimax-clone）

# 验收

- 9:16、30s ± 3s，抖音可读（手机端字号）
- **全片无人出镜**（含生成画面里的人形、倒影）
- 镜头 1 能看见"光标悬停又移开"这个被压住的动作；镜头 3-4 无编造数据
- 全片过 Anti-PPT 门：无静止卡片长读
- 如涉投资建议表述，按第 4 条事实执行合规声明
