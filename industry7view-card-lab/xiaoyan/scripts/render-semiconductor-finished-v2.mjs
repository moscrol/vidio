import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const labDir = path.resolve(scriptDir, "../..");
const projectDir = path.resolve(
  labDir,
  "xiaoyan/finished/SemiconductorFinishedV2",
);
const repoSkillDir = path.resolve(labDir, "../../..");
const outputDir = path.resolve(
  repoSkillDir,
  "outputs/semiconductor-finished-v2",
);
const defaultAroll =
  "/Users/a77/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_52mnqudb2x3o22_97de/msg/video/2026-06/8b817b4a288875035d13c93d09d5d04e.mp4";
const arollPath = path.resolve(process.argv[2] || defaultAroll);
const preparedAroll = path.join(projectDir, "media/aroll-hf.mp4");
const visualOutput = path.join(outputDir, "semiconductor-xiaoyan-v2-visual.mp4");
const finalOutput = path.join(
  outputDir,
  "semiconductor-equipment-xiaoyan-v2.mp4",
);

mkdirSync(path.dirname(preparedAroll), { recursive: true });
mkdirSync(outputDir, { recursive: true });

function run(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  return execFileSync(command, args, {
    cwd: options.cwd || labDir,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: options.capture ? "utf8" : undefined,
  });
}

run("node", [
  path.join(projectDir, "validate-scenes.test.mjs"),
]);

run("ffmpeg", [
  "-y",
  "-i",
  arollPath,
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-r",
  "30",
  "-g",
  "30",
  "-keyint_min",
  "30",
  "-sc_threshold",
  "0",
  "-movflags",
  "+faststart",
  "-an",
  preparedAroll,
]);

run("npx", ["hyperframes", "lint", projectDir]);
run("npx", [
  "hyperframes",
  "inspect",
  "--samples",
  "12",
  "--json",
  projectDir,
]);
run("npx", [
  "hyperframes",
  "render",
  "--quality",
  "draft",
  "--fps",
  "30",
  "--output",
  visualOutput,
  projectDir,
]);

run("ffmpeg", [
  "-y",
  "-i",
  visualOutput,
  "-i",
  arollPath,
  "-map",
  "0:v:0",
  "-map",
  "1:a:0",
  "-c:v",
  "copy",
  "-c:a",
  "aac",
  "-b:a",
  "128k",
  "-shortest",
  "-movflags",
  "+faststart",
  finalOutput,
]);

const qaTimes = [2, 8, 16, 25, 40, 51, 58, 66, 73, 81, 85, 89];
for (const second of qaTimes) {
  run("ffmpeg", [
    "-y",
    "-ss",
    String(second),
    "-i",
    finalOutput,
    "-frames:v",
    "1",
    "-update",
    "1",
    path.join(outputDir, `qa-${String(second).padStart(2, "0")}s.png`),
  ]);
}

const probe = run(
  "ffprobe",
  [
    "-v",
    "error",
    "-show_entries",
    "format=duration,size",
    "-show_streams",
    "-of",
    "json",
    finalOutput,
  ],
  { capture: true },
);
writeFileSync(path.join(outputDir, "ffprobe.json"), probe);
writeFileSync(
  path.join(outputDir, "render-report.md"),
  `# Semiconductor Xiaoyan Finished V2 Render\n\n` +
    `- A-roll: \`${arollPath}\`\n` +
    `- Project: \`${projectDir}\`\n` +
    `- Final: \`${finalOutput}\`\n` +
    `- QA frames: ${qaTimes.join(", ")} seconds\n`,
);

console.log(`\nFinal video: ${finalOutput}`);
