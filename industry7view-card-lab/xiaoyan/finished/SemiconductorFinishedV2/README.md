# SemiconductorFinishedV2

小研主导的半导体设备竖屏成片。

## Structure

- 720x1280, 30fps, 90.2 seconds.
- Seven full-screen Xiaoyan canvases.
- 65.866 seconds of Xiaoyan visuals.
- A-roll remains as the trust anchor and original audio source.
- Paper-cover transitions connect A-roll and sketch canvases.

## Render

```bash
cd industry7view-card-lab
npm run xiaoyan:semiconductor:v2
```

Pass another A-roll path as the first argument when needed:

```bash
npm run xiaoyan:semiconductor:v2 -- /absolute/path/to/aroll.mp4
```

Output:

`/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-finished-v2/semiconductor-equipment-xiaoyan-v2.mp4`
