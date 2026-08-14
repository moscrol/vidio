import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const backupDir = path.join(projectRoot, '.promote-backup');
const requiredGeneratedFiles = ['cards.generated.js', 'timeline-rules.generated.json'];
const managedFiles = ['cards.js', 'timeline-rules.json', 'motion-plan.json'];

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

async function assertGeneratedFilesExist() {
  const missing = [];
  for (const fileName of requiredGeneratedFiles) {
    if (!(await pathExists(path.join(projectRoot, fileName)))) {
      missing.push(fileName);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing generated files: ${missing.join(', ')}. Run npm run video:from-srt:draft first.`);
  }
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

async function clearBackup() {
  await fs.rm(backupDir, { recursive: true, force: true });
}

async function promoteGeneratedFiles() {
  await fs.copyFile(path.join(projectRoot, 'cards.generated.js'), path.join(projectRoot, 'cards.js'));
  await fs.copyFile(path.join(projectRoot, 'timeline-rules.generated.json'), path.join(projectRoot, 'timeline-rules.json'));
}

async function main() {
  console.log('Step 1/5 Check generated files');
  await assertGeneratedFilesExist();

  console.log('Step 2/5 Backup formal files');
  await backupManagedFiles();

  try {
    console.log('Step 3/5 Promote generated files to formal files');
    await promoteGeneratedFiles();

    console.log('Step 4/5 Validate cards and generate formal motion plan');
    await run('npm', ['run', 'check']);
    await run('npm', ['run', 'export']);
    await run('npm', ['run', 'video:timeline']);
    await run('npm', ['run', 'check:motion']);

    console.log('Step 5/5 Promotion completed');
    await clearBackup();
  } catch (error) {
    console.error('Promotion failed. Restoring previous formal files.');
    await restoreManagedFiles();
    throw error;
  }

  console.log('Promoted cards.generated.js to cards.js');
  console.log('Promoted timeline-rules.generated.json to timeline-rules.json');
  console.log('Updated and validated motion-plan.json');
  console.log('Next optional step: npm run video:render');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
