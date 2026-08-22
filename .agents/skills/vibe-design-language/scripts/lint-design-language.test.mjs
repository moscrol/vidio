import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { lintArtifacts } from "./lint-design-language.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const linter = join(scriptDir, "lint-design-language.mjs");

const validBrief = `# Reference Brief

## Objective

Define the evidence-led language for the project.

## Evidence Boundary

Borrow relationships and constraints, not identity or assets.

## Sources

### REF-001 — Supplied product frame

- Layer: project-evidence
- Status: SUPPLIED
- Target: supplied frame, evidence panel at 00:00
- Borrow: literal content order and product state
- Exclude: implied ownership, brand identity, and unstated behavior
- Retrieved: 2026-08-22
- Evidence: the frame shows one claim followed by a labeled evidence row

## Synthesis

Use one claim-to-proof relationship and preserve literal product state.

## Downstream Handoff

Pass TERM-001 and TERM-002 to the visual contract; motion remains unspecified.

## Open Gaps

None.
`;

function validVocabulary() {
  return {
    version: "1.0",
    project: "proof-project",
    terms: [
      {
        id: "TERM-001",
        canonicalName: "evidence rail",
        kind: "component",
        aliases: ["proof rail"],
        definition: "A component that connects one claim to its supporting observations.",
        notThis: ["A decorative divider without evidence."],
        states: ["claim", "evidence", "resolved"],
        acceptance: ["Every rail links one visible claim to at least one labeled observation."],
        sourceRefs: ["REF-001"],
      },
      {
        id: "TERM-002",
        canonicalName: "literal product state",
        kind: "principle",
        aliases: [],
        definition: "Preserve the decision-relevant labels and state shown by supplied product evidence.",
        notThis: ["A reconstructed state that the source never showed."],
        states: [],
        acceptance: ["Visible labels and status agree with the supplied frame."],
        sourceRefs: ["REF-001"],
      },
    ],
    translations: [
      {
        phrase: "高级 clean",
        replaceWith: ["TERM-001", "TERM-002"],
        acceptance: ["The frame leads with one claim, then shows literal supporting evidence."],
        sourceRefs: ["REF-001"],
      },
    ],
    openGaps: [],
  };
}

function runCli({ brief = validBrief, vocabulary = validVocabulary(), rawVocabulary } = {}) {
  const projectDir = mkdtempSync(join(tmpdir(), "vdl-lint-"));
  try {
    if (brief !== null) {
      writeFileSync(join(projectDir, "reference-brief.md"), brief);
    }
    if (rawVocabulary !== undefined) {
      writeFileSync(join(projectDir, "design-vocabulary.json"), rawVocabulary);
    } else if (vocabulary !== null) {
      writeFileSync(
        join(projectDir, "design-vocabulary.json"),
        JSON.stringify(vocabulary, null, 2),
      );
    }

    const result = spawnSync(process.execPath, [linter, projectDir], { encoding: "utf8" });
    return {
      status: result.status,
      output: `${result.stdout}${result.stderr}`,
    };
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

test("valid artifacts pass the API and CLI with zero diagnostics", () => {
  assert.deepEqual(lintArtifacts({ brief: validBrief, vocabulary: validVocabulary() }), {
    errors: [],
    warnings: [],
  });

  const result = runCli();
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /\[APPROVE\]/);
  assert.match(result.output, /0 error\(s\), 0 warning\(s\)/);
});

test("VDL001 reports malformed, missing, and unsupported vocabulary shape", () => {
  const malformed = runCli({ rawVocabulary: "{not-json" });
  assert.equal(malformed.status, 1);
  assert.match(malformed.output, /VDL001/);

  const missingFile = runCli({ vocabulary: null });
  assert.equal(missingFile.status, 1);
  assert.match(missingFile.output, /VDL001/);

  const vocabulary = validVocabulary();
  delete vocabulary.terms;
  const unsupported = lintArtifacts({ brief: validBrief, vocabulary });
  assert.equal(unsupported.errors[0]?.code, "VDL001");
});

test("VDL002 reports a missing brief section and source field", () => {
  const missingSection = runCli({
    brief: validBrief.replace("## Open Gaps", "## Pending Questions"),
  });
  assert.equal(missingSection.status, 1);
  assert.match(missingSection.output, /VDL002/);
  assert.match(missingSection.output, /Open Gaps/);

  const missingField = runCli({
    brief: validBrief.replace(
      "- Evidence: the frame shows one claim followed by a labeled evidence row\n",
      "",
    ),
  });
  assert.equal(missingField.status, 1);
  assert.match(missingField.output, /VDL002/);
  assert.match(missingField.output, /Evidence/);

  const wrongBullet = runCli({
    brief: validBrief.replace("- Layer: project-evidence", "* Layer: project-evidence"),
  });
  assert.equal(wrongBullet.status, 1);
  assert.match(wrongBullet.output, /VDL002/);
  assert.match(wrongBullet.output, /Layer/);
});

test("source headings and fields require exact case and spacing", () => {
  const lowercaseRef = runCli({
    brief: validBrief.replace("### REF-001", "### ref-001"),
  });
  assert.equal(lowercaseRef.status, 1, lowercaseRef.output);
  assert.match(lowercaseRef.output, /VDL005/);

  for (const [label, replacement] of [
    ["lowercase field", "- layer: project-evidence"],
    ["missing post-colon space", "- Layer:project-evidence"],
    ["empty value", "- Layer:    "],
  ]) {
    const result = runCli({
      brief: validBrief.replace("- Layer: project-evidence", replacement),
    });
    assert.equal(result.status, 1, `${label}: ${result.output}`);
    assert.match(result.output, /VDL002/, `${label}: ${result.output}`);
    assert.match(result.output, /Layer/, `${label}: ${result.output}`);
  }
});

test("VDL003 reports colliding term IDs, canonical names, and aliases", () => {
  const duplicateId = validVocabulary();
  duplicateId.terms[1].id = "TERM-001";
  const idResult = runCli({ vocabulary: duplicateId });
  assert.equal(idResult.status, 1);
  assert.match(idResult.output, /VDL003/);

  const duplicateCanonical = validVocabulary();
  duplicateCanonical.terms[1].canonicalName = "Evidence_Rail!";
  const canonicalResult = runCli({ vocabulary: duplicateCanonical });
  assert.equal(canonicalResult.status, 1);
  assert.match(canonicalResult.output, /VDL003/);

  const duplicateAlias = validVocabulary();
  duplicateAlias.terms[1].aliases = ["PROOF-RAIL!"];
  const aliasResult = runCli({ vocabulary: duplicateAlias });
  assert.equal(aliasResult.status, 1);
  assert.match(aliasResult.output, /VDL003/);
});

test("VDL004 reports missing definition, boundary, required states, and acceptance", () => {
  const mutations = [
    ["definition", (term) => delete term.definition],
    ["notThis", (term) => (term.notThis = [])],
    ["states", (term) => (term.states = [])],
    ["acceptance", (term) => (term.acceptance = [])],
  ];

  for (const [field, mutate] of mutations) {
    const vocabulary = validVocabulary();
    mutate(vocabulary.terms[0]);
    const result = runCli({ vocabulary });
    assert.equal(result.status, 1, `${field}: ${result.output}`);
    assert.match(result.output, /VDL004/, `${field}: ${result.output}`);
  }
});

test("VDL005 reports empty and unknown source references", () => {
  const emptyRefs = validVocabulary();
  emptyRefs.terms[0].sourceRefs = [];
  const emptyResult = runCli({ vocabulary: emptyRefs });
  assert.equal(emptyResult.status, 1);
  assert.match(emptyResult.output, /VDL005/);

  const unknownRefs = validVocabulary();
  unknownRefs.translations[0].sourceRefs = ["REF-999"];
  const unknownResult = runCli({ vocabulary: unknownRefs });
  assert.equal(unknownResult.status, 1);
  assert.match(unknownResult.output, /VDL005/);
  assert.match(unknownResult.output, /REF-999/);
});

test("VDL006 blocks vague canonical language while translations remain legal", () => {
  for (const phrase of [
    "高级",
    "高端",
    "大气",
    "丝滑",
    "炫酷",
    "premium",
    "clean",
    "modern",
    "slick",
    "cool",
  ]) {
    const vocabulary = validVocabulary();
    vocabulary.terms[0].canonicalName = `${phrase} evidence rail`;
    const result = runCli({ vocabulary });
    assert.equal(result.status, 1, `${phrase}: ${result.output}`);
    assert.match(result.output, /VDL006/, `${phrase}: ${result.output}`);
  }
});

test("VDL006 scans every vocabulary string except translations[].phrase", () => {
  const vocabulary = validVocabulary();
  vocabulary.version = "premium";
  vocabulary.project = "clean project";
  Object.assign(vocabulary.terms[0], {
    id: "TERM-modern",
    canonicalName: "slick rail",
    kind: "高端",
    aliases: ["cool alias"],
    definition: "premium definition",
    notThis: ["clean boundary"],
    states: ["modern state"],
    acceptance: ["高级 acceptance"],
    sourceRefs: ["REF-炫酷"],
  });
  Object.assign(vocabulary.translations[0], {
    replaceWith: ["TERM-modern"],
    acceptance: ["大气 acceptance"],
    sourceRefs: ["REF-炫酷"],
  });
  vocabulary.openGaps = [
    {
      term: "丝滑 gap",
      reason: "炫酷 reason",
      owner: "premium",
    },
  ];

  const result = runCli({ vocabulary });
  assert.equal(result.status, 1, result.output);
  for (const path of [
    "version",
    "project",
    "terms[0].id",
    "terms[0].canonicalName",
    "terms[0].kind",
    "terms[0].aliases[0]",
    "terms[0].definition",
    "terms[0].notThis[0]",
    "terms[0].states[0]",
    "terms[0].acceptance[0]",
    "terms[0].sourceRefs[0]",
    "translations[0].replaceWith[0]",
    "translations[0].acceptance[0]",
    "translations[0].sourceRefs[0]",
    "openGaps[0].term",
    "openGaps[0].reason",
    "openGaps[0].owner",
  ]) {
    assert.ok(result.output.includes(`VDL006 ${path}:`), `${path}: ${result.output}`);
  }
  assert.doesNotMatch(result.output, /VDL006 translations\[0\]\.phrase:/);
});

test("VDL007 reports unknown translation targets and missing observable acceptance", () => {
  const unknownTarget = validVocabulary();
  unknownTarget.translations[0].replaceWith = ["TERM-999"];
  const unknownResult = runCli({ vocabulary: unknownTarget });
  assert.equal(unknownResult.status, 1);
  assert.match(unknownResult.output, /VDL007/);
  assert.match(unknownResult.output, /TERM-999/);

  const noAcceptance = validVocabulary();
  noAcceptance.translations[0].acceptance = [];
  const acceptanceResult = runCli({ vocabulary: noAcceptance });
  assert.equal(acceptanceResult.status, 1);
  assert.match(acceptanceResult.output, /VDL007/);
  assert.match(acceptanceResult.output, /acceptance/i);
});

test("VDL101 warns for REFERENCE_ONLY evidence without blocking", () => {
  const result = runCli({ brief: validBrief.replace("Status: SUPPLIED", "Status: REFERENCE_ONLY") });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /VDL101/);
  assert.match(result.output, /0 error\(s\), 1 warning\(s\)/);
});

test("VDL102 warns for each open language gap without blocking", () => {
  const vocabulary = validVocabulary();
  vocabulary.openGaps = [
    {
      term: "subtitle provenance",
      reason: "The supplied frame has no subtitle treatment.",
      owner: "human",
    },
  ];
  const result = runCli({ vocabulary });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /VDL102/);
  assert.match(result.output, /0 error\(s\), 1 warning\(s\)/);
});

test("VDL001 rejects unsupported source and nested vocabulary shapes", () => {
  for (const [label, brief] of [
    ["layer", validBrief.replace("Layer: project-evidence", "Layer: moodboard")],
    ["status", validBrief.replace("Status: SUPPLIED", "Status: OWNED")],
    ["retrieved", validBrief.replace("Retrieved: 2026-08-22", "Retrieved: 2026/08/22")],
  ]) {
    const result = runCli({ brief });
    assert.equal(result.status, 1, `${label}: ${result.output}`);
    assert.match(result.output, /VDL001/, `${label}: ${result.output}`);
  }

  const mutations = [
    ["term id", (vocabulary) => (vocabulary.terms[0].id = "term-one")],
    ["term kind", (vocabulary) => (vocabulary.terms[0].kind = "widget")],
    ["aliases", (vocabulary) => (vocabulary.terms[0].aliases = null)],
    ["translation phrase", (vocabulary) => (vocabulary.translations[0].phrase = "")],
    [
      "gap owner",
      (vocabulary) =>
        (vocabulary.openGaps = [
          { term: "unowned term", reason: "No decision exists.", owner: "renderer" },
        ]),
    ],
  ];

  for (const [label, mutate] of mutations) {
    const vocabulary = validVocabulary();
    mutate(vocabulary);
    const result = runCli({ vocabulary });
    assert.equal(result.status, 1, `${label}: ${result.output}`);
    assert.match(result.output, /VDL001/, `${label}: ${result.output}`);
  }
});

test("brief parsing accepts case-insensitive H2 names and ASCII source separators", () => {
  const brief = validBrief
    .replace("## Objective", "## objective")
    .replace("## Evidence Boundary", "## EVIDENCE BOUNDARY")
    .replace("### REF-001 —", "### REF-001 -");
  const result = runCli({ brief });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /0 error\(s\), 0 warning\(s\)/);
});
