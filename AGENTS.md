# vidio

这是 vibe motion 工作区。权威远端是本机 Gitea `http://localhost:3300/a77/vidio`。

**每次接到做视频、做内容、洗稿、数字人、宣传片、动效、即梦或 Seedance 请求，先完整读取并遵循** `.agents/skills/vibe-director/SKILL.md`。它负责读戏、建 brief、选车道、样片门和最终质检。

**任何自主设计的单帧画面、封面、图文卡、UI 演示、数据图、排版帧或宣传片视觉底座，必须先完整读取并遵循** `.agents/skills/vibe-design-language/SKILL.md`。先写并通过项目级 `reference-brief.md` 与 `design-vocabulary.json`，钉住来源边界和规范词汇，再进入视觉或运动设计。

**语言门禁通过后，任何自主设计画面完整读取并遵循** `.agents/skills/vibe-visual-taste/SKILL.md`。它消费语言产物，写项目级 `DESIGN.md` 与数值单一事实源 `visual-contract.json`；不得重写来源或规范词汇，Stitch、HyperFrames、GSAP 与 Remotion 也不自行发明风格。

**任何合成动效、UI 运动、转场、运镜或 kinetic type，完整读取并遵循** `.agents/skills/vibe-motion-taste/SKILL.md`。有自主设计画面的完整链只有一条：`vibe-director → vibe-design-language → reference-brief.md + design-vocabulary.json → vibe-visual-taste → DESIGN.md + visual-contract.json → vibe-motion-taste → motion-contract.json → renderer → hybrid QC`。语言合同负责来源边界与规范词汇，视觉合同负责静态数值，运动合同负责时间与缓动；无自主叠加设计的纯供应素材可跳过三道设计门禁。

项目落在 `projects/<YYYY-MM-DD>-<slug>/`，事实源是 `brief.md`；可复用组件落在 `library/`。本地 GUI：`cd studio && npm install && npm start`（→ localhost:4700）。

## 仓库红线

- 成片和大媒体不入 Git；仓内保留工程、契约、指针与每轮少量代表帧。
- 外部 skill 用 `skills-lock.json` 管运行时版本；知识来源用 `docs/sources/` 钉 commit。仓库自有 skill 可直接迭代，外部 skill 树不整包 vendor。
- Emil Kowalski 是 `vibe-motion-taste` 的知识来源之一，不是运行时 skill。来源、取舍与许可证见 `docs/sources/emilkowalski-skills.md`。
- VoltAgent `awesome-design-md` 是 `vibe-visual-taste` 的方法来源之一，不是品牌模板库或运行时 skill。来源、炼化边界与许可证见 `docs/sources/voltagent-awesome-design-md.md`。
- 付费 API、声音克隆、生成真人与外部发布必须取得用户授权；本地样片、lint、render 和 QC 可直接执行。
- 默认无人出镜；brief 明确授权后才加入真人、角色、倒影或可识别人脸。
- OpenMontage 只提供素材、ASR、TTS、ffmpeg 等工具；调度、项目状态和 QC 仍归 vidio。
