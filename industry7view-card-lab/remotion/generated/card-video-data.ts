export type CardVideoSegment = {
  cardId: string;
  start: number;
  duration: number;
  recipe: string;
  startInFrames: number;
  durationInFrames: number;
  assetPath: string;
  renderMode: 'png' | 'native';
  card: Record<string, unknown> | null;
};

export type SubtitleCue = {
  start: number;
  end: number;
  text: string;
  startInFrames: number;
  endInFrames: number;
};

export type BrollSegmentData = {
  startInFrames: number;
  durationInFrames: number;
  src: string;
  kind: 'video' | 'image';
  fit: 'cover' | 'contain';
  opacity: number;
  fadeInFrames: number;
  fadeOutFrames: number;
  trimStartInFrames: number;
  motion: 'kenBurns' | 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown' | 'still' | null;
};

export type PublishIntroData = {
  brand: string;
  kicker: string;
  titleHtml: string;
  subtitle: string;
  badge: string;
};

export type PublishOutroData = {
  brand: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type PublishMeta =
  | { enabled: false }
  | {
      enabled: true;
      brand: string;
      slug: string;
      introStartInFrames: number;
      introDurationInFrames: number;
      talkingHeadStartInFrames: number;
      outroStartInFrames: number;
      outroDurationInFrames: number;
      intro: PublishIntroData;
      outro: PublishOutroData;
    };

export type CardVideoData = {
  project: string;
  slug: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  cardSequenceDurationInFrames: number;
  talkingHeadVideoPath: string | null;
  talkingHeadDurationInFrames: number;
  talkingHeadStartInFrames: number;
  segments: CardVideoSegment[];
  subtitles: SubtitleCue[];
  brolls: BrollSegmentData[];
  publish: PublishMeta;
};

export const cardVideoData: CardVideoData = {
  "project": "自动生成短视频卡片计划",
  "slug": "semiconductor-equipment",
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "durationInFrames": 2835,
  "cardSequenceDurationInFrames": 2119,
  "talkingHeadVideoPath": "/semiconductor-equipment.mov",
  "talkingHeadDurationInFrames": 2706,
  "talkingHeadStartInFrames": 45,
  "segments": [
    {
      "cardId": "00-cover-card",
      "start": 0,
      "duration": 5.066,
      "recipe": "cover.titleFadeUp",
      "startInFrames": 45,
      "durationInFrames": 152,
      "assetPath": "/card-assets/semiconductor-equipment/00-cover-card.png",
      "renderMode": "png",
      "card": {
        "id": "00-cover-card",
        "type": "cover",
        "tag": "半导体设备",
        "kicker": "INDUSTRY 7VIEW / SEMI EQUIPMENT",
        "titleHtml": "半导体设备<br/>不是造出来就赢了",
        "subtitle": "真正的门槛，是晶圆厂敢不敢用",
        "badge": "半导体设备",
        "footer": "industry7view.com"
      }
    },
    {
      "cardId": "04-not-a-is-b",
      "start": 9.266,
      "duration": 5,
      "recipe": "compare.explainReveal",
      "startInFrames": 323,
      "durationInFrames": 150,
      "assetPath": "/card-assets/semiconductor-equipment/04-not-a-is-b.png",
      "renderMode": "native",
      "card": {
        "id": "04-not-a-is-b",
        "type": "compare",
        "tag": "核心区分",
        "oldText": "实验室样机",
        "newText": "晶圆厂验证",
        "leftLabel": "实验室样机",
        "leftText": "参数跑通 / 单点验证 / 发布会展示",
        "rightLabel": "晶圆厂验证",
        "rightText": "稳定跑产 / 良率不掉 / 客户敢复购",
        "explain": "半导体设备的商业化，不是看样机，而是看产线信任。",
        "footer": "能跑通 ≠ 敢上产线"
      }
    },
    {
      "cardId": "05-business-loop",
      "start": 25,
      "duration": 5,
      "recipe": "loop.sequentialStepHighlight",
      "startInFrames": 795,
      "durationInFrames": 150,
      "assetPath": "/card-assets/semiconductor-equipment/05-business-loop.png",
      "renderMode": "native",
      "card": {
        "id": "05-business-loop",
        "type": "orderValidation",
        "tag": "验证链条",
        "meta": "MILESTONES / 阶段门槛",
        "title": "从样机到订单要过几关",
        "stages": [
          {
            "label": "样机作出来",
            "status": "done"
          },
          {
            "label": "送客户验证",
            "status": "done"
          },
          {
            "label": "小批量导入",
            "status": "current",
            "desc": "正在导入头部产线"
          },
          {
            "label": "稳定跑产",
            "status": "next"
          },
          {
            "label": "批量订单",
            "status": "next"
          }
        ],
        "verdict": "核心是从技术可用走向客户敢用",
        "footer": "不看故事，看订单兑现链条"
      }
    },
    {
      "cardId": "06-tracking-checklist",
      "start": 64.133,
      "duration": 5,
      "recipe": "checklist.staggerReveal",
      "startInFrames": 1969,
      "durationInFrames": 150,
      "assetPath": "/card-assets/semiconductor-equipment/06-tracking-checklist.png",
      "renderMode": "png",
      "card": {
        "id": "06-tracking-checklist",
        "type": "checklist",
        "tag": "跟踪清单",
        "titleHtml": "半导体设备<br/><span class=\"gold\">看三个信号</span>",
        "items": [
          {
            "title": "进验证",
            "desc": "有没有进入头部晶圆厂验证。"
          },
          {
            "title": "有复购",
            "desc": "有没有从首台套变成重复订单。"
          },
          {
            "title": "能兑现",
            "desc": "收入和毛利有没有真正兑现。"
          }
        ],
        "footer": "看投资兑现：验证、复购、毛利。"
      }
    }
  ],
  "subtitles": [
    {
      "start": 0,
      "end": 3.066,
      "text": "很多人以为，半导体设备国产化，",
      "startInFrames": 45,
      "endInFrames": 137
    },
    {
      "start": 3.066,
      "end": 5.066,
      "text": "就是设备终于造出来了。",
      "startInFrames": 137,
      "endInFrames": 197
    },
    {
      "start": 5.066,
      "end": 7.6,
      "text": "但真正的门槛，不在发布会，",
      "startInFrames": 197,
      "endInFrames": 273
    },
    {
      "start": 7.6,
      "end": 9.266,
      "text": "也不在实验室样机，",
      "startInFrames": 273,
      "endInFrames": 323
    },
    {
      "start": 9.266,
      "end": 11.4,
      "text": "而在晶圆厂敢不敢用。",
      "startInFrames": 323,
      "endInFrames": 387
    },
    {
      "start": 11.4,
      "end": 12.2,
      "text": "为什么？",
      "startInFrames": 387,
      "endInFrames": 411
    },
    {
      "start": 12.2,
      "end": 14.6,
      "text": "因为芯片制造不是普通工厂，",
      "startInFrames": 411,
      "endInFrames": 483
    },
    {
      "start": 14.6,
      "end": 16.566,
      "text": "一台设备只要不稳定，",
      "startInFrames": 483,
      "endInFrames": 542
    },
    {
      "start": 16.566,
      "end": 19.033,
      "text": "就可能影响良率、污染晶圆，",
      "startInFrames": 542,
      "endInFrames": 616
    },
    {
      "start": 19.033,
      "end": 21,
      "text": "甚至拖慢整条产线。",
      "startInFrames": 616,
      "endInFrames": 675
    },
    {
      "start": 21,
      "end": 25,
      "text": "所以半导体设备从“能跑通”到“能赚钱”，",
      "startInFrames": 675,
      "endInFrames": 795
    },
    {
      "start": 25,
      "end": 27.8,
      "text": "中间隔着一条很长的验证链。",
      "startInFrames": 795,
      "endInFrames": 879
    },
    {
      "start": 27.8,
      "end": 29.933,
      "text": "第一步，是样机做出来。",
      "startInFrames": 879,
      "endInFrames": 943
    },
    {
      "start": 29.933,
      "end": 32.4,
      "text": "第二步，是送到客户那里验证。",
      "startInFrames": 943,
      "endInFrames": 1017
    },
    {
      "start": 32.4,
      "end": 34.833,
      "text": "第三步，是小批量导入，",
      "startInFrames": 1017,
      "endInFrames": 1090
    },
    {
      "start": 34.833,
      "end": 38.033,
      "text": "看它能不能在真实工艺里稳定运行。",
      "startInFrames": 1090,
      "endInFrames": 1186
    },
    {
      "start": 38.033,
      "end": 40.4,
      "text": "第四步，是长期跑产，",
      "startInFrames": 1186,
      "endInFrames": 1257
    },
    {
      "start": 40.4,
      "end": 42.066,
      "text": "看良率、稳定性、",
      "startInFrames": 1257,
      "endInFrames": 1307
    },
    {
      "start": 42.066,
      "end": 45,
      "text": "维护成本和备件供应能不能扛住。",
      "startInFrames": 1307,
      "endInFrames": 1395
    },
    {
      "start": 45,
      "end": 49.166,
      "text": "最后，才是批量订单、收入确认和毛利兑现。",
      "startInFrames": 1395,
      "endInFrames": 1520
    },
    {
      "start": 49.166,
      "end": 52.933,
      "text": "这就是为什么半导体设备公司最硬的壁垒，",
      "startInFrames": 1520,
      "endInFrames": 1633
    },
    {
      "start": 52.933,
      "end": 54.6,
      "text": "不只是技术参数，",
      "startInFrames": 1633,
      "endInFrames": 1683
    },
    {
      "start": 54.6,
      "end": 57.266,
      "text": "而是客户认证和产线信任。",
      "startInFrames": 1683,
      "endInFrames": 1763
    },
    {
      "start": 57.266,
      "end": 59.766,
      "text": "一个设备进入晶圆厂认证，",
      "startInFrames": 1763,
      "endInFrames": 1838
    },
    {
      "start": 59.766,
      "end": 62.833,
      "text": "常见周期可能是 12 到 24 个月。",
      "startInFrames": 1838,
      "endInFrames": 1930
    },
    {
      "start": 62.833,
      "end": 64.133,
      "text": "所以看这个行业，",
      "startInFrames": 1930,
      "endInFrames": 1969
    },
    {
      "start": 64.133,
      "end": 68.066,
      "text": "别只问有没有国产替代故事，要问三个问题。",
      "startInFrames": 1969,
      "endInFrames": 2087
    },
    {
      "start": 68.066,
      "end": 71.066,
      "text": "第一，有没有进入头部晶圆厂验证？",
      "startInFrames": 2087,
      "endInFrames": 2177
    },
    {
      "start": 71.066,
      "end": 74.766,
      "text": "第二，有没有从首台套变成重复订单？",
      "startInFrames": 2177,
      "endInFrames": 2288
    },
    {
      "start": 74.766,
      "end": 78.2,
      "text": "第三，收入和毛利有没有真正兑现？",
      "startInFrames": 2288,
      "endInFrames": 2391
    },
    {
      "start": 78.2,
      "end": 80,
      "text": "半导体设备国产化，",
      "startInFrames": 2391,
      "endInFrames": 2445
    },
    {
      "start": 80,
      "end": 82.533,
      "text": "真正的终点不是“我们做出来了”。",
      "startInFrames": 2445,
      "endInFrames": 2521
    },
    {
      "start": 82.533,
      "end": 85.4,
      "text": "而是晶圆厂敢用、产线跑得稳、",
      "startInFrames": 2521,
      "endInFrames": 2607
    },
    {
      "start": 85.4,
      "end": 87.166,
      "text": "客户愿意继续下单。",
      "startInFrames": 2607,
      "endInFrames": 2660
    },
    {
      "start": 87.166,
      "end": 90.2,
      "text": "这才是从题材，变成生意的那一刻。",
      "startInFrames": 2660,
      "endInFrames": 2751
    }
  ],
  "brolls": [
    {
      "startInFrames": 345,
      "durationInFrames": 120,
      "src": "/card-assets/semiconductor-equipment/00-cover-card.png",
      "kind": "image",
      "fit": "cover",
      "opacity": 1,
      "fadeInFrames": 6,
      "fadeOutFrames": 6,
      "trimStartInFrames": 0,
      "motion": "kenBurns"
    },
    {
      "startInFrames": 945,
      "durationInFrames": 105,
      "src": "/card-assets/semiconductor-equipment/04-not-a-is-b.png",
      "kind": "image",
      "fit": "cover",
      "opacity": 1,
      "fadeInFrames": 6,
      "fadeOutFrames": 6,
      "trimStartInFrames": 0,
      "motion": "zoomIn"
    },
    {
      "startInFrames": 1695,
      "durationInFrames": 120,
      "src": "/card-assets/semiconductor-equipment/06-tracking-checklist.png",
      "kind": "image",
      "fit": "cover",
      "opacity": 1,
      "fadeInFrames": 6,
      "fadeOutFrames": 6,
      "trimStartInFrames": 0,
      "motion": "panRight"
    }
  ],
  "publish": {
    "enabled": true,
    "brand": "INDUSTRY 7VIEW",
    "slug": "semiconductor-equipment",
    "introStartInFrames": 0,
    "introDurationInFrames": 45,
    "talkingHeadStartInFrames": 45,
    "outroStartInFrames": 2751,
    "outroDurationInFrames": 84,
    "intro": {
      "brand": "INDUSTRY 7VIEW",
      "kicker": "INDUSTRY 7VIEW / SEMI EQUIPMENT",
      "titleHtml": "半导体设备<br/>不是造出来就赢了",
      "subtitle": "真正的门槛，是晶圆厂敢不敢用",
      "badge": "半导体设备"
    },
    "outro": {
      "brand": "INDUSTRY 7VIEW",
      "ctaPrimary": "关注获取完整研报",
      "ctaSecondary": "克制研究 · 不喊口号"
    }
  }
};
