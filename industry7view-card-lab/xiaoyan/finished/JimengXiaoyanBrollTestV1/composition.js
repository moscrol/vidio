import { captionAt } from "./captions.js";
import { SCENES, TOTAL_DURATION } from "./scenes.js";
import { validateScenes } from "./shared/validate-scenes.js";
import {
  mountGateLens,
  updateGateLens,
} from "./shared/scenes/gate-lens.js";
import {
  mountRiskDomino,
  updateRiskDomino,
} from "./shared/scenes/risk-domino.js";
import {
  mountValidationScroll,
  updateValidationScroll,
} from "./shared/scenes/validation-scroll.js";

validateScenes(SCENES, TOTAL_DURATION);

const RENDERERS = {
  XiaoyanGateLens: { mount: mountGateLens, update: updateGateLens },
  XiaoyanRiskDomino: { mount: mountRiskDomino, update: updateRiskDomino },
  XiaoyanValidationScroll: {
    mount: mountValidationScroll,
    update: updateValidationScroll,
  },
};

const TRANSITION_BOUNDARIES = SCENES.slice(1).map((scene) => scene.start);
const root = document.getElementById("semiconductor-finished-v2");
const sceneLayer = document.getElementById("scene-layer");
const captionLayer = document.getElementById("caption-layer");
const paper = document.getElementById("paper-transition");
const brand = document.getElementById("brand");
const topic = document.getElementById("topic-chip");
const watermarkCover = document.getElementById("watermark-cover");

const sceneHosts = new Map();
for (const scene of SCENES.filter((item) => item.type === "xiaoyan")) {
  const renderer = RENDERERS[scene.component];
  const host = document.createElement("section");
  host.id = scene.id;
  host.className = "xy-scene";
  renderer.mount(host);
  sceneLayer.appendChild(host);
  sceneHosts.set(scene.id, host);
}

function activeSceneAt(time) {
  return SCENES.find(
    (scene, index) =>
      time >= scene.start &&
      (time < scene.end || (index === SCENES.length - 1 && time <= scene.end)),
  );
}

function updateTransition(time) {
  const half = 0.36;
  let nearest = null;
  for (const boundary of TRANSITION_BOUNDARIES) {
    const distance = Math.abs(time - boundary);
    if (distance <= half && (!nearest || distance < nearest.distance)) {
      nearest = { boundary, distance };
    }
  }
  if (!nearest) {
    paper.style.opacity = "0";
    paper.style.transform = "translateY(110%) rotate(-2deg)";
    return;
  }
  const before = time <= nearest.boundary;
  const amount = nearest.distance / half;
  paper.style.opacity = "1";
  paper.style.transform = `translateY(${(before ? amount * 110 : -amount * 110).toFixed(2)}%) rotate(${before ? -2 : 2}deg)`;
}

function seekComposition(time) {
  const clamped = Math.max(0, Math.min(TOTAL_DURATION, time));
  const active = activeSceneAt(clamped);

  for (const scene of SCENES.filter((item) => item.type === "xiaoyan")) {
    const host = sceneHosts.get(scene.id);
    const isActive = active?.id === scene.id;
    host.style.opacity = isActive ? "1" : "0";
    if (isActive) {
      RENDERERS[scene.component].update(
        host,
        clamped - scene.start,
        scene.end - scene.start,
      );
    }
  }

  const isXiaoyan = active?.type === "xiaoyan";
  brand.classList.toggle("light", !isXiaoyan);
  topic.style.opacity = isXiaoyan ? "1" : "0";
  watermarkCover.style.opacity = isXiaoyan ? "0" : "1";

  const caption = captionAt(clamped);
  captionLayer.textContent = isXiaoyan && caption ? caption.text : "";
  captionLayer.style.opacity = isXiaoyan && caption ? "1" : "0";
  updateTransition(clamped);
}

seekComposition(0);
window.__seekJimengXiaoyanTest = seekComposition;
root.dataset.ready = "true";
