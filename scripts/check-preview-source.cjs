#!/usr/bin/env node
/*
 * 预览站示例来源检查（移动端）。
 * 组件页 / 模式页里展示出来的组件，必须和 skill 生成页面的效果一致：组件样式只来自基座
 * （assets/styles/gj-b2b-mobile-components.css + Token），写法来自 mapping.json。
 * 示例区（GJPhone.mount / swatch 的 css，含 kit.js 的模式页样式）只允许页面布局与组合样式。
 *
 * 用法：node scripts/check-preview-source.cjs [--json] [页面相对 preview/ 的路径 ...]
 * 检查（逐条列出选择器）：
 *   【阻断】改写基座外观：示例样式对 .gj-m-* / .gj-icon 设置了外观属性（颜色、背景、边框、圆角、阴影、字体、尺寸、内边距、显示与否等），
 *           效果只在预览里有、生成页面做不出来。需要的能力补进基座与 mapping。
 *   【提示】组合样式：只设置组件在容器里的位置关系（外边距、定位、层级、弹性 / 网格子项、对齐、根宽度），
 *           生成页面同样会写；须与 references/page-rules.md 的组合规则一致，逐条确认
 *   【阻断】仿组件：页面私有类设置了圆角，同时有背景 / 边框 / 阴影（自己画的卡片、标签、按钮、输入框等），改用基座组件；
 *           页面私有类改写组件变量（--gj-m-*）也算改写基座外观
 *   【提示】硬编码：私有样式里出现十六进制 / rgb 颜色（应使用 var(--ds-*)）
 * 依赖：Playwright。退出码：有阻断为 1。
 */
const path = require('path'), fs = require('fs'), http = require('http');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { console.error('未找到 playwright：npm i -D playwright 后重试。'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..');
const asJson = process.argv.includes('--json');
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const serve = () => new Promise(ok => { const s = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }); s.listen(0, '127.0.0.1', () => ok(s)); });
const PV = path.join(ROOT, 'preview');
// 基础规范页（颜色、样式效果、圆角、字体、图标、指南、总览）展示的是 Token 本身，样例块是 Token 的载体而不是组件演示，不在检查范围
const FOUNDATION = ['color', 'effects', 'radius', 'typography', 'icons', 'guide', 'overview', '_template', '_data'];
const pages = only.length ? only : [
  ...fs.readdirSync(PV).filter(d => d !== '_template' && fs.existsSync(path.join(PV, d, 'index.html'))).map(d => d + '/index.html'),
  ...fs.readdirSync(path.join(PV, 'patterns')).filter(d => fs.existsSync(path.join(PV, 'patterns', d, 'index.html'))).map(d => 'patterns/' + d + '/index.html')
].filter(p => !FOUNDATION.includes(p.split('/')[0]));
const COMPOSE = /^(scroll-margin(-(top|bottom|block|inline))?|margin(-(top|right|bottom|left|block|inline)(-(start|end))?)?|position|top|right|bottom|left|inset|z-index|flex|flex-(grow|shrink|basis)|order|align-self|justify-self|grid-(column|row|area)(-(start|end))?|width|max-width|min-width)$/;
const SURF = /^(background(-color|-image)?|border(-(top|right|bottom|left))?(-(width|style|color))?|border-radius|box-shadow|outline)$/;

function parse(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  // 展开 @media / @supports 等嵌套；@keyframes 内的帧不算组件样式
  const walk = (t, inKf) => { let i = 0; while (i < t.length) { const o = t.indexOf('{', i); if (o < 0) break; const head = t.slice(i, o).trim(); let d = 1, j = o + 1; while (j < t.length && d) { if (t[j] === '{') d++; else if (t[j] === '}') d--; j++; } const body = t.slice(o + 1, j - 1); if (head.startsWith('@')) walk(body, /^@(-webkit-)?keyframes/.test(head)); else if (!inKf) rules.push([head, body]); i = j; } };
  walk(css, false); return rules;
}

(async () => {
  const server = await serve(); const base = 'http://127.0.0.1:' + server.address().port;
  let browser; try { browser = await chromium.launch(); } catch (e) { console.error('无法启动 Chromium：请运行 `npx playwright install chromium`。'); server.close(); process.exit(2); }
  const report = {}; let block = 0;
  for (const pg of pages) {
    const p = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await p.addInitScript(() => { window.__gjCss = []; let G; Object.defineProperty(window, 'GJPhone', { configurable: true, get() { return G; }, set(v) { G = v; for (const k of ['mount', 'swatch']) { const f = v[k]; v[k] = function (t, o) { if (o && o.css) window.__gjCss.push(o.css); return f.apply(this, arguments); }; } } }); });
    try { await p.goto(base + '/preview/' + pg, { waitUntil: 'load' }); await p.waitForTimeout(1200); } catch (e) { }
    const cssList = await p.evaluate(() => [...new Set(window.__gjCss || [])]).catch(() => []);
    await p.close();
    const seen = new Set(), base_ = [], fake = [], hard = [], compose = [];
    for (const css of cssList) for (const [sel, body] of parse(css)) {
      const key = sel + '{' + body; if (seen.has(key)) continue; seen.add(key);
      const decls = body.split(';').map(x => x.trim()).filter(Boolean).map(x => { const k = x.indexOf(':'); return [x.slice(0, k).trim().toLowerCase(), x.slice(k + 1).trim()]; });
      const s = ' ' + sel.replace(/\s+/g, ' ');
      if (/\.gj-m-|\.gj-icon/.test(s)) { const vis = decls.filter(([k, v]) => !COMPOSE.test(k) && !(k === 'transform' && v === 'none')).map(([k]) => k); /* transform:none 只是取消基座的定位位移（如放大示意里改为静态排布） */ if (vis.length) base_.push(sel + ' {' + [...new Set(vis)].join(',') + '}'); else compose.push(sel + ' {' + [...new Set(decls.map(([k]) => k))].join(',') + '}'); continue; }
      if (/^(html|body|\*|:root|\[hidden\])/.test(sel.trim())) continue;
      const vars = decls.filter(([k]) => k.startsWith('--gj-m-') && !/offset/.test(k)).map(([k]) => k); /* 位置偏移变量（如 --gj-m-fab-offset-y）是基座开放给页面的组合接口 */
      if (vars.length) base_.push(sel + ' {' + vars.join(',') + '}');
      const surf = new Set(decls.filter(([k, v]) => SURF.test(k) && !/^(none|0|0px|transparent|initial|unset|inherit)$/.test(v)).map(([k]) => k.replace(/-(top|right|bottom|left|width|style|color|image)/g, '')));
      // 圆角 + 底色 / 边框 / 阴影 = 自己画的块（卡片、标签、按钮、输入框等）；不带圆角的页面区域（吸顶栏、底部操作栏的底色与分割线）属于布局
      if (surf.has('border-radius') && surf.size >= 2) fake.push(sel + ' {' + [...surf].join(',') + '}');
      if (decls.some(([k, v]) => !k.startsWith('--') && /#[0-9a-f]{3,8}\b|rgba?\(/i.test(v) && !/var\(--/.test(v))) hard.push(sel);
    }
    report[pg] = { base: base_, fake, hard, compose };
    if (base_.length || fake.length) block++;
  }
  await browser.close(); server.close();
  if (asJson) { console.log(JSON.stringify(report, null, 1)); }
  else {
    const n = k => Object.values(report).reduce((a, r) => a + r[k].length, 0);
    console.log(`# 预览站示例来源：${pages.length} 个页面，改写基座外观 ${n('base')} 条，仿组件 ${n('fake')} 条，组合样式 ${n('compose')} 条，硬编码颜色 ${n('hard')} 条\n`);
    for (const [pg, r] of Object.entries(report)) {
      if (!r.base.length && !r.fake.length && !r.hard.length && !r.compose.length) continue;
      console.log('## ' + pg);
      if (r.base.length) console.log('- 【阻断】改写基座外观：' + r.base.join(' | '));
      if (r.fake.length) console.log('- 【阻断】仿组件：' + r.fake.join(' | '));
      if (r.compose.length) console.log('- 【提示】组合样式：' + r.compose.join(' | '));
      if (r.hard.length) console.log('- 【提示】硬编码颜色：' + r.hard.join(' | '));
    }
    console.log(`\n结论：${block} 个页面有阻断项。`);
  }
  process.exit(block ? 1 : 0);
})();
