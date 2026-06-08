import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, pulse, setReveal } from "../sketch-primitives.js";

export function mountRiskDomino(host) {
  host.innerHTML = `
    <div class="scene-content risk-domino">
      <div class="scene-kicker">一台设备不稳定</div>
      <h2 class="scene-title">会推倒整条<br><span class="red">产线多米诺</span></h2>
      <div class="machine"><i></i><strong>设备</strong></div>
      <div class="domino-row">
        <div class="domino d1">良率<br>下降</div>
        <div class="domino d2">晶圆<br>污染</div>
        <div class="domino d3">产线<br>减速</div>
      </div>
      <div class="risk-wave"></div>
      <div class="risk-hit hit-yield">良率警报</div>
      <div class="risk-hit hit-wafer">污染扩散</div>
      <div class="risk-hit hit-line">产线减速</div>
      ${xiaoyanCharacter({ className: "risk-xiaoyan", pose: "brace" })}
      <div class="scene-note risk-note">芯片制造不是普通工厂，故障会沿工艺链放大。</div>
    </div>`;
}

export function updateRiskDomino(host, time, duration) {
  setReveal(
    host.querySelector(".scene-title"),
    easeOut(progress(time, duration, 0, 0.18)),
    30,
  );
  const machine = easeOut(progress(time, duration, 0.14, 0.38));
  host.querySelector(".machine").style.transform =
    `translateX(${(machine * 12).toFixed(1)}px) rotate(${(Math.sin(machine * Math.PI * 4) * 4).toFixed(1)}deg)`;
  host.querySelectorAll(".domino").forEach((item, index) => {
    const amount = easeOut(progress(time, duration, 0.28 + index * 0.15, 0.55 + index * 0.14));
    const hit = pulse(time, duration, 0.26 + index * 0.16, 0.42 + index * 0.16);
    item.style.opacity = String(amount);
    item.style.transform = `rotate(${(amount * (index + 1) * 7 + hit * 3).toFixed(1)}deg) translateY(${(amount * (index + 1) * 7).toFixed(1)}px) scale(${(1 + hit * 0.06).toFixed(3)})`;
  });
  const wave = easeOut(progress(time, duration, 0.38, 0.88));
  host.querySelector(".risk-wave").style.transform = `scaleX(${wave.toFixed(3)})`;
  host.querySelector(".risk-wave").style.opacity = String(wave);
  const hitWindows = [
    pulse(time, duration, 0.26, 0.42),
    pulse(time, duration, 0.42, 0.58),
    pulse(time, duration, 0.58, 0.78),
  ];
  host.querySelectorAll(".risk-hit").forEach((item, index) => {
    const hit = hitWindows[index];
    item.style.opacity = String(hit);
    item.style.transform = `scale(${(0.86 + hit * 0.2).toFixed(3)}) rotate(${(-4 + index * 4).toFixed(1)}deg)`;
  });
  const character = host.querySelector(".risk-xiaoyan");
  character.style.transform = `scale(.72) translateX(${(wave * 20).toFixed(1)}px) rotate(${(-wave * 4 - hitWindows[0] * 3).toFixed(1)}deg)`;
  setReveal(host.querySelector(".risk-note"), easeOut(progress(time, duration, 0.65, 0.96)), 18);
}
