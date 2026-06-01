# Industry 7View 短视频生产项目

## 当前主用系统

```
视频/
├── industry7view-card-lab/     ← 主用：图文卡 + 视频管线
│   ├── index.html              # 卡片预览
│   ├── cards.js                # 内容数据（换主题只改这里）
│   ├── remotion/               # Remotion v0.4：口播视频 + 卡片叠加
│   ├── scripts/                # 卡片计划/时间线/SRT 生成脚本
│   ├── output/                 # PNG 和 MP4 输出
│   └── *.md                    # 规格、设计 Token、动效配方等文档
│
├── 抖音/                        # 演讲稿、分镜执行表、口播素材
├── archive/                     # 旧项目归档
│   ├── legacy-doodle/           # 旧涂鸦简笔管线
│   └── completed-storyboards/   # 已完成视频的分镜执行表
│
├── industry7view-video-system-design.md  # 视觉系统顶层设计
├── 短视频分镜工作流.md          # 分镜拆解 skill 流程文档
├── UBIQUITOUS_LANGUAGE.md       # 统一术语表
└── *_分镜执行表.md             # 具体视频的分镜执行文件
```

## 生产管线（当前）

```
研究母稿 / 口播视频
  ↓
speech-to-shorts → 抖音短视频组
  ↓
storyboard-decision → 分镜执行表
  ↓
写 cards.js → npm run export → PNG 卡片
  ↓
Remotion v0.4：口播视频底层 + 卡片 PNG 上层 overlay → MP4
  ↓
剪映最终合成（可选：加 B-roll、音效、字幕精调）
```

纯卡片视频（无口播）：`cards.js → export → motion-plan.json → Remotion → MP4`

## 卡片系统

**换主题只需改 `cards.js`**：
- `cover` + `cards[01-07]` + 可选 `extras`
- 规格约束见 `CARD_SPEC.md`

**标准命令**：
```bash
cd industry7view-card-lab
npm run check        # 校验 cards.js
npm run export       # 导出 PNG
npm run video:render # Remotion 渲染 MP4
```

**卡片风格**：Industry 7View 版 Swiss — 浅灰背景、白色卡片、深蓝主色、金色数据强调。
不要改颜色/字体/布局。

## Remotion 视频管线 v0.4

- 支持口播视频底层 + PNG 卡片上层 overlay
- 支持从 SRT 字幕 + `timeline-rules.json` 生成卡片出现时间
- 支持纯卡片视频（按 `motion-plan.json` 排时间线）
- 分辨率：1080x1920, 30fps, H.264

详见：`industry7view-card-lab/REMOTION_VIDEO_PIPELINE.md`

## 设计系统

- **主色**：深蓝 `#1a3a5c`
- **强调色**：金色 `#c9a227`
- **风险色**：红色 `#c62828`
- **背景**：浅灰 `#f5f5f7`
- **卡片**：白色 `#ffffff`，细边框，轻阴影

详见：`industry7view-card-lab/DESIGN_TOKENS.md`

## 包管理器

使用 pnpm（`industry7view-card-lab` 项目内）。

## MCP 服务器

- **Stitch MCP**：user 级配置，HTTP 传输。仅用于图表 UI 设计（当前管线中已非必需，industry7view-card-lab 用 HTML/CSS 卡片）。

## 注意事项

- `archive/` 是旧项目归档，不要修改其中的文件
- `stitch-skills/` 是外部 git 仓库，不要修改
- `抖音/` 目录存放演讲稿、分镜执行表和口播素材
- `industry7view-video-system-design.md` 是视觉系统的顶层设计文档，与具体生产管线分开维护
