# 001 · 五层防幻觉 · 案例优先 deck

竖屏讲解幻灯（1080×1920），对接 `ops/douyin/scripts/001-五层防幻觉-生成不是真相.md`。

## 预览

```bash
# 在 vidio 仓库根：
python3 -m http.server 4311 --directory designs
# 浏览器打开：
open http://localhost:4311/ep001-anti-hallucination/index.html
```

键盘：←/→ 翻页，空格下一步动画。

## 文件

| 文件 | 说明 |
|------|------|
| `index.html` + `deck-stage.js` | baoyu-design 源 deck |
| `ep001-anti-hallucination.pptx` | 可编辑 PPTX（含 data-anim 入场 + 备注口播） |
| `slides/slide-0N.png` | 剪映用 @2x PNG |
| `export-pptx.json` | 再导出配置 |
| `_d_meta.json` | baoyu 资产索引 |

## 再导出 PPTX

```bash
# 先起 designs HTTP，再：
node ~/.agents/skills/baoyu-design/agents/gen-pptx/dist/cli.mjs \
  --url http://localhost:4311/ep001-anti-hallucination/index.html \
  --config designs/ep001-anti-hallucination/export-pptx.json \
  --out designs/ep001-anti-hallucination
```

## 分镜对照

1 案例气泡 → 2 四地位标签 → 3 金句 → 4 五层+权限 → 5 可复用 chips → 6 开放问题  
