import { xiaoyanCharacter } from "../character.js";
import { easeOut, progress, setReveal } from "../sketch-primitives.js";

export function mountBusinessProof(host) {
  host.innerHTML = `
    <div class="scene-content business-proof">
      <div class="scene-kicker">国产化的真正终点</div>
      <h2 class="scene-title">从题材<br><span class="red">变成生意</span></h2>
      <div class="idea-bubble">我们做出来了</div>
      <div class="proof-line">
        <div class="proof-fab">晶圆厂敢用</div>
        <div class="proof-orders"><i>订单</i><i>复购</i><i>订单</i></div>
        <div class="margin-chart"><span>毛利兑现</span><svg viewBox="0 0 240 120"><polyline points="8,103 52,94 92,76 132,79 176,48 230,20"/></svg></div>
      </div>
      ${xiaoyanCharacter({ className: "proof-xiaoyan", pose: "writing" })}
      <div class="not-done-cross">不是<br>做出来</div>
      <div class="payoff-stamps">
        <i>敢用</i><i>跑稳</i><i>复购</i><i>毛利兑现</i>
      </div>
      <div class="proof-focus"></div>
    </div>`;
}

export function updateBusinessProof(host, time, duration) {
  setReveal(host.querySelector(".scene-title"), easeOut(progress(time, duration, 0, 0.18)), 30);
  const bubble = easeOut(progress(time, duration, 0.1, 0.38));
  const burst = easeOut(progress(time, duration, 0.32, 0.55));
  const idea = host.querySelector(".idea-bubble");
  idea.style.opacity = String(bubble * (1 - burst));
  idea.style.transform = `scale(${(0.7 + bubble * 0.3 + burst * 0.28).toFixed(3)}) rotate(${(burst * 9).toFixed(1)}deg)`;
  host.querySelectorAll(".proof-line > div").forEach((item, index) => {
    const amount = easeOut(progress(time, duration, 0.38 + index * 0.16, 0.62 + index * 0.16));
    item.style.opacity = String(amount);
    item.style.transform = `translateY(${((1 - amount) * 48).toFixed(1)}px)`;
  });
  const cross = easeOut(progress(time, duration, 0.18, 0.4));
  const crossExit = progress(time, duration, 0.44, 0.62);
  host.querySelector(".not-done-cross").style.opacity = String(cross * (1 - crossExit));
  host.querySelector(".not-done-cross").style.transform = `rotate(-8deg) scale(${(0.86 + cross * 0.18).toFixed(3)})`;
  host.querySelectorAll(".payoff-stamps i").forEach((stamp, index) => {
    const amount = easeOut(progress(time, duration, 0.42 + index * 0.1, 0.58 + index * 0.1));
    stamp.style.opacity = String(amount);
    stamp.style.transform = `translateY(${((1 - amount) * 22).toFixed(1)}px) rotate(${(-5 + index * 3).toFixed(1)}deg)`;
  });
  const focus = easeOut(progress(time, duration, 0.78, 0.98));
  host.querySelector(".proof-focus").style.opacity = String(focus);
  host.querySelector(".proof-focus").style.transform = `scale(${(0.72 + focus * 0.28).toFixed(3)})`;
  host.querySelector(".proof-xiaoyan").style.transform = `scale(.66) translateX(${(focus * 44).toFixed(1)}px)`;
}
