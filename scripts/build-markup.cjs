#!/usr/bin/env node
/*
 * 由各组件 mapping.json 的 templates 生成：
 *   1. assets/scripts/gj-m-templates.js（window.GJ_M_TEMPLATES，供预览站 kit.js、组件预览页与原型页面运行时渲染）
 *   2. mapping.json 的 markup：每个模板用其 example 渲染出示例写法，写回同名 markup 键；有 examples（{markup 键: 数据}）时逐个写回（AI 生成页面时直接复制）
 * templates 是组件写法的唯一来源；改模板后运行：node scripts/build-markup.cjs，再运行 node scripts/check-mapping.cjs。
 * 用 --check 只校验 markup 是否与模板一致（不写文件），不一致时退出码为 1。
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const M = require(path.join(ROOT, 'assets/scripts/gj-m-markup.js'));
const check = process.argv.includes('--check');
M.root = '{ROOT}';
const COMP = path.join(ROOT, 'references/components');
const bundle = {}; const stale = []; let n = 0;
for (const d of fs.readdirSync(COMP).sort()) {
  const f = path.join(COMP, d, 'mapping.json'); if (!fs.existsSync(f)) continue;
  const m = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!m.templates) continue;
  bundle[d] = {};
  for (const [name, t] of Object.entries(m.templates)) {
    bundle[d][name] = t.tpl;
    /* example 写回同名 markup 键；examples 为 {markup 键: 数据}，一个模板生成多个示例（如尺寸、变体） */
    const outs = t.examples ? Object.entries(t.examples) : [[name, t.example || {}]];
    for (const [key, data] of outs) {
      const rendered = M.renderString(t.tpl, data); // M.root 设为 {ROOT}，示例写法保留路径占位
      if ((m.markup || {})[key] !== rendered) { stale.push(`${d}.${key}`); m.markup = m.markup || {}; m.markup[key] = rendered; }
    }
    n++;
  }
  if (!check) fs.writeFileSync(f, JSON.stringify(m, null, 2) + '\n');
}
if (check) {
  if (stale.length) { console.log('markup 与模板不一致（运行 node scripts/build-markup.cjs 更新）：' + stale.join('、')); process.exit(1); }
  console.log(`markup 与 ${n} 个模板一致`); process.exit(0);
}
const js = '/* 由 scripts/build-markup.cjs 从各组件 mapping.json 的 templates 生成，请勿手改。 */\nwindow.GJ_M_TEMPLATES = ' + JSON.stringify(bundle, null, 1) + ';\n';
fs.writeFileSync(path.join(ROOT, 'assets/scripts/gj-m-templates.js'), js);
console.log(`已生成 ${n} 个模板（${Object.keys(bundle).length} 个组件）；更新 markup ${stale.length} 处`);
