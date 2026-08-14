import { captionAt } from "./captions.js";
import { updatePaperTransition } from "./paper-transition.js";
import { SCENES, TOTAL_DURATION } from "./scenes.js";
import { validateScenes } from "./validate-scenes.js";
import { mountGateLens, updateGateLens } from "./scenes/gate-lens.js";
import { mountRiskDomino, updateRiskDomino } from "./scenes/risk-domino.js";
import {
  mountValidationScroll,
  updateValidationScroll,
} from "./scenes/validation-scroll.js";
import {
  mountBarrierScale,
  updateBarrierScale,
} from "./scenes/barrier-scale.js";
import {
  mountCertificationTunnel,
  updateCertificationTunnel,
} from "./scenes/certification-tunnel.js";
import {
  mountResearchGates,
  updateResearchGates,
} from "./scenes/research-gates.js";
import {
  mountBusinessProof,
  updateBusinessProof,
} from "./scenes/business-proof.js";

validateScenes(SCENES, TOTAL_DURATION);

const RENDERERS = {
  XiaoyanGateLens: { mount: mountGateLens, update: updateGateLens },
  XiaoyanRiskDomino: { mount: mountRiskDomino, update: updateRiskDomino },
  XiaoyanValidationScroll: {
    mount: mountValidationScroll,
    update: updateValidationScroll,
  },
  XiaoyanBarrierScale: {
    mount: mountBarrierScale,
    update: updateBarrierScale,
  },
  XiaoyanCertificationTunnel: {
    mount: mountCertificationTunnel,
    update: updateCertificationTunnel,
  },
  XiaoyanResearchGates: {
    mount: mountResearchGates,
    update: updateResearchGates,
  },
  XiaoyanBusinessProof: {
    mount: mountBusinessProof,
    update: updateBusinessProof,
  },
};

const root = document.getElementById("semiconductor-finished-v2");
const sceneLayer = document.getElementById("scene-layer");
const captionLayer = document.getElementById("caption-layer");
const paper = document.getElementById("paper-transition");
const brand = document.getElementById("brand");
const topic = document.getElementById("topic-chip");

const sceneHosts = new Map();
for (const scene of SCENES.filter((item) => item.type === "xiaoyan")) {
  const renderer = RENDERERS[scene.component];
  if (!renderer) throw new Error(`Missing renderer: ${scene.component}`);
  const host = document.createElement("section");
  host.id = scene.id;
  host.className = "xy-scene";
  host.dataset.sceneId = scene.id;
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

  const caption = captionAt(clamped);
  captionLayer.textContent = isXiaoyan && caption ? caption.text : "";
  captionLayer.style.opacity = isXiaoyan && caption ? "1" : "0";
  updatePaperTransition(paper, clamped);
}

seekComposition(0);
window.__seekSemiconductorV2 = seekComposition;
root.dataset.ready = "true";
