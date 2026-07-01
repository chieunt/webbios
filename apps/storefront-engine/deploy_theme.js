const { execSync } = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('E:/WebbiOS/.env.platform', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if(k) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});
execSync('npx wrangler kv:key put --binding=CACHE_KV "cache:theme:config:webbios.dev" --path E:/WebbiThemes/themes/corporate01/theme.json', {
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID }
});
