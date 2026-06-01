# Industry 7View B-roll Prompt Pack

用途：为产业研究短视频生成可复用的 B-roll 素材方向和 AI 视频提示词。适用于即梦、可灵、真实素材库、剪映素材库。

原则：B-roll 服务理解，不抢观点；画面要克制、真实、研究感，避免过度科幻、广告片和短剧感。

## 1. 使用流程

```text
1. 判断当前句子是否需要 B-roll。
2. 选择素材类型：真实场景 / 设备细节 / 工厂流程 / 信息流 / 抽象数据 / 风险场景。
3. 优先使用真实公开素材或可商用素材。
4. 没有合适素材时，再用 AI 生成。
5. 生成后放入剪映，时长控制 4-8 秒。
```

## 2. B-roll 适用句子

适合：

```text
动作描写
产品展示
工厂场景
技术细节
应用场景
真实案例
数据变化
产业链上下游
```

不适合：

```text
核心结论
风险提示
反常识判断
需要建立信任的句子
复杂投资判断
```

这些更适合 A-roll 或图文卡。

## 3. 通用负面约束

每条 AI B-roll prompt 后都可以追加：

```text
no sci-fi spaceship fantasy, no cyberpunk city, no exaggerated glow, no movie trailer style, no cartoon, no anime, no stock advertisement look, no text overlay, no logo, realistic documentary style, calm camera movement
```

中文要求：

```text
不要过度科幻，不要赛博朋克，不要炫光，不要电影预告片质感，不要卡通，不要广告片感，不要画面文字，不要 logo，真实纪录片风格，镜头运动克制。
```

## 4. 通用镜头模板

### 4.1 工厂 / 制造

```text
A realistic documentary shot of a modern Chinese manufacturing workshop, clean industrial lighting, workers checking machines, robotic arms or production lines operating steadily, calm slow push-in camera, 9:16 vertical video
```

适用：机器人、半导体、稀土永磁、光伏、锂电、商业航天制造。

### 4.2 实验室 / 研发

```text
A realistic documentary shot inside a modern research laboratory, scientists checking instruments and samples, clean white and blue lighting, close-up of hands operating equipment, calm camera movement, 9:16 vertical video
```

适用：创新药、AI 制药、半导体材料、新能源材料。

### 4.3 物流 / 供应链

```text
A realistic documentary shot of containers, warehouse shelves, automated sorting systems and trucks moving through an industrial logistics hub, calm neutral color, no brand logos, 9:16 vertical video
```

适用：商业航天供应链、跨境电商、制造业、医药流通。

### 4.4 数据 / 信息流

```text
A minimal documentary-style visualization of data flowing across a clean network map, subtle blue and gold interface lines, no readable text, calm slow motion, 9:16 vertical video
```

适用：卫星通信、AI 算力、金融科技、RWA、数据要素。

### 4.5 应用场景

```text
A realistic scene showing the technology being used in everyday or industrial context, people interacting naturally with devices, calm documentary style, neutral lighting, no advertising look, 9:16 vertical video
```

适用：下游应用、商业化、用户付费场景。

## 5. 行业模板

### 5.1 商业航天

可用画面：

```text
火箭发射
卫星总装
低轨卫星星座示意
地面站天线
海上船舶卫星通信
偏远地区卫星宽带
遥感地图监测
```

AI Prompt：

```text
A realistic documentary shot of a satellite ground station with large antennas under a clear sky, subtle communication signals visualized as thin blue lines, calm slow push-in, no logo, no text overlay, 9:16 vertical video
```

### 5.2 人形机器人

可用画面：

```text
工厂内机器人搬运
机械臂装配
灵巧手抓取物体
关节模组特写
工程师调试机器人
仓储物流试点
```

AI Prompt：

```text
A realistic documentary shot of a humanoid robot being tested in a clean factory environment, engineers monitoring nearby, the robot performs a simple industrial task slowly and steadily, no dancing, no sci-fi, 9:16 vertical video
```

### 5.3 创新药

可用画面：

```text
实验室移液
细胞培养
科研人员看显微镜
药物研发仪器
临床数据会议
药品生产线
医院药房
```

AI Prompt：

```text
A realistic documentary shot inside a biotech laboratory, researchers handling samples with pipettes and checking clinical data on a monitor, clean white-blue lighting, no readable text, no logo, calm camera movement, 9:16 vertical video
```

### 5.4 稀土永磁

可用画面：

```text
矿山开采
稀土分离设备
磁材生产线
电机装配
新能源汽车电机
风电机组
机器人关节电机
```

AI Prompt：

```text
A realistic documentary shot of a high-performance magnet manufacturing line, metallic components moving through precision equipment, engineers inspecting electric motor parts, industrial blue-gray lighting, no logo, no text, 9:16 vertical video
```

### 5.5 AI 算力 / 半导体

可用画面：

```text
数据中心机柜
服务器风扇特写
芯片封装产线
晶圆检测
工程师巡检机房
高速互连线缆
```

AI Prompt：

```text
A realistic documentary shot inside a modern data center, rows of server racks with subtle blue indicator lights, technician walking slowly through the aisle, calm camera movement, no brand logos, 9:16 vertical video
```

## 6. 剪映使用建议

```text
B-roll 单段长度：4-8 秒
画面运动：慢推近、轻横移、静态特写
叠加方式：可盖住数字人口播，也可和 PNG 卡片交替
原声音量：0%-20%
字幕：只保留关键词，不要满屏解释
```

## 7. 质量检查

- [ ] 是否真实可信，不像素材库广告。
- [ ] 是否服务当前口播句子。
- [ ] 是否没有过度科幻或炫光。
- [ ] 是否没有 logo、水印、可读文字。
- [ ] 是否不会抢走图文卡主观点。
- [ ] 是否和 Industry 7View 的克制研究感一致。
