# Semiconductor Rhythm Director v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing 90.2s semiconductor video from a flat explainer into a rhythm-directed cut with clear problem, pressure, turn, and payoff beats.

**Architecture:** Keep `SemiconductorFinishedV2` as the single HyperFrames composition and preserve the A-roll audio/video timing. Add small timing primitives and scene-local emphasis elements so each canvas can express pauses, hits, grouped progression, and payoff stamps without introducing a new rendering system or changing the avatar asset pack.

**Tech Stack:** HyperFrames HTML composition, vanilla ES modules, CSS animation primitives, ffmpeg muxing/QA, Node tests.

---

## File Structure

- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/sketch-primitives.js`: add reusable `pulse()` and `holdProgress()` helpers for emphasis and pauses.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/paper-transition.js`: give key A-roll/canvas boundaries stronger paper beats without black frames.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/captions.js`: tighten visual caption segmentation around “为什么?”, “不只是技术参数”, “不是我们做出来了”, and the final payoff.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/gate-lens.js`: make the misconception exit faster and the “敢不敢用?” stamp stronger.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/risk-domino.js`: add three sharp risk hits instead of smooth list reveal.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/validation-scroll.js`: group the seven stages into “能跑通 / 敢使用 / 能赚钱” with different tempo and a hold near long-term production.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/barrier-scale.js`: strengthen the contrast between parameters and certification/trust.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/certification-tunnel.js`: make “12-24 个月” the turn with a short visual hold.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/research-gates.js`: make gates pass one by one with stronger feedback.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/business-proof.js`: add the final negative-to-positive payoff with four stamps.
- Modify `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`: add styles for rhythm badges, group bands, hit rings, hold cards, and payoff stamps.
- Test with `validate-scenes.test.mjs`, avatar asset tests, HyperFrames lint, HyperFrames inspect, render, ffprobe, and 12-frame QA.

---

### Task 1: Add Rhythm Primitives

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/sketch-primitives.js`

- [ ] **Step 1: Add emphasis helpers**

Add these functions after `easeOut()`:

```js
export function easeInOut(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function pulse(localTime, duration, start, end) {
  const amount = progress(localTime, duration, start, end);
  return Math.sin(amount * Math.PI);
}

export function holdProgress(localTime, duration, start, end, holdStart, holdEnd) {
  const normalized = duration <= 0 ? 1 : localTime / duration;
  if (normalized <= holdStart) return progress(localTime, duration, start, holdStart) * 0.5;
  if (normalized <= holdEnd) return 0.5;
  return 0.5 + progress(localTime, duration, holdEnd, end) * 0.5;
}
```

- [ ] **Step 2: Run scene validation**

Run: `node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs`

Expected: `SemiconductorFinishedV2 scene validation passed`

- [ ] **Step 3: Commit**

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/sketch-primitives.js
git commit -m "add rhythm timing primitives"
```

---

### Task 2: Strengthen Opening And Risk Pressure

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/gate-lens.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/risk-domino.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`

- [ ] **Step 1: Update opening scene markup**

In `gate-lens.js`, add two beat labels inside `.gate-lens`:

```js
<div class="misread-tag">误区：造出来就算成功</div>
<div class="gate-hit-line">真正问题</div>
```

- [ ] **Step 2: Update opening scene timing**

Change `updateGateLens()` to:

```js
const title = easeOut(progress(time, duration, 0, 0.16));
const push = easeOut(progress(time, duration, 0.08, 0.38));
const gate = easeOut(progress(time, duration, 0.25, 0.58));
const stamp = easeOut(progress(time, duration, 0.55, 0.9));
const hit = pulse(time, duration, 0.62, 0.84);
```

Apply `hit` to scale the stamp and ring:

```js
const stampElement = host.querySelector(".gate-stamp");
setReveal(stampElement, stamp, 22);
stampElement.style.transform += ` scale(${(1 + hit * 0.12).toFixed(3)}) rotate(-5deg)`;
host.querySelector(".gate-ring").style.opacity = String(stamp * (0.28 + hit * 0.34));
host.querySelector(".gate-hit-line").style.opacity = String(stamp);
```

- [ ] **Step 3: Update risk scene markup**

In `risk-domino.js`, add risk impact labels after `.risk-wave`:

```js
<div class="risk-hit hit-yield">良率警报</div>
<div class="risk-hit hit-wafer">污染扩散</div>
<div class="risk-hit hit-line">产线减速</div>
```

- [ ] **Step 4: Update risk scene timing**

Import `pulse` and use three hit windows:

```js
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
```

- [ ] **Step 5: Add CSS**

Add styles for `.misread-tag`, `.gate-hit-line`, and `.risk-hit` in `styles.css`.

- [ ] **Step 6: Validate and commit**

Run:

```bash
node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs
npx hyperframes lint industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
```

Expected: validation pass and lint 0 errors, 0 warnings.

Commit:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/gate-lens.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/risk-domino.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css
git commit -m "strengthen opening and risk beats"
```

---

### Task 3: Rebuild Validation Chain Into Three Rhythm Groups

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/validation-scroll.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`

- [ ] **Step 1: Add group metadata**

Replace `STAGES` with:

```js
const GROUPS = [
  ["能跑通", 0, 1],
  ["敢使用", 2, 3],
  ["能赚钱", 4, 6],
];

const STAGES = [
  ["样机", "能跑通", "run"],
  ["客户验证", "敢使用", "run"],
  ["小批量", "进工艺", "use"],
  ["长期跑产", "稳得住", "use"],
  ["批量订单", "愿复购", "earn"],
  ["收入确认", "进报表", "earn"],
  ["毛利兑现", "能赚钱", "earn"],
];
```

- [ ] **Step 2: Add group bands and hold marker**

Inside `mountValidationScroll()`, add:

```js
<div class="scroll-groups">
  ${GROUPS.map(([title, start, end], index) => `
    <div class="scroll-group group-${index}" style="--start:${start};--span:${end - start + 1}">
      ${title}
    </div>`).join("")}
</div>
<div class="long-run-hold">真实工艺里<br>稳定跑产</div>
```

Add `data-group="${group}"` to each `.scroll-stage`.

- [ ] **Step 3: Change journey pacing**

Use `holdProgress(time, duration, 0.06, 0.92, 0.56, 0.66)` for the journey so long-term production pauses visually.

- [ ] **Step 4: Add group reveal timing**

Reveal groups at different tempos:

```js
host.querySelectorAll(".scroll-group").forEach((group, index) => {
  const amount = easeOut(progress(time, duration, 0.1 + index * 0.24, 0.24 + index * 0.24));
  group.style.opacity = String(amount);
  group.style.transform = `translateY(${((1 - amount) * 18).toFixed(1)}px)`;
});
```

- [ ] **Step 5: Add CSS**

Add `.scroll-groups`, `.scroll-group`, `.long-run-hold`, and group-specific stage treatment.

- [ ] **Step 6: Validate and commit**

Run validation and lint, then commit:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/validation-scroll.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css
git commit -m "group validation chain into rhythm beats"
```

---

### Task 4: Add Turn Pause And Research Gate Payoff

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/barrier-scale.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/certification-tunnel.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/research-gates.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`

- [ ] **Step 1: Strengthen barrier contrast**

Add:

```js
<div class="barrier-turn">参数很多<br><strong>但信任更重</strong></div>
```

Reveal it with the trust weight:

```js
setReveal(host.querySelector(".barrier-turn"), trust, 18);
```

- [ ] **Step 2: Add certification hold label**

Add:

```js
<div class="cert-hold">先慢下来<br><strong>认证才是门槛</strong></div>
```

Reveal after the ruler reaches full weight:

```js
const hold = pulse(time, duration, 0.56, 0.82);
host.querySelector(".cert-hold").style.opacity = String(Math.max(0, hold));
host.querySelector(".cert-hold").style.transform = `scale(${(0.94 + hold * 0.08).toFixed(3)})`;
```

- [ ] **Step 3: Strengthen research pass feedback**

In `research-gates.js`, add a `.gate-pass-burst` element and set it to pulse when the last gate passes.

- [ ] **Step 4: Add CSS**

Add styles for `.barrier-turn`, `.cert-hold`, and `.gate-pass-burst`.

- [ ] **Step 5: Validate and commit**

Run validation and lint, then commit:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/barrier-scale.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/certification-tunnel.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/research-gates.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css
git commit -m "add certification turn and gate payoff"
```

---

### Task 5: Add Final Negative-To-Payoff Beat

**Files:**
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/business-proof.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/captions.js`
- Modify: `industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css`

- [ ] **Step 1: Add payoff stamps**

Add inside `.business-proof`:

```js
<div class="not-done-cross">不是<br>做出来</div>
<div class="payoff-stamps">
  <i>敢用</i><i>跑稳</i><i>复购</i><i>毛利兑现</i>
</div>
```

- [ ] **Step 2: Animate negative and payoff**

Use staggered reveal windows:

```js
const cross = easeOut(progress(time, duration, 0.18, 0.4));
host.querySelector(".not-done-cross").style.opacity = String(cross * (1 - progress(time, duration, 0.44, 0.62)));
host.querySelector(".not-done-cross").style.transform = `rotate(-8deg) scale(${(0.86 + cross * 0.18).toFixed(3)})`;

host.querySelectorAll(".payoff-stamps i").forEach((stamp, index) => {
  const amount = easeOut(progress(time, duration, 0.42 + index * 0.1, 0.58 + index * 0.1));
  stamp.style.opacity = String(amount);
  stamp.style.transform = `translateY(${((1 - amount) * 22).toFixed(1)}px) rotate(${(-5 + index * 3).toFixed(1)}deg)`;
});
```

- [ ] **Step 3: Tighten final caption segmentation**

In `captions.js`, split final captions to keep the denial and payoff visually separate:

```js
[80, 82.533, "真正的终点，不是“我们做出来了”。"],
[82.533, 84.2, "而是晶圆厂敢用、"],
[84.2, 85.4, "产线跑得稳、"],
[85.4, 87.166, "客户愿意继续下单。"],
```

- [ ] **Step 4: Validate and commit**

Run validation and lint, then commit:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/scenes/business-proof.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/captions.js industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/styles.css
git commit -m "add final payoff rhythm"
```

---

### Task 6: Render And QA Rhythm Director v3

**Files:**
- Output: `/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3/semiconductor-rhythm-director-v3-visual.mp4`
- Output: `/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3/semiconductor-equipment-rhythm-director-v3.mp4`
- Output: `/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3/qa-*.png`
- Output: `/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3/ffprobe.json`

- [ ] **Step 1: Run full validation**

```bash
node industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2/validate-scenes.test.mjs
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
npx hyperframes lint industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
npx hyperframes inspect --samples 12 --json industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
```

Expected: scene validation pass, avatar tests pass, lint 0 errors/0 warnings, inspect `ok: true`.

- [ ] **Step 2: Render visual mp4**

```bash
mkdir -p /Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3
npx hyperframes render --quality draft --fps 30 --output /Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3/semiconductor-rhythm-director-v3-visual.mp4 industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
```

- [ ] **Step 3: Mux A-roll audio**

```bash
out=/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3
aroll='/Users/a77/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_52mnqudb2x3o22_97de/msg/video/2026-06/8b817b4a288875035d13c93d09d5d04e.mp4'
ffmpeg -y -i "$out/semiconductor-rhythm-director-v3-visual.mp4" -i "$aroll" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart "$out/semiconductor-equipment-rhythm-director-v3.mp4"
```

- [ ] **Step 4: Extract QA frames and metadata**

```bash
out=/Users/a77/Documents/Codex/2026-06-01/skill/outputs/semiconductor-rhythm-director-v3
for s in 2 8 16 25 34 40 51 58 66 73 81 85 89; do
  ffmpeg -y -ss "$s" -i "$out/semiconductor-equipment-rhythm-director-v3.mp4" -frames:v 1 -update 1 "$out/qa-$(printf '%02d' $s)s.png" >/dev/null 2>&1
done
ffprobe -v error -show_entries format=duration,size -show_entries stream=index,codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels -of json "$out/semiconductor-equipment-rhythm-director-v3.mp4" > "$out/ffprobe.json"
```

- [ ] **Step 5: Manual QA**

Inspect at least these frames with `view_image`:

```text
qa-08s.png
qa-16s.png
qa-25s.png
qa-40s.png
qa-58s.png
qa-66s.png
qa-73s.png
qa-85s.png
qa-89s.png
```

Expected: no subtitle overlap, avatar identity stable, rhythm labels readable, final payoff stamps not blocking the core proof line.

- [ ] **Step 6: Final commit if render QA passes**

```bash
git status --short
git log -1 --oneline
```

If code changes remain uncommitted, commit only relevant source changes:

```bash
git add industry7view-card-lab/xiaoyan/finished/SemiconductorFinishedV2
git commit -m "ship semiconductor rhythm director v3"
```
