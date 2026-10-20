#!/usr/bin/env node
/*
 * 生成后验收脚本（移动端）。规则见 references/generation-verification.md。
 *
 * 用法：
 *   node scripts/verify-page.cjs <页面 html 路径或 URL> [--widths 375,320,768] [--container h5|webview|miniprogram]
 *                                [--shots <截图目录>] [--json] [--file]
 * 本地路径默认用内置静态服务（以包含 SKILL.md 的目录为根）以 http 打开；--file 改为 file:// 直接打开，
 * 用于验证“双击 HTML 离线打开”的交付方式（Chromium 下 file:// 的 SVG mask 图标会被跨域拦截）。
 * 依赖：Playwright（npm i -D playwright；或全局安装后设置 NODE_PATH）。
 * 退出码：有“阻断”项时为 1，否则为 0。“提示”项需要人工判断，不阻断。
 */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) {
  console.error('未找到 playwright：请先安装（npm i -D playwright），或设置 NODE_PATH 指向全局 node_modules。');
  process.exit(2);
}

const args = process.argv.slice(2);
if (!args.length || args[0].startsWith('--')) { console.error('用法：node scripts/verify-page.cjs <页面> [--widths 375,320,768] [--container h5|webview|miniprogram] [--shots dir] [--json]'); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : d; };
const target = args[0];
const http = require('http');
const isRemote = /^https?:|^file:/.test(target);
const useFile = args.includes('--file');
function findRoot(p) { let d = path.dirname(path.resolve(p)); while (d !== path.dirname(d)) { if (fs.existsSync(path.join(d, 'SKILL.md'))) return d; d = path.dirname(d); } return process.cwd(); }
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.woff': 'font/woff' };
function serve(root) { return new Promise(ok => { const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }); srv.listen(0, '127.0.0.1', () => ok(srv)); }); }
let url, server;
const widths = opt('widths', '375,320,768').split(',').map(Number);
const container = opt('container', 'h5');
const shots = opt('shots', null);
const asJson = args.includes('--json');
const SCALE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];

(async () => {
  if (isRemote) url = target;
  else if (useFile) url = 'file://' + path.resolve(target);
  else { const root = findRoot(target); server = await serve(root); url = `http://127.0.0.1:${server.address().port}/` + path.relative(root, path.resolve(target)).split(path.sep).map(encodeURIComponent).join('/'); }
  let browser;
  try { browser = await chromium.launch(); } catch (e) {
    console.error('无法启动 Chromium：Playwright 的浏览器还没有下载到本机。请在 Skill 目录运行 `npx playwright install chromium` 后重试。\n原始错误：' + String(e.message).split('\n')[0]);
    if (server) server.close(); process.exit(2);
  }
  const report = { page: target, container, widths: {}, blockers: 0, warnings: 0 };
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 812 }, deviceScaleFactor: 2 });
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => failed.push(r.url()));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const res = await page.evaluate(({ SCALE, container }) => {
      const B = [], W = [];
      const name = el => { const c = (el.className && el.className.baseVal === undefined ? el.className : '') || ''; return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + String(c).trim().split(/\s+/).slice(0, 2).join('.') : ''); };
      const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
      const vw = document.documentElement.clientWidth;
      // 1 页面横向溢出
      if (document.documentElement.scrollWidth > vw + 1) B.push(`页面横向溢出：scrollWidth ${document.documentElement.scrollWidth} > ${vw}`);
      // 2 盒模型
      if (getComputedStyle(document.body).boxSizing !== 'border-box') W.push('未设置 *{box-sizing:border-box}：width:100% + 内边距的组件可能溢出');
      // 3 元素超出视口（滚动容器内的除外）
      const inScroller = el => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return true; } return false; };
      const outs = new Set();
      document.querySelectorAll('body *').forEach(el => { if (!visible(el)) return; const s = getComputedStyle(el); if (s.position === 'fixed') return; const r = el.getBoundingClientRect(); if ((r.right > vw + 1 || r.left < -1) && !inScroller(el)) outs.add(name(el)); });
      if (outs.size) B.push('元素超出屏幕：' + [...outs].slice(0, 8).join('、'));
      // 4 文字被截断但未设置省略（叶子文本）
      document.querySelectorAll('body *').forEach(el => { if (!visible(el) || el.children.length) return; const s = getComputedStyle(el); if (!el.textContent.trim()) return; if (el.scrollWidth > el.clientWidth + 1 && s.overflow !== 'visible' && s.textOverflow !== 'ellipsis' && !/(auto|scroll)/.test(s.overflowX)) W.push('文字被裁切且无省略号：' + name(el) + '「' + el.textContent.trim().slice(0, 12) + '」'); });
      // 5 字号下限
      const small = new Map();
      document.querySelectorAll('body *').forEach(el => { if (!visible(el)) return; const t = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!t) return; const fz = parseFloat(getComputedStyle(el).fontSize); if (fz < 10) B.push(`字号 ${fz}px 小于 10：${name(el)}「${el.textContent.trim().slice(0, 10)}」`); else if (fz < 12) small.set(name(el), fz); });
      if (small.size) W.push('字号 10–11px（小屏按 h5-small-screen.md 正文不低于 12；辅助文字、Small 标签、底部导航标签可为 10）：' + [...small.keys()].slice(0, 8).join('、'));
      // 6 可点击元素热区 ≥ 44（含 ::after 扩展）
      const hit = el => { const r = el.getBoundingClientRect(); let w = r.width, h = r.height; for (const p of ['::after', '::before']) { const s = getComputedStyle(el, p); if (s.content !== 'none' && s.position === 'absolute') { w = Math.max(w, parseFloat(s.width) || 0); h = Math.max(h, parseFloat(s.height) || 0); } } return [w, h]; };
      const smallHit = [];
      document.querySelectorAll('button, a[href], [role=button], [role=tab], [role=switch], input[type=checkbox], input[type=radio], select').forEach(el => {
        let t = el; if (/^(checkbox|radio)$/.test(el.type)) t = el.closest('label') || el; if (!visible(t)) return; const [w, h] = hit(t);
        if (Math.min(w, h) < 43.5) smallHit.push(`${name(t)}（${Math.round(w)}×${Math.round(h)}）`); });
      if (smallHit.length) W.push('热区不足 44（密集列表等已批准例外可忽略）：' + smallHit.slice(0, 10).join('、'));
      // 7 可访问名称
      const noName = [];
      document.querySelectorAll('button, a[href], [role=button], [role=switch], [role=tab]').forEach(el => { if (!visible(el)) return; const n = (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.textContent).trim(); if (!n) noName.push(name(el)); });
      document.querySelectorAll('input:not([type=hidden]), textarea, select').forEach(el => { const n = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || (el.id && document.querySelector(`label[for="${el.id}"]`)) || el.closest('label')?.textContent.trim(); if (!n) noName.push(name(el)); });
      if (noName.length) B.push('缺少可访问名称：' + noName.slice(0, 10).join('、'));
      document.querySelectorAll('img').forEach(el => { if (!el.hasAttribute('alt')) B.push('图片缺少 alt：' + (el.getAttribute('src') || '').split('/').pop()); });
      // 8 弹层
      document.querySelectorAll('[role=dialog]').forEach(el => { if (!visible(el)) return; if (el.getAttribute('aria-modal') !== 'true') W.push('弹窗缺少 aria-modal="true"：' + name(el)); if (!el.getAttribute('aria-labelledby') && !el.getAttribute('aria-label')) B.push('弹窗缺少标题关联：' + name(el)); });
      // 9 图标资源与颜色
      document.querySelectorAll('.gj-icon').forEach(el => { const v = el.style.getPropertyValue('--gj-icon') || getComputedStyle(el).getPropertyValue('--gj-icon'); if (v && !/icons\/(iconfont|fileicon|glassicon|general)\//.test(v)) B.push('图标不是图标库资源：' + v.trim().slice(0, 60)); });
      const iconColor = [];
      document.querySelectorAll('.gj-m-button > .gj-icon, .gj-m-text-button > .gj-icon').forEach(el => { if (!visible(el)) return; const host = el.parentElement; const bg = getComputedStyle(el).backgroundColor, fg = getComputedStyle(host).color; if (bg !== fg) iconColor.push(name(host)); });
      if (iconColor.length) W.push('按钮内图标颜色与文字不一致：' + [...new Set(iconColor)].slice(0, 6).join('、'));
      // 10 同一行控件高度一致
      const rows = new Map();
      document.querySelectorAll('.gj-m-button').forEach(el => { if (!visible(el) || !el.parentElement) return; const k = el.parentElement; const r = el.getBoundingClientRect(); const arr = rows.get(k) || []; arr.push([Math.round(r.top), Math.round(r.height)]); rows.set(k, arr); });
      rows.forEach((arr, p) => { const byTop = {}; arr.forEach(([t, h]) => (byTop[t] = byTop[t] || new Set()).add(h)); Object.values(byTop).forEach(s => { if (s.size > 1) W.push('同一行按钮高度不一致：' + name(p) + '（' + [...s].join(' / ') + '）'); }); });
      // 11 页面级间距不在阶梯上（只查页面自定义容器，组件内部按组件取值）
      const off = new Set();
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 100; /* 375 时 100px，450 起封顶 120px */
      const toDesign = v => Math.round(parseFloat(v) * 100 / rootPx);
      document.querySelectorAll('body *').forEach(el => { if (!visible(el)) return; const c = String(el.className || ''); if (/gj-m-|gj-icon/.test(c)) return; if (el.closest('[class*="gj-m-"]') && el.closest('[class*="gj-m-"]') !== el) return; const s = getComputedStyle(el); const vals = [s.rowGap, s.columnGap, s.paddingTop, s.paddingLeft, s.paddingRight].filter(v => v && v !== 'normal').map(toDesign).filter(v => v > 0 && !SCALE.includes(v)); if (vals.length) off.add(name(el) + '（' + [...new Set(vals)].join('/') + '）'); });
      if (off.size) W.push('页面级间距不在 4/8/12/16/20/24/32/40/48 阶梯上（按根字号折算回设计值，安全区等计算值可忽略）：' + [...off].slice(0, 8).join('、'));
      // 12 金融数字
      const nums = []; document.querySelectorAll('.gj-m-metric-num, [class*="amount"], [class*="money"]').forEach(el => { if (visible(el) && !/tabular-nums/.test(getComputedStyle(el).fontVariantNumeric)) nums.push(name(el)); });
      if (nums.length) W.push('金额 / 指标数字未用等宽数字：' + nums.slice(0, 6).join('、'));
      // 13 容器：输入字号与 viewport
      const vp = (document.querySelector('meta[name=viewport]') || {}).content || '';
      if (container !== 'miniprogram') { const tiny = [...document.querySelectorAll('input, textarea')].filter(el => visible(el) && parseFloat(getComputedStyle(el).fontSize) < 16); if (tiny.length && !/maximum-scale\s*=\s*1/.test(vp)) B.push(`H5 / web-view 中有 ${tiny.length} 个输入框字号 < 16，viewport 需加 maximum-scale=1`); }
      if (!/width=device-width/.test(vp)) B.push('viewport 缺少 width=device-width');
      return { B, W };
    }, { SCALE, container });
    if (errors.length) res.B.push('脚本 / 控制台错误：' + errors.slice(0, 5).join(' | '));
    if (failed.length) res.B.push('资源加载失败：' + [...new Set(failed)].slice(0, 6).join('、'));
    if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `${path.basename(target).replace(/\W+/g, '_')}-${w}.png`), fullPage: true }); }
    report.widths[w] = res; report.blockers += res.B.length; report.warnings += res.W.length;
    await page.close();
  }
  await browser.close();
  if (server) server.close();
  if (asJson) { console.log(JSON.stringify(report, null, 2)); }
  else {
    console.log(`# 验收：${target}（容器 ${container}）`);
    for (const [w, r] of Object.entries(report.widths)) {
      console.log(`\n## ${w} 宽`);
      if (!r.B.length && !r.W.length) console.log('- 通过');
      r.B.forEach(x => console.log('- 【阻断】' + x));
      r.W.forEach(x => console.log('- 【提示】' + x));
    }
    console.log(`\n结论：阻断 ${report.blockers} 项，提示 ${report.warnings} 项。${report.blockers ? '修复阻断项后重新运行。' : '无阻断项；逐条判断提示项，并完成人工检查项。'}`);
  }
  process.exit(report.blockers ? 1 : 0);
})();
