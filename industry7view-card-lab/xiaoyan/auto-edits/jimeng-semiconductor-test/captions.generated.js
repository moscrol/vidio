export const CAPTIONS = [
  {
    "start": 3.056,
    "end": 6.111,
    "text": "国产化就是把设备造出"
  },
  {
    "start": 6.111,
    "end": 9.167,
    "text": "来但真正的门砍不再"
  },
  {
    "start": 9.167,
    "end": 12.222,
    "text": "发布会也不再实验室样"
  },
  {
    "start": 12.222,
    "end": 15.278,
    "text": "机而在晶圆厂敢不敢"
  },
  {
    "start": 15.278,
    "end": 18.333,
    "text": "用为什么因为芯片制"
  },
  {
    "start": 18.333,
    "end": 21.389,
    "text": "造不是普通工厂一台设"
  },
  {
    "start": 21.389,
    "end": 24.444,
    "text": "备只要不稳定就可能造"
  }
];

export function captionAt(time) {
  return CAPTIONS.find((caption) => time >= caption.start && time < caption.end);
}
