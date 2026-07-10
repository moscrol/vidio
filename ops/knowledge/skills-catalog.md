# Skill / 工具目录（短视频运营用）

as-of: 2026-07-10  
原则：**先用已有，再装外部**；外部 skill 先读协议与数据出境风险。

---

## A. 我们仓库内已有（优先）

| Skill / 模块 | 路径 | 用途 |
|--------------|------|------|
| douyin-transcript | `vidio/.claude/skills/douyin-transcript` | 抖音链接 → 结构化讲稿（拆竞品） |
| stitch-to-video | `vidio/.claude/skills/stitch-to-video` | 分镜 → 图表动画成片子流 |
| hyperframes 全家桶 | `vidio/.agents/skills/hyperframes*` | HTML 视频、字幕、动效 |
| website-to-hyperframes | 同上 | 官网/落地页 → 产品演示短片 |
| remotion-to-hyperframes | 同上 | Remotion → HyperFrames |
| hyperframes-media | 同上 | TTS / 转写 / 抠像 |
| industry7view-card-lab | `vidio/industry7view-card-lab/` | 卡片 + Remotion 竖屏管线 |
| video-use | `~/.claude/skills/video-use` | 通用剪辑、字幕、调色对话式 |
| manim-video | video-use 子 skill | 数学/技术动画 |
| web-access | `~/.claude/skills/web-access` | 浏览器 CDP（对标调研、创作者中心只读） |
| imagine | grok skills | 封面 / 概念图 |
| a-stock-data | claude skills | 金融数据（Agent 演示素材，**勿直接荐股**） |

---

## B. 建议后续自建的项目 Skill（高价值）

按优先级：

| 优先级 | Skill 名（拟定） | 做什么 | 输入 → 输出 |
|--------|------------------|--------|-------------|
| P0 | `douyin-script-writer` | 按钩子 playbook 写 15–35s 口播 | 选题 + 类型 → 标题/钩子/口播/封面/结尾问 |
| P0 | `douyin-review` | 读复盘表给下一轮实验 | reviews/*.md → 改钩子/时长建议 |
| P1 | `competitor-hook-mine` | 调 douyin-transcript 批量拆对标前 3 秒 | 链接列表 → 钩子库 |
| P1 | `fin-compliance-lint` | 脚本敏感词扫描 | 文案 → 红线命中列表 |
| P2 | `content-calendar-fill` | 从痛点库自动填 7 天排期 | 产品能力 → calendar 表 |
| P2 | `cover-copy-gen` | 大字封面 3 变体 | 钩子句 → 封面文案 |

实现位置建议：`vidio/.claude/skills/` 或 `vidio/ops/skills/`（运营向 skill 放 ops 更清晰）。

---

## C. 外部可调研 / 可选引入

| 名称 | 类型 | 价值 | 风险/备注 |
|------|------|------|-----------|
| yzfly/douyin-mcp-server 等 | MCP | 无水印下载、文案提取 | 合规与登录；优先用已有 transcript skill |
| Douyin Trending Analysis（Claude skill） | Skill | 趋势/话题 | 需验证是否维护、是否适合我们赛道 |
| 1-SKILL/jiaoben 类脚本工坊 | Skill | 批量脚本 | 质量参差，宜当参考不当黑盒 |
| Wan-skills | AIGC | 图/视频生成 | 偏生成，不是运营逻辑 |
| agent-media / UGC 管线 | 海外 UGC | 对口型竖屏 | 金融人设未必适合数字人 |
| 巨量算数 | 官方趋势 | 合规数据 | 人工/半自动即可 |
| 蝉妈妈等 | 商业数据 | 对标账号 | 付费；起号期非必须 |

**引入流程**：inbox 记链接 → 试用 1 个真实任务 → 写入本表「已验证」栏 → 再装进日常。

---

## D. Agent 编排（顾问模式推荐）

```
选题池 (content-calendar)
    → douyin-script-writer / 人工改
    → 合规 lint
    → 拍摄 or card-lab / hyperframes / video-use
    → 发布
    → reviews 填数
    → douyin-review → 改下一轮
    → 竞品：douyin-transcript → 钩子库更新
```

顾问（Grok）默认职责：策略、脚本、复盘、知识库；你负责拍发与最终合规把关。

---

## E. 与产品仓库的接口

| 产品仓 | 运营侧用法 |
|--------|------------|
| finhot | 录屏素材、功能故事（后期软植入） |
| finance-workspace-private | 「研究工作流」演示，不展示买卖信号 |
| finance-research-site | 长文拆短视频选题 |
| agent-memory | 跨 Agent 长期结论蒸馏 |
