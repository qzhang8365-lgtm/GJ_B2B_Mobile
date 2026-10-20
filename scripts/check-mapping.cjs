#!/usr/bin/env node
/*
 * 组件写法一致性检查（移动端）。
 * mapping.json 的 markup 是组件写法的唯一来源；预览页、页面模式（kit.js）与端到端示例都应与之一致。
 *
 * 用法：node scripts/check-mapping.cjs [--verbose] [--json]
 * 检查：
 *   【阻断】mapping 片段渲染出错：脚本错误、资源 404、引用了基座 CSS 中不存在的 gj-m-* 类
 *   【提示】预览页 / 页面模式 / 端到端示例里用到、但 mapping 完全没提到的 gj-m-* 类（片段与 propertyMap / valueMap 都没有：写法未收录或已偏离）
 *   【提示】同一组件内部的父子结构（如 popup-header > popup-title）在页面里出现、但 mapping 片段里没有：发现“同一组件两种写法”。
 *          组件之间的组合（如 card-body > info-list）属于页面组合，不在此检查。
 * 依赖：Playwright（npm i -D playwright 后 npx playwright install chromium）。退出码：有阻断为 1。
 */
const path = require('path'), fs = require('fs'), http = require('http');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('未找到 playwright：npm i -D playwright 后重试。'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..');
const verbose = process.argv.includes('--verbose'), asJson = process.argv.includes('--json');
const CSS = fs.readFileSync(path.join(ROOT, 'assets/styles/gj-b2b-mobile-components.css'), 'utf8');
const cssClasses = new Set((CSS.match(/\.gj-m-[a-zA-Z0-9_-]+/g) || []).map(s => s.slice(1)));
const COMP = path.join(ROOT, 'references/components');
const inv = JSON.parse(fs.readFileSync(path.join(COMP, 'inventory.json'), 'utf8')).components;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
let snippetHtml = '';
const serve = () => new Promise(ok => { const s = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/__mapping__.html') { r.writeHead(200, { 'Content-Type': MIME['.html'] }); r.end(snippetHtml); return; } const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }); s.listen(0, '127.0.0.1', () => ok(s)); });

/* 片段页：每个片段一个区块，记录来源组件 */
const rows = []; let mappingText = '';
for (const d of fs.readdirSync(COMP)) {
  const f = path.join(COMP, d, 'mapping.json'); if (!fs.existsSync(f)) continue;
  const raw = fs.readFileSync(f, 'utf8'); mappingText += raw; const m = JSON.parse(raw);
  for (const [k, v] of Object.entries(m.markup || {})) if (typeof v === 'string') rows.push(`<div class="__r" data-k="${d}.${k}">${v.replace(/\{ROOT\}/g, '/')}</div>`);
}
snippetHtml = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/styles/gj-b2b-mobile-tokens.css"><link rel="stylesheet" href="/assets/styles/gj-b2b-mobile-components.css"><style>html{font-size:100px}*{box-sizing:border-box}body{margin:0;padding:16px;font-size:.14rem;width:375px}.__r{position:relative;transform:translateZ(0);margin:8px 0}</style></head><body>${rows.join('')}</body></html>`;

/* 在页面（含所有 iframe）里收集 gj-m-* 类与父子结构 */
const collect = () => { const cls = new Set(), pairs = new Set();
  const own = el => [...el.classList].filter(c => c.startsWith('gj-m-'));
  document.querySelectorAll('[class*="gj-m-"]').forEach(el => { const mine = own(el); mine.forEach(c => cls.add(c));
    let p = el.parentElement; while (p && !own(p).length) p = p.parentElement;
    if (p) { const pc = own(p)[0]; mine.forEach(c => pairs.add(pc + ' > ' + c)); } });
  return { cls: [...cls], pairs: [...pairs] }; };

(async () => {
  const server = await serve(), base = `http://127.0.0.1:${server.address().port}`;
  let browser; try { browser = await chromium.launch(); } catch (e) { console.error('无法启动 Chromium：请运行 `npx playwright install chromium`。'); server.close(); process.exit(2); }
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const B = [], W = [];
  const bad = new Set(), errs = [];
  page.on('response', r => { if (r.status() >= 400) bad.add(r.url().replace(base, '')); });
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(base + '/__mapping__.html', { waitUntil: 'networkidle' });
  const snip = await page.evaluate(collect);
  if (errs.length) B.push('片段脚本错误：' + errs.join('；'));
  if (bad.size) B.push('片段资源加载失败：' + [...bad].join('、'));
  const unknown = snip.cls.filter(c => !cssClasses.has(c));
  if (unknown.length) B.push('片段引用了基座 CSS 中不存在的类：' + unknown.join('、'));
  const snipCls = new Set(snip.cls), snipPairs = new Set(snip.pairs);

  /* 预览页、页面模式、端到端示例 */
  const targets = [...new Set(inv.map(c => c.preview && c.preview.split('#')[0]).filter(Boolean))];
  for (const d of fs.readdirSync(path.join(ROOT, 'preview/patterns'))) if (fs.existsSync(path.join(ROOT, 'preview/patterns', d, 'index.html'))) targets.push(`preview/patterns/${d}/index.html`);
  if (fs.existsSync(path.join(ROOT, 'planning/e2e'))) for (const f of fs.readdirSync(path.join(ROOT, 'planning/e2e'))) if (/\.html$/.test(f) && f !== 'index.html' && !f.startsWith('_')) targets.push(`planning/e2e/${f}`);
  const missCls = new Map(), missPairs = new Map();
  const documented = c => new RegExp('(^|[^a-z0-9-])' + c.replace(/-/g, '\\-') + '(?![a-z0-9-])').test(mappingText);
  const prefix = c => c.replace(/^gj-m-/, '').split('-')[0];
  const note = (map, key, where) => { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(where); };
  for (const t of targets) {
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try { await p.goto(base + '/' + t.split('?')[0], { waitUntil: 'networkidle', timeout: 30000 }); await p.waitForTimeout(400); } catch (e) { W.push(`无法打开 ${t}：${e.message.split('\n')[0]}`); await p.close(); continue; }
    for (const fr of p.frames()) { let r; try { r = await fr.evaluate(collect); } catch (e) { continue; }
      r.cls.forEach(c => { if (!snipCls.has(c) && cssClasses.has(c) && !documented(c)) note(missCls, c, t); });
      r.pairs.forEach(pr => { const [a, b] = pr.split(' > '); if (prefix(a) === prefix(b) && a !== b && snipCls.has(a) && snipCls.has(b) && !snipPairs.has(pr)) note(missPairs, pr, t); }); }
    await p.close();
  }
  await browser.close(); server.close();
  const fmt = (map, n) => [...map].sort((a, b) => b[1].size - a[1].size).slice(0, n).map(([k, s]) => `${k}（${[...s].slice(0, 3).join('、')}${s.size > 3 ? ` 等 ${s.size} 处` : ''}）`);
  if (missCls.size) W.push(`有 ${missCls.size} 个类在页面中使用、但 mapping 完全没有提到：\n  - ` + fmt(missCls, verbose ? 999 : 25).join('\n  - '));
  if (missPairs.size) W.push(`有 ${missPairs.size} 种同一组件内部的父子结构在页面中出现、但 mapping 片段里没有：\n  - ` + fmt(missPairs, verbose ? 999 : 25).join('\n  - '));
  if (asJson) console.log(JSON.stringify({ snippets: rows.length, pages: targets.length, blockers: B, warnings: W }, null, 2));
  else {
    console.log(`# 组件写法一致性：${rows.length} 个 mapping 片段，对比 ${targets.length} 个页面\n`);
    B.forEach(x => console.log('- 【阻断】' + x)); W.forEach(x => console.log('- 【提示】' + x));
    if (!B.length && !W.length) console.log('- 通过');
    console.log(`\n结论：阻断 ${B.length} 项，提示 ${W.length} 项。提示项逐条判断：属于组件写法的，补进对应 mapping.json；属于页面私有写法偏离组件的，改页面。`);
  }
  process.exit(B.length ? 1 : 0);
})();
