# vidio

这是 vibe motion 工作区。权威远端是本机 Gitea `http://localhost:3300/a77/vidio`。

**每次接到做视频、做内容、洗稿、数字人、宣传片、动效、即梦或 Seedance 请求，先完整读取并遵循** `.agents/skills/vibe-director/SKILL.md`。它负责读戏、建 brief、选车道、样片门和最终质检。

**任何合成动效、UI 运动、转场、运镜或 kinetic type，完整读取并遵循** `.agents/skills/vibe-motion-taste/SKILL.md`。活动链只有一条：`vibe-director → vibe-motion-taste → motion-contract.json → renderer → hybrid QC`。HyperFrames、GSAP 与 Remotion 执行契约，不自行决定动效品味。

项目落在 `projects/<YYYY-MM-DD>-<slug>/`，事实源是 `brief.md`；可复用组件落在 `library/`。本地 GUI：`cd studio && npm install && npm start`（→ localhost:4700）。

## 仓库红线

- 成片和大媒体不入 Git；仓内保留工程、契约、指针与每轮少量代表帧。
- 外部 skill 用 `skills-lock.json` 管运行时版本；知识来源用 `docs/sources/` 钉 commit。仓库自有 skill 可直接迭代，外部 skill 树不整包 vendor。
- Emil Kowalski 是 `vibe-motion-taste` 的知识来源之一，不是运行时 skill。来源、取舍与许可证见 `docs/sources/emilkowalski-skills.md`。
- 付费 API、声音克隆、生成真人与外部发布必须取得用户授权；本地样片、lint、render 和 QC 可直接执行。
- 默认无人出镜；brief 明确授权后才加入真人、角色、倒影或可识别人脸。
- OpenMontage 只提供素材、ASR、TTS、ffmpeg 等工具；调度、项目状态和 QC 仍归 vidio。
