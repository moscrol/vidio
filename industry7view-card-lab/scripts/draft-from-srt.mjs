import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const managedFiles = ['cards.js', 'timeline-rules.json', 'motion-plan.json'];
const backupDir = path.join(projectRoot, '.draft-backup');

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function backupManagedFiles() {
  await fs.rm(backupDir, { recursive: true, force: true });
  await fs.mkdir(backupDir, { recursive: true });

  for (const fileName of managedFiles) {
    await fs.copyFile(path.join(projectRoot, fileName), path.join(backupDir, fileName));
  }
}

async function restoreManagedFiles() {
  for (const fileName of managedFiles) {
    const source = path.join(backupDir, fileName);
    if (await pathExists(source)) {
      await fs.copyFile(source, path.join(projectRoot, fileName));
    }
  }
  await fs.rm(backupDir, { recursive: true, force: true });
}

async function promoteGeneratedForSandbox() {
  await fs.copyFile(path.join(projectRoot, 'cards.generated.js'), path.join(projectRoot, 'cards.js'));
  await fs.copyFile(path.join(projectRoot, 'timeline-rules.generated.json'), path.join(projectRoot, 'timeline-rules.json'));
}

async function main() {
  console.log('Step 1/6 Generate card-plan.generated.json');
  await run('npm', ['run', 'video:card-plan']);

  console.log('Step 2/6 Generate cards.generated.js');
  await run('npm', ['run', 'video:cards:draft']);

  console.log('Step 3/6 Generate timeline-rules.generated.json');
  await run('npm', ['run', 'video:timeline:from-plan']);

  console.log('Step 4/6 Sandbox generated cards and timeline rules');
  await backupManagedFiles();

  try {
    await promoteGeneratedForSandbox();

    console.log('Step 5/6 Validate generated cards and export preview PNGs');
    await run('npm', ['run', 'check']);
    await run('npm', ['run', 'export']);

    console.log('Step 6/6 Validate generated timeline against SRT');
    await run('npm', ['run', 'video:timeline']);
    await run('npm', ['run', 'check:motion']);
  } finally {
    await restoreManagedFiles();
  }

  console.log('Draft workflow completed. Formal cards.js, timeline-rules.json, and motion-plan.json were restored.');
  console.log('Review card-plan.generated.json, cards.generated.js, and timeline-rules.generated.json before promoting.');
}

main().catch(async (error) => {
  try {
    await restoreManagedFiles();
  } catch (restoreError) {
    console.error(restoreError);
  }
  console.error(error);
  process.exitCode = 1;
});
