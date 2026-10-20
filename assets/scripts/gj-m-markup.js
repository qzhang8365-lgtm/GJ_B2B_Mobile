/* 组件写法渲染器（原型用，不代表真实前端组件库 API）。
 * 模板来自各组件 references/components/<id>/mapping.json 的 templates（唯一来源），
 * 由 scripts/build-markup.cjs 打包为 assets/scripts/gj-m-templates.js（window.GJ_M_TEMPLATES）。
 *
 * 用法：GJMarkup.render('button', 'button', {text:'提交', level:'primary', size:'large'})
 *       GJMarkup.root = '../../'   // 页面到 Skill 根目录的相对路径，替换模板里的 {ROOT}
 * 模板语法（Mustache 子集；false、0、空串、空数组视为假）：
 *   {{x}} 转义输出   {{{x}}} 原样输出   {{.}} 当前项
 *   {{#x}}…{{/x}}  x 为数组时逐项渲染（项为对象时字段可直接引用，也可引用外层字段）；为真值时渲染一次
 *   {{^x}}…{{/x}}  x 为假值或空数组时渲染
 */
(function (root) {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lookup = (stack, name) => {
    if (name === '.') return stack[stack.length - 1];
    const parts = name.split('.');
    for (let i = stack.length - 1; i >= 0; i--) {
      const ctx = stack[i];
      if (ctx != null && typeof ctx === 'object' && parts[0] in ctx) { let v = ctx; for (const p of parts) v = v == null ? undefined : v[p]; return v; }
    }
    return undefined;
  };
  /* 找到与 {{#name}} 配对的 {{/name}}（支持同名嵌套） */
  const findClose = (tpl, name, from) => {
    const re = new RegExp('\\{\\{([#^/])' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\}\\}', 'g'); re.lastIndex = from; let depth = 1, m;
    while ((m = re.exec(tpl))) { if (m[1] === '/') { if (--depth === 0) return m; } else depth++; }
    throw new Error('模板缺少 {{/' + name + '}}');
  };
  function renderTpl(tpl, stack) {
    let out = '', i = 0; const tag = /\{\{(\{?)([#^/]?)\s*([\w.@]+)\s*\}?\}\}/g; let m;
    while ((m = tag.exec(tpl))) {
      out += tpl.slice(i, m.index);
      const [all, triple, sigil, name] = m;
      if (sigil === '#' || sigil === '^') {
        const close = findClose(tpl, name, tag.lastIndex), inner = tpl.slice(tag.lastIndex, close.index), v = lookup(stack, name);
        const empty = v == null || v === false || v === '' || v === 0 || (Array.isArray(v) && !v.length);
        if (sigil === '^') { if (empty) out += renderTpl(inner, stack); }
        else if (!empty) {
          if (Array.isArray(v)) v.forEach((it, idx) => { out += renderTpl(inner, stack.concat([it && typeof it === 'object' ? Object.assign({ '@index': idx }, it) : it])); });
          else out += renderTpl(inner, typeof v === 'object' ? stack.concat([v]) : stack);
        }
        i = close.index + close[0].length; tag.lastIndex = i; continue;
      }
      const v = lookup(stack, name);
      out += triple ? (v == null ? '' : String(v)) : esc(v);
      i = tag.lastIndex;
    }
    return out + tpl.slice(i);
  }
  const api = {
    root: '',
    templates: null,
    get(component, name) {
      const all = api.templates || root.GJ_M_TEMPLATES;
      const t = all && all[component] && all[component][name];
      if (!t) throw new Error('未找到组件模板：' + component + '.' + name);
      return t;
    },
    render(component, name, data) { return api.renderString(api.get(component, name), data); },
    renderString(tpl, data) { return renderTpl(tpl, [data || {}]).replace(/\{ROOT\}/g, api.root); },
    esc
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GJMarkup = api;
})(typeof window !== 'undefined' ? window : globalThis);
