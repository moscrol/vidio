import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, setReveal } from "../sketch-primitives.js";

export function mountCertificationTunnel(host) {
  host.innerHTML = `
    <div class="scene-content certification-tunnel">
      <div class="scene-kicker">客户认证，是慢变量</div>
      <h2 class="hero-number"><span>12</span><i>-</i><span>24</span><small>个月</small></h2>
      <div class="month-ruler">
        ${Array.from({ length: 24 }, (_, index) => `<i class="${[5, 11, 17, 23].includes(index) ? "major" : ""}"><span>${index + 1}</span></i>`).join("")}
      </div>
      <div class="checkpoint cp-test">测试</div>
      <div class="checkpoint cp-fix">整改</div>
      <div class="checkpoint cp-retest">复验</div>
      ${xiaoyanCharacter({ className: "tunnel-xiaoyan", pose: "inspect" })}
      <div class="scene-note tunnel-note">别只问有没有国产替代故事。</div>
    </div>`;
}

export function updateCertificationTunnel(host, time, duration) {
  const hero = easeOut(progress(time, duration, 0, 0.28));
  setReveal(host.querySelector(".hero-number"), hero, 34);
  const ruler = easeOut(progress(time, duration, 0.12, 0.88));
  host.querySelector(".month-ruler").style.transform = `scaleX(${ruler.toFixed(3)})`;
  host.querySelectorAll(".checkpoint").forEach((checkpoint, index) => {
    const amount = easeOut(progress(time, duration, 0.3 + index * 0.17, 0.5 + index * 0.17));
    checkpoint.style.opacity = String(amount);
    checkpoint.style.transform = `translateY(${((1 - amount) * 25).toFixed(1)}px)`;
  });
  const character = host.querySelector(".tunnel-xiaoyan");
  character.style.left = `${42 + ruler * 448}px`;
  character.style.transform = "scale(.58)";
  setReveal(host.querySelector(".tunnel-note"), easeOut(progress(time, duration, 0.72, 0.98)), 16);
}
