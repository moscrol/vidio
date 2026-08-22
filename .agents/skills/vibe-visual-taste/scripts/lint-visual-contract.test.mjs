import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const linter = join(scriptDir, "lint-visual-contract.mjs");

const validDesign = `# Visual System

## Intent
Evidence-led editorial clarity.

## Hierarchy
One focal claim leads to supporting proof.

## Tokens
Use semantic roles from the JSON contract.

## Components
Each component has one job.

## Media
Owned product evidence remains legible.

## Do / Avoid
Do preserve hierarchy. Avoid decorative competition.

## Review
Check full size, thumbnail, grayscale, and safe area.
`;

function validContract() {
  return {
    version: "1.0",
    name: "valid-visual-system",
    canvas: {
      width: 1080,
      height: 1920,
      fps: 30,
      backgroundRole: "background",
    },
    identity: {
      voice: ["editorial", "evidence-led"],
      hierarchyPrinciple: "One claim leads; evidence supports it.",
      distinctiveMove: "A narrow evidence rail anchors the proof.",
      brandImitation: false,
      inspirationMode: "original",
    },
    palette: {
      background: "#F4F0E7",
      surface: "#FFFFFF",
      textPrimary: "#142634",
      textMuted: "#53616B",
      accent: "#A66F16",
      warning: "#A53B2A",
      maxAccentCoveragePct: 12,
    },
    typography: {
      families: {
        display: { family: "Noto Serif SC", fallback: ["serif"] },
        body: { family: "Noto Sans SC", fallback: ["sans-serif"] },
        data: { family: "Noto Sans Mono", fallback: ["monospace"] },
        label: { family: "Noto Sans SC", fallback: ["sans-serif"] },
      },
      scale: {
        hero: { sizePx: 92, lineHeight: 1.04, weight: 800, maxLines: 3 },
        title: { sizePx: 44, lineHeight: 1.15, weight: 700, maxLines: 2 },
        body: { sizePx: 30, lineHeight: 1.45, weight: 450, maxLines: 5 },
        label: { sizePx: 24, lineHeight: 1.3, weight: 650, maxLines: 2 },
        source: { sizePx: 21, lineHeight: 1.35, weight: 450, maxLines: 3 },
      },
    },
    layout: {
      safeAreaPx: { top: 96, right: 72, bottom: 112, left: 72 },
      gridColumns: 6,
      gutterPx: 24,
      readingOrder: ["kicker", "headline", "evidence", "product", "source"],
      maxFocalElements: 1,
      maxPanels: 3,
    },
    surfaces: {
      radiusScalePx: [0, 12, 24],
      borderStrategy: "One-pixel ink rules separate evidence.",
      shadowStrategy: "none",
      effects: [
        {
          name: "paper-grain",
          purpose: "Keep large quiet fields tactile without adding a focal point.",
          maxCoveragePct: 100,
        },
      ],
    },
    media: {
      sourcePolicy: "owned-or-verified",
      treatment: "Product UI remains literal and high contrast.",
      cropPolicy: "Crop only outside decision-relevant UI.",
    },
    components: [
      {
        name: "evidence-rail",
        purpose: "Connect the claim to three supporting observations.",
        priority: 1,
        geometry: "Narrow left rule with aligned evidence rows.",
      },
    ],
    guardrails: {
      do: [
        "Keep one dominant claim.",
        "Use the accent only for evidence.",
        "Preserve literal product details.",
      ],
      avoid: [
        "Do not imitate a named brand.",
        "Do not stack decorative effects.",
        "Do not create competing focal panels.",
      ],
    },
    accessibility: {
      minContrastRatio: 4.5,
      minBodyPxAt1080: 28,
      minLabelPxAt1080: 22,
      minSourcePxAt1080: 20,
    },
  };
}

function runCase({ contract = validContract(), design = validDesign, rawJson } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "vvt-lint-"));
  try {
    if (design !== null) {
      writeFileSync(join(dir, "DESIGN.md"), design);
    }
    if (rawJson !== undefined) {
      writeFileSync(join(dir, "visual-contract.json"), rawJson);
    } else if (contract !== null) {
      writeFileSync(join(dir, "visual-contract.json"), JSON.stringify(contract, null, 2));
    }

    const result = spawnSync(process.execPath, [linter, dir], {
      encoding: "utf8",
    });
    return {
      status: result.status,
      output: `${result.stdout}${result.stderr}`,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("valid contract passes without diagnostics", () => {
  const result = runCase();
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /0 error\(s\), 0 warning\(s\)/);
});

test("VVT001 reports malformed JSON and missing required structure", () => {
  const malformed = runCase({ rawJson: "{not-json" });
  assert.equal(malformed.status, 1);
  assert.match(malformed.output, /VVT001/);

  const contract = validContract();
  delete contract.canvas;
  const missing = runCase({ contract });
  assert.equal(missing.status, 1);
  assert.match(missing.output, /VVT001/);
});

test("VVT002 reports a missing DESIGN section", () => {
  const result = runCase({
    design: validDesign.replace("## Review", "## Verification Notes"),
  });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT002/);
});

test("VVT003 reports invalid semantic colors", () => {
  const contract = validContract();
  contract.palette.accent = "gold";
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT003/);
});

test("VVT004 reports low text contrast", () => {
  const contract = validContract();
  contract.palette.textPrimary = "#F5F5F5";
  contract.palette.background = "#FFFFFF";
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT004/);
});

test("VVT005 reports unreadable type at a normalized 1080 width", () => {
  const contract = validContract();
  contract.typography.scale.body.sizePx = 18;
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT005/);
});

test("VVT006 blocks named-brand imitation modes", () => {
  const contract = validContract();
  contract.identity.brandImitation = true;
  contract.identity.inspirationMode = "copy-brand";
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT006/);
});

test("VVT007 reports unsafe geometry and components without purpose", () => {
  const contract = validContract();
  contract.layout.safeAreaPx.left = 800;
  contract.layout.safeAreaPx.right = 400;
  contract.components[0].purpose = "";
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT007/);
});

test("VVT008 requires at least three positive and negative guardrails", () => {
  const contract = validContract();
  contract.guardrails.do = ["Keep one focal claim."];
  const result = runCase({ contract });
  assert.equal(result.status, 1);
  assert.match(result.output, /VVT008/);
});

test("budget smells emit VVT101 through VVT106 as warnings", () => {
  const contract = validContract();
  contract.typography.families.label.family = "IBM Plex Sans";
  contract.palette.maxAccentCoveragePct = 30;
  contract.layout.maxFocalElements = 2;
  contract.surfaces.radiusScalePx = [0, 8, 16, 24];
  contract.surfaces.effects = [
    { name: "glass", purpose: "Separate one panel.", maxCoveragePct: 30 },
    { name: "glow", purpose: "Call attention to status.", maxCoveragePct: 10 },
    { name: "gradient", purpose: "Bind the background.", maxCoveragePct: 100 },
    { name: "blur" },
  ];

  const result = runCase({ contract });
  assert.equal(result.status, 0, result.output);
  for (const code of ["VVT101", "VVT102", "VVT103", "VVT104", "VVT105", "VVT106"]) {
    assert.match(result.output, new RegExp(code), result.output);
  }
  assert.match(result.output, /0 error\(s\), 6 warning\(s\)/);
});
