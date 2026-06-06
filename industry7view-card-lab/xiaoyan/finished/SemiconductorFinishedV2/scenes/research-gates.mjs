import { xiaoyanCharacter } from "../character.mjs";
import { easeOut, progress, setReveal } from "../sketch-primitives.mjs";

const GATES = [
  ["01", "头部晶圆厂", "进入验证"],
  ["02", "首台套之后", "重复订单"],
  ["03", "收入与毛利", "真正兑现"],
];

export function mountResearchGates(host) {
  host.innerHTML = `
    <div class="scene-content research-gates">
      <div class="scene-kicker">研究半导体设备，要问三个问题</div>
      <h2 class="scene-title">小研的<br><span class="blue">三道检查门</span></h2>
      <div class="gate-row">
        ${GATES.map(([number, title, proof], index) => `
          <div class="research-gate gate-${index}">
            <span>${number}</span><strong>${title}</strong><small>${proof}</small><i>✓</i>
          </div>`).join("")}
      </div>
      ${xiaoyanCharacter({ className: "gates-xiaoyan", pose: "inspect" })}
      <div class="pass-light"><i></i><strong>通过</strong></div>
    </div>`;
}

export function updateResearchGates(host, time, duration) {
  setReveal(host.querySelector(".scene-title"), easeOut(progress(time, duration, 0, 0.16)), 30);
  const gates = [...host.querySelectorAll(".research-gate")];
  gates.forEach((gate, index) => {
    const enter = easeOut(progress(time, duration, 0.14 + index * 0.23, 0.34 + index * 0.23));
    const pass = easeOut(progress(time, duration, 0.28 + index * 0.23, 0.47 + index * 0.23));
    gate.style.opacity = String(enter);
    gate.style.transform = `translateY(${((1 - enter) * 55).toFixed(1)}px)`;
    gate.classList.toggle("passed", pass > 0.75);
  });
  const journey = easeOut(progress(time, duration, 0.16, 0.88));
  host.querySelector(".gates-xiaoyan").style.left = `${36 + journey * 500}px`;
  host.querySelector(".gates-xiaoyan").style.transform = "scale(.62)";
  const light = easeOut(progress(time, duration, 0.83, 0.98));
  setReveal(host.querySelector(".pass-light"), light, 18);
}

