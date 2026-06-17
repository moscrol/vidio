export function node(label, className = "") {
  return `<div class="sketch-node ${className}">${label}</div>`;
}

export function label(text, className = "") {
  return `<div class="sketch-label ${className}">${text}</div>`;
}

export function arrow(className = "") {
  return `<div class="sketch-arrow ${className}"><i></i></div>`;
}

export function progress(localTime, duration, start = 0, end = 1) {
  const normalized = duration <= 0 ? 1 : localTime / duration;
  return Math.max(0, Math.min(1, (normalized - start) / (end - start)));
}

export function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}

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

export function setReveal(element, amount, distance = 24) {
  if (!element) return;
  element.style.opacity = String(amount);
  element.style.transform = `translateY(${((1 - amount) * distance).toFixed(2)}px)`;
}

export function setDraw(element, amount) {
  if (!element) return;
  element.style.setProperty("--draw", amount.toFixed(4));
}
