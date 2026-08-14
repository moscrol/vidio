# 要不要单独再开一个 Obsidian？

**结论：不必新开 vault。用现有 `agent-memory` + 本仓 `ops/` 双层即可。**

## 你已经有的

`agent-memory` 本身就是 **Git 托管的 Obsidian vault**：

- `00_inbox` → `10_knowledge` 蒸馏流
- `20_projects` 项目状态
- `40_playbooks` 可复用工作流
- 多 Agent 共享、纯 Markdown

再开一个「短视频专用 Obsidian」会带来：

- 双份笔记、不知道写哪
- 同步/插件/目录再次配置
- Agent 接线成本翻倍

## 推荐架构（单一大脑，两个抽屉）

```
┌─────────────────────────────────────────┐
│ agent-memory（跨项目长期记忆 / Obsidian） │
│  20_projects/vidio-short-video.md  MOC  │
│  10_knowledge/ 仅放「跨项目仍有用」结论   │
│  40_playbooks/ 通用内容流水线（可选）     │
└──────────────────┬──────────────────────┘
                   │ 链到 / 摘要自
                   ▼
┌─────────────────────────────────────────┐
│ vidio/ops/（项目 SSOT，本分支工作区）     │
│  knowledge/  钩子、算法、skill 目录      │
│  douyin/     策略、排期、脚本、复盘      │
│  成片生产仍在 card-lab / 演讲稿          │
└─────────────────────────────────────────┘
```

| 内容类型 | 写哪里 |
|----------|--------|
| 钩子公式、skill 清单、冷启动假设 | **`vidio/ops/knowledge/`** |
| 逐条脚本、日更数据、本周实验 | **`vidio/ops/douyin/`** |
| 「我们验证过：产品号前 15 条不能硬广」这类长期结论 | 蒸馏到 **`agent-memory/10_knowledge/`** |
| 多 Agent 协作约定 | **`agent-memory/30_conventions` + 50_agents** |

## 何时才值得「新 vault」

仅当同时满足：

1. 短视频变成独立事业线，和金融/代码记忆**完全隔离**有合规要求；且  
2. 非技术搭档只开 Obsidian、不碰 Git；且  
3. `agent-memory` 已经臃肿到无法导航  

目前都不满足 → **不开新库**。

## 可选的轻量动作（推荐做）

1. 用 Obsidian 打开 **已有** `agent-memory`（不是新开）。  
2. 在 `20_projects/` 加一篇 `vidio-short-video.md` MOC，链到本仓路径：  
   `../vidio/ops/knowledge/README.md`（或你本机绝对路径 / git submodule 策略按你现有习惯）。  
3. 每两周：从 `ops/douyin/reviews` 抽 3 条验证结论 → `agent-memory/10_knowledge`。

## 顾问立场一句话

> **Obsidian 是「怎么读」；Git 仓是「事实存在哪」。**  
> 你已有 Obsidian vault（agent-memory）。短视频资产放 `vidio/ops` 用 Git 演进；需要人脑漫游时用 Obsidian 打开 agent-memory 并链过来。不要为了「感觉专业」再开第三个坟场。
