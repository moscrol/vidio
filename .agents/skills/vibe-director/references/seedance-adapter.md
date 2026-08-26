# Seedance 在本仓库怎么用

权威读戏合同：`.agents/skills/seedance-20/references/directors-read.md`。提示词编译走 `seedance-20`，不要在本文件重写它的字段。

## 默认

1. 先读戏，再写提示词。
2. 交付物是可粘贴提示词包（即梦 / 方舟 / 对应表面各一版，若用户只给一个表面就只出一版）。
3. 不代跑 VOLC / FAL / 即梦 API，除非用户这轮明确说「代跑」且环境变量已在。
4. 本仓库默认无人出镜：非叙事车道里不要为了填十字段去编一个角色。

## 代跑

用户确认后代跑才加载 `openmontage-adapter`。密钥用环境变量，不写进 brief 和成片工程。
