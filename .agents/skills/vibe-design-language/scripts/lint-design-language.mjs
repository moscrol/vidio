#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const finding = (code, path, message) => ({ code, path, message });
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const REQUIRED_SECTIONS = [
  "Objective",
  "Evidence Boundary",
  "Sources",
  "Synthesis",
  "Downstream Handoff",
  "Open Gaps",
];
const SOURCE_FIELDS = ["Layer", "Status", "Target", "Borrow", "Exclude", "Retrieved", "Evidence"];
const SOURCE_LAYERS = new Set([
  "visual-ceiling",
  "flow",
  "platform",
  "implementation",
  "principle",
  "project-evidence",
]);
const SOURCE_STATUSES = new Set(["VERIFIED", "REFERENCE_ONLY", "SUPPLIED"]);
const TERM_KINDS = new Set(["component", "pattern", "motion", "principle", "visual-axis"]);
const GAP_OWNERS = new Set([
  "brief",
  "visual-contract",
  "motion-contract",
  "component-contract",
  "human",
]);
const VAGUE_PATTERNS = [
  ["高级", /高级/u],
  ["高端", /高端/u],
  ["大气", /大气/u],
  ["丝滑", /丝滑/u],
  ["炫酷", /炫酷/u],
  ["premium", /\bpremium\b/iu],
  ["clean", /\bclean\b/iu],
  ["modern", /\bmodern\b/iu],
  ["slick", /\bslick\b/iu],
  ["cool", /\bcool\b/iu],
];

function parseBrief(brief, errors) {
  const sections = new Set();
  const sources = [];
  let currentSection = "";
  let activeSource = null;

  for (const line of brief.split(/\r?\n/)) {
    const h2 = line.match(/^##(?!#)\s+(.+?)\s*$/);
    if (h2) {
      currentSection = h2[1].trim().toLocaleLowerCase("und");
      sections.add(currentSection);
      activeSource = null;
      continue;
    }

    const h3 = line.match(/^###\s+(REF-\d{3})\s+(?:—|-)\s+(.+?)\s*$/);
    if (h3) {
      activeSource = null;
      if (currentSection === "sources") {
        activeSource = {
          id: h3[1].toUpperCase(),
          fields: new Map(),
        };
        sources.push(activeSource);
      }
      continue;
    }

    if (!activeSource) continue;
    const field = line.match(
      /^- (Layer|Status|Target|Borrow|Exclude|Retrieved|Evidence): +(\S(?:.*\S)?)\s*$/,
    );
    if (!field) continue;
    activeSource.fields.set(field[1], field[2].trim());
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!sections.has(section.toLocaleLowerCase("und"))) {
      errors.push(
        finding("VDL002", "reference-brief.md", `Missing required H2 section: ${section}.`),
      );
    }
  }

  for (const source of sources) {
    for (const field of SOURCE_FIELDS) {
      if (!hasText(source.fields.get(field))) {
        errors.push(
          finding(
            "VDL002",
            `${source.id}.${field}`,
            `${source.id} is missing required source field ${field}.`,
          ),
        );
      }
    }
  }

  return { sources };
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function validateBriefShape(briefData, errors) {
  const sourceIds = new Set();
  for (const source of briefData.sources) {
    if (sourceIds.has(source.id)) {
      errors.push(
        finding("VDL001", `${source.id}.heading`, `Duplicate source ID: ${source.id}.`),
      );
    }
    sourceIds.add(source.id);

    const layer = source.fields.get("Layer");
    if (hasText(layer) && !SOURCE_LAYERS.has(layer)) {
      errors.push(
        finding(
          "VDL001",
          `${source.id}.Layer`,
          `Unsupported source layer: ${layer}.`,
        ),
      );
    }
    const status = source.fields.get("Status");
    if (hasText(status) && !SOURCE_STATUSES.has(status)) {
      errors.push(
        finding(
          "VDL001",
          `${source.id}.Status`,
          `Unsupported source status: ${status}.`,
        ),
      );
    }
    const retrieved = source.fields.get("Retrieved");
    if (hasText(retrieved) && !isIsoDate(retrieved)) {
      errors.push(
        finding(
          "VDL001",
          `${source.id}.Retrieved`,
          `Retrieved must be a valid ISO date (YYYY-MM-DD): ${retrieved}.`,
        ),
      );
    }
  }
}

function parseVocabulary(value, errors) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      errors.push(
        finding("VDL001", "design-vocabulary.json", `Malformed JSON: ${error.message}`),
      );
      return null;
    }
  }
  return value;
}

function validateTopLevel(vocabulary, errors) {
  if (!isObject(vocabulary)) {
    errors.push(finding("VDL001", "$", "Vocabulary root must be an object."));
    return false;
  }

  if (vocabulary.version !== "1.0") {
    errors.push(finding("VDL001", "version", 'Only vocabulary version "1.0" is supported.'));
  }
  if (!hasText(vocabulary.project)) {
    errors.push(finding("VDL001", "project", "project must be a non-empty string."));
  }
  for (const key of ["terms", "translations", "openGaps"]) {
    if (!Array.isArray(vocabulary[key])) {
      errors.push(finding("VDL001", key, `${key} must be an array.`));
    }
  }
  for (const key of Object.keys(vocabulary)) {
    if (!["version", "project", "terms", "translations", "openGaps"].includes(key)) {
      errors.push(finding("VDL001", key, `Unsupported top-level field: ${key}.`));
    }
  }
  return true;
}

function rejectUnknownKeys(value, allowed, path, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      errors.push(finding("VDL001", `${path}.${key}`, `Unsupported field: ${key}.`));
    }
  }
}

function validateVocabularyShape(vocabulary, errors) {
  if (!isObject(vocabulary)) return;

  if (Array.isArray(vocabulary.terms)) {
    vocabulary.terms.forEach((term, index) => {
      const path = `terms[${index}]`;
      if (!isObject(term)) {
        errors.push(finding("VDL001", path, "Each term must be an object."));
        return;
      }
      rejectUnknownKeys(
        term,
        [
          "id",
          "canonicalName",
          "kind",
          "aliases",
          "definition",
          "notThis",
          "states",
          "acceptance",
          "sourceRefs",
        ],
        path,
        errors,
      );
      if (!/^TERM-\d{3}$/.test(term.id ?? "")) {
        errors.push(
          finding("VDL001", `${path}.id`, "Term id must match TERM-###."),
        );
      }
      if (!hasText(term.canonicalName)) {
        errors.push(
          finding("VDL001", `${path}.canonicalName`, "canonicalName must be non-empty."),
        );
      }
      if (!TERM_KINDS.has(term.kind)) {
        errors.push(
          finding("VDL001", `${path}.kind`, `Unsupported term kind: ${term.kind}.`),
        );
      }
      if (!Array.isArray(term.aliases) || !term.aliases.every((alias) => hasText(alias))) {
        errors.push(
          finding("VDL001", `${path}.aliases`, "aliases must be an array of non-empty strings."),
        );
      }
    });
  }

  if (Array.isArray(vocabulary.translations)) {
    vocabulary.translations.forEach((translation, index) => {
      const path = `translations[${index}]`;
      if (!isObject(translation)) {
        errors.push(finding("VDL001", path, "Each translation must be an object."));
        return;
      }
      rejectUnknownKeys(
        translation,
        ["phrase", "replaceWith", "acceptance", "sourceRefs"],
        path,
        errors,
      );
      if (!hasText(translation.phrase)) {
        errors.push(
          finding("VDL001", `${path}.phrase`, "Translation phrase must be non-empty."),
        );
      }
    });
  }

  if (Array.isArray(vocabulary.openGaps)) {
    vocabulary.openGaps.forEach((gap, index) => {
      const path = `openGaps[${index}]`;
      if (!isObject(gap)) {
        errors.push(finding("VDL001", path, "Each open gap must be an object."));
        return;
      }
      rejectUnknownKeys(gap, ["term", "reason", "owner"], path, errors);
      if (!hasText(gap.term)) {
        errors.push(finding("VDL001", `${path}.term`, "Gap term must be non-empty."));
      }
      if (!hasText(gap.reason)) {
        errors.push(finding("VDL001", `${path}.reason`, "Gap reason must be non-empty."));
      }
      if (!GAP_OWNERS.has(gap.owner)) {
        errors.push(
          finding("VDL001", `${path}.owner`, `Unsupported gap owner: ${gap.owner}.`),
        );
      }
    });
  }
}

function normalizeCollision(value) {
  return String(value).toLocaleLowerCase("und").replace(/[\s_\p{P}]/gu, "");
}

function validateCollisions(terms, errors) {
  if (!Array.isArray(terms)) return;
  const seenIds = new Map();
  const seenNames = new Map();

  const record = (seen, value, path, label) => {
    if (!hasText(value)) return;
    const normalized = normalizeCollision(value);
    const previous = seen.get(normalized);
    if (previous) {
      errors.push(
        finding(
          "VDL003",
          path,
          `${label} collides with ${previous} after case and punctuation normalization.`,
        ),
      );
    } else {
      seen.set(normalized, path);
    }
  };

  terms.forEach((term, index) => {
    if (!isObject(term)) return;
    record(seenIds, term.id, `terms[${index}].id`, "Term ID");
    record(
      seenNames,
      term.canonicalName,
      `terms[${index}].canonicalName`,
      "Canonical name",
    );
    if (Array.isArray(term.aliases)) {
      term.aliases.forEach((alias, aliasIndex) => {
        record(
          seenNames,
          alias,
          `terms[${index}].aliases[${aliasIndex}]`,
          "Alias",
        );
      });
    }
  });
}

function hasNonEmptyTextArray(value) {
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.every((item) => hasText(item))
  );
}

function validateTermBoundaries(terms, errors) {
  if (!Array.isArray(terms)) return;
  terms.forEach((term, index) => {
    if (!isObject(term)) return;
    const path = `terms[${index}]`;
    if (!hasText(term.definition)) {
      errors.push(
        finding("VDL004", `${path}.definition`, "Term definition must be non-empty."),
      );
    }
    if (!hasNonEmptyTextArray(term.notThis)) {
      errors.push(
        finding(
          "VDL004",
          `${path}.notThis`,
          "Term boundary must name at least one adjacent concept in notThis.",
        ),
      );
    }
    if (!Array.isArray(term.states)) {
      errors.push(finding("VDL004", `${path}.states`, "states must be an array."));
    } else if (
      ["component", "motion"].includes(term.kind) &&
      !hasNonEmptyTextArray(term.states)
    ) {
      errors.push(
        finding(
          "VDL004",
          `${path}.states`,
          `${term.kind} terms require at least one observable state.`,
        ),
      );
    } else if (!term.states.every((state) => hasText(state))) {
      errors.push(
        finding("VDL004", `${path}.states`, "Every declared state must be non-empty."),
      );
    }
    if (!hasNonEmptyTextArray(term.acceptance)) {
      errors.push(
        finding(
          "VDL004",
          `${path}.acceptance`,
          "Term acceptance must contain at least one observable check.",
        ),
      );
    }
  });
}

function validateSourceRefs(items, itemLabel, sourceIds, errors) {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    if (!isObject(item)) return;
    const path = `${itemLabel}[${index}].sourceRefs`;
    if (!hasNonEmptyTextArray(item.sourceRefs)) {
      errors.push(
        finding("VDL005", path, "sourceRefs must contain at least one REF-### ID."),
      );
      return;
    }
    item.sourceRefs.forEach((sourceRef, sourceIndex) => {
      if (!sourceIds.has(sourceRef)) {
        errors.push(
          finding(
            "VDL005",
            `${path}[${sourceIndex}]`,
            `Unknown source reference: ${sourceRef}.`,
          ),
        );
      }
    });
  });
}

function formatVocabularyPath(segments) {
  let path = "";
  for (const segment of segments) {
    if (typeof segment === "number") {
      path += `[${segment}]`;
    } else {
      path += path.length > 0 ? `.${segment}` : segment;
    }
  }
  return path;
}

function validateVagueLanguage(value, errors, segments = []) {
  if (typeof value === "string") {
    const isTranslationPhrase =
      segments.length === 3 &&
      segments[0] === "translations" &&
      typeof segments[1] === "number" &&
      segments[2] === "phrase";
    if (isTranslationPhrase) return;

    const vague = VAGUE_PATTERNS.find(([, pattern]) => pattern.test(value));
    if (vague) {
      errors.push(
        finding(
          "VDL006",
          formatVocabularyPath(segments),
          `Vague phrase "${vague[0]}" is legal only in translations[].phrase.`,
        ),
      );
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => validateVagueLanguage(item, errors, [...segments, index]));
    return;
  }

  if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      validateVagueLanguage(item, errors, [...segments, key]);
    }
  }
}

function validateTranslations(translations, terms, errors) {
  if (!Array.isArray(translations)) return;
  const knownTermIds = new Set(
    Array.isArray(terms)
      ? terms.filter((term) => isObject(term) && hasText(term.id)).map((term) => term.id)
      : [],
  );

  translations.forEach((translation, index) => {
    if (!isObject(translation)) return;
    const path = `translations[${index}]`;
    if (!hasNonEmptyTextArray(translation.replaceWith)) {
      errors.push(
        finding(
          "VDL007",
          `${path}.replaceWith`,
          "replaceWith must contain at least one known TERM-### ID.",
        ),
      );
    } else {
      translation.replaceWith.forEach((termId, termIndex) => {
        if (!knownTermIds.has(termId)) {
          errors.push(
            finding(
              "VDL007",
              `${path}.replaceWith[${termIndex}]`,
              `Unknown translation target: ${termId}.`,
            ),
          );
        }
      });
    }

    if (!hasNonEmptyTextArray(translation.acceptance)) {
      errors.push(
        finding(
          "VDL007",
          `${path}.acceptance`,
          "Translation acceptance must contain at least one observable check.",
        ),
      );
    }
  });
}

function collectWarnings(briefData, vocabulary, warnings) {
  if (briefData) {
    for (const source of briefData.sources) {
      if (source.fields.get("Status") === "REFERENCE_ONLY") {
        warnings.push(
          finding(
            "VDL101",
            `${source.id}.Status`,
            `${source.id} is REFERENCE_ONLY and cannot support verified project facts.`,
          ),
        );
      }
    }
  }

  if (Array.isArray(vocabulary?.openGaps)) {
    vocabulary.openGaps.forEach((gap, index) => {
      warnings.push(
        finding(
          "VDL102",
          `openGaps[${index}]`,
          `Open language gap remains: ${hasText(gap?.term) ? gap.term : "unnamed gap"}.`,
        ),
      );
    });
  }
}

export function lintArtifacts({ brief, vocabulary } = {}) {
  const errors = [];
  const warnings = [];
  let briefData = null;
  if (typeof brief !== "string") {
    errors.push(finding("VDL001", "reference-brief.md", "Reference brief must be text."));
  } else {
    briefData = parseBrief(brief, errors);
    validateBriefShape(briefData, errors);
  }
  const parsedVocabulary = parseVocabulary(vocabulary, errors);
  if (parsedVocabulary !== null) {
    validateTopLevel(parsedVocabulary, errors);
    validateVocabularyShape(parsedVocabulary, errors);
    validateCollisions(parsedVocabulary?.terms, errors);
    validateTermBoundaries(parsedVocabulary?.terms, errors);
    validateVagueLanguage(parsedVocabulary, errors);
    validateTranslations(parsedVocabulary?.translations, parsedVocabulary?.terms, errors);
    if (briefData) {
      const sourceIds = new Set(briefData.sources.map((source) => source.id));
      validateSourceRefs(parsedVocabulary?.terms, "terms", sourceIds, errors);
      validateSourceRefs(parsedVocabulary?.translations, "translations", sourceIds, errors);
    }
    collectWarnings(briefData, parsedVocabulary, warnings);
  }
  return { errors, warnings };
}

export function formatReport(target, report) {
  const verdict = report.errors.length === 0 ? "APPROVE" : "BLOCK";
  const lines = [
    `[${verdict}] ${target} — ${report.errors.length} error(s), ${report.warnings.length} warning(s)`,
  ];

  for (const issue of report.errors) {
    lines.push(`ERROR ${issue.code} ${issue.path}: ${issue.message}`);
  }
  for (const issue of report.warnings) {
    lines.push(`WARN  ${issue.code} ${issue.path}: ${issue.message}`);
  }
  return lines.join("\n");
}

function lintDirectory(directory) {
  const target = resolve(directory);
  const readErrors = [];
  const read = (filename) => {
    try {
      return readFileSync(join(target, filename), "utf8");
    } catch (error) {
      readErrors.push(finding("VDL001", filename, `Cannot read ${filename}: ${error.message}`));
      return null;
    }
  };

  const brief = read("reference-brief.md");
  const vocabulary = read("design-vocabulary.json");
  const report = lintArtifacts({ brief: brief ?? undefined, vocabulary: vocabulary ?? undefined });
  report.errors.unshift(...readErrors);
  return { target, report };
}

function main(directories) {
  if (directories.length === 0) {
    const report = {
      errors: [
        finding(
          "VDL001",
          "$",
          "Usage: lint-design-language.mjs <project-directory> [...]",
        ),
      ],
      warnings: [],
    };
    console.log(formatReport("<no-project-directory>", report));
    process.exitCode = 1;
    return;
  }

  let blocked = false;
  for (const directory of directories) {
    const { target, report } = lintDirectory(directory);
    console.log(formatReport(target, report));
    blocked ||= report.errors.length > 0;
  }
  process.exitCode = blocked ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}
