import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contract = JSON.parse(
  readFileSync(new URL("../character-contract.json", import.meta.url), "utf8"),
);

test("locks the A-roll identity anchors", () => {
  assert.equal(contract.characterId, "ar-schema");
  assert.equal(contract.displayName, "A-roll素描分身");
  assert.equal(contract.palette, "black-white-grayscale");
  assert.equal(contract.proportion.headsTall, 5.5);
  assert.equal(contract.proportion.adult, true);
  assert.equal(contract.proportion.slenderBuild, true);
  assert.deepEqual(contract.identityAnchors, [
    "narrow-oval-face",
    "tapered-jaw",
    "shoulder-length-black-hair",
    "three-seven-side-part",
    "left-side-tucked-behind-ear",
    "right-curved-side-fringe",
    "slightly-flipped-hair-ends",
    "straight-fine-brows",
    "slender-almond-eyes",
    "thin-lips",
    "long-neck",
    "narrow-shoulders",
  ]);
  assert.deepEqual(contract.requiredCostume, [
    "white-stand-collar-shirt",
    "rolled-sleeves",
    "light-trousers",
    "round-watch-left-wrist",
    "small-ear-studs",
  ]);
  assert.deepEqual(contract.forbiddenTraits, [
    "large-anime-eyes",
    "round-child-face",
    "short-chibi-body",
    "glamour-influencer-styling",
    "eyeglasses",
    "hat",
    "doctoral-cap",
  ]);
  assert.deepEqual(contract.renderStyle, [
    "editorial-pencil-sketch",
    "charcoal-outline",
    "grayscale-hatching",
    "paper-grain",
    "clean-white-background",
  ]);
});
