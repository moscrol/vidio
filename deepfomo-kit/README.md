# Deep Fomo 视频组件库

固定风格的「Deep Fomo 问答录屏」视频生成器：给一份 markdown 原文，一条命令产出竖屏 9:16 MP4（1080×1920，30fps，含合成音效）。风格与 `deepfomo-sample/anim6.html` 样片一致：ChatGPT 风封面 → 打字提问 → 深度思考逐行流出 → 逐字流式输出全文（含表格）→ 结尾 CTA + 弹幕。

## 用法

```bash
pip install playwright numpy && playwright install chromium   # 首次
python3 make_video.py content.md out.mp4
```

时长自动计算：思考行按字数排期，正文按 `rate`（默认 75 字/秒）流式，全片总长 = 内容长度决定。

## content.md 约定

```markdown
---
question: 深挖XX股份            # 打字输入的问题（封面首帧不出现，避免合规风险）
greeting: [主标题, 副标题]       # 封面定位语（可省，用默认）
chips: [个股深度研究, 题材深度探索, 行情前瞻研判]
ending: [结尾主句, 结尾副句]
end_placeholder: 直接评论：深挖 + 股票名
danmaku: [弹幕1, 弹幕2, 弹幕3]
rate: 75                        # 流式速度（字/秒）
---

## 思考

- 每行一条思考，==高亮短语== 用双等号标记（R1 式第一人称推理）

## 回答

正文段落直接写；**重点句** 用双星号（渲染为加粗+金色下划线）。

### 分节小标题用三级标题

| markdown 表格 | 原样渲染 |
|---|---|
| 深蓝表头 | 斑马纹 |

> 结尾 meta 段（灰色小字，如"需要的话我可以继续…"）用引用块
```

## 文件

| 文件 | 说明 |
|---|---|
| `template.html` | 动画模板（单文件 HTML，`window.seek(t)` 确定性渲染；从 `content.js` 读内容，时长/排期自动计算） |
| `build_content.py` | content.md → content.js（front matter + ==高亮== / **加粗** / 表格 / 引用块解析） |
| `make_video.py` | 一键管线：build_content → Playwright 逐帧截图 → numpy 合成音效（打字声/提交音/思考滴答/段落提示）→ ffmpeg 编码 |
| `content.md` | 示例原文（汇成股份 95 分样板，2026-06-30 口径，数据已过时，仅作格式示例） |
| `logo_crop.png` | 品牌 logo |

## 设计细节

- 品牌色：藏蓝 `#12294B`、金 `#C08A2D`、浅灰底 `#F5F7FA`
- 音效时间点取自页面导出的 `window.TIMING`（打字区间/提交/每条思考/每段正文/结尾），内容变化自动对齐
- 中间产物在 `.work/`（frames、audio.wav、silent.mp4），不提交
