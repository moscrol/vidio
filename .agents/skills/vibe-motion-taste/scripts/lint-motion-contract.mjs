#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const PURPOSES = new Set([
  "orient",
  "explain",
  "emphasize",
  "bridge",
  "confirm",
  "delight",
]);

const LAYOUT_PROPERTIES = new Set([
  "width",
  "height",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "top",
  "right",
  "bottom",
  "left",
  "gap",
  "flex",
  "grid-template-columns",
  "grid-template-rows",
]);

const finding = (rule, path, message) => ({ rule, path, message });
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

function validateComposition(composition, errors) {
  if (!isObject(composition)) {
    errors.push(finding("VMT001", "composition", "composition must be an object."));
    return null;
  }

  if (!hasText(composition.id)) {
    errors.push(finding("VMT001", "composition.id", "composition.id is required."));
  }
  if (!isPositiveInteger(composition.fps)) {
    errors.push(finding("VMT001", "composition.fps", "composition.fps must be a positive integer."));
  }
  if (!isPositiveInteger(composition.durationFrames)) {
    errors.push(
      finding(
        "VMT001",
        "composition.durationFrames",
        "composition.durationFrames must be a positive integer.",
      ),
    );
  }
  if (!hasText(composition.personality)) {
    errors.push(
      finding("VMT001", "composition.personality", "composition.personality is required."),
    );
  }
  if (!hasText(composition.primaryAudience)) {
    errors.push(
      finding(
        "VMT001",
        "composition.primaryAudience",
        "composition.primaryAudience is required.",
      ),
    );
  }

  return composition;
}

function validateRange(beat, index, durationFrames, errors) {
  const path = `beats[${index}].range`;
  const range = beat.range;
  const validShape =
    Array.isArray(range) &&
    range.length === 2 &&
    Number.isInteger(range[0]) &&
    Number.isInteger(range[1]);

  if (!validShape) {
    errors.push(finding("VMT002", path, "range must contain two integer frame numbers."));
    return null;
  }

  const [start, end] = range;
  if (start < 0 || end <= start || !isPositiveInteger(durationFrames) || end > durationFrames) {
    errors.push(
      finding(
        "VMT002",
        path,
        `range must satisfy 0 <= start < end <= composition.durationFrames (${durationFrames}).`,
      ),
    );
    return null;
  }

  return range;
}

function validateEntry(beat, index, errors, warnings) {
  if (beat.entry === undefined) return;

  const path = `beats[${index}].entry`;
  const entry = beat.entry;
  if (!isObject(entry)) {
    errors.push(finding("VMT001", path, "entry must be an object."));
    return;
  }

  if (!Array.isArray(entry.properties) || entry.properties.length === 0) {
    errors.push(
      finding("VMT001", `${path}.properties`, "entry.properties must be a non-empty array."),
    );
  } else {
    const layoutProperties = entry.properties.filter((property) =>
      LAYOUT_PROPERTIES.has(String(property).toLowerCase()),
    );
    if (layoutProperties.length > 0) {
      warnings.push(
        finding(
          "VMT101",
          `${path}.properties`,
          `Continuous layout animation (${layoutProperties.join(", ")}) can make previews unstable. Prefer transform, opacity, or a justified clip-path.`,
        ),
      );
    }
  }

  if (!hasText(entry.easing)) {
    errors.push(finding("VMT001", `${path}.easing`, "entry.easing is required."));
  } else {
    const easing = entry.easing.toLowerCase();
    if (easing === "ease-in" || easing.endsWith(".in")) {
      errors.push(
        finding("VMT004", `${path}.easing`, "Entry easing cannot be ease-in."),
      );
    }
    if ((easing.includes("back") || easing.includes("spring")) && !hasText(beat.physicalReason)) {
      warnings.push(
        finding(
          "VMT102",
          `${path}.easing`,
          "Back or spring easing needs physicalReason; otherwise use a deterministic timing curve.",
        ),
      );
    }
  }

  if (!isPositiveInteger(entry.durationFrames)) {
    errors.push(
      finding(
        "VMT001",
        `${path}.durationFrames`,
        "entry.durationFrames must be a positive integer.",
      ),
    );
  } else if (
    (entry.durationFrames < 8 || entry.durationFrames > 15) &&
    !hasText(beat.timingReason)
  ) {
    errors.push(
      finding(
        "VMT007",
        `${path}.durationFrames`,
        "Entry duration outside the 8–15 frame band requires timingReason.",
      ),
    );
  }

  if (entry.fromScale !== undefined) {
    if (typeof entry.fromScale !== "number" || !Number.isFinite(entry.fromScale)) {
      errors.push(
        finding("VMT001", `${path}.fromScale`, "entry.fromScale must be a finite number."),
      );
    } else if (entry.fromScale < 0.9) {
      errors.push(
        finding(
          "VMT005",
          `${path}.fromScale`,
          "Normalized entry.fromScale must be at least 0.9; scale(0) and tiny origins are blocked.",
        ),
      );
    }
  }
}

function validateBeat(beat, index, composition, errors, warnings, ids) {
  const path = `beats[${index}]`;
  if (!isObject(beat)) {
    errors.push(finding("VMT001", path, "beat must be an object."));
    return null;
  }

  if (!hasText(beat.id)) {
    errors.push(finding("VMT001", `${path}.id`, "beat.id is required."));
  } else if (ids.has(beat.id)) {
    errors.push(finding("VMT001", `${path}.id`, `beat.id must be unique: ${beat.id}.`));
  } else {
    ids.add(beat.id);
  }

  const range = validateRange(beat, index, composition?.durationFrames, errors);

  if (!PURPOSES.has(beat.purpose)) {
    errors.push(
      finding(
        "VMT003",
        `${path}.purpose`,
        `purpose must be one of: ${[...PURPOSES].join(", ")}.`,
      ),
    );
  } else if (beat.purpose === "delight" && !hasText(beat.delightReason)) {
    errors.push(
      finding(
        "VMT003",
        `${path}.delightReason`,
        "A delight beat requires delightReason explaining why the rare moment earns it.",
      ),
    );
  }

  if (!hasText(beat.focus)) {
    errors.push(finding("VMT001", `${path}.focus`, "beat.focus is required."));
  }

  if (beat.salience !== undefined && !["low", "medium", "high"].includes(beat.salience)) {
    errors.push(
      finding(
        "VMT001",
        `${path}.salience`,
        "beat.salience must be low, medium, or high.",
      ),
    );
  }

  validateEntry(beat, index, errors, warnings);

  if (!isObject(beat.exit) && beat.persistsThroughScene !== true) {
    errors.push(
      finding(
        "VMT006",
        `${path}.exit`,
        "A transient beat requires exit, or persistsThroughScene must be true.",
      ),
    );
  }

  if (
    beat.staggerFrames !== undefined &&
    (!Number.isInteger(beat.staggerFrames) || beat.staggerFrames < 1 || beat.staggerFrames > 3)
  ) {
    warnings.push(
      finding(
        "VMT104",
        `${path}.staggerFrames`,
        "staggerFrames should stay between one and three frames unless the timing is explicitly justified.",
      ),
    );
  }

  if (beat.motionRole === "camera" && (!isPositiveInteger(beat.holdFrames) || beat.holdFrames < 24)) {
    warnings.push(
      finding(
        "VMT105",
        `${path}.holdFrames`,
        "Camera motion should settle into at least 24 readable frames before the next cut.",
      ),
    );
  }

  if (beat.displayMode === "static-card" && beat.holdFrames > 45 && !hasText(beat.secondaryMotion)) {
    warnings.push(
      finding(
        "VMT106",
        `${path}.displayMode`,
        "A long static card risks Anti-PPT; declare a restrained secondaryMotion or shorten it.",
      ),
    );
  }

  return range ? { index, id: beat.id, range, salience: beat.salience } : null;
}

function warnOverlappingFocus(validBeats, warnings) {
  const high = validBeats.filter((beat) => beat && beat.salience === "high");
  for (let left = 0; left < high.length; left += 1) {
    for (let right = left + 1; right < high.length; right += 1) {
      const a = high[left];
      const b = high[right];
      if (Math.max(a.range[0], b.range[0]) < Math.min(a.range[1], b.range[1])) {
        warnings.push(
          finding(
            "VMT103",
            `beats[${b.index}].range`,
            `High-salience beats ${a.id} and ${b.id} overlap; keep one primary focus.`,
          ),
        );
      }
    }
  }
}

export function lintContract(contract) {
  const errors = [];
  const warnings = [];

  if (!isObject(contract)) {
    return {
      errors: [finding("VMT001", "$", "Contract root must be an object.")],
      warnings,
    };
  }

  if (contract.version !== 1) {
    errors.push(finding("VMT001", "version", "Only motion contract version 1 is supported."));
  }

  const composition = validateComposition(contract.composition, errors);
  if (!Array.isArray(contract.beats) || contract.beats.length === 0) {
    errors.push(finding("VMT001", "beats", "beats must be a non-empty array."));
    return { errors, warnings };
  }

  const ids = new Set();
  const validBeats = contract.beats.map((beat, index) =>
    validateBeat(beat, index, composition, errors, warnings, ids),
  );
  warnOverlappingFocus(validBeats, warnings);

  return { errors, warnings };
}

export function formatReport(file, report) {
  const verdict = report.errors.length === 0 ? "APPROVE" : "BLOCK";
  const lines = [
    `[${verdict}] ${file} — ${report.errors.length} error(s), ${report.warnings.length} warning(s)`,
  ];

  for (const issue of report.errors) {
    lines.push(`ERROR ${issue.rule} ${issue.path}: ${issue.message}`);
  }
  for (const issue of report.warnings) {
    lines.push(`WARN  ${issue.rule} ${issue.path}: ${issue.message}`);
  }

  return lines.join("\n");
}

function readContract(file) {
  try {
    return { contract: JSON.parse(readFileSync(file, "utf8")), readError: null };
  } catch (error) {
    return {
      contract: null,
      readError: finding("VMT001", "$", `Cannot read valid JSON: ${error.message}`),
    };
  }
}

function runCli(argv) {
  const json = argv.includes("--json");
  const files = argv.filter((argument) => argument !== "--json");
  if (files.length === 0) {
    console.error("Usage: lint-motion-contract.mjs [--json] <motion-contract.json> [...]");
    return 2;
  }

  const results = files.map((file) => {
    const { contract, readError } = readContract(file);
    const report = readError ? { errors: [readError], warnings: [] } : lintContract(contract);
    return { file, ...report };
  });

  if (json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(results.map(({ file, errors, warnings }) => formatReport(file, { errors, warnings })).join("\n\n"));
  }

  return results.some((result) => result.errors.length > 0) ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli(process.argv.slice(2));
}
