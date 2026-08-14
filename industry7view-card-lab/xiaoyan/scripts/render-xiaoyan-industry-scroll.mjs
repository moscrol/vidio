import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const PROJECT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "../..");
const DEFAULT_PROPS_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanIndustryScroll/sample-props.json",
);
const COMPONENT_INDEX_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanIndustryScroll/index.html",
);
const RENDERS_ROOT = path.join(PROJECT_ROOT, "xiaoyan/renders");
const CHROME_EXECUTABLE_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 1080, height: 1920 };
const TIMELINE_ID = "xiaoyan-industry-scroll";

const propsPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : DEFAULT_PROPS_PATH;

function validateProps(props) {
  const errors = [];

  if (!props || typeof props !== "object" || Array.isArray(props)) {
    errors.push("props must be a JSON object");
  } else {
    if (typeof props.id !== "string" || props.id.trim() === "") {
      errors.push("props.id must be a non-empty string");
    } else if (props.id === "." || props.id === "..") {
      errors.push("props.id must not be . or ..");
    } else if (!/^[A-Za-z0-9._-]+$/.test(props.id)) {
      errors.push("props.id may only contain letters, numbers, dots, underscores, and hyphens");
    }

    if (typeof props.topic !== "string" || props.topic.trim() === "") {
      errors.push("props.topic must be a non-empty string");
    }

    if (typeof props.title !== "string" || props.title.trim() === "") {
      errors.push("props.title must be a non-empty string");
    }

    if (!Array.isArray(props.nodes) || props.nodes.length < 4 || props.nodes.length > 6) {
      errors.push("props.nodes must contain 4-6 nodes");
    } else {
      for (const node of props.nodes) {
        if (!node || typeof node !== "object" || Array.isArray(node)) {
          errors.push("each node must be an object");
          continue;
        }

        if (typeof node.label !== "string" || node.label.trim() === "") {
          errors.push("each node.label must be a non-empty string");
        }

        if (
          node.role !== undefined &&
          !["upstream", "midstream", "downstream", "application"].includes(node.role)
        ) {
          errors.push(`invalid node.role for ${node.label || "(missing label)"}`);
        }
      }
    }

    if (
      props.highlightNode &&
      Array.isArray(props.nodes) &&
      !props.nodes.some((node) => node.label === props.highlightNode)
    ) {
      errors.push("props.highlightNode must match one node.label");
    }

    if (
      props.durationSeconds !== undefined &&
      (typeof props.durationSeconds !== "number" ||
        props.durationSeconds < 6 ||
        props.durationSeconds > 10)
    ) {
      errors.push("props.durationSeconds must be a number from 6 to 10 when provided");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid props:\n- ${errors.join("\n- ")}`);
  }
}

function resolveOutputDir(propsId) {
  const outputDir = path.resolve(RENDERS_ROOT, propsId);
  const relativePath = path.relative(RENDERS_ROOT, outputDir);

  if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Invalid props.id output directory: ${propsId}`);
  }

  return outputDir;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function injectProps(html, props) {
  const propsScriptPattern =
    /<script\s+type="application\/json"\s+id="xiaoyan-props">[\s\S]*?<\/script>/;
  const propsJson = JSON.stringify(props, null, 2).replace(/<\/script/gi, "<\\/script");
  const nextBlock = `<script type="application/json" id="xiaoyan-props">\n${propsJson}\n    </script>`;

  if (!propsScriptPattern.test(html)) {
    throw new Error("Could not find xiaoyan-props JSON script block in component index.html");
  }

  return html.replace(propsScriptPattern, nextBlock);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const cwd = options.cwd || process.cwd();
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      error.result = {
        command: [command, ...args].join(" "),
        cwd,
        code: null,
        stdout,
        stderr,
        output: `${stdout}${stderr}`,
      };
      reject(error);
    });
    child.on("close", (code) => {
      const result = {
        command: [command, ...args].join(" "),
        cwd,
        code,
        stdout,
        stderr,
        output: `${stdout}${stderr}`,
      };

      if (code === 0) {
        resolve(result);
      } else {
        const error = new Error(`Command failed (${code}): ${result.command}`);
        error.result = result;
        reject(error);
      }
    });
  });
}

async function withStaticServer(rootDir, callback) {
  const resolvedRootDir = path.resolve(rootDir);
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      const decodedPath = decodeURIComponent(requestUrl.pathname);
      const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
      const filePath = path.resolve(resolvedRootDir, relativePath);
      const serverRelativePath = path.relative(resolvedRootDir, filePath);

      if (serverRelativePath.startsWith("..") || path.isAbsolute(serverRelativePath)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const content = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      const contentType =
        ext === ".html"
          ? "text/html; charset=utf-8"
          : ext === ".js"
            ? "text/javascript; charset=utf-8"
            : ext === ".json"
              ? "application/json; charset=utf-8"
              : "application/octet-stream";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500);
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
    }
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  try {
    return await callback(`http://127.0.0.1:${port}/index.html`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function capturePreview(tempCompositionDir, previewPath) {
  await withStaticServer(tempCompositionDir, async (url) => {
    const browser = await chromium.launch({
      executablePath: CHROME_EXECUTABLE_PATH,
      headless: true,
    });

    try {
      const page = await browser.newPage({ viewport: VIEWPORT });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForFunction(
        (timelineId) => {
          const timeline = window.__timelines?.[timelineId];
          return timeline && typeof timeline.duration === "function" && timeline.duration() > 0;
        },
        TIMELINE_ID,
      );
      await page.evaluate((timelineId) => {
        const timeline = window.__timelines[timelineId];
        const nearFinalTime = Math.max(timeline.duration() - 0.1, 0);
        timeline.pause();
        timeline.seek(nearFinalTime, false);
      }, TIMELINE_ID);
      await page.waitForFunction(
        (timelineId) => {
          const timeline = window.__timelines?.[timelineId];
          return timeline && timeline.time() >= Math.max(timeline.duration() - 0.11, 0);
        },
        TIMELINE_ID,
      );
      await page.screenshot({ path: previewPath, fullPage: false });
    } finally {
      await browser.close();
    }
  });
}

function reportSection(title, body) {
  return `## ${title}\n\n\`\`\`text\n${body.trim() || "(no output)"}\n\`\`\``;
}

function commandReportSection(result) {
  const body = [
    `Command: ${result.command}`,
    `CWD: ${result.cwd}`,
    `Exit code: ${result.code ?? "(spawn error)"}`,
    "",
    "STDOUT:",
    result.stdout.trim() || "(no output)",
    "",
    "STDERR:",
    result.stderr.trim() || "(no output)",
  ].join("\n");

  return reportSection(result.label, body);
}

function parseFfprobeOutput(output) {
  const metadata = {};

  for (const line of output.split(/\r?\n/)) {
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    metadata[key] = value;
  }

  return metadata;
}

function validateVideoMetadata(ffprobeResult, expectedDurationSeconds) {
  const metadata = parseFfprobeOutput(ffprobeResult.stdout);
  const failures = [];
  const durationToleranceSeconds = 0.08;

  if (metadata.width !== "1080") {
    failures.push(`width must be 1080, got ${metadata.width || "(missing)"}`);
  }

  if (metadata.height !== "1920") {
    failures.push(`height must be 1920, got ${metadata.height || "(missing)"}`);
  }

  if (metadata.r_frame_rate !== "30/1") {
    failures.push(`r_frame_rate must be 30/1, got ${metadata.r_frame_rate || "(missing)"}`);
  }

  const duration = Number(metadata.duration);
  if (!Number.isFinite(duration)) {
    failures.push(`duration must be numeric, got ${metadata.duration || "(missing)"}`);
  } else if (Math.abs(duration - expectedDurationSeconds) > durationToleranceSeconds) {
    failures.push(
      `duration must be ${expectedDurationSeconds}s +/- ${durationToleranceSeconds}s, got ${duration}s`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`ffprobe validation failed:\n- ${failures.join("\n- ")}`);
  }
}

function buildReport({ status, paths, commandResults, error }) {
  const sections = [
    "# Xiaoyan Industry Scroll Render Report",
    "",
    `Status: ${status}`,
    "",
    `Props: ${paths.outputPropsPath}`,
    `Temp composition: ${paths.tempCompositionDir}`,
    `Rendered MP4: ${paths.mp4Path}`,
    `Preview PNG: ${paths.previewPath}`,
    "",
  ];

  if (error) {
    sections.push(reportSection("Failure", error.stack || error.message));
    sections.push("");
  }

  for (const result of commandResults) {
    sections.push(commandReportSection(result));
    sections.push("");
  }

  return sections.join("\n");
}

async function runTrackedCommand(commandResults, label, command, args, options = {}) {
  try {
    const result = await runCommand(command, args, options);
    commandResults.push({ label, ...result });
    return result;
  } catch (error) {
    if (error.result) {
      commandResults.push({ label, ...error.result });
    }
    throw error;
  }
}

async function main() {
  const props = await readJson(propsPath);
  validateProps(props);

  const outputDir = resolveOutputDir(props.id);
  const tempCompositionDir = path.join(outputDir, "composition-temp");
  const mp4Path = path.join(outputDir, "xiaoyan-industry-scroll.mp4");
  const previewPath = path.join(outputDir, "preview.png");
  const reportPath = path.join(outputDir, "render-report.md");
  const outputPropsPath = path.join(outputDir, "props.json");
  const paths = {
    outputPropsPath,
    tempCompositionDir,
    mp4Path,
    previewPath,
  };
  const commandResults = [];

  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(tempCompositionDir, { recursive: true, force: true });
  await fs.mkdir(tempCompositionDir, { recursive: true });

  const componentHtml = await fs.readFile(COMPONENT_INDEX_PATH, "utf8");
  await fs.writeFile(path.join(tempCompositionDir, "index.html"), injectProps(componentHtml, props));
  await fs.writeFile(outputPropsPath, `${JSON.stringify(props, null, 2)}\n`);

  try {
    await runTrackedCommand(commandResults, "HyperFrames Lint", "npx", ["hyperframes", "lint", "--verbose"], {
      cwd: tempCompositionDir,
    });
    await runTrackedCommand(
      commandResults,
      "HyperFrames Inspect",
      "npx",
      ["hyperframes", "inspect", "--samples", "8", "--json"],
      { cwd: tempCompositionDir },
    );
    await runTrackedCommand(
      commandResults,
      "HyperFrames Render",
      "npx",
      ["hyperframes", "render", "--quality", "draft", "--output", mp4Path],
      { cwd: tempCompositionDir },
    );

    await capturePreview(tempCompositionDir, previewPath);

    const ffprobeResult = await runTrackedCommand(
      commandResults,
      "ffprobe",
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,r_frame_rate,duration",
        "-of",
        "default=nw=1",
        mp4Path,
      ],
      { cwd: PROJECT_ROOT },
    );
    validateVideoMetadata(ffprobeResult, props.durationSeconds || 8);

    await fs.writeFile(reportPath, buildReport({ status: "success", paths, commandResults }));
  } catch (error) {
    await fs.writeFile(reportPath, buildReport({ status: "failure", paths, commandResults, error }));
    throw error;
  }

  console.log(`Rendered MP4: ${mp4Path}`);
  console.log(`Preview PNG: ${previewPath}`);
  console.log(`Render report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error.message);
  if (error.result?.output) {
    console.error(error.result.output);
  }
  process.exit(1);
});
