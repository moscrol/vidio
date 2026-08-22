import assert from "node:assert/strict";
import test from "node:test";

import { lintContract } from "./lint-motion-contract.mjs";

const validContract = () => ({
  version: 1,
  composition: {
    id: "proof",
    fps: 30,
    durationFrames: 240,
    personality: "crisp-editorial",
    primaryAudience: "mobile",
  },
  beats: [
    {
      id: "intro",
      range: [0, 72],
      purpose: "orient",
      focus: "FinHot feed",
      salience: "high",
      entry: {
        properties: ["transform", "opacity"],
        easing: "ease-out-strong",
        durationFrames: 10,
        fromScale: 0.95,
      },
      holdFrames: 30,
      exit: { mode: "bridge-to-next-scene" },
    },
  ],
});

test("valid contract passes", () => {
  assert.deepEqual(lintContract(validContract()), { errors: [], warnings: [] });
});

test("rejects an unknown purpose", () => {
  const contract = validContract();
  contract.beats[0].purpose = "look-cool";

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT003");
  assert.match(report.errors[0].message, /purpose/i);
});

test("requires a reason for delight", () => {
  const contract = validContract();
  contract.beats[0].purpose = "delight";

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT003");
  assert.match(report.errors[0].message, /delightReason/);
});

test("rejects ease-in on entry", () => {
  const contract = validContract();
  contract.beats[0].entry.easing = "ease-in";

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT004");
  assert.match(report.errors[0].message, /ease-in/);
});

test("rejects normalized entry scale below 0.9", () => {
  const contract = validContract();
  contract.beats[0].entry.fromScale = 0;

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT005");
  assert.match(report.errors[0].message, /fromScale/);
});

test("rejects an out-of-range beat", () => {
  const contract = validContract();
  contract.beats[0].range = [0, 241];

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT002");
  assert.match(report.errors[0].message, /durationFrames/);
});

test("requires an exit or persistence", () => {
  const contract = validContract();
  delete contract.beats[0].exit;

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT006");
  assert.match(report.errors[0].message, /exit/);
});

test("requires a timing reason outside the entry band", () => {
  const contract = validContract();
  contract.beats[0].entry.durationFrames = 16;

  const report = lintContract(contract);
  assert.equal(report.errors[0].rule, "VMT007");
  assert.match(report.errors[0].message, /timingReason/);
});

test("warns about layout animation", () => {
  const contract = validContract();
  contract.beats[0].entry.properties.push("width");

  const report = lintContract(contract);
  assert.equal(report.warnings[0].rule, "VMT101");
  assert.match(report.warnings[0].message, /layout/);
});

test("warns about back easing without physical justification", () => {
  const contract = validContract();
  contract.beats[0].entry.easing = "back-out";

  const report = lintContract(contract);
  assert.equal(report.warnings[0].rule, "VMT102");
  assert.match(report.warnings[0].message, /physicalReason/);
});

test("warns when two high-salience beats overlap", () => {
  const contract = validContract();
  contract.beats.push({
    ...contract.beats[0],
    id: "competing-focus",
    range: [36, 96],
    focus: "competing chart",
  });

  const report = lintContract(contract);
  assert.equal(report.warnings.at(-1).rule, "VMT103");
  assert.match(report.warnings.at(-1).message, /overlap/);
});

test("warns about stagger outside one to three frames", () => {
  const contract = validContract();
  contract.beats[0].staggerFrames = 5;

  const report = lintContract(contract);
  assert.equal(report.warnings[0].rule, "VMT104");
  assert.match(report.warnings[0].message, /stagger/);
});
