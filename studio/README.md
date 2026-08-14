# vidio studio — 仓库能力的本地 GUI

把这个仓库的生产能力读成一个亲和的 Web 工作台。不引数据库、不引构建链：Express 直接读仓库文件系统，前端纯 ES 模块。

```bash
cd studio
npm install
npm start          # → http://localhost:4700
```

## 六个视图

| 视图 | 做什么 | 数据来自 |
| --- | --- | --- |
| 工作台 | 项目卡：brief 状态、规格、复用组件、硬覆盖芯片 | `projects/*/brief.md` |
| 风格画廊 | 成片悬停即播、混剪芯片、勾选候选、**Lint / Inspect / 打开 HyperFrames 预览**、复制渲染命令 | `工程/v*` + `成片/*.mp4` + `npx hyperframes` |
| 混剪台 | 可视化 EDL + 一键 ffmpeg 拼装；EDL 真源是 `CUTLIST.md` 的 `edl` 块 | `工程/*/CUTLIST.md` + `assemble.sh` 同一套工艺 |
| 组件库 | manifest + 预览帧 + 复制路径 | `library/` |
| 能力地图 | vibe-director 8 条车道、硬覆盖、152 镜头卡检索、技能（禁用划线）、OM 工具按车道 | `vibe-director` + `video-shotcraft/shots` + skills + OpenMontage |
| 质检 | QC.md 摘要 + 证据帧灯箱 | `projects/*/质检/` |

## 设计取向

- **GUI 管看和拍板，本机执行环可点。** 画廊里能跑 HyperFrames `lint` / `inspect` / `preview --background`。整片 `render` 只复制命令（耗时长）。生成、数字人、付费 API 仍走 vibe-director。
- 混剪拼装读 `CUTLIST.md` 末尾 `edl` 块（含角标遮盖），输出默认 `v11-mix-gui.mp4`，不覆盖 agent 产物。
- 成片/质检帧不入库，所以画廊在新 clone 上会显示「本地无成片」——先本机渲染再打开。

## 之后想套 Electron

服务已经是 localhost 单进程，`electron` 里 `loadURL("http://localhost:4700")` 即可，无需改代码。
