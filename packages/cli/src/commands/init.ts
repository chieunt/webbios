import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { runWrangler, createD1Database } from '../utils/cloudflare';
import { runDrizzlePush } from '../utils/d1';

export const initCommand = async () => {
  console.log(chalk.blue('🚀 Starting WebbiOS Core Initialization (God Instance)...'));

  const apiCwd = path.resolve(process.cwd(), 'apps/api');

  try {
    // 1. Create D1 database
    console.log(chalk.yellow('\n[1/4] Creating D1 Database...'));
    const dbName = `god-webbios-db`;
    const dbId = createD1Database(dbName, apiCwd);
    console.log(chalk.green(`✅ Database created with ID: ${dbId}`));

    // 2. Update wrangler.toml
    console.log(chalk.yellow('\n[2/4] Updating wrangler.toml...'));
    const tomlPath = path.join(apiCwd, 'wrangler.toml');
    let tomlContent = fs.readFileSync(tomlPath, 'utf8');

    // Replace database_id
    tomlContent = tomlContent.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${dbId}"`);
    tomlContent = tomlContent.replace(/database_name\s*=\s*"[^"]*"/, `database_name = "${dbName}"`);

    // Add or replace INSTANCE_TYPE = "platform"
    if (tomlContent.includes('INSTANCE_TYPE')) {
      tomlContent = tomlContent.replace(/INSTANCE_TYPE\s*=\s*"[^"]*"/, `INSTANCE_TYPE = "platform"`);
    } else {
      // Append to [vars] block
      if (tomlContent.includes('[vars]')) {
        tomlContent = tomlContent.replace(/\[vars\]/, `[vars]\nINSTANCE_TYPE = "platform"`);
      } else {
        tomlContent += `\n[vars]\nINSTANCE_TYPE = "platform"\n`;
      }
    }

    fs.writeFileSync(tomlPath, tomlContent);
    console.log(chalk.green(`✅ Updated wrangler.toml with new DB ID and INSTANCE_TYPE="platform"`));

    // 3. Run Drizzle migrations
    console.log(chalk.yellow('\n[3/4] Pushing SQL Schema to D1 (Local & Remote)...'));
    console.log(chalk.gray(`> npx drizzle-kit generate:sqlite`));
    try {
      require('child_process').execSync(`npx.cmd drizzle-kit generate:sqlite`, { cwd: apiCwd, stdio: 'inherit' });
    } catch (e) {
      console.log(chalk.gray('Skipping generate or no changes...'));
    }

    // To apply to remote D1: wrangler d1 migrations apply DB --remote
    // First we must ensure we have a migration file. 
    console.log(chalk.gray(`> wrangler d1 migrations apply DB --remote`));
    try {
      runWrangler(`d1 migrations apply DB --remote`, apiCwd);
      console.log(chalk.green('✅ Migrations applied remotely.'));
    } catch (e) {
      console.log(chalk.yellow('⚠️ Migration application failed. Check if there are migrations in drizzle/ folder.'));
    }

    // 4. Seed Data
    console.log(chalk.yellow('\n[4/5] Seeding Initial Data...'));
    const dbDir = path.resolve(process.cwd(), '../packages/db');
    // Generate seed.sql
    console.log(chalk.gray(`> npx.cmd tsx src/seeds/write.ts vi`));
    require('child_process').execSync(`npx.cmd tsx src/seeds/write.ts vi`, { cwd: dbDir, stdio: 'inherit' });

    // Execute seed.sql against D1
    console.log(chalk.gray(`> npx.cmd wrangler d1 execute ${dbName} --remote --file seed.sql`));
    try {
      require('child_process').execSync(`npx.cmd wrangler d1 execute ${dbName} --remote --file seed.sql`, { cwd: dbDir, stdio: 'inherit' });
      console.log(chalk.green('✅ Data seeded successfully.'));
    } catch (e) {
      console.log(chalk.yellow('⚠️ Data seeding failed or partially applied.'));
    }

    // 5. Deploy worker and dashboard
    console.log(chalk.yellow('\n[5/5] Deploying WebbiOS Core API & Dashboard...'));
    console.log(chalk.gray(`> Deploying API Worker...`));
    runWrangler(`deploy --name god-webbios-api`, apiCwd);
    console.log(chalk.green('✅ Core API Deployed successfully!'));

    console.log(chalk.gray(`> Deploying Dashboard to CF Pages...`));
    const dashboardCwd = path.resolve(process.cwd(), 'apps/dashboard');
    try {
      require('child_process').execSync(`npx.cmd pnpm run build`, { cwd: dashboardCwd, stdio: 'inherit' });
      try {
        // Try creating project first, if it exists it will throw but we can ignore
        runWrangler(`pages project create god-webbios-dashboard --production-branch main`, dashboardCwd);
      } catch (e) {
        // Project might already exist, which is fine
      }
      runWrangler(`pages deploy dist --project-name god-webbios-dashboard --branch main`, dashboardCwd);
      console.log(chalk.green('✅ Dashboard Deployed successfully!'));
    } catch (e) {
      console.log(chalk.yellow('⚠️ Dashboard deployment failed. You can deploy it manually later.'));
    }

    // Save the dbId somewhere for Platform Suite to use later
    const configDir = path.resolve(process.cwd(), '.webbi');
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);
    fs.writeFileSync(path.join(configDir, 'config.json'), JSON.stringify({
      godInstanceDbId: dbId,
      godInstanceDbName: dbName
    }, null, 2));

    console.log(chalk.green.bold('\n🎉 WebbiOS God Instance Bootstrap Complete!'));
    console.log(chalk.cyan('You can now proceed to install Platform Suite using: webbi install'));

  } catch (error) {
    console.error(chalk.red('\n❌ Initialization failed!'));
    console.error(error);
  }
};
