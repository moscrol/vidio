# vidio

这是 vibe motion 工作区。用户给想法，agent 组装技能做成片。

**每次接到做视频 / 做内容 / 洗稿 / 数字人 / 宣传片 / 动效 / 即梦 / Seedance 的请求，先读并遵循** `.agents/skills/vibe-director/SKILL.md`。先读戏再选引擎。不要创建 `01-内容生产/`。

成片封面 / 开幕字标不是「封面图文」车道：留在本片车道，开幕 CSS 默认可见，质检抽 `质检/t0.png`（`scripts/check_opening_frame.py`）。已经渲完才用 `scripts/pin_opening.py` 把落定帧铺回片头。独立 5:2 编辑图才走封面图文。

项目落在 `projects/<YYYY-MM-DD>-<slug>/`，契约是 `brief.md`。可复用组件在 `library/`。OpenMontage 只当工具箱（`openmontage-adapter`），不要加载它的 pipeline / Backlot。

本地 GUI 工作台：`cd studio && npm install && npm start`（→ localhost:4700）。六个视图：工作台 / 风格画廊 / 混剪台 / 组件库 / **能力地图**（vibe-director 8 条车道 + 152 镜头卡 + 硬覆盖）/ **质检**。GUI 管看和拍板，生产链仍走 vibe-director。

## 仓库红线

- 成片 / 大媒体（`*.mp4`、`*.mp3`、批量帧图）不进 PR、不入库：走 GitHub Release 资产或外部存储，仓里只留指针与代表帧（质检每轮保留 1-2 张）。
- 跨仓 skill 以 `skills-lock.json` 钉扎版本，不把技能树整树 vendor 入仓；权威源在 agent-memory 仓与本机技能目录，新环境用 `npx skills` 按锁恢复。
