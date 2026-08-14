import { xiaoyanCharacter } from "../character.js";
import {
  easeOut,
  holdProgress,
  progress,
  pulse,
  setReveal,
} from "../sketch-primitives.js";

const GROUPS = [
  ["能跑通", 0, 1],
  ["敢使用", 2, 3],
  ["能赚钱", 4, 6],
];

const STAGES = [
  ["样机", "能跑通", "run"],
  ["客户验证", "敢使用", "run"],
  ["小批量", "进工艺", "use"],
  ["长期跑产", "稳得住", "use"],
  ["批量订单", "愿复购", "earn"],
  ["收入确认", "进报表", "earn"],
  ["毛利兑现", "能赚钱", "earn"],
];

export function mountValidationScroll(host) {
  host.innerHTML = `
    <div class="scene-content validation-scroll">
      <div class="scene-kicker">从“能跑通”到“能赚钱”</div>
      <h2 class="scene-title">中间隔着一条<br><span class="blue">很长的验证链</span></h2>
      <div class="scroll-track"></div>
      <div class="scroll-groups">
        ${GROUPS.map(([title, start, end], index) => `
          <div class="scroll-group group-${index}" style="--start:${start};--span:${end - start + 1}">
            ${title}
          </div>`).join("")}
      </div>
      <div class="scroll-stages">
        ${STAGES.map(([title, note, group], index) => `
          <div class="scroll-stage stage-${index}" data-group="${group}">
            <span>${index + 1}</span><strong>${title}</strong><small>${note}</small>
          </div>`).join("")}
      </div>
      ${xiaoyanCharacter({ className: "scroll-xiaoyan", pose: "walk" })}
      <div class="long-run-hold">真实工艺里<br><strong>稳定跑产</strong></div>
      <div class="scroll-distance">
        <span>能跑通</span><i></i><strong>能赚钱</strong>
      </div>
    </div>`;
}

export function updateValidationScroll(host, time, duration) {
  setReveal(
    host.querySelector(".scene-title"),
    easeOut(progress(time, duration, 0, 0.08)),
    28,
  );
  const journey = holdProgress(time, duration, 0.06, 0.92, 0.56, 0.66);
  const easedJourney = easeOut(journey);
  host.querySelector(".scroll-track").style.transform = `scaleX(${journey.toFixed(4)})`;
  host.querySelectorAll(".scroll-group").forEach((group, index) => {
    const amount = easeOut(progress(time, duration, 0.1 + index * 0.24, 0.24 + index * 0.24));
    group.style.opacity = String(amount);
    group.style.transform = `translateY(${((1 - amount) * 18).toFixed(1)}px)`;
  });
  const stages = [...host.querySelectorAll(".scroll-stage")];
  stages.forEach((stage, index) => {
    const starts = [0.09, 0.17, 0.33, 0.49, 0.69, 0.76, 0.83];
    const start = starts[index];
    const amount = easeOut(progress(time, duration, start, start + 0.11));
    const hit = pulse(time, duration, start, start + 0.12);
    stage.style.opacity = String(amount);
    stage.style.transform = `translateY(${((1 - amount) * 38).toFixed(1)}px) scale(${(0.88 + amount * 0.12 + hit * 0.025).toFixed(3)})`;
    stage.classList.toggle("active", easedJourney >= (index + 0.45) / stages.length);
  });
  const character = host.querySelector(".scroll-xiaoyan");
  character.style.left = `${64 + easedJourney * 456}px`;
  character.style.transform = `scale(.62) translateY(${(Math.sin(easedJourney * Math.PI * 14) * 5).toFixed(1)}px)`;
  const hold = pulse(time, duration, 0.54, 0.69);
  host.querySelector(".long-run-hold").style.opacity = String(hold);
  host.querySelector(".long-run-hold").style.transform = `scale(${(0.92 + hold * 0.08).toFixed(3)}) rotate(-3deg)`;
  setReveal(
    host.querySelector(".scroll-distance"),
    easeOut(progress(time, duration, 0.79, 0.98)),
    20,
  );
}
