import { readFile, writeFile, mkdir, copyFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const read = name => readFile(join(root, name), 'utf8');
const config = JSON.parse(await read('site.config.json'));
const apiBaseUrl = (config.apiBaseUrl || '').replace(/\/$/, '');
if (apiBaseUrl && !/^https:\/\/[^/]+$/.test(apiBaseUrl)) throw new Error('apiBaseUrl must be an HTTPS origin.');
if (config.readyToPublish && !apiBaseUrl) throw new Error('Configure apiBaseUrl before publishing account deletion.');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let policy = await read('privacy-policy.md');
for (const [placeholder, value] of Object.entries({
  '[Game Name]': config.game,
  '[Developer or Company Name]': config.developer,
  '[Privacy Contact Email]': config.email,
  '[Developer Website]': config.website,
  '[Business Mailing Address]': config.mailingAddress,
  '[Account Deletion URL]': '/delete-account'
})) policy = policy.replaceAll(placeholder, value);
if (process.argv.includes('--release') && !config.readyToPublish) throw new Error('Resolve RELEASE-CHECKLIST.md and set readyToPublish before a release build.');
if (config.readyToPublish && (/\[[^\]]+\]/.test(policy) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email) || !/^https:\/\//.test(config.website))) throw new Error('Resolve policy placeholders and contact settings before release.');

function inline(text) {
  return escape(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replaceAll('/delete-account', '<a href="/delete-account">Account deletion page</a>');
}
function markdown(text) {
  const out = []; let paragraph = []; let list = false;
  const flush = () => { if (paragraph.length) { out.push(`<p>${paragraph.map(inline).join('<br>')}</p>`); paragraph = []; } };
  for (const line of (text.replace(/^\uFEFF/, '') + '\n').split(/\r?\n/)) {
    const heading = line.match(/^(#{1,3}) (.+)$/); const item = line.match(/^- (.+)$/);
    if (heading || item || !line.trim()) flush();
    if (list && !item) { out.push('</ul>'); list = false; }
    if (heading) out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
    else if (item) { if (!list) { out.push('<ul>'); list = true; } out.push(`<li>${inline(item[1])}</li>`); }
    else if (line.trim()) paragraph.push(line.trim());
  }
  return out.join('\n');
}
const draft = !config.readyToPublish;
const banner = draft ? '<aside class="draft" role="note"><strong>Draft - pending confirmation.</strong> Game practices must be confirmed before release.</aside>' : '';
const pages = [
  ['', 'Claim the arena', await read('templates/home.html')],
  ['privacy', 'Privacy policy', markdown(policy)],
  ['support', 'Support', await read('templates/support.html')],
  ['delete-account', 'Account & data deletion', await read('templates/delete-account.html')]
];
for (const [route, title, content] of pages) {
  const dir = join(root, 'dist', route); await mkdir(dir, { recursive: true });
  const body = content
    .replaceAll('{{email}}', escape(config.email))
    .replaceAll('{{apiBaseUrl}}', escape(apiBaseUrl))
    .replaceAll('{{website}}', escape(config.website));
  const current = path => route === path ? ' aria-current="page"' : '';
  await writeFile(join(dir, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${draft ? '<meta name="robots" content="noindex,nofollow">' : ''}<title>${escape(title)} | ${escape(config.game)}</title><meta name="description" content="${route ? 'FactionFall privacy, player support, and account deletion information.' : 'Meet the units of FactionFall. Build your deck, deploy your faction, and claim the arena.'}"><link rel="icon" href="/assets/brand/crest.png"><link rel="stylesheet" href="/styles.css"></head><body class="${route ? 'information-page' : 'game-home'}"><a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="header-inner"><a class="brand" href="/"><img class="brand-crest" src="/assets/brand/crest.png" alt="" width="512" height="512"><span class="brand-name">${escape(config.game)}<span>THREE FACTIONS. YOUR BATTLE.</span></span></a><nav class="site-nav" aria-label="Main navigation"><a href="/"${current('')}>Home</a><a href="/#characters">The units</a><a href="/support"${current('support')}>Support</a><a href="/privacy"${current('privacy')}>Privacy</a><a class="nav-delete" href="/delete-account"${current('delete-account')}>Account deletion</a></nav></div></header><main class="page-main" id="main">${banner}${body}</main><footer class="site-footer"><p>${escape(config.game)} &middot; ${escape(config.developer)}</p><div class="footer-links"><a href="/privacy">Privacy policy</a><a href="/support">Support</a><a href="/delete-account">Account deletion</a></div></footer></body></html>`);
}
await copyFile(join(root, 'styles.css'), join(root, 'dist/styles.css'));
await copyFile(join(root, 'delete-account.js'), join(root, 'dist/delete-account.js'));
await cp(join(root, 'assets'), join(root, 'dist/assets'), { recursive: true });
await writeFile(join(root, 'dist/404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | FactionFall</title><link rel="stylesheet" href="/styles.css"></head><body><main><h1>Page not found</h1><a href="/">Return to FactionFall</a></main></body></html>');
await writeFile(join(root, 'dist/_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n  Content-Security-Policy: default-src 'none'; img-src 'self'; font-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' ${apiBaseUrl}; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\n${draft ? '  X-Robots-Tag: noindex, nofollow\n' : ''}`);
console.log('Built dist/' + (draft ? ' (draft preview)' : ' (release)'));
