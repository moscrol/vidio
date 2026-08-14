# B-roll 使用指南

发布版 v0.9 起支持在口播视频之上叠加 B-roll 真实画面。**支持视频（mp4/mov/webm）和图片（jpg/png/webp）**。图片自动叠加 Ken Burns 缓慢运动，避免静态死板。

## 1. 渲染层级

```text
最底层：口播视频（含音频）
其上：  B-roll（覆盖画面，自身静音，口播音频继续播放）
其上：  动态卡片（PNG / Remotion native）
其上：  字幕烧录
最顶层：品牌水印
片头/片尾：完全替代画面
```

口播音频不会被 B-roll 替换。B-roll 只接管视觉。

## 2. 文件目录

把 mp4 / mov 放到：

```text
public/broll/{slug}/{name}.mp4
```

例如：

```text
public/broll/semiconductor-equipment/wafer-fab.mp4
public/broll/semiconductor-equipment/lithography-machine.mp4
public/broll/humanoid-robot/optimus-walking.mp4
public/broll/commercial-space/falcon9-landing.mp4
```

**视频素材规格建议**：

```text
分辨率：1080x1920（竖屏，最佳）或 1920x1080（横屏，会被 cover 裁剪）
时长：  3-6 秒（短视频 B-roll 黄金时长）
帧率：  30 fps
编码：  h264 / mp4，关闭音频或保持静音
```

**图片素材规格建议**：

```text
分辨率：1500x2667 或更高（竖屏最佳，给 Ken Burns 留缩放余量）
           或 2400x1600（横屏，会被 cover 裁剪，pan 类动效也有余量）
       至少不要小于 1080x1920，否则放大会糊
格式：  jpg / png / webp / avif
时长：  4-6 秒（图片要足够时间让 Ken Burns 推完一遍）
来源：  Pexels / Unsplash / 官网产品图 / AI 生成（即梦/Sora/Midjourney）
```

## 3. 在 motion-plan.json 配置

在 `motion-plan.json` 顶层加 `brolls` 数组：

```json
{
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "talkingHeadVideoPath": "/semiconductor-equipment.mov",
  "talkingHeadDuration": 90.2,
  "publish": {
    "intro": 1.5,
    "outro": 2.8
  },
  "segments": [
    /* 卡片段，时间相对于口播 */
  ],
  "brolls": [
    {
      "start": 4.5,
      "duration": 3.5,
      "src": "/broll/semiconductor-equipment/wafer-fab.mp4",
      "fit": "cover",
      "fadeIn": 0.3,
      "fadeOut": 0.3
    },
    {
      "start": 18.0,
      "duration": 4.0,
      "src": "/broll/semiconductor-equipment/lithography-machine.mp4",
      "trimStart": 1.0
    },
    {
      "start": 28.0,
      "duration": 5.0,
      "src": "/broll/semiconductor-equipment/asml-euv.jpg",
      "motion": "kenBurns"
    },
    {
      "start": 38.0,
      "duration": 4.5,
      "src": "/broll/semiconductor-equipment/wafer-closeup.png",
      "motion": "zoomIn"
    },
    {
      "start": 48.0,
      "duration": 5.0,
      "src": "/broll/semiconductor-equipment/cleanroom-pano.jpg",
      "motion": "panRight"
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `start` | ✅ | B-roll 在**口播时间轴**上开始的秒数（不含片头偏移，prepare 会自动加上） |
| `duration` | ✅ | B-roll 停留秒数 |
| `src` | ✅ | 相对 `public/` 的路径，如 `/broll/{slug}/xxx.mp4` 或 `xxx.jpg` |
| `kind` | ❌ | `video` 或 `image`；不填会按后缀自动判断 |
| `fit` | ❌ | `cover`（默认，铺满裁剪）或 `contain`（完整显示，留黑边） |
| `opacity` | ❌ | 默认 1.0；可设 0.6-0.8 让 B-roll 半透盖在口播上 |
| `fadeIn` | ❌ | 淡入秒数，默认 0.2 |
| `fadeOut` | ❌ | 淡出秒数，默认 0.2 |
| `trimStart` | ❌ | 跳过素材片头多少秒（仅视频），默认 0 |
| `motion` | ❌ | 仅图片：`kenBurns`（默认）/`zoomIn`/`zoomOut`/`panLeft`/`panRight`/`panUp`/`panDown`/`still` |

### 图片动效（motion）

发布版 v0.9 起，图片 B-roll 自动叠加缓慢运动，避免静态死板。**默认走克制研究感**：3.5% 缩放范围、28px 平移、缓动 ease-in-out。

| motion | 效果 | 适用 |
|---|---|---|
| `kenBurns` | 1.0 → 1.035 缩放 + 右上微移 | 默认，适合所有真实场景图 |
| `zoomIn` | 静止 → 6.3% 推进 | 强调感、揭示重要细节 |
| `zoomOut` | 6.3% 起 → 静止 | 大场景揭示、开阔感 |
| `panLeft` | 横向从右往左扫 | 宽幅产线、卷轴式构图 |
| `panRight` | 横向从左往右扫 | 宽幅产线、卷轴式构图 |
| `panUp` | 纵向从下往上扫 | 高大场景、垂直构图 |
| `panDown` | 纵向从上往下扫 | 俯瞰场景、揭示底部细节 |
| `still` | 完全静止 | 仅在你确定要让图死板时用，不推荐 |

如果图片素材比 1080×1920 大，所有动效都不会暴露边缘；如果素材尺寸不够大，平移类动效会露黑边，建议选 `zoomIn` 或 `still`。

## 4. B-roll 与卡片的关系

**B-roll 出现时，卡片仍可见**。两者层级独立。

实践上常见两种用法：

```text
A. B-roll 替代口播画面，无卡片
   适合：开头反常识画面、风险画面、互动结尾画面
   做法：B-roll 时间窗口避开 motion-plan.segments 时间窗口

B. B-roll 作为背景，卡片在上层强调数据
   适合：B-roll 是产线 + 卡片是数据
   做法：B-roll 时间窗口与某张数据卡重叠
```

## 5. 文件不存在会立即失败

`scripts/prepare-remotion-assets.mjs` 在加载阶段就会校验所有 B-roll 文件存在；如果缺失：

```text
B-roll 文件不存在: /Users/.../public/broll/xxx/yyy.mp4
  请放到 public/broll/xxx/yyy.mp4
```

不会渲染到一半才挂。

## 6. 推荐工作流

```bash
# 1. 准备素材
mkdir -p public/broll/semiconductor-equipment/
# 把 mp4 拷进去

# 2. 在 motion-plan.json 加 brolls 数组

# 3. 出发布版（带 B-roll）
npm run video:publish

# 4. 抽封面
npm run video:publish:cover

# 5. 人工审片
open output/publish/semiconductor-equipment/video.mp4
```

## 7. 素材来源

```text
免费无版权：
  Pexels Videos       https://www.pexels.com/videos/
  Pixabay Videos      https://pixabay.com/videos/
  Coverr              https://coverr.co/
  Mixkit              https://mixkit.co/free-stock-video/

AI 生成：
  Sora                适合超短特定场景，时长 5-10s
  Runway Gen-3        适合摄影机运动镜头
  Veo                 适合工业/产业场景
  即梦/可灵           中文素材最好用，工厂/机器人题材丰富

主题搜索关键词建议：
  半导体设备：wafer fab, cleanroom, semiconductor, lithography, EUV
  人形机器人：humanoid robot, robotics factory, automation arm
  商业航天：rocket launch, falcon 9, spacecraft, low earth orbit
  CPO/光通信：data center, fiber optic, server rack
  新能源：EV battery, solar panel, wind turbine
```

## 8. 失败模式

| 现象 | 原因 | 解决 |
|---|---|---|
| 渲染挂起或崩溃 | B-roll 文件损坏或不是浏览器可解码格式 | 用 ffmpeg 重新转码为 h264 mp4 |
| B-roll 出现时口播画面消失了一段 | 正常，B-roll 覆盖在口播视频之上 | 这是预期行为 |
| B-roll 没声音 | 设计如此，B-roll 强制静音 | 不要依赖 B-roll 声音 |
| B-roll 与字幕重叠不好读 | 字幕底纹不够 | 调 `SubtitleOverlay` 的 background 透明度，或避开 |
| 卡片在 B-roll 之上挡画面 | 层级正确，但同时段冲突 | 把卡片或 B-roll 时间窗口错开 |
