import { execSync } from 'child_process';
import chalk from 'chalk';

export const runDrizzlePush = (cwd: string) => {
  try {
    console.log(chalk.gray(`> drizzle-kit push:sqlite`));
    // Drizzle-kit requires the schema and config to be present in cwd
    execSync(`npx drizzle-kit push:sqlite`, {
      cwd,
      encoding: 'utf-8',
      stdio: 'inherit'
    });
  } catch (error: any) {
    console.error(chalk.red(`Failed to push migrations.`));
    throw error;
  }
};
