import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, setReveal } from "../sketch-primitives.js";

const STAGES = [
  ["样机", "能跑通"],
  ["客户验证", "敢使用"],
  ["小批量", "进工艺"],
  ["长期跑产", "稳得住"],
  ["批量订单", "愿复购"],
  ["收入确认", "进报表"],
  ["毛利兑现", "能赚钱"],
];

export function mountValidationScroll(host) {
  host.innerHTML = `
    <div class="scene-content validation-scroll">
      <div class="scene-kicker">从“能跑通”到“能赚钱”</div>
      <h2 class="scene-title">中间隔着一条<br><span class="blue">很长的验证链</span></h2>
      <div class="scroll-track"></div>
      <div class="scroll-stages">
        ${STAGES.map(([title, note], index) => `
          <div class="scroll-stage stage-${index}">
            <span>${index + 1}</span><strong>${title}</strong><small>${note}</small>
          </div>`).join("")}
      </div>
      ${xiaoyanCharacter({ className: "scroll-xiaoyan", pose: "walk" })}
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
  const journey = easeOut(progress(time, duration, 0.08, 0.9));
  host.querySelector(".scroll-track").style.transform = `scaleX(${journey.toFixed(4)})`;
  const stages = [...host.querySelectorAll(".scroll-stage")];
  stages.forEach((stage, index) => {
    const start = 0.1 + index * 0.105;
    const amount = easeOut(progress(time, duration, start, start + 0.12));
    stage.style.opacity = String(amount);
    stage.style.transform = `translateY(${((1 - amount) * 38).toFixed(1)}px) scale(${(0.88 + amount * 0.12).toFixed(3)})`;
    stage.classList.toggle("active", journey >= (index + 0.45) / stages.length);
  });
  const character = host.querySelector(".scroll-xiaoyan");
  character.style.left = `${64 + journey * 488}px`;
  character.style.transform = `scale(.72) translateY(${(Math.sin(journey * Math.PI * 14) * 6).toFixed(1)}px)`;
  setReveal(
    host.querySelector(".scroll-distance"),
    easeOut(progress(time, duration, 0.79, 0.98)),
    20,
  );
}

