const fs = require('fs');
const https = require('https');
const path = require('path');

const themePath = 'E:\\\\WebbiThemes\\\\themes\\\\corporate01\\\\theme.json';
let theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

// 1. Generate Sitemap
const baseUrl = 'https://webbios.dev';
const urls = Object.keys(theme.pages).map(p => {
  const loc = p === '/' ? baseUrl : baseUrl + p;
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
fs.writeFileSync('E:\\\\WebbiOS\\\\apps\\\\storefront-engine\\\\public\\\\sitemap.xml', sitemap);
console.log('Sitemap generated.');

// 2. Write robots.txt
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
fs.writeFileSync('E:\\\\WebbiOS\\\\apps\\\\storefront-engine\\\\public\\\\robots.txt', robots);
console.log('Robots.txt generated.');

// 3. Download SVGs & Update theme.json
const svgs = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', file: 'react.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg', file: 'typescript.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg', file: 'cloudflare.svg' }
];

let themeStr = JSON.stringify(theme, null, 2);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

Promise.all(svgs.map(svg => {
  return new Promise((resolve, reject) => {
    https.get(svg.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(path.join('E:\\\\WebbiOS\\\\apps\\\\storefront-engine\\\\public', svg.file), data);
        themeStr = themeStr.replace(new RegExp(escapeRegExp(svg.url), 'g'), '/' + svg.file);
        console.log('Downloaded', svg.file);
        resolve();
      });
    }).on('error', reject);
  });
})).then(() => {
  fs.writeFileSync(themePath, themeStr);
  console.log('theme.json updated.');
});
