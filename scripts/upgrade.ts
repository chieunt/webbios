import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
// Load .env.test for Cloudflare credentials
const envPath = path.join(process.cwd(), '.env.test');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const runCmd = (cmd: string, cwd: string = process.cwd()): string => {
  console.log(`\n> ${cmd}`);
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'inherit' });
  } catch (error: any) {
    console.error(`Command failed: ${cmd}`);
    process.exit(1);
  }
};

const upgrade = async () => {
  console.log(`\n🔍 Checking for updates...`);
  const platformApi = 'https://platform.webbios.dev';
  
  // In a real CLI, we would read the current version from package.json or config
  const currentVersion = '0.0.0'; 
  
  const response = await fetch(`${platformApi}/api/v1/versions/latest?current_version=${currentVersion}`);
  if (!response.ok) {
    console.error("❌ Failed to contact Platform Gateway");
    process.exit(1);
  }
  
  const data = await response.json();
  if (!data.hasUpdate) {
    console.log(`✅ You are already on the latest version (${data.latestVersion}).`);
    return;
  }
  
  console.log(`\n🚀 New version found: ${data.latestVersion}`);
  console.log(`Notes: ${data.releaseNotes}`);
  
  const zipUrl = data.downloadUrl;
  const zipFile = `update-${data.latestVersion}.zip`;
  
  console.log(`\n📥 Downloading update from ${zipUrl}...`);
  const zipResponse = await fetch(zipUrl);
  if (!zipResponse.ok) {
    console.error(`❌ Download failed: ${zipResponse.statusText}`);
    process.exit(1);
  }
  
  const arrayBuffer = await zipResponse.arrayBuffer();
  fs.writeFileSync(zipFile, Buffer.from(arrayBuffer));
  console.log(`✅ Download complete: ${zipFile}`);
  
  console.log(`\n📦 Extracting update...`);
  // Using tar.exe available on Windows to extract the zip file, overwriting existing files
  runCmd(`tar.exe -x -f ${zipFile}`);
  
  console.log(`\n🛠️ Running migrations...`);
  // Assume we are upgrading the God Instance Dashboard for this test
  // In reality, the CLI would extract the DB ID of the shop from its config
  runCmd(`npx.cmd wrangler d1 migrations apply webbios_platform --remote --config=wrangler.god.toml`, path.join(process.cwd(), 'apps', 'api'));
  
  console.log(`\n☁️ Deploying updated Core API...`);
  runCmd(`npx.cmd wrangler deploy --config=wrangler.god.toml`, path.join(process.cwd(), 'apps', 'api'));
  
  console.log(`\n☁️ Deploying updated Dashboard...`);
  runCmd(`pnpm run build`, path.join(process.cwd(), 'apps', 'dashboard'));
  runCmd(`npx.cmd wrangler pages deploy dist --project-name webbios-dashboard-god --branch main --commit-dirty=true`, path.join(process.cwd(), 'apps', 'dashboard'));
  
  console.log(`\n🧹 Cleaning up...`);
  fs.rmSync(zipFile);
  
  console.log(`\n🎉 Upgrade to ${data.latestVersion} successful!`);
};

upgrade();
