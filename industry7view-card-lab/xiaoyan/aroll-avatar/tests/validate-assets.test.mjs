import assert from "node:assert/strict";
import test from "node:test";
import contract from "../character-contract.json" with { type: "json" };

test("locks the A-roll identity anchors", () => {
  assert.equal(contract.characterId, "ar-schema");
  assert.equal(contract.proportion.headsTall, 5.5);
  assert.equal(contract.palette, "black-white-grayscale");
  assert.deepEqual(contract.requiredCostume, [
    "white-stand-collar-shirt",
    "rolled-sleeves",
    "light-trousers",
    "round-watch-left-wrist",
    "small-ear-studs",
  ]);
  assert.ok(contract.identityAnchors.includes("narrow-oval-face"));
  assert.ok(contract.identityAnchors.includes("right-curved-side-fringe"));
  assert.ok(contract.identityAnchors.includes("slender-almond-eyes"));
});
