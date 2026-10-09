import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(repo, 'public');
const guide = join(repo, 'app/illustrated-guide');
const siteURL = (process.env.SITE_URL || 'https://message-in-a-bottle-alpha.vercel.app').replace(/\/$/, '');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
// Only these public release directories enter the static deployment.
for (const directory of ['app', 'pdf', 'downloads']) {
  cpSync(join(repo, directory), join(output, directory), { recursive: true });
}
for (const name of readdirSync(guide)) cpSync(join(guide, name), join(output, name), { recursive: true });
for (const name of ['LICENSE', 'LICENSE-MIT', 'LICENSE-CC-BY-4.0']) cpSync(join(repo, name), join(output, name));

const resources = `
<section class="wide release-resources" aria-labelledby="resources-title">
  <p class="section-label">Free materials for your table</p>
  <h2 id="resources-title">Bring it to your table.</h2>
  <div class="encounter-grid">
    <article class="encounter-card"><h3>Latest illustrated guide</h3>
      <p>The guide on this page includes the expanded Thompson Center maze, old Chicago Cyclotron encounter and eleven named character profiles.</p>
      <a class="button" href="downloads/message-in-a-bottle-illustrated-guide.zip">Download the illustrated guide</a>
      <p><a href="encounters.md">Encounter reference</a> · <a href="stat-blocks.md">Character stat blocks</a></p>
    </article>
    <article class="encounter-card"><h3>GM desk &amp; print editions</h3>
      <p>The earlier scene runner and PDFs offer another way to run the campaign. They remain separate editions; the latest two encounter expansions are in the guide above.</p>
      <a class="button" href="app/">Open the GM runner</a>
      <p><a href="pdf/message-in-a-bottle-module.pdf">GM module PDF</a> · <a href="pdf/message-in-a-bottle-player-handouts.pdf">Player handouts PDF</a></p>
      <p><a href="pdf/message-in-a-bottle-scene-director.pdf">Scene director PDF</a> · <a href="downloads/message-in-a-bottle-free-module.zip">Earlier complete offline package</a></p>
    </article>
  </div>
</section>`;
let page = readFileSync(join(guide, 'index.html'), 'utf8');
page = page.replace('<section class="intro wide"', `${resources}\n  <section class="intro wide"`);
page = page.replace('  <title>', `  <link rel="canonical" href="${siteURL}/">\n  <meta property="og:title" content="Message in a Bottle · Free Savage Worlds module">\n  <meta property="og:description" content="A free illustrated Chicago campaign, with GM spoilers, characters and runnable encounters.">\n  <meta property="og:type" content="website">\n  <meta property="og:url" content="${siteURL}/">\n  <meta property="og:image" content="${siteURL}/images/chicago-snowglobe.webp">\n  <title>`);
writeFileSync(join(output, 'index.html'), page);
writeFileSync(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteURL}/sitemap.xml\n`);
writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteURL}/</loc></url></urlset>\n`);
// Fail the build if a front-page resource or image would be broken.
for (const [, href] of page.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^(?:#|https?:|mailto:)/.test(href)) continue;
  const path = join(output, href.split(/[?#]/)[0]);
  if (!existsSync(path)) throw new Error(`Missing public resource: ${href}`);
}
for (const privatePath of ['mcp', 'source', '.git', '.vercel', 'work']) {
  if (existsSync(join(output, privatePath))) throw new Error(`Unexpected deployment directory: ${privatePath}`);
}
console.log('Static site built: illustrated guide at /, runner at /app/, PDFs and downloads included.');
