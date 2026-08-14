# library — 可复用组件库

本目录沉淀跨项目复用的视频组件。登记规则见 `.agents/skills/vibe-director/SKILL.md` 的「组件化与复用」。新建组件时从 `.agents/skills/vibe-director/templates/manifest.json` 复制 manifest。

**组件是工作流的可选配工具包，不是主干。** 做产品宣传片先走
`.agents/skills/promo-film-pipeline/SKILL.md` 的九步管线，每一步的表格列明
可插拔哪些组件（底座二选一、融合/摄影/合影/音效按需配）；组件单独拿走也能用。

## 目录约定

```text
library/<分类>/<组件名>/
├── manifest.json   # 名称、来源项目、规格（分辨率/帧率/时长）、参数、复用方法
├── preview.png     # 预览帧
├── 成品/           # 可直接叠加使用的渲染产物（循环 MP4/WebM 等，允许入库）
└── 工程/           # 可编辑源（不含 node_modules 和渲染中间产物）
```

建议分类：`视频背景/`、`开场/`、`转场/`、`字幕样式/`、`页面模板/`、`音效包/`、`镜头/`。

动效词汇表不在本目录：video-shotcraft 的 152 张镜头卡（`.agents/skills/video-shotcraft/references/shots/`）可直接点名复用。

## 组件登记

| 组件 | 分类 | 规格 | 来源项目 | 说明 |
| --- | --- | --- | --- | --- |
| aurora-玻璃质感 | 视频背景 | CSS+GSAP 片段 | finance-agent-promo v01 | uitripled 配方：色块呼吸 + 噪点 + 晕影 + 玻璃卡片 |
| 做旧纸张-毛玻璃 | 视频背景 | CSS 设计系统 | finance-agent-promo v12 | 陈渍纸底 + multiply 纤维噪点 + 毛玻璃组件配方 + 字体三声部（细体/巨衬线/mono），含 `.hero.or` 层叠坑 |
| 打字机命令行 | 组件 | CSS+GSAP 片段 | finance-agent-promo v01–v04 | steps() 打字 + 光标闪烁，四种皮肤验证过 |
| 任务清单打勾 | 组件 | CSS+GSAP 片段 | finance-agent-promo v01/03/04/06 | 条目入场→状态翻转节奏契约，四种皮肤 |
| 手绘圈注 | 组件 | SVG dashoffset | finance-agent-promo v08 | 圈住关键词的手绘椭圆；同族：涂鸦下划线、箭头（v12 CTA 复用验证） |
| 真实UI-手账贴图 | 组件 | CSS+GSAP 片段 | finance-agent-promo v12 | B-roll 融合配方：sepia 暖调 + multiply 罩 + 纸白相框 + 胶带贴角 + 2.5D 容器 |
| 电影摄影层 | 镜头 | CSS+GSAP 层 | finance-agent-promo v12 | 治「解说感」三板斧：镜头缓移（HUD 固定）、景深三式（开镜对焦/落字拉焦/深度分层）、光斑扫光遮挡卡 |
| 发布会合影收场 | 镜头 | CSS+GSAP 镜头 | finance-agent-promo v12 | Q8 全家福：字标立→成员焦外飞入落定微倾→收束拍 impact+白闪；配 riser→impact→sparkle 三拍 |
| 宣传片SFX钉帧 | 音效包 | ffmpeg 模板 | finance-agent-promo v11/v12 | 峰值对齐钉帧表 + 轻素材增益账 + 回测法；素材指向 shotcraft 库，含 sound-template.sh |

> 待验收后可继续沉淀：黄色滑块硬切转场（v02）、瑞士柱状图（v03）、终端日志流（v04）、印章盖章（v05/v08）、设备壳（v06）、折线绘制+证据旗标（v07）、蓝图系统图（v09）、光扫掠（v10）。
