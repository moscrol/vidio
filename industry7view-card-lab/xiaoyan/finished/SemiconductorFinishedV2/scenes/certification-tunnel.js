import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, pulse, setReveal } from "../sketch-primitives.js";

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
      <div class="cert-hold">先慢下来<br><strong>认证才是门槛</strong></div>
      ${xiaoyanCharacter({ className: "tunnel-xiaoyan", pose: "inspect" })}
      <div class="scene-note tunnel-note">别只问有没有国产替代故事。</div>
    </div>`;
}

export function updateCertificationTunnel(host, time, duration) {
  const hero = easeOut(progress(time, duration, 0, 0.28));
  const heroHit = pulse(time, duration, 0.08, 0.34);
  setReveal(host.querySelector(".hero-number"), hero, 34);
  host.querySelector(".hero-number").style.transform = `translateY(${((1 - hero) * 34).toFixed(2)}px) scale(${(1 + heroHit * 0.045).toFixed(3)})`;
  const ruler = easeOut(progress(time, duration, 0.12, 0.78));
  host.querySelector(".month-ruler").style.transform = `scaleX(${ruler.toFixed(3)})`;
  host.querySelectorAll(".checkpoint").forEach((checkpoint, index) => {
    const amount = easeOut(progress(time, duration, 0.3 + index * 0.17, 0.5 + index * 0.17));
    checkpoint.style.opacity = String(amount);
    checkpoint.style.transform = `translateY(${((1 - amount) * 25).toFixed(1)}px)`;
  });
  const character = host.querySelector(".tunnel-xiaoyan");
  character.style.left = `${42 + ruler * 448}px`;
  character.style.transform = "scale(.58)";
  const hold = pulse(time, duration, 0.56, 0.82);
  host.querySelector(".cert-hold").style.opacity = String(hold);
  host.querySelector(".cert-hold").style.transform = `scale(${(0.94 + hold * 0.08).toFixed(3)}) rotate(-3deg)`;
  setReveal(host.querySelector(".tunnel-note"), easeOut(progress(time, duration, 0.72, 0.98)), 16);
}
