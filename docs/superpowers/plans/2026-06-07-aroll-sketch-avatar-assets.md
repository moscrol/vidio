# A-roll Sketch Avatar Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a consistent black-and-white sketch avatar asset pack derived from the A-roll presenter for use in B-roll scenes.

**Architecture:** Treat the approved full-body master as the single identity source. Generate later views and actions by editing or referencing that master, then validate every sheet against a machine-readable character contract before adding it to the asset manifest.

**Tech Stack:** Built-in image generation, PNG assets, Node.js validation scripts, JSON metadata, ImageMagick or `sips` for image inspection.

---

## File Structure

```text
industry7view-card-lab/xiaoyan/aroll-avatar/
  character-contract.json       # immutable identity, costume, and proportion rules
  asset-manifest.json           # approved asset inventory and intended B-roll usage
  README.md                     # generation and reuse workflow
  scripts/
    validate-assets.mjs         # dimensions, naming, and manifest validation
  tests/
    validate-assets.test.mjs    # contract and manifest tests
  references/
    ar-schema-front.png         # approved standard full-body master
  sheets/
    ar-schema-turnaround.png    # front, profile, and back views
    ar-schema-expressions.png   # six facial expressions
    ar-schema-actions.png       # eight research actions
    ar-schema-hands.png         # five hand and prop details
outputs/aroll-sketch-avatar/
  previews/                     # review copies of approved sheets
```

### Task 1: Create The Character Contract

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/character-contract.json`
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs`

- [ ] **Step 1: Write the failing contract test**

```js
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
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

Expected: FAIL because `character-contract.json` does not exist.

- [ ] **Step 3: Create the character contract**

```json
{
  "characterId": "ar-schema",
  "displayName": "A-roll素描分身",
  "palette": "black-white-grayscale",
  "proportion": {
    "headsTall": 5.5,
    "adult": true,
    "slenderBuild": true
  },
  "identityAnchors": [
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
    "narrow-shoulders"
  ],
  "requiredCostume": [
    "white-stand-collar-shirt",
    "rolled-sleeves",
    "light-trousers",
    "round-watch-left-wrist",
    "small-ear-studs"
  ],
  "forbiddenTraits": [
    "large-anime-eyes",
    "round-child-face",
    "short-chibi-body",
    "glamour-influencer-styling",
    "eyeglasses",
    "hat",
    "doctoral-cap"
  ],
  "renderStyle": [
    "editorial-pencil-sketch",
    "charcoal-outline",
    "grayscale-hatching",
    "paper-grain",
    "clean-white-background"
  ]
}
```

- [ ] **Step 4: Run the test and verify success**

Run:

```bash
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar
git commit -m "define A-roll sketch avatar contract"
```

### Task 2: Generate And Approve The Full-Body Master

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/references/ar-schema-front.png`
- Create: `outputs/aroll-sketch-avatar/previews/ar-schema-front.png`

- [ ] **Step 1: Prepare the identity reference**

Use the original A-roll frames at 2, 30, 51, 70, and 89 seconds as identity references. Assign their role explicitly as face, hair, costume, posture, and body-proportion references.

- [ ] **Step 2: Generate one standard master**

Generate a vertical full-body image with:

```text
Adult East Asian female industry-research presenter derived from the supplied
A-roll references. Preserve the narrow oval face, tapered jaw, three-seven
side-parted shoulder-length black hair, right curved fringe, tucked left side,
slender almond eyes, thin lips, long neck, narrow shoulders, white stand-collar
shirt with rolled sleeves, light trousers, small ear studs, and round watch on
the left wrist. Natural standing pose at a gentle three-quarter angle, 5.5-head
adult proportion. Black-and-white editorial pencil sketch, charcoal contour,
grayscale hatching, paper grain, clean white background. No large eyes, no
chibi proportions, no glasses, no hat, no glamour styling, no text.
```

- [ ] **Step 3: Inspect identity anchors**

Reject the image if any of these are missing:

```text
- narrow oval face and tapered jaw
- right curved fringe and tucked left hair
- adult 5.5-head proportion
- rolled white shirt sleeves
- round watch on left wrist
- calm, restrained expression
```

- [ ] **Step 4: Save the approved master**

Copy the approved PNG to both paths:

```bash
cp <generated-master.png> industry7view-card-lab/xiaoyan/aroll-avatar/references/ar-schema-front.png
cp <generated-master.png> outputs/aroll-sketch-avatar/previews/ar-schema-front.png
```

- [ ] **Step 5: Commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar/references/ar-schema-front.png
git commit -m "add approved A-roll sketch avatar master"
```

### Task 3: Generate The Turnaround Sheet

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/sheets/ar-schema-turnaround.png`

- [ ] **Step 1: Generate from the approved master**

Use `ar-schema-front.png` as the identity reference and generate one sheet containing:

```text
front view | strict right profile | back view
```

Keep identical head height, shoulder width, waist line, trouser length, hair length, shirt, rolled sleeves, earrings, and left-wrist watch. Use a white background and no decorative labels inside the image.

- [ ] **Step 2: Validate the profile**

The strict profile must preserve:

```text
- tapered jaw rather than a round cheek
- long neck
- layered shoulder-length hair with a flipped end
- slim nose bridge and thin lips
- shirt collar and rolled sleeve structure
```

- [ ] **Step 3: Save and commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar/sheets/ar-schema-turnaround.png
git commit -m "add A-roll avatar turnaround sheet"
```

### Task 4: Generate Expression And Action Sheets

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/sheets/ar-schema-expressions.png`
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/sheets/ar-schema-actions.png`
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/sheets/ar-schema-hands.png`

- [ ] **Step 1: Generate the expression sheet**

Use the approved master and produce:

```text
calm | slight smile | thinking | doubtful | discovery | alert
```

Change only brows, eyelids, mouth corners, and head tilt. Keep face shape, hair silhouette, and eye scale fixed.

- [ ] **Step 2: Generate the action sheet**

Use the approved master and produce:

```text
walking | seated presentation | pointing at chart | turning notebook page |
writing | inspecting equipment | arranging data cards | looking back
```

Each pose must show a readable center of gravity and preserve the left-wrist watch.

- [ ] **Step 3: Generate the hand-detail sheet**

Use the same drawing style and produce:

```text
holding pen | turning page | pointing | supporting chart | pressing button
```

- [ ] **Step 4: Save and commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar/sheets
git commit -m "add A-roll avatar expression and action sheets"
```

### Task 5: Add Manifest Validation

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/asset-manifest.json`
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/scripts/validate-assets.mjs`
- Modify: `industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs`

- [ ] **Step 1: Add the failing manifest test**

Append:

```js
import { validateManifest } from "../scripts/validate-assets.mjs";

test("requires the complete approved asset set", async () => {
  const result = await validateManifest(
    new URL("../asset-manifest.json", import.meta.url),
  );
  assert.equal(result.ok, true);
  assert.equal(result.assets.length, 5);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

Expected: FAIL because the manifest and validator do not exist.

- [ ] **Step 3: Create the manifest**

```json
{
  "characterId": "ar-schema",
  "assets": [
    {"id": "master", "path": "references/ar-schema-front.png", "usage": "identity-reference"},
    {"id": "turnaround", "path": "sheets/ar-schema-turnaround.png", "usage": "view-consistency"},
    {"id": "expressions", "path": "sheets/ar-schema-expressions.png", "usage": "facial-animation"},
    {"id": "actions", "path": "sheets/ar-schema-actions.png", "usage": "broll-blocking"},
    {"id": "hands", "path": "sheets/ar-schema-hands.png", "usage": "prop-interaction"}
  ]
}
```

- [ ] **Step 4: Implement the validator**

```js
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function validateManifest(manifestUrl) {
  const manifestPath = fileURLToPath(manifestUrl);
  const root = path.dirname(manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (manifest.characterId !== "ar-schema") {
    throw new Error("Unexpected characterId");
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length !== 5) {
    throw new Error("Expected five avatar assets");
  }

  for (const asset of manifest.assets) {
    if (!asset.id || !asset.path || !asset.usage) {
      throw new Error("Asset entries require id, path, and usage");
    }
    if (!asset.path.endsWith(".png")) {
      throw new Error(`Asset must be PNG: ${asset.path}`);
    }
    await access(path.join(root, asset.path));
  }

  return { ok: true, assets: manifest.assets };
}
```

- [ ] **Step 5: Run the test and verify success**

Run:

```bash
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

Expected: two passing tests.

- [ ] **Step 6: Commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar
git commit -m "validate A-roll avatar asset pack"
```

### Task 6: Document B-roll Integration

**Files:**
- Create: `industry7view-card-lab/xiaoyan/aroll-avatar/README.md`

- [ ] **Step 1: Document asset roles**

The README must state:

```text
- The master PNG is the only identity reference.
- Turnaround is for side/back reconstruction.
- Expressions may change only facial controls.
- Actions are blocking references, not independent redesigns.
- The watch must remain on the character's left wrist.
- The avatar and Xiaoyan professor are separate characters.
```

- [ ] **Step 2: Add the validation command**

```bash
node --test xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

- [ ] **Step 3: Add B-roll usage mapping**

```text
walking              -> entering an industry chain
seated presentation  -> replacing short A-roll inserts
pointing at chart    -> explaining metrics
turning notebook     -> changing research stages
writing              -> recording validation evidence
inspecting equipment -> factory and device scenes
arranging data cards -> comparison and screening scenes
looking back         -> transition or conclusion
```

- [ ] **Step 4: Commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar/README.md
git commit -m "document A-roll avatar B-roll workflow"
```

### Task 7: Final QA

**Files:**
- Modify: `outputs/aroll-sketch-avatar/previews/`

- [ ] **Step 1: Run manifest validation**

Run:

```bash
node --test industry7view-card-lab/xiaoyan/aroll-avatar/tests/validate-assets.test.mjs
```

Expected: all tests pass.

- [ ] **Step 2: Inspect PNG dimensions**

Run:

```bash
for file in industry7view-card-lab/xiaoyan/aroll-avatar/{references,sheets}/*.png; do
  sips -g pixelWidth -g pixelHeight "$file"
done
```

Expected: every file is readable and at least 1024 pixels on its shortest side.

- [ ] **Step 3: Copy review previews**

```bash
mkdir -p outputs/aroll-sketch-avatar/previews
cp industry7view-card-lab/xiaoyan/aroll-avatar/references/*.png outputs/aroll-sketch-avatar/previews/
cp industry7view-card-lab/xiaoyan/aroll-avatar/sheets/*.png outputs/aroll-sketch-avatar/previews/
```

- [ ] **Step 4: Visual identity review**

Compare all sheets against the approved master and reject any sheet that changes face width, fringe direction, hair length, eye scale, shirt design, sleeve roll, or watch wrist.

- [ ] **Step 5: Final commit**

```bash
git add industry7view-card-lab/xiaoyan/aroll-avatar outputs/aroll-sketch-avatar/previews
git commit -m "complete A-roll sketch avatar asset pack"
```
