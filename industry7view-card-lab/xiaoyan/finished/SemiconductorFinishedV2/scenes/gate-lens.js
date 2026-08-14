import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, pulse, setReveal } from "../sketch-primitives.js";

export function mountGateLens(host) {
  host.innerHTML = `
    <div class="scene-content gate-lens">
      <div class="scene-kicker">半导体设备国产化</div>
      <h2 class="scene-title">真正的门槛<br><span class="blue">不在发布会</span></h2>
      <div class="misread-tag">误区：造出来就算成功</div>
      <div class="false-bubble bubble-launch">发布会</div>
      <div class="false-bubble bubble-lab">实验室样机</div>
      <div class="fab-gate">
        <div class="fab-roof"></div>
        <div class="fab-door"></div>
        <strong>晶圆厂</strong>
      </div>
      <div class="gate-stamp">敢不敢用？</div>
      <div class="gate-hit-line">真正问题</div>
      ${xiaoyanCharacter({ className: "gate-xiaoyan", pose: "point" })}
      <div class="focus-beam"></div>
      <div class="scribble-ring gate-ring"></div>
    </div>`;
}

export function updateGateLens(host, time, duration) {
  const title = easeOut(progress(time, duration, 0, 0.16));
  const push = easeOut(progress(time, duration, 0.08, 0.38));
  const gate = easeOut(progress(time, duration, 0.25, 0.58));
  const stamp = easeOut(progress(time, duration, 0.55, 0.9));
  const hit = pulse(time, duration, 0.62, 0.84);
  setReveal(host.querySelector(".scene-title"), title, 34);
  setReveal(host.querySelector(".misread-tag"), easeOut(progress(time, duration, 0.03, 0.18)), 18);
  const launch = host.querySelector(".bubble-launch");
  const lab = host.querySelector(".bubble-lab");
  const bubbleOpacity = push * (1 - progress(push, 1, 0.42, 0.88));
  launch.style.opacity = String(bubbleOpacity);
  launch.style.transform = `translateX(${(-168 * push).toFixed(1)}px) rotate(-${(12 * push).toFixed(1)}deg)`;
  lab.style.opacity = String(bubbleOpacity);
  lab.style.transform = `translateX(${(154 * push).toFixed(1)}px) rotate(${(10 * push).toFixed(1)}deg)`;
  const fab = host.querySelector(".fab-gate");
  fab.style.opacity = String(gate);
  fab.style.transform = `scale(${(0.6 + gate * 0.4 + hit * 0.035).toFixed(3)})`;
  const beam = host.querySelector(".focus-beam");
  beam.style.opacity = String(gate);
  beam.style.transform = `scaleX(${gate.toFixed(3)})`;
  const character = host.querySelector(".gate-xiaoyan");
  character.style.transform = `scale(.76) translateX(${(push * 58).toFixed(1)}px) rotate(${(-hit * 2).toFixed(1)}deg)`;
  const stampElement = host.querySelector(".gate-stamp");
  setReveal(stampElement, stamp, 22);
  stampElement.style.transform = `translateY(${((1 - stamp) * 22).toFixed(2)}px) scale(${(1 + hit * 0.12).toFixed(3)}) rotate(-5deg)`;
  host.querySelector(".gate-hit-line").style.opacity = String(stamp);
  host.querySelector(".gate-hit-line").style.transform = `scaleX(${(0.72 + stamp * 0.28).toFixed(3)})`;
  host.querySelector(".gate-ring").style.opacity = String(stamp * (0.28 + hit * 0.34));
}
