---
name: douyin-transcript
description: 给定抖音视频链接，提取视频内容生成结构化文字讲稿。
metadata:
  author: lbq
  version: "3.0.0"
  requires: ["web-access"]
---

# douyin-transcript

从抖音视频生成结构化文字讲稿。主路径：CDP 拿源 URL → 下载视频 → OpenCV 采帧 → 视觉识别字幕 → 整理讲稿。

## 触发

用户粘贴抖音视频链接 + "生成讲稿/转录/文字版"。

## 流程

### 1. CDP 提取视频源 URL

```bash
node "$HOME/.claude/skills/web-access/scripts/check-deps.mjs"
curl -s "http://localhost:3456/new?url=<链接>"
```

等 4-5 秒，提取标题和源地址：

```javascript
(function(){
  var title = document.querySelector('meta[name="description"]')?.content
    || document.querySelector('meta[name="lark:url:video_title"]')?.content
    || document.querySelector('h1')?.innerText || '';
  var sources = document.querySelector('video')?.querySelectorAll('source') || [];
  var src = '';
  for (var i = 0; i < sources.length; i++) {
    if (sources[i].src && sources[i].src.indexOf('douyinvod') > -1) { src = sources[i].src; break; }
  }
  return JSON.stringify({title: title.substring(0,200), src: src, url: location.href});
})()
```

拿到 src 后**立即关闭 tab**：`curl -s "http://localhost:3456/close?target=<targetId>"`

如果 src 为空：检查 `location.href` 是否跳到了搜索页，用 `/navigate` 导航到 `url` 字段中的完整视频 URL 后重试。

### 2. 下载 + 采帧（一键脚本）

```bash
python3 "${CLAUDE_SKILL_DIR}/scripts/extract-frames.py" "<视频源URL>"
```

脚本自动完成：下载（带 Referer）→ 验证文件 → OpenCV 每 3 秒采一帧 → 输出到 `/tmp/douyin_frames/`。

输出示例：`OK: 2m36s | 52 frames @ 3s interval -> /tmp/douyin_frames/`

### 3. 视觉识别字幕

用 Agent 子任务读取帧图片，**只提取字幕文本**。字幕位置：画面底部白色文字。

超过 40 帧时分两批 Agent 并行（如 0-39、40-N）。Agent prompt 要点：

- 逐帧输出帧号 + 底部字幕原文（中文逐字转录）
- 无字幕则标 "no subtitle"
- 不要描述画面内容，只关注字幕
- 最终输出按时间顺序去重后的完整字幕列表

### 4. 整理输出

用提取的字幕生成两份内容：

**完整讲稿**——原文转录，去除语气词，按语义分段加小标题，保留所有内容不删减。

**课程总结**——提炼核心要点，用表格/列表呈现关键概念，附课后作业。

格式：
```markdown
## 视频讲稿：[标题]

> [逐句转录...]

---

## 课程总结

[结构化要点]

---
来源：[链接]
时长：[X分X秒]
```

### 5. 清理

```bash
rm -rf /tmp/douyin_video.mp4 /tmp/douyin_frames
```

## 已知陷阱

| 陷阱 | 说明 |
|------|------|
| 浏览器不播放视频 | 桌面端 video readyState 常为 0，字幕轨道为空。不要尝试在浏览器中提取字幕 |
| 第三方解析 API | 实测不返回字幕数据，不可用 |
| 下载返回 350 字节 | 缺 Referer 头，脚本已内置处理 |
| 视频源 URL 时效性 | 提取后立即下载，不要延迟 |
| 短链接跳转搜索页 | v.douyin.com 短链可能不跳转到视频页，需用 /navigate 到完整 URL |
| 帧间隔过大遗漏内容 | 必须用 3 秒间隔。10 秒以上会丢失大量字幕 |
