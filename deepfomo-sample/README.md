# Deep Fomo 问答样片（深挖汇成股份 · 流式输出）

2026-07-02 制作。竖屏 9:16（1080×1920）纯屏幕演示样片：用户输入「深挖汇成股份」→ Deep Fomo 深度思考 → ChatGPT 式逐字流式输出完整深挖报告。

成品 MP4 因仓库 `.gitignore` 排除 `*.mp4` 不入库，本目录提交源码与生成路径，任何机器可一键复现。

## 三个版本

| 文件 | 时长 | 说明 |
|---|---|---|
| `anim3.html` / `render3.py` | 52s | 初版流式：输出用 stock-deep-dive 脱敏精简锚样板（exemplars/deep-dive-huicheng-20260630.md） |
| `anim4.html` / `render4.py` | 71s | 换用金融仓 95 分模板原文 `docs/learning/stock-deep-dive-95-huicheng-template.md`，含三张表格（收入结构/证据硬度/生命周期四问），流式提速到 75 字/秒 |
| `anim5.html` / `render5.py` | 75s | 措辞改成 LLM 录屏风格——思考区 R1 式第一人称推理（"用户想让我深挖…先验鲜…等等，这个反差需要重点解释"）、输出加开场承接句、六个分节小标题、结尾追问（"需要的话我可以继续做同链对比"） |
| `anim6.html` / `render6.py` | 75s | **最终版**：封面 UI 改成 ChatGPT 风——顶栏（≡ / logo / 模型徽标 / 头像）、居中问候语、建议问题 chips、圆角胶囊输入框（＋ / 麦克风 / 圆形发送键，输入后发送键点亮） |

`frames-preview/` 是 anim5 关键时间点截帧（思考中 / 输出开始 / 表格 / 结论 / 结尾 CTA）。

## 生成路径

方法论参考 vibe-motion/skills：HTML/CSS/JS 确定性动画 + 无头浏览器逐帧截图 + ffmpeg 编码（非 AI 生成视频）。

1. **动画页**：单文件 HTML，暴露 `window.seek(t)` 把页面渲染到任意时刻，`window.TOTAL` 为总时长。四段结构：
   - 0–4.2s 输入：输入框自动打字「深挖汇成股份」+ 光标闪烁 + 提交按钮按压
   - 4.4–16.2s 深度思考：金边白卡逐行流出 5 条研究员式推理，关键词黄底加亮；16.2s 收起为「已深度思考（用时 12 秒）」
   - 17s–~65s 流式输出：段落级调度（每段按字数排期，`ANS_RATE=75` 字/秒、段间 `ANS_GAP=0.3s`），逐字渲染 + 末尾光标块闪烁 + 表格整体淡入 + 内容超出视口时 chat 容器 translateY 自动跟随滚动
   - 尾段：97%→100% 白色遮罩淡入 + 居中 CTA「评论区报你想深挖的票」+ 三条弹幕右→左飘入 + 免责声明
2. **截帧**：`render5.py`（Playwright chromium，viewport 1080×1920，30fps，逐帧 `seek(t)` + screenshot）
3. **音效**：numpy 合成（键盘 click / 提交 pop / 思考 tick / 流式软 tick），写 44.1kHz wav
4. **编码**：
   ```
   ffmpeg -framerate 30 -i frames/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium silent.mp4
   ffmpeg -i silent.mp4 -i audio.wav -c:v copy -c:a aac -b:a 128k -shortest final.mp4
   ```

## 复现

```
pip install playwright && playwright install chromium
python3 render6.py        # 输出 frames/f%05d.png（约 2250 帧，~4 分钟）
# 再按上面两条 ffmpeg 命令编码
```

## 内容与设计细节

- 文案源：金融仓 `docs/learning/stock-deep-dive-95-huicheng-template.md`（95 分汇成股份深挖样板原文）。注意该样板数据为 2026-06-30 口径、文件头标注已过时，**发布前应替换为当天真实深挖输出**——只需改 `ANSWER` 数组重渲染。
- 品牌色：深蓝 #12294B / 金 #C08A2D / 浅灰底 #F5F7FA；关键句加亮用 `linear-gradient(transparent 70%, #F0DDB4 70%)` 黄底划线。
- Logo：`logo_crop.png`（用户提供）。
- 改文案只动 `THINK` / `ANSWER` 两个数组；时长、排期、`TOTAL` 全部自动重算。

> 已抽成可复用组件库：见 `../deepfomo-kit/`，给一份 content.md 原文即可一键生成同风格视频。

| `anim7.html` / `render7.py` | 30s | 抖音优化版：3s 结论钩子开场 + 快剪思考 + 精简正文 + 关键数字大字弹出 + 音底 |

### 真人情绪开场版（deepfomo_douyin_face_30s.mp4）

前 3.4s 用免费素材（Mixkit #51396，夜间刷手机情绪特写，License: Mixkit Free）替换大字钩子，叠加文案「又是深夜盯盘 / 越看越慌？/ Deep Fomo 先把研究跑完 ↓」+ 心跳音底，硬切进产品问答正片（anim7 去掉自带 hook 段）。拼接命令见 `render7.py` 同目录说明：素材 crop 608x1080→1080x1920，drawtext 逐行淡入，ffmpeg concat 后混音。
