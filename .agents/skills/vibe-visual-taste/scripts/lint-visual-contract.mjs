#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const requiredSections = [
  "intent",
  "hierarchy",
  "tokens",
  "components",
  "media",
  "do / avoid",
  "review",
];

const semanticColors = [
  "background",
  "surface",
  "textPrimary",
  "textMuted",
  "accent",
  "warning",
];

const topLevelShape = {
  version: "string",
  name: "string",
  canvas: "object",
  identity: "object",
  palette: "object",
  typography: "object",
  layout: "object",
  surfaces: "object",
  media: "object",
  components: "array",
  guardrails: "object",
  accessibility: "object",
};

const diagnostics = [];

function report(severity, code, message) {
  diagnostics.push({ severity, code, message });
}

function error(code, message) {
  report("error", code, message);
}

function warning(code, message) {
  report("warning", code, message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasType(value, type) {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return isObject(value);
  return typeof value === type && (type !== "string" || value.trim().length > 0);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function readText(path, label) {
  try {
    return readFileSync(path, "utf8");
  } catch (cause) {
    error("VVT001", `${label} is missing or unreadable: ${cause.message}`);
    return null;
  }
}

function parseContract(text) {
  if (text === null) return null;
  try {
    const value = JSON.parse(text);
    if (!isObject(value)) {
      error("VVT001", "visual-contract.json must contain one JSON object.");
      return null;
    }
    return value;
  } catch (cause) {
    error("VVT001", `visual-contract.json is not valid JSON: ${cause.message}`);
    return null;
  }
}

function validateTopLevel(contract) {
  for (const [key, type] of Object.entries(topLevelShape)) {
    if (!hasType(contract[key], type)) {
      error("VVT001", `visual-contract.json requires ${key} as ${type}.`);
    }
  }

  if (contract.version !== "1.0") {
    error("VVT001", "visual-contract.json version must be 1.0.");
  }

  const canvas = contract.canvas;
  if (isObject(canvas)) {
    for (const key of ["width", "height", "fps"]) {
      if (!isFiniteNumber(canvas[key]) || canvas[key] <= 0) {
        error("VVT001", `canvas.${key} must be a positive number.`);
      }
    }
    if (!hasType(canvas.backgroundRole, "string")) {
      error("VVT001", "canvas.backgroundRole must be a non-empty string.");
    }
  }

  const identity = contract.identity;
  if (isObject(identity)) {
    if (
      !Array.isArray(identity.voice) ||
      identity.voice.length < 1 ||
      identity.voice.length > 4 ||
      identity.voice.some((word) => !hasType(word, "string"))
    ) {
      error("VVT001", "identity.voice must contain one to four non-empty terms.");
    }
    for (const key of ["hierarchyPrinciple", "distinctiveMove"]) {
      if (!hasType(identity[key], "string")) {
        error("VVT001", `identity.${key} must be a non-empty string.`);
      }
    }
  }

  const palette = contract.palette;
  if (isObject(palette) && !isFiniteNumber(palette.maxAccentCoveragePct)) {
    error("VVT001", "palette.maxAccentCoveragePct must be a number.");
  }

  const typography = contract.typography;
  if (isObject(typography)) {
    if (!isObject(typography.families)) {
      error("VVT001", "typography.families must be an object.");
    } else {
      for (const role of ["display", "body", "data", "label"]) {
        if (
          !isObject(typography.families[role]) ||
          !hasType(typography.families[role].family, "string")
        ) {
          error("VVT001", `typography.families.${role}.family is required.`);
        }
      }
    }

    if (!isObject(typography.scale)) {
      error("VVT001", "typography.scale must be an object.");
    } else {
      for (const role of ["hero", "title", "body", "label", "source"]) {
        const token = typography.scale[role];
        if (!isObject(token)) {
          error("VVT001", `typography.scale.${role} must be an object.`);
          continue;
        }
        for (const key of ["sizePx", "lineHeight", "weight", "maxLines"]) {
          if (!isFiniteNumber(token[key]) || token[key] <= 0) {
            error("VVT001", `typography.scale.${role}.${key} must be positive.`);
          }
        }
      }
    }
  }

  const layout = contract.layout;
  if (isObject(layout)) {
    if (!isObject(layout.safeAreaPx)) {
      error("VVT001", "layout.safeAreaPx must be an object.");
    }
    for (const key of ["gridColumns", "maxFocalElements", "maxPanels"]) {
      if (!Number.isInteger(layout[key]) || layout[key] < 1) {
        error("VVT001", `layout.${key} must be a positive integer.`);
      }
    }
    if (!isFiniteNumber(layout.gutterPx) || layout.gutterPx < 0) {
      error("VVT001", "layout.gutterPx must be a non-negative number.");
    }
    if (!Array.isArray(layout.readingOrder)) {
      error("VVT001", "layout.readingOrder must be an array.");
    }
  }

  const surfaces = contract.surfaces;
  if (isObject(surfaces)) {
    if (!Array.isArray(surfaces.radiusScalePx)) {
      error("VVT001", "surfaces.radiusScalePx must be an array.");
    }
    if (!Array.isArray(surfaces.effects)) {
      error("VVT001", "surfaces.effects must be an array.");
    } else {
      surfaces.effects.forEach((effect, index) => {
        if (!isObject(effect) || !hasType(effect.name, "string")) {
          error("VVT001", `surfaces.effects[${index}].name is required.`);
        }
      });
    }
    for (const key of ["borderStrategy", "shadowStrategy"]) {
      if (!hasType(surfaces[key], "string")) {
        error("VVT001", `surfaces.${key} must be a non-empty string.`);
      }
    }
  }

  if (Array.isArray(contract.components)) {
    if (contract.components.length === 0) {
      error("VVT001", "components must contain at least one component.");
    }
    contract.components.forEach((component, index) => {
      if (!isObject(component)) return;
      for (const key of ["name", "geometry"]) {
        if (!hasType(component[key], "string")) {
          error("VVT001", `components[${index}].${key} is required.`);
        }
      }
      if (!Number.isInteger(component.priority) || component.priority < 1) {
        error("VVT001", `components[${index}].priority must be a positive integer.`);
      }
    });
  }

  const media = contract.media;
  if (isObject(media)) {
    for (const key of ["sourcePolicy", "treatment", "cropPolicy"]) {
      if (!hasType(media[key], "string")) {
        error("VVT001", `media.${key} must be a non-empty string.`);
      }
    }
  }

  const accessibility = contract.accessibility;
  if (isObject(accessibility)) {
    for (const key of [
      "minContrastRatio",
      "minBodyPxAt1080",
      "minLabelPxAt1080",
      "minSourcePxAt1080",
    ]) {
      if (!isFiniteNumber(accessibility[key]) || accessibility[key] <= 0) {
        error("VVT001", `accessibility.${key} must be a positive number.`);
      }
    }
  }
}

function validateDesign(design) {
  if (design === null) return;
  const headings = new Set(
    design
      .split(/\r?\n/)
      .map((line) => line.match(/^#{1,6}\s+(.+?)\s*$/)?.[1])
      .filter(Boolean)
      .map((heading) => heading.toLowerCase().replace(/\s+/g, " ")),
  );

  for (const section of requiredSections) {
    if (!headings.has(section)) {
      error("VVT002", `DESIGN.md is missing the required “${section}” section.`);
    }
  }
}

function validateColors(contract) {
  if (!isObject(contract.palette)) return;
  const hex = /^#[0-9A-Fa-f]{6}$/;
  for (const role of semanticColors) {
    if (!hex.test(contract.palette[role] ?? "")) {
      error("VVT003", `palette.${role} must be a six-digit hex color.`);
    }
  }
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  return channels
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrastRatio(a, b) {
  const bright = Math.max(relativeLuminance(a), relativeLuminance(b));
  const dark = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (bright + 0.05) / (dark + 0.05);
}

function validateContrast(contract) {
  const palette = contract.palette;
  if (!isObject(palette)) return;
  const hex = /^#[0-9A-Fa-f]{6}$/;
  if (!hex.test(palette.textPrimary ?? "")) return;

  const requested = contract.accessibility?.minContrastRatio;
  const threshold = Math.max(4.5, isFiniteNumber(requested) ? requested : 4.5);
  for (const role of ["background", "surface"]) {
    if (!hex.test(palette[role] ?? "")) continue;
    const ratio = contrastRatio(palette.textPrimary, palette[role]);
    if (ratio < threshold) {
      error(
        "VVT004",
        `textPrimary against ${role} is ${ratio.toFixed(2)}:1; require at least ${threshold.toFixed(2)}:1.`,
      );
    }
  }
}

function validateType(contract) {
  const width = contract.canvas?.width;
  const scale = contract.typography?.scale;
  if (!isFiniteNumber(width) || width <= 0 || !isObject(scale)) return;

  const checks = [
    ["body", "minBodyPxAt1080", 28],
    ["label", "minLabelPxAt1080", 22],
    ["source", "minSourcePxAt1080", 20],
  ];
  for (const [role, setting, hardFloor] of checks) {
    const size = scale[role]?.sizePx;
    if (!isFiniteNumber(size)) continue;
    const configured = contract.accessibility?.[setting];
    const minimum = Math.max(hardFloor, isFiniteNumber(configured) ? configured : hardFloor);
    const normalized = (size * 1080) / width;
    if (normalized < minimum) {
      error(
        "VVT005",
        `typography.scale.${role} normalizes to ${normalized.toFixed(1)}px at 1080; require ${minimum}px.`,
      );
    }
  }
}

function validateIdentity(contract) {
  const identity = contract.identity;
  if (!isObject(identity)) return;
  if (identity.brandImitation !== false) {
    error("VVT006", "identity.brandImitation must be false.");
  }
  if (!["method-only", "original"].includes(identity.inspirationMode)) {
    error("VVT006", "identity.inspirationMode must be method-only or original.");
  }
}

function validateGeometry(contract) {
  const layout = contract.layout;
  const canvas = contract.canvas;
  if (isObject(layout?.safeAreaPx)) {
    const safe = layout.safeAreaPx;
    const sides = ["top", "right", "bottom", "left"];
    const invalidSide = sides.find((side) => !isFiniteNumber(safe[side]) || safe[side] < 0);
    if (invalidSide) {
      error("VVT007", `layout.safeAreaPx.${invalidSide} must be non-negative.`);
    } else if (
      isFiniteNumber(canvas?.width) &&
      isFiniteNumber(canvas?.height) &&
      (safe.left + safe.right >= canvas.width || safe.top + safe.bottom >= canvas.height)
    ) {
      error("VVT007", "Safe-area edges consume the full canvas or cross each other.");
    }
  }

  if (
    !Array.isArray(layout?.readingOrder) ||
    layout.readingOrder.length === 0 ||
    layout.readingOrder.some((item) => !hasType(item, "string"))
  ) {
    error("VVT007", "layout.readingOrder must contain at least one named step.");
  }

  if (Array.isArray(contract.components)) {
    contract.components.forEach((component, index) => {
      if (!isObject(component) || !hasType(component.purpose, "string")) {
        error("VVT007", `components[${index}] must state a non-empty purpose.`);
      }
    });
  }
}

function validateGuardrails(contract) {
  const guardrails = contract.guardrails;
  if (!isObject(guardrails)) return;
  for (const key of ["do", "avoid"]) {
    if (
      !Array.isArray(guardrails[key]) ||
      guardrails[key].filter((item) => hasType(item, "string")).length < 3
    ) {
      error("VVT008", `guardrails.${key} must contain at least three rules.`);
    }
  }
}

function validateBudgets(contract) {
  const familyRoles = contract.typography?.families;
  if (isObject(familyRoles)) {
    const families = new Set(
      Object.values(familyRoles)
        .map((role) => role?.family)
        .filter((family) => hasType(family, "string"))
        .map((family) => family.trim().toLowerCase()),
    );
    if (families.size > 3) {
      warning("VVT101", `Typography uses ${families.size} font families; budget is three.`);
    }
  }

  const accent = contract.palette?.maxAccentCoveragePct;
  if (isFiniteNumber(accent) && accent > 18) {
    warning("VVT102", `Accent coverage budget is ${accent}%; recommended maximum is 18%.`);
  }

  const focal = contract.layout?.maxFocalElements;
  if (isFiniteNumber(focal) && focal > 1) {
    warning("VVT103", `The frame allows ${focal} focal elements; recommended maximum is one.`);
  }

  const effects = contract.surfaces?.effects;
  if (Array.isArray(effects)) {
    if (effects.length > 3) {
      warning("VVT104", `The system declares ${effects.length} surface effects; budget is three.`);
    }
    if (
      effects.some(
        (effect) =>
          !isObject(effect) ||
          !hasType(effect.purpose, "string") ||
          !isFiniteNumber(effect.maxCoveragePct) ||
          effect.maxCoveragePct < 0 ||
          effect.maxCoveragePct > 100,
      )
    ) {
      warning("VVT106", "Every effect needs a purpose and a 0–100 coverage budget.");
    }
  }

  const radii = contract.surfaces?.radiusScalePx;
  if (Array.isArray(radii) && new Set(radii).size > 3) {
    warning("VVT105", `The radius scale has ${new Set(radii).size} values; budget is three.`);
  }
}

function printAndExit() {
  for (const diagnostic of diagnostics) {
    const label = diagnostic.severity === "error" ? "ERROR" : "WARN";
    console.log(`[${label} ${diagnostic.code}] ${diagnostic.message}`);
  }

  const errors = diagnostics.filter((item) => item.severity === "error").length;
  const warnings = diagnostics.length - errors;
  console.log(`Summary: ${errors} error(s), ${warnings} warning(s)`);
  process.exitCode = errors > 0 ? 1 : 0;
}

const targetArg = process.argv[2];
if (!targetArg) {
  error("VVT001", "Usage: lint-visual-contract.mjs <project-or-variant-directory>");
  printAndExit();
} else {
  const target = resolve(targetArg);
  const design = readText(join(target, "DESIGN.md"), "DESIGN.md");
  const contractText = readText(join(target, "visual-contract.json"), "visual-contract.json");
  const contract = parseContract(contractText);

  validateDesign(design);
  if (contract !== null) {
    validateTopLevel(contract);
    validateColors(contract);
    validateContrast(contract);
    validateType(contract);
    validateIdentity(contract);
    validateGeometry(contract);
    validateGuardrails(contract);
    validateBudgets(contract);
  }
  printAndExit();
}
