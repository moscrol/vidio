const EPSILON = 0.0005;

export function validateScenes(scenes, totalDuration) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    throw new Error("scenes must be a non-empty array");
  }

  const ids = new Set();
  let cursor = 0;

  for (const scene of scenes) {
    if (!scene.id || ids.has(scene.id)) {
      throw new Error(`duplicate or missing scene id: ${scene.id ?? ""}`);
    }
    ids.add(scene.id);

    if (!Number.isFinite(scene.start) || !Number.isFinite(scene.end)) {
      throw new Error(`invalid timing for ${scene.id}`);
    }
    if (scene.start < 0 || scene.end <= scene.start) {
      throw new Error(`non-positive duration for ${scene.id}`);
    }
    if (scene.type !== "aroll" && scene.type !== "xiaoyan") {
      throw new Error(`invalid scene type for ${scene.id}`);
    }
    if (scene.type === "xiaoyan" && !scene.component) {
      throw new Error(`missing component for ${scene.id}`);
    }

    if (scene.start < cursor - EPSILON) {
      throw new Error(`scene overlap before ${scene.id}`);
    }
    if (scene.start > cursor + EPSILON) {
      throw new Error(`scene gap before ${scene.id}`);
    }
    cursor = scene.end;
  }

  if (Math.abs(cursor - totalDuration) > EPSILON) {
    throw new Error(
      `timeline ends at ${cursor}, expected ${totalDuration}`,
    );
  }

  return true;
}

