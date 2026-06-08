import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { runWrangler } from '../utils/cloudflare';

export const installCommand = async (zipFile: string) => {
  console.log(chalk.blue(`📥 Installing App/Suite from: ${zipFile}`));
  
  try {
    const zipPath = path.resolve(process.cwd(), zipFile);
    if (!fs.existsSync(zipPath)) {
      throw new Error(`File not found: ${zipPath}`);
    }
    
    const extractDir = path.resolve(process.cwd(), '.webbi/tmp_install');
    if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true });
    
    // 1. Unzip
    console.log(chalk.yellow('\n[1/4] Extracting package...'));
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractDir, true);
    
    const manifestPath = path.join(extractDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('manifest.json not found in the package.');
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(chalk.cyan(`App: ${manifest.name} v${manifest.version}`));
    
    // Read config to get D1 ID
    const configPath = path.resolve(process.cwd(), '.webbi/config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('God Instance is not initialized. Run "webbi init" first.');
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const dbId = config.godInstanceDbId;
    const dbName = config.godInstanceDbName;
    
    // 2. Setup Worker
    console.log(chalk.yellow('\n[2/4] Configuring App Worker...'));
    const workerDir = path.join(extractDir, 'worker');
    const tomlPath = path.join(workerDir, 'wrangler.toml');
    let tomlContent = fs.readFileSync(tomlPath, 'utf8');
    
    // Bind the App to the God Instance's D1 Database!
    tomlContent = tomlContent.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${dbId}"`);
    tomlContent = tomlContent.replace(/database_name\s*=\s*"[^"]*"/, `database_name = "${dbName}"`);
    fs.writeFileSync(tomlPath, tomlContent);
    
    // 3. Push SQL Migrations (if any)
    console.log(chalk.yellow('\n[3/4] Running App DB Migrations...'));
    // Since the zip contains schema.ts, we could run drizzle-kit generate here
    // In reality, we'd compile the schema. For this test, we assume the tables are created or we run a raw SQL.
    console.log(chalk.gray('Skipping dynamic migration for test demo.'));
    
    // 4. Deploy Worker
    console.log(chalk.yellow('\n[4/4] Deploying App Worker to Cloudflare...'));
    // Install dependencies in the extracted worker dir
    require('child_process').execSync('npm.cmd install --production', { cwd: workerDir, stdio: 'ignore' });
    runWrangler(`deploy`, workerDir);
    
    // Clean up
    fs.rmSync(extractDir, { recursive: true, force: true });
    
    console.log(chalk.green.bold(`\n🎉 ${manifest.name} installed successfully! 🎉`));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Installation failed!'));
    console.error(error);
  }
};
