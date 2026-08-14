# Industry 7View B-roll Asset System

用途：为 Industry 7View 短视频建立 B-roll 选择、搜索和 AI 生成规则。它解决的问题是：发布版不能全是卡片，必须用真实场景、行业镜头和动态素材补足可信度与观看节奏。

## 1. B-roll 的职责

B-roll 不只是填空，它承担四类任务：

```text
1. 真实感：证明这不是纯概念讲解。
2. 节奏感：打断连续信息卡，给观众呼吸。
3. 场景感：让抽象产业链变成可见对象。
4. 情绪感：强化判断、风险、转折和结尾。
```

不应把 B-roll 当成“哪里没卡就随便补画面”。

## 2. 什么时候优先用 B-roll

```text
1. 口播在讲真实世界对象：工厂、设备、火箭、卫星、机器人、晶圆厂。
2. 口播在讲情绪判断：别只看热闹、真正的问题是、市场可能看错了。
3. 连续出现两张卡之后。
4. 卡片会挡脸或挡重要画面。
5. 段落没有新数字、新结构、新对比。
6. 需要让视频更像发布版，而不是 PPT 录屏。
```

## 3. B-roll 类型

| 类型 | 适合段落 | 示例 |
|---|---|---|
| 场景镜头 | 行业背景、开头定调 | 工厂、实验室、发射场、数据中心 |
| 动作镜头 | 解释“正在发生什么” | 机器人搬运、火箭发射、设备装机 |
| 细节镜头 | 强化专业感 | 晶圆、机械臂、线缆、终端、仪表盘 |
| 抽象动画 | 概念难以实拍 | 轨道、网络、算力流、电力流、供应链迁移 |
| 新闻/资料感镜头 | 产业进展 | 发布会、产线、展会、工程现场 |
| A-roll 回切 | 强判断、结论、互动 | 数字人/真人正面口播 |

## 4. 行业素材关键词

### 4.1 商业航天

剪映 / 素材站搜索词：

```text
火箭发射
可回收火箭
低轨卫星
卫星星座
地面站
遥感卫星
卫星互联网
地球轨道动画
卫星终端
航天测控
```

AI B-roll 提示词方向：

```text
9:16 vertical cinematic shot, reusable rocket launching at dawn, realistic aerospace launch site, clean documentary style, no text, no logo

9:16 vertical animation, low earth orbit satellite constellation around earth, blue and gold technology style, realistic, no text

9:16 vertical close-up, satellite ground terminal on rooftop connecting to orbiting satellites, documentary realism, no brand logo
```

适合段落：

```text
1. 发射不是终点。
2. 星座组网。
3. 地面终端连接。
4. 下游应用付费。
```

### 4.2 人形机器人

搜索词：

```text
人形机器人 工厂
机器人 搬运
机器人 装配
机器人 拧螺丝
机器人 仓储
工业机器人 产线
特斯拉 Optimus
机器人 Demo
```

AI B-roll 提示词方向：

```text
9:16 vertical realistic factory floor, humanoid robot carrying boxes beside human workers, documentary lighting, no text, no logo

9:16 vertical close-up, humanoid robot hand using screwdriver on assembly line, industrial realism, shallow depth of field

9:16 vertical contrast shot, robot dancing on stage transitioning to robot working in factory, realistic, no text
```

适合段落：

```text
1. Demo 不等于产品。
2. 真正拐点是进工厂。
3. 稳定干活、成本下降、客户付费。
```

### 4.3 半导体设备

搜索词：

```text
晶圆厂
半导体设备
光刻机
刻蚀设备
薄膜沉积
清洗设备
CMP
晶圆检测
洁净室
设备装机
```

AI B-roll 提示词方向：

```text
9:16 vertical ultra clean semiconductor fab, engineers installing wafer processing equipment, realistic documentary style, no text, no logo

9:16 vertical close-up, silicon wafer moving through automated semiconductor tool, cleanroom lighting, high precision machinery

9:16 vertical cinematic shot, semiconductor lithography machine in cleanroom, engineers in bunny suits, realistic, no text
```

适合段落：

```text
1. 造芯片的机器。
2. 样机到晶圆厂验证。
3. 装机、良率、收入确认。
4. 国产替代进入产线。
```

### 4.4 AI 算力 / 服务器电源

搜索词：

```text
数据中心
AI 服务器
GPU 服务器
服务器机柜
液冷数据中心
电源模块
高压直流 HVDC
机房运维
算力中心
```

AI B-roll 提示词方向：

```text
9:16 vertical cinematic data center aisle, high density AI server racks, blue lighting, documentary realism, no text, no logo

9:16 vertical close-up, power supply modules and thick power cables inside AI server rack, realistic industrial detail

9:16 vertical animation, electricity flow feeding GPU server racks, blue and gold technical visualization, no text
```

适合段落：

```text
1. AI 算力最后都要吃电。
2. 机柜功率提升。
3. 高效供电、液冷、系统方案。
4. 认证到批量交付。
```

### 4.5 CPO / 光通信

搜索词：

```text
光模块
数据中心 光纤
硅光芯片
交换机
光通信
高速互连
AI 数据中心 网络
光纤连接
```

AI B-roll 提示词方向：

```text
9:16 vertical macro shot, fiber optic cables connected to high speed data center switch, glowing blue light, realistic, no text

9:16 vertical technical animation, optical signal moving from pluggable module closer to chip package, blue and gold, no text

9:16 vertical close-up, silicon photonics chip and optical fibers on lab bench, clean technology documentary style
```

适合段落：

```text
1. 光模块印钞机可能易主。
2. 功耗瓶颈。
3. 模块厂到芯片厂/光引擎/先进封装。
4. 长期终局与短期节奏差。
```

## 5. AI B-roll 提示词规则

通用结构：

```text
9:16 vertical + subject + action/scene + style + constraints
```

推荐模板：

```text
9:16 vertical realistic documentary shot, [主体] [动作/场景], industry research video style, clean lighting, no text, no logo, no watermark
```

技术动画模板：

```text
9:16 vertical technical animation, [技术对象] showing [变化/流动/连接], blue and gold color palette, clean Swiss information design, no text, no logo
```

禁止项：

```text
1. 不要生成带错误文字的画面。
2. 不要生成夸张科幻感过强的画面。
3. 不要出现真实公司 logo，除非素材授权明确。
4. 不要用股票 K 线替代产业镜头。
5. 不要用过度炫酷的赛博朋克风破坏 Industry 7View 克制感。
```

## 6. B-roll 与卡片的配合

| 口播类型 | 优先画面 |
|---|---|
| 数字证据 | DataHero + 轻 B-roll 背景 |
| 误解纠偏 | Compare + 对应反例 B-roll |
| 商业闭环 | BusinessLoop + 场景 B-roll 穿插 |
| 行业类比 | LogisticsCard 或真实类比 B-roll |
| 跟踪指标 | Checklist + 素材快速切换 |
| 结尾金句 | A-roll 回切或 ClosingQuote |

## 7. 素材命名规则

推荐素材目录命名：

```text
主题_slug/
  01-hook/
  02-context/
  03-structure/
  04-data/
  05-closing/
```

文件命名：

```text
{主题}-{段落}-{镜头内容}-{来源}.{ext}
```

示例：

```text
commercial-space-03-satellite-constellation-ai.mp4
humanoid-robot-02-factory-carrying-stock.mp4
semiconductor-equipment-04-cleanroom-installation-ai.mp4
```

## 8. 质量检查

B-roll 合格标准：

```text
1. 一眼能看出行业对象。
2. 不抢口播字幕。
3. 不带无授权 logo。
4. 不出现乱码文字。
5. 画面风格克制，不像纯广告片。
6. 能和 Industry 7View 深蓝、金色、浅纸底视觉系统共存。
```
