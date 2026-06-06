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

export function setReveal(element, amount, distance = 24) {
  if (!element) return;
  element.style.opacity = String(amount);
  element.style.transform = `translateY(${((1 - amount) * distance).toFixed(2)}px)`;
}

export function setDraw(element, amount) {
  if (!element) return;
  element.style.setProperty("--draw", amount.toFixed(4));
}

