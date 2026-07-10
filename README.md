# vidio

短视频生产 + 运营仓库。

| 区域 | 用途 |
|------|------|
| `ops/` | **短视频运营**（账号策略、选题脚本、数据复盘）← 当前主线分支 `ops/short-video` |
| `短视频演讲稿/` | 题材内容母稿（口播 / 分镜 / 短视频组） |
| `industry7view-card-lab/` | 图文卡 + Remotion 生产管线 |
| `docs/` | 系统设计、工作流、术语、剪映清单 |
| `archive/` | 已完成分镜等归档（勿改） |
| `.claude/skills/` | 项目内 skill（如 `douyin-transcript`） |
| `.agents/skills/` | HyperFrames 等制作 skill |

## 分支约定

- `main`：稳定生产管线与历史题材
- `ops/short-video`：短视频运营（抖音起号、FinHot / 金融 Agent 内容等）

## 快速入口

- 运营：[`ops/README.md`](./ops/README.md)
- 卡片/渲染：`cd industry7view-card-lab && npm run check`
- Agent 生产说明：[`.claude/CLAUDE.md`](./.claude/CLAUDE.md)
