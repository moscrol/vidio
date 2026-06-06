import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, setReveal } from "../sketch-primitives.js";

export function mountGateLens(host) {
  host.innerHTML = `
    <div class="scene-content gate-lens">
      <div class="scene-kicker">半导体设备国产化</div>
      <h2 class="scene-title">真正的门槛<br><span class="blue">不在发布会</span></h2>
      <div class="false-bubble bubble-launch">发布会</div>
      <div class="false-bubble bubble-lab">实验室样机</div>
      <div class="fab-gate">
        <div class="fab-roof"></div>
        <div class="fab-door"></div>
        <strong>晶圆厂</strong>
      </div>
      <div class="gate-stamp">敢不敢用？</div>
      ${xiaoyanCharacter({ className: "gate-xiaoyan", pose: "push" })}
      <div class="focus-beam"></div>
      <div class="scribble-ring gate-ring"></div>
    </div>`;
}

export function updateGateLens(host, time, duration) {
  const title = easeOut(progress(time, duration, 0, 0.2));
  const push = easeOut(progress(time, duration, 0.12, 0.5));
  const gate = easeOut(progress(time, duration, 0.34, 0.72));
  const stamp = easeOut(progress(time, duration, 0.68, 0.96));
  setReveal(host.querySelector(".scene-title"), title, 34);
  const launch = host.querySelector(".bubble-launch");
  const lab = host.querySelector(".bubble-lab");
  const bubbleOpacity = push * (1 - progress(push, 1, 0.58, 1));
  launch.style.opacity = String(bubbleOpacity);
  launch.style.transform = `translateX(${(-138 * push).toFixed(1)}px) rotate(-${(8 * push).toFixed(1)}deg)`;
  lab.style.opacity = String(bubbleOpacity);
  lab.style.transform = `translateX(${(128 * push).toFixed(1)}px) rotate(${(7 * push).toFixed(1)}deg)`;
  const fab = host.querySelector(".fab-gate");
  fab.style.opacity = String(gate);
  fab.style.transform = `scale(${(0.65 + gate * 0.35).toFixed(3)})`;
  const beam = host.querySelector(".focus-beam");
  beam.style.opacity = String(gate);
  beam.style.transform = `scaleX(${gate.toFixed(3)})`;
  const character = host.querySelector(".gate-xiaoyan");
  character.style.transform = `translateX(${(push * 78).toFixed(1)}px)`;
  setReveal(host.querySelector(".gate-stamp"), stamp, 22);
  host.querySelector(".gate-ring").style.opacity = String(stamp * 0.32);
}
