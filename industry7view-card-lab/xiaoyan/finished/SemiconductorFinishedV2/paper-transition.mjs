import { SCENES } from "./scenes.mjs";

const BOUNDARIES = SCENES.slice(1)
  .filter((scene, index) => scene.type !== SCENES[index].type)
  .map((scene) => scene.start);

export function updatePaperTransition(element, time) {
  const half = 0.42;
  let nearest = null;

  for (const boundary of BOUNDARIES) {
    const distance = Math.abs(time - boundary);
    if (distance <= half && (!nearest || distance < nearest.distance)) {
      nearest = { boundary, distance };
    }
  }

  if (!nearest) {
    element.style.opacity = "0";
    element.style.transform = "translateY(110%) rotate(-2deg)";
    return;
  }

  const before = time <= nearest.boundary;
  const amount = Math.max(0, Math.min(1, nearest.distance / half));
  const y = before ? amount * 110 : -amount * 110;
  element.style.opacity = "1";
  element.style.transform = `translateY(${y.toFixed(2)}%) rotate(${before ? -2 : 2}deg)`;
}

