import assert from "node:assert/strict";

import { SCENES, TOTAL_DURATION } from "./scenes.js";
import { validateScenes } from "./validate-scenes.js";

assert.equal(TOTAL_DURATION, 90.2);
assert.doesNotThrow(() => validateScenes(SCENES, TOTAL_DURATION));

const xiaoyanDuration = SCENES.filter((scene) => scene.type === "xiaoyan")
  .reduce((sum, scene) => sum + scene.end - scene.start, 0);
assert.equal(xiaoyanDuration.toFixed(3), "65.866");

assert.throws(
  () =>
    validateScenes(
      [
        { id: "a", type: "aroll", start: 0, end: 2 },
        { id: "b", type: "aroll", start: 1, end: 3 },
      ],
      3,
    ),
  /overlap/,
);

assert.throws(
  () =>
    validateScenes(
      [
        { id: "a", type: "aroll", start: 0, end: 1 },
        { id: "b", type: "aroll", start: 2, end: 3 },
      ],
      3,
    ),
  /gap/,
);

assert.throws(
  () =>
    validateScenes(
      [{ id: "missing", type: "xiaoyan", start: 0, end: 1 }],
      1,
    ),
  /missing component/,
);

console.log("SemiconductorFinishedV2 scene validation passed");
