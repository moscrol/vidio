export const CAPTIONS = [
  [5, 6.56, "就是把设备造出来。"],
  [6.56, 7.65, "但真正的门槛，"],
  [8.27, 9.16, "不在发布会，"],
  [9.64, 11, "也不在实验室样机。"],
  [15, 15.55, "为什么？"],
  [16.05, 18.54, "因为芯片制造，不是普通工厂。"],
  [19.11, 21, "一台设备只要不稳定，"],
  [21, 22.7, "就可能造成良率下降，"],
  [22.99, 23.86, "晶圆污染，"],
  [24.4, 26.5, "甚至拖慢整条产线。"],
].map(([start, end, text]) => ({ start, end, text }));

export function captionAt(time) {
  return CAPTIONS.find((caption) => time >= caption.start && time < caption.end);
}
