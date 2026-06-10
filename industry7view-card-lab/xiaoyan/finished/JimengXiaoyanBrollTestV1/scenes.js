export const TOTAL_DURATION = 28.833333;

export const SCENES = [
  { id: "aroll-open", type: "aroll", start: 0, end: 5 },
  {
    id: "gate-lens",
    type: "xiaoyan",
    component: "XiaoyanGateLens",
    start: 5,
    end: 11,
  },
  { id: "aroll-turn", type: "aroll", start: 11, end: 15 },
  {
    id: "risk-domino",
    type: "xiaoyan",
    component: "XiaoyanRiskDomino",
    start: 15,
    end: 21,
  },
  {
    id: "validation-scroll",
    type: "xiaoyan",
    component: "XiaoyanValidationScroll",
    start: 21,
    end: 26.5,
  },
  { id: "aroll-close", type: "aroll", start: 26.5, end: TOTAL_DURATION },
];
