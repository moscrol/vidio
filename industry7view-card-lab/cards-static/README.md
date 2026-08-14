# 卡片静态库 · cards-static/

可复用 PNG 卡片的**独立编辑沙盒**。所有静态卡片在这里都能单独打开、单独迭代、即改即看，验证完成后再回写到 `../index.html` 和 `../remotion/components/*`。

## 文件结构

```
cards-static/
├── _base.css                # 共享设计令牌、卡片底盘、品牌条、底部注脚
├── index.html               # 总览页（iframe 展示所有卡片缩略图）
├── cover.html               # 00 封面（深色 + 金色短横分隔 + 两区构图）
├── hook.html                # 01 反常识金句
├── dataHero.html            # 02 核心硬数据
├── logistics.html           # 03 真实场景挑战
├── compare.html             # 04 不是 A 是 B（核心区分）
├── loop.html                # 05a 业务闭环 / 线性流程
├── orderValidation.html     # 05b 验证链条（done/active/next/risk 多态）
├── checklist.html           # 06 跟踪信号清单
├── quote.html               # 07 金句结尾（深色版）
├── evidenceGrid.html        # 08 2×N 证据网格
└── supplyChainShift.html    # 09 供应链迁移 from→to + drivers
```

## 使用方法

1. **总览预览**：在浏览器打开 `cards-static/index.html`，看所有卡片缩略图。
2. **单卡迭代**：点缩略图右上的 `EDIT →` 进入单卡 HTML，编辑 `<style>` 块中的字号/留白/边框，浏览器直接刷新即可看效果。
3. **跨卡共享改动**：如果要改设计令牌（颜色、字体、卡片宽高、品牌条样式），改 `_base.css`，所有卡片同步生效。
4. **同步回主库**：满意后把变更同步到：
   - `../index.html`（同名 CSS 块；用于 PNG 导出）
   - `../remotion/components/*Motion.tsx`（同名样式对象；用于视频原生渲染）

## 设计原则（已应用的反 AI 模板规则）

- **左上 anchor 编辑式**：标题始终从左上 anchor 开始，不再做"垂直居中浮动"
- **金色短横分隔线**：标题前/后用 36–44px×3px 金色短横做版面节奏标记，替代廉价的居中渐变
- **2 区构图**：内容上半区 + bottom-anchored 元素（badge/url-pill/verdict）形成对角张力
- **强边框 + 金色 accent left bar**：卡片项左侧加 3–4px 金色边条，比浅灰薄边强 10 倍
- **字距收紧**：标题级 `-0.05em ~ -0.08em`，避免松散感
- **去除冗余装饰**：cover/checklist 卡片关闭全局金色竖线（`::after { display: none }`），让新加的 accent 元素当主角

## 已修复的具体问题清单

| 卡片 | 旧问题 | 修复 |
|---|---|---|
| Cover | 标题块居中浮动，上下大片空 | 改为左上 anchor + 金色短横引导 |
| Cover | badge 与标题重叠 | 移到底部左下角形成两区构图 |
| Cover | 深色卡上不该有金色竖线 | `::after { display: none }` |
| Compare | 字与边框贴太近，边框 1px 太弱 | padding `24px → 30/36px`，border `1px → 2px` + 新卡片金色边框 |
| OrderValidation | 标题与 list 之间差 58px | list `top: 212 → 196`，标题字号 `30 → 32`，加金色短横 |
| Checklist | 标题撞到金色竖线 | 关闭竖线 + `left: 28 → 32` |
| Checklist | 底部 200px 死白 | 项目 padding/字号变大 + gold left bar |

