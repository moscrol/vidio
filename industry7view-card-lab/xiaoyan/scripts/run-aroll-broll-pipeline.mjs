import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  buildEditDecision,
  normalizeTranscript,
  renderCaptionsModule,
  renderScenesModule,
  validateSceneTimeline,
} from "./aroll-broll-pipeline-lib.mjs";

const execFileAsync = promisify(execFile);
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "../..");
const DEFAULT_OUTPUT_ROOT = path.join(PROJECT_ROOT, "xiaoyan/auto-edits");

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.aroll || !args.transcript) {
    console.error(
      "Usage: npm run xiaoyan:aroll-broll:pipeline -- --aroll <video.mp4> --transcript <whisper.json> [--slug name] [--out dir]",
    );
    process.exit(1);
  }

  const arollPath = path.resolve(process.cwd(), args.aroll);
  const transcriptPath = path.resolve(process.cwd(), args.transcript);
  const slug = args.slug ?? slugify(path.basename(arollPath, path.extname(arollPath)));
  const outputDir = path.resolve(process.cwd(), args.out ?? path.join(DEFAULT_OUTPUT_ROOT, slug));

  const rawTranscript = JSON.parse(await fs.readFile(transcriptPath, "utf8"));
  const words = normalizeTranscript(rawTranscript);
  const duration = args.duration ? Number(args.duration) : await probeDuration(arollPath, words);
  const decision = buildEditDecision({
    arollPath: path.relative(outputDir, arollPath),
    transcriptPath: path.relative(outputDir, transcriptPath),
    words,
    duration,
    slug,
  });

  validateSceneTimeline(decision.scenes, decision.duration);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, "transcript.normalized.json"),
    `${JSON.stringify({ schemaVersion: 1, slug, words }, null, 2)}\n`,
  );
  await fs.writeFile(path.join(outputDir, "edit-decision.json"), `${JSON.stringify(decision, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, "scenes.generated.js"), renderScenesModule(decision));
  await fs.writeFile(path.join(outputDir, "captions.generated.js"), renderCaptionsModule(decision));
  await fs.writeFile(path.join(outputDir, "README.md"), renderReadme(decision));

  console.log(`Generated ${path.relative(PROJECT_ROOT, outputDir)}`);
  console.log(`Duration: ${decision.duration}s`);
  console.log(`Scenes: ${decision.scenes.length}`);
  console.log(`Xiaoyan scenes: ${decision.stats.xiaoyanSceneCount}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

async function probeDuration(videoPath, words) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      videoPath,
    ]);
    const duration = Number(stdout.trim());
    if (Number.isFinite(duration) && duration > 0) {
      return Math.round(duration * 1000) / 1000;
    }
  } catch {
    // Fall back to transcript timing below.
  }
  const fallback = words.at(-1)?.end;
  if (!Number.isFinite(fallback)) {
    throw new Error(`Could not determine duration for ${videoPath}`);
  }
  return fallback;
}

function renderReadme(decision) {
  const rows = decision.scenes.map((scene) => {
    const label = scene.type === "xiaoyan" ? `${scene.type}:${scene.component}` : scene.type;
    return `| ${scene.start.toFixed(2)}-${scene.end.toFixed(2)} | ${label} | ${scene.reason ?? ""} |`;
  });
  return [
    `# ${decision.slug} Xiaoyan A-roll+B-roll Auto Edit`,
    "",
    `- Duration: ${decision.duration}s`,
    `- A-roll source: \`${decision.sources.arollPath}\``,
    `- Transcript source: \`${decision.sources.transcriptPath}\``,
    `- Word count: ${decision.stats.wordCount}`,
    `- Xiaoyan scenes: ${decision.stats.xiaoyanSceneCount}`,
    `- Xiaoyan seconds: ${decision.stats.xiaoyanSeconds}s`,
    "",
    "| time | layer | reason |",
    "|---|---|---|",
    ...rows,
    "",
    "## Files",
    "",
    "- `transcript.normalized.json`: timestamp-normalized words.",
    "- `edit-decision.json`: canonical decision contract.",
    "- `scenes.generated.js`: generated scene timeline module.",
    "- `captions.generated.js`: generated Xiaoyan caption module.",
    "",
  ].join("\n");
}

function slugify(value) {
  return String(value)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
