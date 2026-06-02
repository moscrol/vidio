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
  "xiaoyan/components/XiaoyanProfitPipe/sample-props.json",
);
const COMPONENT_INDEX_PATH = path.join(
  PROJECT_ROOT,
  "xiaoyan/components/XiaoyanProfitPipe/index.html",
);
const CHROME_EXECUTABLE_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 1080, height: 1920 };
const PREVIEW_WAIT_MS = 5200;

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
    } else if (!/^[A-Za-z0-9._-]+$/.test(props.id)) {
      errors.push("props.id may only contain letters, numbers, dots, underscores, and hyphens");
    }

    if (!Array.isArray(props.factors)) {
      errors.push("props.factors must be an array");
    }

    if (typeof props.resultLabel !== "string" || props.resultLabel.trim() === "") {
      errors.push("props.resultLabel must be a non-empty string");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid props:\n- ${errors.join("\n- ")}`);
  }
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
    const child = spawn(command, args, {
      cwd: options.cwd,
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
    child.on("error", reject);
    child.on("close", (code) => {
      const result = {
        command: [command, ...args].join(" "),
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
  const server = createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
      const decodedPath = decodeURIComponent(requestUrl.pathname);
      const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
      const filePath = path.resolve(rootDir, relativePath);

      if (!filePath.startsWith(rootDir)) {
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
      await page.waitForTimeout(PREVIEW_WAIT_MS);
      await page.screenshot({ path: previewPath, fullPage: false });
    } finally {
      await browser.close();
    }
  });
}

function reportSection(title, body) {
  return `## ${title}\n\n\`\`\`text\n${body.trim() || "(no output)"}\n\`\`\``;
}

async function main() {
  const props = await readJson(propsPath);
  validateProps(props);

  const outputDir = path.join(PROJECT_ROOT, "xiaoyan/renders", props.id);
  const tempCompositionDir = path.join(outputDir, "composition-temp");
  const mp4Path = path.join(outputDir, "xiaoyan-profit-pipe.mp4");
  const previewPath = path.join(outputDir, "preview.png");
  const reportPath = path.join(outputDir, "render-report.md");
  const outputPropsPath = path.join(outputDir, "props.json");

  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(tempCompositionDir, { recursive: true, force: true });
  await fs.mkdir(tempCompositionDir, { recursive: true });

  const componentHtml = await fs.readFile(COMPONENT_INDEX_PATH, "utf8");
  await fs.writeFile(path.join(tempCompositionDir, "index.html"), injectProps(componentHtml, props));
  await fs.writeFile(outputPropsPath, `${JSON.stringify(props, null, 2)}\n`);

  const lintResult = await runCommand("npx", ["hyperframes", "lint", "--verbose"], {
    cwd: tempCompositionDir,
  });
  const inspectResult = await runCommand(
    "npx",
    ["hyperframes", "inspect", "--samples", "8", "--json"],
    { cwd: tempCompositionDir },
  );
  const renderResult = await runCommand(
    "npx",
    ["hyperframes", "render", "--quality", "draft", "--output", mp4Path],
    { cwd: tempCompositionDir },
  );

  await capturePreview(tempCompositionDir, previewPath);

  const ffprobeResult = await runCommand(
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

  const report = [
    "# Xiaoyan Profit Pipe Render Report",
    "",
    `Props: ${outputPropsPath}`,
    `Temp composition: ${tempCompositionDir}`,
    `Rendered MP4: ${mp4Path}`,
    `Preview PNG: ${previewPath}`,
    "",
    reportSection("HyperFrames Lint", lintResult.output),
    "",
    reportSection("HyperFrames Inspect", inspectResult.output),
    "",
    reportSection("HyperFrames Render", renderResult.output),
    "",
    reportSection("ffprobe", ffprobeResult.output),
    "",
  ].join("\n");
  await fs.writeFile(reportPath, report);

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
