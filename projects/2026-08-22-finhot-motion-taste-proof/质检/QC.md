# FinHot 动效品味炼化 A/B 质检 · 2026-08-22

> **结论：APPROVE。** 两版使用同一组 FinHot 真界面截图、同一套文案、构图和配色，只改变运动编排。炼化版通过「单一焦点 → 因果桥接 → 镜头停稳 → 结论留读」建立了更清楚的观看秩序，可作为 `vibe-motion-taste` 的最小可执行证明。

## 规格与自动门槛

| 项 | 基线版 | 炼化版 |
| --- | --- | --- |
| 画幅 / 帧率 / 时长 | 1080×1920 · 30fps · 8.000s | 1080×1920 · 30fps · 8.000s |
| 编码 / 音轨 | H.264 yuv420p · 无音轨 | H.264 yuv420p · 无音轨 |
| 成片体积 | 13,356,876 bytes | 7,388,011 bytes |
| motion contract | 0 error / 5 warning | **0 error / 0 warning** |
| HyperFrames 0.8.8 lint | 0 / 0 | 0 / 0 |
| runtime / layout / motion / contrast | **全部 0 finding** | **全部 0 finding** |
| motion samples | 161 | 161 |
| 对比用途 | 故意保留旧式问题的参照组 | 推荐实现 |

基线版的五条 warning 是受控实验变量：两处镜头未停稳、一次无物理理由的 back easing、一次 4 帧拖沓 stagger、一次高显著性动作重叠。它们只用于证明差异，不进入可复用默认值。

## 关键帧人检

证据板：`comparison.png`。橙框上排为基线版（1.4 / 4.4 / 7.4s），绿框下排为炼化版（1.4 / 4.5 / 7.4s）。检查覆盖 Studio 1× 预览、慢速时间线逐拍检查、最终 MP4 抽帧和 matching keyframes。

| 时刻 | 基线版 | 炼化版 | 判定 |
| --- | --- | --- | --- |
| 1.4s | 信源芯片、镜头和标题争抢焦点 | 先完成信源汇聚，标题尚未抢入 | 炼化版层级更清楚 |
| 3.3–4.5s | 镜头移动时标题已出现，随后硬切 | 「多源聚合 → 质量排序」形成因果桥；排序分先于结论 | 炼化版连续性更强 |
| 5.7s | 结论已与其他运动叠加 | 镜头停稳后再出现「高信号浮上来」 | 炼化版阅读窗口稳定 |
| 7.4s | 末屏可读 | 末屏可读，且已有约 1.8s 稳定 hold | 两版可读，炼化版收束更从容 |

## 交付判定

- `baseline/motion-contract.json`：**APPROVE as controlled baseline**，五条 warning 全部为刻意保留的反例。
- `distilled/motion-contract.json`：**APPROVE**，零 error、零 warning。
- `baseline/index.html` 与 `distilled/index.html`：HyperFrames `check --samples 13 --at-transitions` 全绿，无运行时、布局、运动或对比度问题。
- 最终 MP4 已逐项用 `ffprobe` 回验，并从最终编码文件抽帧生成证据板；不是拿预览缓存冒充交付。

**最终结论：APPROVE。** 炼化版可作为 Vidio 自有动效品味层的回归样例；基线版只作为反例对照保留。
