import { getSeedSQL } from './index';
import * as fs from 'fs';
import * as path from 'path';

const lang = (process.argv[2] as 'vi' | 'en') || 'vi';
const sql = getSeedSQL(lang);

const outPath = path.resolve(process.cwd(), 'seed.sql');
fs.writeFileSync(outPath, sql);

console.log(`Generated seed.sql for language: ${lang}`);
