# `emilkowalski/skills` 来源记录

- URL：<https://github.com/emilkowalski/skills>
- 审计 commit：`d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7`
- 审计日期：2026-08-22
- 许可证：MIT；副本见 `third_party/licenses/emilkowalski-skills-MIT.txt`
- 运行时依赖：无

## 本仓吸收范围

| 上游 skill | 吸收内容 |
| --- | --- |
| `emil-design-eng` | 动效目的、物理来源、曲线、性能与慢放复核 |
| `animate` | 先判断是否该动，再决定目的、属性、曲线和时长 |
| `review-animations` | 阻断条件、修复优先级与明确 verdict |
| `find-animation-opportunities` | 先拒绝无意义动效 |
| `improve-animations` | 先盘点、再分级、最后修复 |
| `animation-vocabulary` | 进退场、节拍、空间与连续性词汇 |
| `apple-design` | 适用于镜头与物件运动的空间连续性、速度继承与材质层级 |

`animate-expo`、`ask-sonner`、`pick-ui-library`、`prototype`、`write-swift` 不进入视频运行时。前四项处理交互 UI 或特定组件；最后一项是 Swift 工程规范。

## 炼化边界

vidio 不复制上游 skill 树。仓库自有 `.agents/skills/vibe-motion-taste/` 是唯一运行时品味层；它把适用原则翻译为固定时间轴、镜头运动和视频质检契约。HyperFrames、GSAP 与 Remotion 只消费已经作出的运动决定。

## 更新方法

1. 在临时目录浅克隆新的上游 commit。
2. 只比较上表七个相关 skill 与本记录的审计 commit。
3. 将确实适用于固定视频的新原则翻译进 `vibe-motion-taste`。
4. 运行 contract 单元测试和 FinHot 证明项目复核。
5. 更新本文件的 commit；不覆盖 vidio 自有规则，不提交上游 skill 正文。
