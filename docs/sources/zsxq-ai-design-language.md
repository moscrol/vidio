# 知识星球《AI 设计·词汇篇》来源记录

- 主文：[《AI 设计·词汇篇》](https://articles.zsxq.com/id_fdcp004tv2wh.html)
- 读取状态：`VERIFIED`
- 读取日期：2026-08-22
- 读取方式：本机浏览器 CDP；Material 两页使用页面自身指向的同站官方 page-data；不读取 cookie、localStorage、密码或其他会话数据
- 研究范围：主文及其正文中去重后的 16 个直接内容链接，深度 1；不递归跟随这些页面中的二级链接
- 集成方式：`method-only`；Vidio 无运行时依赖，也不 vendor 来源正文、设计系统语料或资产

## 深度一来源清单

下表中的 14 个直接页面在记录日期呈现了可读正文。两个 Material 2 直接目标的浏览器页面壳返回 200 但未呈现正文，其页面自身指向的两个官方 page-data 端点提供了可读证据；因此 16 个直接目标都取得了可用证据。`VERIFIED` 只表示该精确目标及明确列出的同站支撑在该次审计中被读取，不把同站其他页面或页面内未打开的名称一并升级为已核验来源。

| # | 直接目标 | 状态与使用边界 |
| --- | --- | --- |
| 1 | [搭建 AI 设计组件库和 Skills](https://articles.zsxq.com/id_tcme6xadg3nf.html) | `VERIFIED`；用于理解组件分层、契约化和从真实页面发现复用缺口的方法，不复制文章表达或组件树。 |
| 2 | [给 AI 找设计参考](https://articles.zsxq.com/id_1z3w09xk55ij.html) | `VERIFIED`；用于区分质量目标、真实流程和实现参考，不把参考站点当成品牌模板。 |
| 3 | [Refactoring UI 话题](https://t.zsxq.com/OmPCI) | `VERIFIED`；短链跳转后的 SPA 话题正文可读，附件不在读取或分发范围。 |
| 4 | [产品构建需求提示词话题](https://t.zsxq.com/oxAld) | `VERIFIED`；短链跳转后的 SPA 话题正文可读，话题内二级链接未递归读取。 |
| 5 | [Checklist Design](https://www.checklist.design/) | `VERIFIED`；用作按界面、流程和交付阶段组织检查项的目录参考，不把当次加载数量当成稳定事实。 |
| 6 | [Component.gallery](https://component.gallery/components/) | `VERIFIED`；用作组件规范名、别名、定义和边界的查词参考，不采用站点视觉或组件实现。 |
| 7 | [UI Patterns](https://ui-patterns.com/) | `VERIFIED`；用作重复界面问题与模式分类的参考，商业卡片不构成方法证据。 |
| 8 | [Design Systems Repo](https://designsystemsrepo.com/) | `VERIFIED`；只作为设计系统资料目录，不将目录自述当成内容时效保证。 |
| 9 | [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) | `VERIFIED`；作为 Apple 平台的一手规范索引，不外推为其他平台的唯一标准。 |
| 10 | [Material 2 Components](https://m2.material.io/components) | `VERIFIED`；浏览器页面壳返回 200，正文证据由下列同站官方 page-data 支撑；版本边界是 Material 2。 |
| 11 | [Material 2 Understanding motion](https://m2.material.io/design/motion/understanding-motion.html#principles) | `VERIFIED`；浏览器页面壳返回 200，正文证据由下列同站官方 page-data 支撑；具体实现值仍归当前平台合同。 |
| 12 | [Design Spells](https://designspells.com/) | `VERIFIED`；只作为微交互案例目录，不承担无障碍、性能或平台规范角色。 |
| 13 | [UX in Motion Manifesto](https://medium.com/ux-in-motion/creating-usability-with-motion-the-ux-in-motion-manifesto-a87a4584ddc) | `VERIFIED`；作为个人方法论的动效审查词汇参考，不把它当成平台标准。 |
| 14 | [Laws of UX](https://lawsofux.com/) | `VERIFIED`；作为启发式索引，不能替代项目验证或因果证据。 |
| 15 | [UI glossary](https://www.uxdesigninstitute.com/blog/ui-glossary/) | `VERIFIED`；作为 UI 术语入口，具体实现仍回到平台规范和项目证据。 |
| 16 | [UX glossary](https://www.uxdesigninstitute.com/blog/glossary-ux-terms/) | `VERIFIED`；作为 UX 术语入口，不替代研究方法原典或本项目验证。 |

### Material 2 官方页面数据

Material 2 的两个浏览器页面壳返回 200，但正文取证同时使用了页面自身指向的官方数据：

- [Components page-data](https://m2.material.io/page-data/LandingPages/4819743532122112.json) — `VERIFIED`，支撑上表第 10 项。
- [Understanding motion page-data](https://m2.material.io/page-data/Guidelines/5774956804964352.json) — `VERIFIED`，支撑上表第 11 项。

这两个端点是同站一手支撑，不计入主文的 16 个深度一直链。

## VERIFIED 与 REFERENCE_ONLY 边界

主文或已读文章中出现、但本次没有直接打开的 Awwwards、CSSDA、Mobbin、Refero、PageFlows、UI Notes、shadcn/ui、Aceternity、Magic UI 和 React Bits 仅为 `REFERENCE_ONLY` 线索。它们不能支持 Vidio 的项目事实、词条或实现决定；若未来需要使用，必须另行记录精确目标和读取日期。

## 独立炼化的方法

Vidio 只吸收可迁移的工作方法，并以自有字段和校验器重新实现：

1. 对每个参考写清精确目标，以及允许借用与必须排除的部分。
2. 每个项目概念只有一个规范名，并记录别名、相邻概念边界和来源。
3. 交付顺序固定为 `evidence → language → visual contract → motion contract → renderer → QC`；每一层只决定自己的事项。
4. 真实项目中反复出现的实现缺口进入组件合同或 `library/`，不在一次画面里临时堆叠。

这些规则是 Vidio 对来源方法的独立工程化判断，不是来源站点提供的 schema、代码或运行时服务。

## 内容与权利边界

- 仓库不复制文章段落、PDF 或话题附件，也不保存私有页面、会话数据、cookie、本地用户报告或浏览器截图。
- 仓库不复制品牌资产、字体、设计系统语料库或来源站点的完整视觉身份。
- 本次没有 vendor 代码、资产或实质性原文，因此不新增许可证文件；来源链接仅用于审计与复查。
- 上述边界是工程记录，不构成法律意见。
