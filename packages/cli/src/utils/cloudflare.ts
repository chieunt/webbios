import { execSync } from 'child_process';
import chalk from 'chalk';

export const runWrangler = (command: string, cwd: string = process.cwd()) => {
  try {
    console.log(chalk.gray(`> npx wrangler ${command}`));
    const result = execSync(`npx.cmd wrangler ${command}`, {
      cwd,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return result;
  } catch (error: any) {
    console.error(chalk.red(`Failed to execute wrangler command: ${command}`));
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(chalk.red(error.stderr));
    throw error;
  }
};

export const createD1Database = (name: string, cwd: string): string => {
  console.log(chalk.blue(`Creating D1 database: ${name}...`));
  const output = runWrangler(`d1 create ${name}`, cwd);
  console.log(output);
  
  // Extract database_id from output
  // Output format usually contains: database_id = "..."
  const match = output.match(/database_id\s*=\s*"([^"]+)"/);
  if (match && match[1]) {
    return match[1];
  }
  
  throw new Error("Could not parse database_id from wrangler output");
};
