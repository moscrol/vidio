# 镜05 B-roll AI 提示词（增强版 · Nocturne 色系对齐）

> 生成工具：即梦 / 可灵（图生视频或文生视频）
> 色彩对齐目标：与 Remotion 图表共用 Nocturne High-Contrast 设计系统
> 画面属性：AI 示意素材，不作为真实公司画面使用

## 色彩参考（直接写入 prompt）

| 角色 | 色值 | 在画面中的位置 |
|------|------|---------------|
| 主背景/暗部 | `#131313` | 工厂墙面、阴影区域 |
| 暖金强调光 | `#ffdb3c` | 机器人轮廓边缘光、指示灯、数据面板 |
| Ruby 红点缀 | `#e0115f` | 控制面板警示灯、安全标识 |
| 金属本色 | 银灰/白 | 机器人机身主体 |

---

## 镜头 1：搬箱子（中景）

> 对应口播："进工厂、搬箱子"

**中文提示词：**
现代化工厂产线，一台白色人形机器人（类似特斯拉Optimus风格）正在搬运一个灰色金属箱子。中景构图，机器人占据画面主体，手臂托举箱子。工业灯光从上方打下，暖金色边缘光（#ffdb3c）勾勒机器人肩部和手臂轮廓。背景为深色工厂墙面（#131313），远处控制面板有暗红色指示灯（#e0115f）。电影感纪录片风格，真实质感，金属表面有细微使用痕迹。竖屏9:16，不要文字，不要水印，不要品牌Logo。

**英文提示词：**
Modern factory assembly line, a white humanoid robot (Tesla Optimus style) carrying a grey metal box with both arms. Medium shot, robot dominating the frame, arms lifting the box. Industrial overhead lighting, warm golden rim light (#ffdb3c) outlining the robot's shoulders and arms. Deep dark factory wall background (#131313), subtle ruby red indicator lights (#e0115f) on distant control panels. Cinematic documentary style, realistic textures, metal surfaces with subtle wear marks. Vertical 9:16, no text, no watermark, no brand logo.

---

## 镜头 2：拧螺丝（特写）

> 对应口播："拧螺丝"

**中文提示词：**
人形机器人的手部微距特写，白色金属手指正在拧紧一颗银色螺丝。指尖有暖金色反光（#ffdb3c），金属工件表面反射出细腻光泽。背景虚化，深色调（#131313），画面边缘隐约可见暗红色指示灯（#e0115f）。景深极浅，焦点集中在手指与螺丝的接触点。电影感微距摄影，精密工业美学，高细节。竖屏9:16，不要文字，不要水印，不要品牌Logo。

**英文提示词：**
Extreme close-up macro shot of a humanoid robot's white metallic fingers tightening a silver screw. Warm golden reflections (#ffdb3c) on the fingertips, fine glossy highlights on the metal workpiece. Shallow depth of field, background blurred in deep dark tones (#131313), faint ruby red indicator glow (#e0115f) at frame edges. Focus locked on the contact point between fingers and screw. Cinematic macro photography, precision industrial aesthetic, high detail. Vertical 9:16, no text, no watermark, no brand logo.

---

## 镜头 3：产线协作（全景）

> 对应口播："并且让客户付钱"（收束镜头）

**中文提示词：**
现代化智能工厂全景，三台白色人形机器人在流水线上协作。前景机器人正在传递零件，中景两台机器人分别进行组装和质检。流水线缓慢移动。暖金色顶光（#ffdb3c）照亮工作区域，深色工厂背景（#131313）营造沉浸感，控制面板有暗红状态灯（#e0115f）。画面干净、秩序感强，科技纪实风格。竖屏9:16，不要文字，不要水印，不要品牌Logo。

**英文提示词：**
Wide shot of a modern smart factory interior, three white humanoid robots collaborating on a conveyor belt. Foreground robot passing a component to another, two more robots assembling and inspecting in the midground. Conveyor belt moving slowly. Warm golden overhead lighting (#ffdb3c) illuminating the work area, deep dark factory background (#131313) for immersive depth, subtle ruby red status lights (#e0115f) on control panels. Clean composition with strong sense of order, tech documentary style. Vertical 9:16, no text, no watermark, no brand logo.

---

## 负面提示词（三组共用）

**中文：**
低质量，模糊，手指畸形，多余手指，关节错位，穿模，卡通，二次元，文字，水印，品牌Logo，过度科幻，背景杂乱，闪烁，昏暗，橙色机械臂（不要非人形机器人），工业机械臂（只要人形机器人），假人模型，CGI感过强。

**英文：**
low quality, blurry, distorted fingers, extra fingers, wrong anatomy, joint deformation, clipping, cartoon, anime, text, watermark, brand logo, over futuristic, unrealistic, messy background, flickering, dark, gloomy, industrial robotic arm (not humanoid), mechanical arm (humanoid robot only), mannequin, overly CGI look.

---

## 使用流程

```
1. 复制对应镜头的「中文提示词」
2. 粘贴到即梦/可灵「文生视频」
3. 复制「负面提示词」到负面词输入框
4. 生成 3-5 个候选，按以下标准筛选：
   ✓ 手指数量正确（5根）、关节正常
   ✓ 画面内没有乱码文字或假Logo
   ✓ 暖金色调（#ffdb3c）和暗红点缀（#e0115f）可见
   ✓ 动作自然流畅
   ✓ 适合竖屏裁切
   ✓ 2-4秒内能看懂画面内容
5. 导入剪映后，统一加一层轻微调色：
   - 对比度 +8
   - 色温 +3（偏暖）
   - 饱和度 +5
   - 暗部压暗 -3
```

## 与图表色彩衔接

Remotion 图表使用相同色系：
- ComparisonChart: ruby `#e0115f` (负面/旧认知) + gold `#ffdb3c` (正面/新认知) + `#131313` 背景
- NumberImpactCard: gold `#e9c400` 主色 + gold glow + `#05070A` 背景

剪映中图表 MP4 和 B-roll MP4 并列时，两者共享 gold/ruby 暖色+深黑背景，视觉一致。
