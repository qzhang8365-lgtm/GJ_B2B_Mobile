#!/usr/bin/env node
/*
 * 图标内嵌：把页面用到的图标 SVG 和转换脚本（assets/scripts/gj-m-inline-icons.js 的内容）写进页面本身，
 * 页面打开后图标由 CSS 遮罩改为真正的 SVG（Figma「网页导入」等工具才能识别为矢量图层；双击打开也可用）。
 *
 * 用法：node scripts/embed-icons.cjs <页面.html> [更多页面...]        直接改写页面（同一份文件，不另存）
 *       node scripts/embed-icons.cjs <页面.html> --check              只检查：未内嵌或图标数据过期时退出码 1
 *       node scripts/embed-icons.cjs <页面.html> --no-statusbar       不加手机状态栏（交付真实 H5 代码时；验证页、原型默认加）
 * 收集范围：页面与它引用的本地脚本中出现的图标名（icf_*），加上基座 CSS 与组件模板里用到的全部图标。
 * 可重复运行：页面里 <!-- gj-m-icons:start --> … <!-- gj-m-icons:end --> 之间的内容整体替换。
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ICON_DIR = path.join(ROOT, 'assets/icons/iconfont');
const NAME = /icf_[A-Za-z0-9_.-]+?(?=\.svg|['"`\s),;}\]])/g;
const START = '<!-- gj-m-icons:start -->', END = '<!-- gj-m-icons:end -->';
const check = process.argv.includes('--check');
const noBar = process.argv.includes('--no-statusbar');
/* 手机状态栏示意（9:41、信号、电池，透明底；背景由页面顶部导航决定） */
const STATUSBAR = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(ROOT, 'assets/images/status-bar-transparent.svg')).toString('base64');
/* 运行脚本一起写进页面：页面移动到别处或单独发送也能用 */
const RUNTIME = fs.readFileSync(path.join(ROOT, 'assets/scripts/gj-m-inline-icons.js'), 'utf8').replace(/<\/script/gi, '<\\/script').trim();
const pages = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!pages.length) { console.error('用法：node scripts/embed-icons.cjs <页面.html> [--check]'); process.exit(2); }

const exists = n => fs.existsSync(path.join(ICON_DIR, n + '.svg'));
const namesIn = text => (text.match(NAME) || []).map(n => n.replace(/\.$/, '')).filter(exists);
/* 基座与模板里的图标：任何页面都可能通过组件用到 */
const common = new Set([
  ...namesIn(fs.readFileSync(path.join(ROOT, 'assets/styles/gj-b2b-mobile-components.css'), 'utf8')),
  ...namesIn(fs.readFileSync(path.join(ROOT, 'assets/scripts/gj-m-templates.js'), 'utf8')),
]);
/* SVG 精简：颜色改为 currentColor（跟随文字色），尺寸交给容器 */
const clean = n => fs.readFileSync(path.join(ICON_DIR, n + '.svg'), 'utf8')
  .replace(/<\?xml[^>]*>/, '').replace(/\s+/g, ' ').trim()
  .replace(/^<svg\b([^>]*)>/, (m, a) => '<svg' + a.replace(/\s(width|height)="[^"]*"/g, '') + ' aria-hidden="true" focusable="false">')
  .replace(/(fill|stroke)="#(?:101828|10161F)"/gi, '$1="currentColor"');

/* 页面里 <img> 引用的 Skill 图片（文件图标、空状态、头像、Logo、毛玻璃图标等）：导入工具读不到本地文件，改为页面内的 data URL。
 * 路径里的模板变量（${x} / {{x}}）按同目录文件展开。 */
const ASSET = /assets\/((?:icons|images)\/[^'"`)\s<>]+?\.(?:svg|png|jpe?g))/g;
const MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
/* hint：判断模板展开项是否用到的文本（页面与它的脚本）。目录文件多（如毛玻璃图标）时只保留文件名在页面里出现过的，避免把整套图片写进页面 */
const assetsIn = (text, hint = text) => {
  const out = new Set();
  for (const m of text.matchAll(ASSET)) {
    const rel = m[1];
    if (rel.startsWith('icons/iconfont/')) continue; // 图标库图标走上面的 SVG 内嵌
    if (/\$\{|\{\{/.test(rel)) {
      const dir = path.join(ROOT, 'assets', path.dirname(rel)); if (!fs.existsSync(dir)) continue;
      const re = new RegExp('^' + path.basename(rel).replace(/[.*+?^()|[\]\\]/g, '\\$&').replace(/\\\$\\\{[^}]*\}|\$\{[^}]*\}|\{\{[^}]*\}\}/g, '.+') + '$');
      const hits = fs.readdirSync(dir).filter(f => re.test(f));
      const used = hits.length > 12 ? hits.filter(f => new RegExp(`['"\`/]${f.replace(/\.[^.]+$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`.]`).test(hint)) : hits;
      used.forEach(f => out.add(path.posix.join(path.dirname(rel), f)));
    } else if (fs.existsSync(path.join(ROOT, 'assets', rel))) out.add(rel);
  }
  return out;
};
const dataUrl = rel => `data:${MIME[path.extname(rel).slice(1).toLowerCase()]};base64,${fs.readFileSync(path.join(ROOT, 'assets', rel)).toString('base64')}`;
const TEMPLATES = fs.readFileSync(path.join(ROOT, 'assets/scripts/gj-m-templates.js'), 'utf8');

let bad = 0;
for (const page of pages) {
  const file = path.resolve(page);
  let html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  /* 页面引用的本地脚本（不含 assets 下的公共脚本）里写到的图标名 */
  const body = html.replace(new RegExp(START + '[\\s\\S]*?' + END), '');
  const own = new Set(namesIn(body));
  let pageText = body;
  const imgs = new Set(assetsIn(body));
  for (const m of html.matchAll(/<script[^>]+src="([^"?#]+)/g)) {
    const src = path.resolve(dir, m[1]);
    if (!src.startsWith(path.join(ROOT, 'assets')) && fs.existsSync(src)) { const t = fs.readFileSync(src, 'utf8'); pageText += t; namesIn(t).forEach(n => own.add(n)); assetsIn(t).forEach(a => imgs.add(a)); }
  }
  assetsIn(TEMPLATES, pageText).forEach(a => imgs.add(a)); // 组件模板里的图片（空状态、文件图标、毛玻璃宫格等），按页面实际用到的名称筛选
  const names = [...new Set([...common, ...own])].sort();
  const data = {}; names.forEach(n => { data[n] = clean(n); });
  const pics = {}; [...imgs].sort().forEach(r => { pics[r] = dataUrl(r); });
  const block = `${START}\n<script>/* 由 scripts/embed-icons.cjs 生成：页面用到的图标 SVG（${names.length} 个）与图片（${imgs.size} 个），供 gj-m-inline-icons.js 把遮罩图标换成内嵌 SVG。请勿手改，改页面后重新运行。 */\nwindow.GJ_M_ICONS=${JSON.stringify(data)};\nwindow.GJ_M_ASSETS=${JSON.stringify(pics)};${noBar ? '' : `\nwindow.GJ_M_STATUSBAR=${JSON.stringify(STATUSBAR)};`}</script>\n<script>${RUNTIME}</script>\n${END}`;
  const has = html.includes(START) && html.includes(END);
  const next = has ? html.replace(new RegExp(START + '[\\s\\S]*?' + END), () => block) : html.replace(/<\/body>/i, () => block + '\n</body>');
  if (check) {
    if (next !== html) { bad++; console.log(`未内嵌或已过期：${page}（运行 node scripts/embed-icons.cjs ${page}）`); }
    else console.log(`已内嵌：${page}（${names.length} 个图标）`);
  } else {
    if (!/<\/body>/i.test(html) && !has) { console.error(`缺少 </body>：${page}`); bad++; continue; }
    fs.writeFileSync(file, next);
    console.log(`${has ? '已更新' : '已内嵌'}：${page}（${names.length} 个图标、${imgs.size} 张图片，约 ${(Buffer.byteLength(block) / 1024).toFixed(0)} KB）`);
  }
}
process.exit(bad ? 1 : 0);
