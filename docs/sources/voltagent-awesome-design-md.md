# VoltAgent awesome-design-md 来源记录

- 上游：<https://github.com/VoltAgent/awesome-design-md>
- 审计提交：[`8147538b4226ae41e2487a9179e3bcc1f68e8554`](https://github.com/VoltAgent/awesome-design-md/commit/8147538b4226ae41e2487a9179e3bcc1f68e8554)
- 审计日期：2026-08-22
- 许可证：MIT，副本见 `third_party/licenses/voltagent-awesome-design-md-MIT.txt`
- 集成方式：`method-only` 知识炼化；无运行时依赖，不 vendor 上游语料库。

## 固定快照

对固定提交的本地清点结果：

- 153 个 tracked files，149 个 Markdown 文件；
- 74 个 `design-md/*/DESIGN.md`，其中 64 个使用 YAML frontmatter + prose，10 个使用较早的编号章节格式；
- 73 个站点 README；
- 0 个 HTML 文件，也没有随库交付的 schema、脚本或测试。

这些数值来自固定树，不跟随 README 的浮动描述。该提交的 README 徽章写 73 份 `DESIGN.md`，实际是 74 份；README 还声称每个站点有 preview HTML，固定树实际为 0 个。因此上游格式只按参考语料处理，不当成稳定 API。

## 吸收内容

Vidio 重写并工程化了以下跨样本方法：

- 先写视觉意图和信息层级，再选择样式；
- 用语义角色描述颜色、字体、表面、媒体和组件；
- 同时写 `do`、`avoid`、证据和已知缺口；
- 给强调色、焦点、字体、圆角和效果设置预算；
- 把人类可读的视觉理由与机器可检的数值合同分开；
- 把网页响应式思路翻译为视频画幅、安全区和阅读顺序；
- 在渲染前 lint 合同，在渲染后检查真实静帧。

对应的 Vidio 自有实现是 `.agents/skills/vibe-visual-taste/`。字段、规则、文案、示例与测试均为本仓重新设计。

## 排除内容

没有复制或注册上游 74 份品牌 `DESIGN.md`。以下内容不进入 Vidio 运行时：

- 品牌名称驱动的仿制 preset 或 prompt；
- 品牌色板、字标、logo、页面文案和高度可识别的完整构图；
- 专有字体文件、品牌照片和其他第三方资产；
- 未重新验证的单站点 token；
- 上游网页交互细节与未经观察的推断。

上游明确说明其不拥有被分析站点的视觉身份。MIT 许可覆盖上游有权许可的仓库材料，不当然授予第三方商标、字体、照片或商业外观权利。本记录不是法律意见。

## 更新流程

1. 读取远端 `main` 的新 SHA，不直接追踪浮动内容。
2. 对新 SHA 重新清点文件、格式、许可证、README/树漂移和来源声明。
3. 只比较跨样本方法；品牌 token 与资产默认排除。
4. 若 Vidio 的自有 schema 或规则需要改变，先更新设计规格和测试，再更新 skill。
5. 将本文件的 SHA、日期、实测数量和修改说明一并更新。

除非未来有明确决定 vendor 上游的实质性内容，否则不新增 package、git submodule、skills lock 或运行时网络依赖。
