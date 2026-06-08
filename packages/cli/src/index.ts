#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { packCommand } from './commands/pack';
import { installCommand } from './commands/install';
import { upgradeCommand } from './commands/upgrade';
import chalk from 'chalk';

const program = new Command();

program
  .name('webbi')
  .description('WebbiOS Command Line Interface')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new WebbiOS God Instance (Create D1, deploy Core, seed data)')
  .action(initCommand);

program
  .command('pack')
  .description('Package the current App/Suite into a deployable .zip file')
  .action(packCommand);

program
  .command('install')
  .description('Install a packaged App/Suite into the WebbiOS instance')
  .argument('<zip-file>', 'Path to the .zip file')
  .action(installCommand);

program
  .command('upgrade')
  .description('Upgrade the WebbiOS Core to the latest version')
  .action(upgradeCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
