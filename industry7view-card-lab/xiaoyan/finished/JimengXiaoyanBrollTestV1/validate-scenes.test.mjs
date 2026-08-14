import assert from "node:assert/strict";

import { SCENES, TOTAL_DURATION } from "./scenes.js";
import { validateScenes } from "../SemiconductorFinishedV2/validate-scenes.js";

assert.equal(TOTAL_DURATION, 28.833333);
assert.equal(SCENES.length, 6);
assert.doesNotThrow(() => validateScenes(SCENES, TOTAL_DURATION));
assert.equal(
  SCENES.filter((scene) => scene.type === "xiaoyan").length,
  3,
);

console.log("JimengXiaoyanBrollTestV1 scene validation passed");
