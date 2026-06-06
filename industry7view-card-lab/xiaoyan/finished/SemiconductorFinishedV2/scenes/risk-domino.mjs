import { xiaoyanCharacter } from "../character.mjs";
import { easeOut, progress, setReveal } from "../sketch-primitives.mjs";

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
    item.style.opacity = String(amount);
    item.style.transform = `rotate(${(amount * (index + 1) * 7).toFixed(1)}deg) translateY(${(amount * (index + 1) * 7).toFixed(1)}px)`;
  });
  const wave = easeOut(progress(time, duration, 0.38, 0.88));
  host.querySelector(".risk-wave").style.transform = `scaleX(${wave.toFixed(3)})`;
  host.querySelector(".risk-wave").style.opacity = String(wave);
  const character = host.querySelector(".risk-xiaoyan");
  character.style.transform = `translateX(${(wave * 28).toFixed(1)}px) rotate(${(-wave * 5).toFixed(1)}deg)`;
  setReveal(host.querySelector(".risk-note"), easeOut(progress(time, duration, 0.65, 0.96)), 18);
}

