#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const fetch = globalThis.fetch || require('node-fetch');
const path = require('path');

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: true, ...opts });
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    process.exit(err.status || 1);
  }
}

async function waitForUrl(url, { timeout = 30000, interval = 1000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, interval));
  }
  return false;
}

async function runPreviewAndSmoke() {
  console.log('\n> Starting preview server (npm run start)');
  const startProc = spawn('npm', ['run', 'start'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
  });

  const baseUrl = 'http://localhost:3000';
  const ok = await waitForUrl(baseUrl, { timeout: 20000 });
  if (!ok) {
    console.error('Preview server did not become healthy within timeout');
    startProc.kill('SIGTERM');
    process.exit(1);
  }

  console.log('Preview is up — running smoke checks');
  try {
    const res = await fetch(baseUrl + '/');
    if (res.status !== 200) {
      throw new Error(`Unexpected status ${res.status}`);
    }
    console.log('Smoke check passed: / -> 200');
  } catch (err) {
    console.error('Smoke check failed:', err.message || err);
    startProc.kill('SIGTERM');
    process.exit(1);
  }

  console.log('Stopping preview server');
  startProc.kill('SIGTERM');
}

function runTerraformPlan() {
  const infraDir = path.join(process.cwd(), 'infra', 'terraform');
  const terraformCmd = 'terraform';
  console.log('\n> Running Terraform plan (if terraform is available)');
  try {
    execSync(`${terraformCmd} -version`, { stdio: 'ignore' });
  } catch (e) {
    console.warn('Terraform not found on PATH — skipping terraform plan');
    return;
  }

  try {
    // init without backend to avoid touching remote state during local CI
    execSync(`${terraformCmd} init -backend=false`, { cwd: infraDir, stdio: 'inherit' });
    execSync(`${terraformCmd} plan -no-color -out=plan.out`, { cwd: infraDir, stdio: 'inherit' });
    console.log('Terraform plan generated at infra/terraform/plan.out');
  } catch (err) {
    console.error('Terraform plan failed');
    process.exit(err.status || 1);
  }
}

(async function main(){
  // 1. build
  run('npm run build');

  // 2. test
  run('npm test');

  // 3. coverage
  run('npm run coverage');

  // 4-5. preview + smoke
  await runPreviewAndSmoke();

  // 6. plan
  runTerraformPlan();

  console.log('\n✅ ci-local finished successfully');
})();
