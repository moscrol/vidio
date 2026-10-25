# ep001 双引擎对比样片（2026-07-12）

同一叙事（案例气泡 → 四地位 → 金句 → 五层+权限 → chips → 讨论），约 32s 竖屏 1080×1920，无配音。

| | **H · HyperFrames** | **B · baoyu animated-video** |
|--|---------------------|------------------------------|
| 源 | `designs/ep001-hf/` | `designs/ep001-baoyu-anim/` |
| MP4 | `ep001-hf/renders/ep001-hf-draft.mp4` | `ep001-baoyu-anim/ep001-baoyu-anim.mp4` |
| 引擎 | GSAP + HyperFrames 截帧 | React Stage + gen-video |
| 预览 | `http://localhost:4311/ep001-hf/`（需起 designs 服务） | `…/ep001-baoyu-anim/` |
| 质量 | draft 样片 | deviceScaleFactor=1 样片 |

## 怎么看

1. 直接打开两个 MP4 并排播  
2. 或打开 HTML 拖时间轴细看动效  
3. 帧抽样在本目录 `hf_*.jpg` / `baoyu_*.jpg`

## 反馈请说

- 更喜欢 H / B / 都不行  
- 若都不行：丢一个参考片（链接或本地路径）定风格方向  
