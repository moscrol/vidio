import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, setReveal } from "../sketch-primitives.js";

export function mountBarrierScale(host) {
  host.innerHTML = `
    <div class="scene-content barrier-scale">
      <div class="scene-kicker">最硬的壁垒</div>
      <h2 class="scene-title">不只是技术参数<br><span class="blue">而是认证与信任</span></h2>
      <div class="scale-rig">
        <div class="scale-beam"></div><div class="scale-post"></div>
        <div class="scale-pan pan-left">
          <div class="parameter-stack"><i>精度</i><i>效率</i><i>参数</i><i>规格</i></div>
        </div>
        <div class="scale-pan pan-right">
          <div class="trust-weight">客户认证</div>
          <div class="trust-weight">产线信任</div>
        </div>
      </div>
      ${xiaoyanCharacter({ className: "scale-xiaoyan", pose: "point" })}
      <div class="barrier-turn">参数很多<br><strong>但信任更重</strong></div>
      <div class="approval-stamp">真正壁垒</div>
    </div>`;
}

export function updateBarrierScale(host, time, duration) {
  setReveal(host.querySelector(".scene-title"), easeOut(progress(time, duration, 0, 0.18)), 30);
  const params = easeOut(progress(time, duration, 0.14, 0.44));
  host.querySelector(".parameter-stack").style.opacity = String(params);
  host.querySelector(".parameter-stack").style.transform = `translateY(${((1 - params) * 70).toFixed(1)}px)`;
  const trust = easeOut(progress(time, duration, 0.38, 0.72));
  host.querySelectorAll(".trust-weight").forEach((weight, index) => {
    weight.style.opacity = String(trust);
    weight.style.transform = `translateY(${((1 - trust) * (-95 - index * 30)).toFixed(1)}px)`;
  });
  host.querySelector(".scale-beam").style.transform = `rotate(${(trust * 10 - params * 3).toFixed(1)}deg)`;
  host.querySelector(".pan-left").style.transform = `translateY(${(-trust * 36).toFixed(1)}px)`;
  host.querySelector(".pan-right").style.transform = `translateY(${(trust * 36).toFixed(1)}px)`;
  setReveal(host.querySelector(".barrier-turn"), trust, 18);
  const stamp = easeOut(progress(time, duration, 0.68, 0.94));
  setReveal(host.querySelector(".approval-stamp"), stamp, 24);
  host.querySelector(".scale-xiaoyan").style.transform = `scale(.68) translateX(${(stamp * 42).toFixed(1)}px)`;
}
