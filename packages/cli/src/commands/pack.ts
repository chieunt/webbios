import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export const packCommand = async () => {
  console.log(chalk.blue('📦 Packaging Platform Suite...'));
  
  const platformApiDir = path.resolve(process.cwd(), '../WebbiPlatform/apps/api.webbios.dev');
  const platformDbDir = path.resolve(process.cwd(), '../WebbiPlatform/packages/db');
  
  try {
    // Check if directories exist
    if (!fs.existsSync(platformApiDir)) {
      throw new Error(`Directory not found: ${platformApiDir}`);
    }
    
    // 1. We would build the source here, but for now we just zip the src/ folder.
    // Realistically: npx esbuild src/index.ts --bundle --outfile=dist/worker.js
    
    // 2. Create a zip
    const zip = new AdmZip();
    
    // Add Worker Source
    zip.addLocalFolder(path.join(platformApiDir, 'src'), 'worker/src');
    zip.addLocalFile(path.join(platformApiDir, 'wrangler.toml'), 'worker');
    zip.addLocalFile(path.join(platformApiDir, 'package.json'), 'worker');
    
    // Add DB schema & migrations
    if (fs.existsSync(path.join(platformDbDir, 'src', 'schema.ts'))) {
      zip.addLocalFile(path.join(platformDbDir, 'src', 'schema.ts'), 'db');
    }
    
    // 3. Add Manifest
    const manifest = {
      name: "Platform Suite",
      slug: "platform",
      version: "1.0.0",
      type: "suite",
      visibility: "internal"
    };
    zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf8'));
    
    // 4. Save Zip
    const outputPath = path.resolve(process.cwd(), 'platform-suite-v1.0.0.zip');
    zip.writeZip(outputPath);
    
    console.log(chalk.green(`✅ Packaged successfully into ${outputPath}`));
  } catch (error) {
    console.error(chalk.red('\n❌ Packaging failed!'));
    console.error(error);
  }
};
