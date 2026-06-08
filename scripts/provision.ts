import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.test if it exists
try {
  const envPath = path.join(process.cwd(), '.env.test');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2].trim();
      }
    });
    console.log('Loaded credentials from .env.test');
  }
} catch (e) {
  console.log('No .env.test file found, relying on system env variables.');
}

const runCmd = (cmd: string, cwd: string = process.cwd()): string => {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, { cwd, encoding: 'utf-8', stdio: 'pipe' });
    console.log(output);
    return output;
  } catch (error: any) {
    console.error(`Command failed: ${cmd}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    throw error;
  }
};

const provisionShop = async () => {
  const shopId = `shop${Math.floor(Math.random() * 10000)}`;
  const dbName = `webbios_db_${shopId}`;
  const workerName = `webbios-api-${shopId}`;
  const pagesName = `webbios-dashboard-${shopId}`;

  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    console.log(`Using Cloudflare Account ID: ${accountId}`);
    
    // 1. Generate temporary wrangler.toml for the API Worker
    console.log(`\n--- Step 1: Preparing Config ---`);
    const apiDir = path.join(process.cwd(), 'apps', 'api');
    const tempTomlPath = path.join(apiDir, `wrangler.${shopId}.toml`);
    // Create it with just the account_id and name first so D1 can use it
    let tomlContent = `
name = "${workerName}"
main = "src/index.ts"
compatibility_date = "2024-03-20"
account_id = "${accountId}"
`;
    fs.writeFileSync(tempTomlPath, tomlContent);
    console.log(`✅ Created temporary wrangler config: ${tempTomlPath}`);

    // 2. Create D1 Database using the config
    console.log(`\n--- Step 2: Creating D1 Database (${dbName}) ---`);
    let d1Output = "";
    try {
        d1Output = runCmd(`npx.cmd wrangler d1 create ${dbName} --config="${tempTomlPath}"`, apiDir);
    } catch (e: any) {
        if (e.stdout) d1Output = e.stdout;
        else throw e;
    }
    
    const dbIdMatch = d1Output.match(/database_id\s*=\s*"([^"]+)"/);
    if (!dbIdMatch || !dbIdMatch[1]) {
      throw new Error(`Could not extract database_id from output: ${d1Output}`);
    }
    const dbId = dbIdMatch[1];
    console.log(`✅ Created D1 Database! ID: ${dbId}`);

    // Update config with D1 bindings
    tomlContent += `
[[d1_databases]]
binding = "DB"
database_name = "${dbName}"
database_id = "${dbId}"
`;
    fs.writeFileSync(tempTomlPath, tomlContent);

    // 3. Apply Schema and Seed Data
    console.log(`\n--- Step 3: Seeding Database ---`);
    const seedPath = path.resolve('packages/db/seed.sql');
    
    // Apply migrations
    runCmd(`npx.cmd wrangler d1 migrations apply ${dbName} --remote --config="${tempTomlPath}"`, apiDir);
    // Execute seed data
    runCmd(`npx.cmd wrangler d1 execute ${dbName} --remote --file="${seedPath}" --config="${tempTomlPath}"`, apiDir);
    console.log(`✅ Database seeded successfully!`);

    // 4. Deploy API Worker
    console.log(`\n--- Step 4: Deploying API Worker ---`);
    const deployOutput = runCmd(`npx.cmd wrangler deploy --config="wrangler.${shopId}.toml"`, apiDir);
    
    const urlMatch = deployOutput.match(/https:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.workers\.dev/);
    const apiUrl = urlMatch ? urlMatch[0] : null;
    if (!apiUrl) {
      console.warn("Could not extract Worker URL from deployment output, but deployment succeeded.");
    } else {
      console.log(`✅ API Worker deployed to: ${apiUrl}`);
    }

    // 5. Deploy Dashboard (Pages)
    console.log(`\n--- Step 5: Deploying Dashboard ---`);
    const dashboardDir = path.join(process.cwd(), 'apps', 'dashboard');
    
    // We inject VITE_API_URL via environment variable during build
    // Note: For cross-platform, we use node to set it or just pass it to the build command
    console.log('Building dashboard with new API URL...');
    if (apiUrl) {
      process.env.VITE_API_URL = `${apiUrl}/v1/admin`;
      process.env.VITE_PLATFORM_API_URL = 'https://platform.webbios.dev/api';
    }
    
    runCmd('pnpm run build', dashboardDir);
    
    // Restore env
    if (apiUrl) {
      delete process.env.VITE_API_URL;
      delete process.env.VITE_PLATFORM_API_URL;
    }

    // Create pages project using Cloudflare REST API (to bypass Wrangler bug)
    try {
      console.log(`Creating Pages project ${pagesName} via REST API...`);
      const createRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: pagesName,
          production_branch: 'main'
        })
      });
      const createData = await createRes.json();
      if (!createRes.ok && createData.errors?.[0]?.code !== 8000006) { // 8000006 is "Project already exists"
        console.warn(`Failed to create Pages project:`, createData);
      } else {
        console.log(`✅ Pages project created (or already exists).`);
      }
    } catch (e) {
      console.log(`Project ${pagesName} creation error:`, e);
    }

    // Deploy Pages
    console.log(`Deploying Pages project ${pagesName}...`);
    // Pass --commit-dirty=true to bypass git warnings
    const pagesDeployOutput = runCmd(`npx.cmd wrangler pages deploy dist --project-name ${pagesName} --branch main --commit-dirty=true`, dashboardDir);
    const pagesUrlMatch = pagesDeployOutput.match(/https:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.pages\.dev/);
    const pagesUrl = pagesUrlMatch ? pagesUrlMatch[0] : null;

    console.log(`\n=========================================`);
    console.log(`🎉 PROVISIONING SUCCESSFUL FOR ${shopId}!`);
    console.log(`=========================================`);
    console.log(`Database Name: ${dbName} (${dbId})`);
    console.log(`API URL:       ${apiUrl || 'Unknown'}`);
    console.log(`Dashboard URL: ${pagesUrl || 'Unknown'}`);
    console.log(`\nLogin with admin@webbios.local / password123`);
    console.log(`=========================================\n`);

    // Cleanup
    fs.unlinkSync(tempTomlPath);

  } catch (error) {
    console.error("\n❌ PROVISIONING FAILED!");
    console.error(error);
  }
};

provisionShop();
