import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO_URL = 'https://github.com/andiahmadysp/spd-team-frontend.git';
const TEMP_DIR = '/tmp/dist-repo';
const DIST_DIR = path.resolve(process.cwd(), 'dist');

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runQuiet(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...opts });
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('1. Building production bundle...');
  run('npx vite build');

  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('Folder dist/ tidak ditemukan setelah build.');
  }

  console.log('2. Cleaning up temp directory...');
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  console.log('3. Fetching dist branch from remote...');
  const cloned = runQuiet(`git clone --branch dist --depth 1 ${REPO_URL} ${TEMP_DIR}`);

  if (cloned !== null) {
    console.log('Linear history dist branch found. Updating files...');
    // Delete existing files except .git
    const entries = fs.readdirSync(TEMP_DIR);
    for (const entry of entries) {
      if (entry === '.git') continue;
      fs.rmSync(path.join(TEMP_DIR, entry), { recursive: true, force: true });
    }
  } else {
    console.log('Branch dist belum ada. Membuat branch baru...');
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    run('git init', { cwd: TEMP_DIR });
    run('git checkout -b dist', { cwd: TEMP_DIR });
    run(`git remote add origin ${REPO_URL}`, { cwd: TEMP_DIR });
  }

  console.log('4. Copying build artifacts...');
  // Copy all files from dist/ to TEMP_DIR
  fs.cpSync(DIST_DIR, TEMP_DIR, { recursive: true });

  // Explicitly ensure .htaccess is copied
  const htaccessPath = path.resolve(process.cwd(), 'public/.htaccess');
  if (fs.existsSync(htaccessPath)) {
    fs.copyFileSync(htaccessPath, path.join(TEMP_DIR, '.htaccess'));
  }

  console.log('5. Committing and pushing to origin/dist...');
  run('git add -A', { cwd: TEMP_DIR });

  const status = runQuiet('git status --porcelain', { cwd: TEMP_DIR });
  if (status && status.trim().length > 0) {
    const timestamp = new Date().toISOString();
    run(`git commit -m "build: update static dist for Hostinger (${timestamp})"`, { cwd: TEMP_DIR });
    run('git push origin dist', { cwd: TEMP_DIR });
    console.log('✅ Deployment successful! dist branch updated with linear history.');
  } else {
    console.log('ℹ️ Tidak ada perubahan pada hasil build.');
  }
}

main().catch((err) => {
  console.error('❌ Deployment error:', err.message);
  process.exit(1);
});
