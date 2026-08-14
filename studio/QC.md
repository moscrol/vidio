# studio GUI 质检 · 2026-08-13 R1 → R3

对照仓库真实能力（vibe-director 路由表、硬覆盖、library、152 镜头卡、OpenMontage 工具箱、质检链、HyperFrames 执行环）审 GUI。

## 总评

第一版能看片、能拼混剪、能列技能名，但**没有把导演调度体现出来**。R2 补上能力地图 + 镜头卡 + 质检视图。R3 按优先级把「本机可跑的执行环」和「CUTLIST 真源」接进 GUI，并收窄 OpenMontage 未分组工具。

## 对照表

| 仓库能力 | R1 GUI | R2 | R3 |
| --- | --- | --- | --- |
| vibe-director 8 条形态路由 | 无 | 能力地图 8 张车道卡 + 复制开场话术 | 工作台增加执行环步骤条 |
| 硬覆盖 | 凭据灯 | 芯片 + 禁用划线 | 保留 |
| video-shotcraft 152 镜头卡 | 无 | 检索 + 点名 | 保留 |
| HyperFrames lint / inspect / preview | 无 | 无 | 画廊灯箱可跑；render 只复制命令 |
| 混剪 EDL | 写死在 server.mjs | 同左 | 解析 `CUTLIST.md` 的 `edl` 块；可重载 |
| 角标遮盖 | 无 | 无 | EDL `cover` 行 → ffmpeg drawbox |
| OpenMontage 102 工具 | 平铺 | 7 车道，48 个「其他」 | 补生图/数字人/合成/录屏，其他应接近 0 |
| 质检 | 死接口 | QC.md + 帧灯箱 | 保留 |

## 仍不在 GUI 里

- 不代跑 Seedance / 即梦 / HeyGen（付费与样片门仍走 agent）
- 不在浏览器里跑整片 `hyperframes render`（只给命令）
- 不写 brief、不改硬覆盖
- Electron 未做（`localhost:4700` 可后包）

## 工艺验证（R3）

- `/api/cutlist` 的 `source` 指向 `工程/v11-mix/CUTLIST.md`；`edl.segments[1].from === 7`
- `/api/hf` lint v02 → 0 err；preview 返回 localhost URL
- `/api/atoms` 「其他工具」应 ≤ 5
- 混剪 dry-run 含 `drawbox` 与 `trim=start=7:end=12`
