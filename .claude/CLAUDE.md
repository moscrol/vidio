# vidio · 短视频生产与运营

## 仓库地图

```
vidio/
├── ops/                        ← 短视频运营（策略 / 脚本 / 复盘）主线：分支 ops/short-video
│   ├── shared/                 # 跨平台原则与合规
│   └── douyin/                 # 抖音起号与内容
├── 短视频演讲稿/                # 题材母稿（按主题分子目录）
│   ├── 商业航天/
│   ├── 半导体设备/
│   ├── 创新药/
│   └── 人形机器人/
├── industry7view-card-lab/     ← 主用生产：图文卡 + Remotion
├── docs/
│   ├── system/                 # 视觉系统、分镜工作流、B-roll 提示词
│   ├── production/             # 剪映等执行清单
│   ├── UBIQUITOUS_LANGUAGE.md
│   └── superpowers/
├── archive/                    # 已完成分镜等（勿改）
├── .claude/skills/             # douyin-transcript、stitch-to-video 等
└── .agents/skills/             # HyperFrames 制作技能
```

## 生产管线（Industry 7View 题材）

```
研究母稿 / 口播视频
  ↓
speech-to-shorts → 短视频组
  ↓
storyboard-decision → 分镜执行表
  ↓
写 cards.js → npm run export → PNG 卡片
  ↓
Remotion：口播底层 + 卡片 overlay → MP4
  ↓
剪映最终合成（可选 B-roll / 音效 / 字幕）
```

纯卡片：`cards.js → export → motion-plan.json → Remotion → MP4`

## 卡片系统

**换主题只改 `industry7view-card-lab/cards.js`**。

```bash
cd industry7view-card-lab
npm run check
npm run export
npm run video:render
```

风格：Industry 7View Swiss — 浅灰底、白卡、深蓝 `#1a3a5c`、金强调 `#c9a227`。不要擅自改色板。

详见：`industry7view-card-lab/REMOTION_VIDEO_PIPELINE.md`、`CARD_SPEC.md`。

## 运营协作

- 策略与脚本写在 `ops/`，不要和 card-lab 生产文件混放
- 金融向内容遵守 `ops/shared/principles.md`（不荐股、前 15 条不硬广）

## 注意事项

- `archive/` 只读归档
- 包管理：`industry7view-card-lab` 内使用项目约定包管理器
- 视觉顶层设计：`docs/system/industry7view-video-system-design.md`
- 术语：`docs/UBIQUITOUS_LANGUAGE.md`
