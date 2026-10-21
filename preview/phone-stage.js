/* 移动端规范站 · 手机预览框
 *
 * 文档页本身按桌面阅读排版（根字号 16px），移动端 Token 与组件却以 rem 书写（375 宽时 1rem = 100px）。
 * 所以所有移动端示例都放进独立 iframe：iframe 的逻辑宽度就是设备宽度，根字号按
 * references/h5-sizing-and-adaptation.md 的 `min(calc(100vw / 3.75), 120px)` 计算。
 * 示例固定按 1 倍显示（不提供倍率切换）；仅在 fit 且容器过窄时整体缩小画框，不改变 iframe 的逻辑宽度和其中的尺寸值。
 *
 * 用法（文档页位于 preview/<page>/index.html）：
 *   <script src="../phone-stage.js"></script>
 *   const stage = GJPhone.mount(document.getElementById('demo'), {
 *     html: '<div class="m-button">提交</div>',   // 放进 .page 的示例结构
 *     css: '',                                     // 仅本示例需要的补充样式（rem 书写）
 *     width: 375,                                  // 初始宽度
 *     widths: [320, 375, 450, 600, 960],           // 可切换档位；传 [] 隐藏切换
 *     height: 'auto',                              // 'auto' 按内容撑高；数字为固定画框高度（如 812）
 *     background: 'var(--ds-background-background)'
 *   });
 *   stage.setHTML(html); stage.setWidth(320); stage.doc  // 当前 iframe document
 */
(function () {
  const script = document.currentScript;
  // phone-stage.js 位于 <skill>/preview/，资源根目录是 <skill>/
  const ROOT = new URL('../', script ? script.src : location.href).href;
  const STYLES = [
    'assets/styles/gj-b2b-mobile-tokens.css?v=20261020-display',
    'assets/styles/gj-b2b-mobile-components.css?v=20261020-src1'  // 更新基座后同步改版本号，避免浏览器沿用旧样式
  ];
  const DEFAULT_WIDTHS = [320, 375, 450, 600, 960];

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function buildDoc(html, css, background) {
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">' +
      '<base href="' + esc(ROOT) + '">' +
      STYLES.map(h => '<link rel="stylesheet" href="' + h + '">').join('') +
      '<style>' +
      'html{font-size:min(calc(100vw / 3.75), 120px)}' +
      ':root{--safe-top:env(safe-area-inset-top, 0px);--safe-bottom:env(safe-area-inset-bottom, 0px)}' +
      '*{box-sizing:border-box}' +
      'body{margin:0;font-size:.14rem;line-height:.22rem;font-family:var(--ds-font-family-ui);color:var(--ds-text-primary);background:' + (background || 'var(--ds-background-background)') + ';-webkit-text-size-adjust:100%}' +
      '.page{display:flow-root;width:100%}@media (min-width:960px){.page{max-width:960px;margin-inline:auto}}' +
      (css || '') +
      '</style></head><body><div class="page">' + (html || '') + '</div></body></html>';
  }

  /* 记录画框文档上挂的监听和计时器，原地更新内容时统一清理，避免重复绑定 */
  function trackDoc(frame) {
    const d = frame.contentDocument, w = d && d.defaultView; if (!w) return;
    frame._gjTrack = []; frame._gjTimers = [];
    [d, w, d.documentElement, d.body].forEach(tg => { const add = tg.addEventListener; tg.addEventListener = function (t, fn, o) { frame._gjTrack.push([this, t, fn, o]); return add.call(this, t, fn, o); }; });
    ['setInterval', 'setTimeout'].forEach(k => { const f0 = w[k]; w[k] = function () { const id = f0.apply(w, arguments); frame._gjTimers.push(id); return id; }; });
  }
  function untrackDoc(frame) {
    const w = frame.contentDocument && frame.contentDocument.defaultView;
    (frame._gjTrack || []).forEach(([tg, t, fn, o]) => tg.removeEventListener(t, fn, o)); frame._gjTrack = [];
    (frame._gjTimers || []).forEach(id => { if (w) { w.clearInterval(id); w.clearTimeout(id); } }); frame._gjTimers = [];
  }

  function mount(target, options) {
    const opt = Object.assign({ html: '', css: '', width: 375, widths: DEFAULT_WIDTHS, height: 'auto', zoom: 1, background: '', fit: false }, options || {});
    let width = opt.width, zoom = opt.zoom, html = opt.html, css = opt.css, ro;

    target.classList.add('phone-stage');
    target.innerHTML =
      // 只有需要切换宽度时才显示工具栏（组件页传 widths:[]，只展示 375 宽 1 倍效果）；不提供倍率切换
      '<div class="phone-toolbar"' + (opt.widths.length ? '' : ' hidden') + '>' +
        (opt.widths.length ? '<span>宽度</span><span class="seg" data-role="width">' + opt.widths.map(w => '<button type="button" data-w="' + w + '">' + w + '</button>').join('') + '</span>' : '') +
        '<span class="phone-meta"></span>' +
      '</div>' +
      '<div class="phone-viewport"><div class="phone-scaler"><div class="phone-inner"><iframe class="phone-frame" title="移动端预览"></iframe></div></div></div>';

    const frame = target.querySelector('iframe');
    const scaler = target.querySelector('.phone-scaler');
    const inner = target.querySelector('.phone-inner');
    const meta = target.querySelector('.phone-meta');
    const viewport = target.querySelector('.phone-viewport');

    function frameHeight() {
      if (typeof opt.height === 'number') return opt.height;
      const d = frame.contentDocument;
      return d && d.body ? Math.max(1, Math.ceil(d.body.getBoundingClientRect().height)) : 120;
    }
    function layout() {
      const h = frameHeight();
      // fit：画框宽于可用区域时按比例缩小显示（只改视觉倍率，不改 iframe 逻辑宽度）
      const avail = viewport.clientWidth - 8;
      const z = opt.fit && avail > 0 && width * zoom > avail ? avail / width : zoom;
      frame.style.width = width + 'px';
      frame.style.height = h + 'px';
      // 外层按缩放后的尺寸占位并居中；内层只做视觉缩放，不改变 iframe 逻辑宽度
      scaler.style.width = (width * z) + 'px';
      scaler.style.height = (h * z) + 'px';
      inner.style.width = width + 'px';
      inner.style.transform = z === 1 ? '' : 'scale(' + z + ')';
      const d = frame.contentDocument;
      const rem = d && d.documentElement ? parseFloat(getComputedStyle(d.documentElement).fontSize) : NaN;
      meta.textContent = width + ' × ' + (typeof opt.height === 'number' ? opt.height : 'auto') + ' · 1rem = ' + (isNaN(rem) ? '—' : Math.round(rem * 100) / 100 + 'px') + (z !== 1 ? ' · ' + (Math.round(z * 100) / 100) + 'x' : '');
      target.querySelectorAll('[data-w]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.w === width)));
      target.querySelectorAll('[data-z]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.z === zoom)));
    }
    function render() {
      if (ro) ro.disconnect();
      frame.onload = () => {
        layout();
        const d = frame.contentDocument;
        trackDoc(frame);
        if (d && 'ResizeObserver' in window && typeof opt.height !== 'number') {
          ro = new ResizeObserver(() => layout());
          ro.observe(d.body);
        }
        target.dispatchEvent(new CustomEvent('phone:ready', { detail: { doc: d, width } }));
      };
      frame.srcdoc = buildDoc(html, css, opt.background);
    }

    if (opt.fit && 'ResizeObserver' in window) new ResizeObserver(() => layout()).observe(viewport);
    target.addEventListener('click', e => {
      const w = e.target.closest('[data-w]'), z = e.target.closest('[data-z]');
      if (w) { width = +w.dataset.w; frame.style.width = width + 'px'; requestAnimationFrame(layout); }
      if (z) { zoom = +z.dataset.z; layout(); }
    });

    frame.style.width = width + 'px';
    render();
    return {
      get doc() { return frame.contentDocument; },
      frame,
      setHTML(next, nextCss) {
        /* 样式不变时原地替换 .page 内容，不重载 iframe（避免闪烁）；之前挂在 document / window 上的监听与计时器会被清理，再派发 phone:ready 供页面重新绑定 */
        const d = frame.contentDocument, page = d && d.querySelector('.page');
        html = next;
        if (page && (nextCss === undefined || nextCss === css) && frame._gjTrack) {
          untrackDoc(frame);
          page.innerHTML = html || '';
          layout();
          target.dispatchEvent(new CustomEvent('phone:ready', { detail: { doc: d, width } }));
          return;
        }
        if (nextCss !== undefined) css = nextCss; render();
      },
      setWidth(next) { width = next; frame.style.width = width + 'px'; requestAnimationFrame(layout); },
      refresh: layout
    };
  }

  /* 小样画框：用于 Token 卡片内的局部预览（无工具栏、宽度撑满容器）。
   * 宽度不代表设备宽度，因此根字号固定为 375 基准的 1rem = 100px，而不是按 100vw 计算。
   *   GJPhone.swatch(el, { html, css, height: 150, background })
   *   height: 'auto' 时按内容撑高、背景透明，用于组件页把 375 基准示例直接嵌在文档面板里（不带手机框）。
   */
  function swatch(target, options) {
    const opt = Object.assign({ html: '', css: '', height: 150, background: '' }, options || {});
    const auto = opt.height === 'auto';
    const headCss = 'html{font-size:100px}' + (auto ? 'html,body{background:transparent}.page{max-width:none!important;margin:0!important}' : '') + (opt.css || '');
    const bg = auto && !opt.background ? 'transparent' : opt.background;
    const key = headCss + '|' + bg + '|' + auto;
    /* 同一容器再次调用（交互演示改属性时）：复用已加载的画框，只替换 .page 内容，不重载 iframe，避免闪烁。
     * 页面在返回值上注册的 load 回调仍会在内容替换后异步触发一次；之前注册的回调会被丢弃，不会重复绑定。 */
    const old = target.querySelector(':scope > iframe.phone-swatch');
    if (old && old._gjKey === key && old._gjReady) {
      const d = old.contentDocument, page = d && d.querySelector('.page');
      if (page) {
        old._gjL = [];
        /* 清掉上一次渲染挂在 document / window / body 上的监听和计时器 */
        untrackDoc(old);
        if (!auto) old.style.height = opt.height + 'px';
        const sx = d.scrollingElement ? d.scrollingElement.scrollTop : 0;
        page.innerHTML = opt.html || '';
        if (d.scrollingElement) d.scrollingElement.scrollTop = sx;
        const tick = ++old._gjTick;
        setTimeout(() => { if (tick !== old._gjTick) return; const ev = new Event('load'); old._gjL.slice().forEach(fn => fn.call(old, ev)); }, 0);
        return old;
      }
    }
    const frame = document.createElement('iframe');
    frame.className = 'phone-swatch';
    frame.title = '移动端效果预览（375 基准）';
    frame.style.cssText = 'display:block;width:100%;border:0;height:' + (auto ? 0 : opt.height) + 'px';
    frame._gjKey = key; frame._gjL = []; frame._gjTick = 0; frame._gjReady = false;
    /* load 回调统一由画框转发，便于复用时替换 */
    const nativeAdd = EventTarget.prototype.addEventListener;
    frame.addEventListener = function (type, fn, o) { if (type === 'load' && typeof fn === 'function') { this._gjL.push(fn); return; } return nativeAdd.call(this, type, fn, o); };
    nativeAdd.call(frame, 'load', ev => {
      frame._gjReady = true;
      trackDoc(frame);
      if (auto) {
        const d = frame.contentDocument, fit = () => { frame.style.height = Math.ceil(d.body.getBoundingClientRect().height) + 'px'; };
        fit(); new ResizeObserver(fit).observe(d.body);
      }
      frame._gjL.slice().forEach(fn => fn.call(frame, ev));
    });
    frame.srcdoc = buildDoc(opt.html, headCss, bg);
    target.innerHTML = '';
    target.appendChild(frame);
    return frame;
  }

  /* 文档页属性控制面板：把原生选择器 / 多选框 / 单选框 / 滑块 / 输入框 / 按钮套上基座组件样式（px 换算版 preview/docs-controls.css）。
   * 只改外观与结构包裹，保留原控件元素、id 和事件，页面脚本无需改动。 */
  const CTL_CSS = 'preview/docs-controls.css?v=20261020-src1';
  function upgradeControls(scope) {
    scope.querySelectorAll('.playground .controls').forEach(panel => {
      panel.querySelectorAll('select:not([data-gj-ctl])').forEach(sel => {
        sel.dataset.gjCtl = '1';
        const wrap = document.createElement('span'); wrap.className = 'docs-ctl-select';
        sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
        sel.classList.add('gj-m-select', 'gj-m-select-m', 'gj-m-select-line');
        wrap.insertAdjacentHTML('beforeend', '<span class="gj-m-select-arrow" aria-hidden="true"><span class="gj-icon"></span></span>');
      });
      panel.querySelectorAll('input[type=checkbox]:not([data-gj-ctl]), input[type=radio]:not([data-gj-ctl])').forEach(inp => {
        inp.dataset.gjCtl = '1';
        const k = inp.type === 'radio' ? 'radio' : 'checkbox';
        let label = inp.closest('label');
        if (!label) { label = document.createElement('label'); inp.parentNode.insertBefore(label, inp); label.appendChild(inp); }
        label.classList.add('gj-m-' + k, 'docs-ctl-check');
        inp.classList.add('gj-m-' + k + '-input');
        const icon = document.createElement('span'); icon.className = 'gj-m-' + k + '-icon'; icon.setAttribute('aria-hidden', 'true');
        inp.after(icon);
        const text = document.createElement('span'); text.className = 'gj-m-' + k + '-label';
        [...label.childNodes].filter(n => n !== inp && n !== icon && (n.nodeType === 3 ? n.textContent.trim() : true)).forEach(n => text.appendChild(n));
        if (text.childNodes.length) label.appendChild(text);
      });
      panel.querySelectorAll('input[type=range]:not([data-gj-ctl])').forEach(r => {
        r.dataset.gjCtl = '1'; r.classList.add('gj-m-slider');
        const sync = () => { const min = +r.min || 0, max = r.max === '' ? 100 : +r.max; r.style.setProperty('--gj-m-slider-pct', ((r.value - min) / (max - min || 1)) * 100 + '%'); };
        r.addEventListener('input', sync); r.addEventListener('change', sync); sync();
      });
      panel.querySelectorAll('input:not([type]):not([data-gj-ctl]), input[type=text]:not([data-gj-ctl]), input[type=number]:not([data-gj-ctl]), input[type=search]:not([data-gj-ctl])').forEach(inp => {
        inp.dataset.gjCtl = '1';
        const wrap = document.createElement('span'); wrap.className = 'gj-m-input gj-m-input-m gj-m-input-line docs-ctl-input';
        inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
      });
      panel.querySelectorAll('textarea:not([data-gj-ctl])').forEach(t => {
        t.dataset.gjCtl = '1';
        const wrap = document.createElement('span'); wrap.className = 'gj-m-textarea gj-m-textarea-line docs-ctl-input';
        t.parentNode.insertBefore(wrap, t); wrap.appendChild(t);
      });
      panel.querySelectorAll('button:not([data-gj-ctl]):not(.gj-m-button)').forEach(b => {
        b.dataset.gjCtl = '1'; b.classList.add('gj-m-button', 'gj-m-button-secondary', 'gj-m-button-small');
      });
    });
  }
  function initControls() {
    if (!document.querySelector('.playground .controls')) return;
    if (!document.querySelector('link[data-gj-ctl]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = ROOT + CTL_CSS; l.dataset.gjCtl = '1'; document.head.appendChild(l); }
    upgradeControls(document);
    new MutationObserver(() => upgradeControls(document)).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initControls); else initControls();

  /* 双击打开（file://）时的图标兜底。
   * 图标用 CSS mask 引用 svg 文件（--gj-icon:url(...svg) 或 mask:url(...svg)），浏览器禁止 file:// 页面这样跨文件读取，图标会显示不出来。
   * 只在 file:// 下生效：按需引入 assets/icons/icon-content.js（全部 SVG 源码）和 preview/_data/icon-rules.js（基座 / 控制面板 CSS 里的图标规则，
   * 由 scripts/build-preview-data.py 生成），把 svg 文件地址换成内嵌 data URI。用本地服务（http://）打开时不加载、不改动任何东西。 */
  function initFileIcons() {
    if (location.protocol !== 'file:') return;
    const load = src => new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = ROOT + src; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
    const ready = window.GJ_ICON_CONTENT ? Promise.resolve() : load('assets/icons/icon-content.js');
    const rulesReady = (window.GJ_PREVIEW_DATA || {}).iconRules ? Promise.resolve() : load('preview/_data/icon-rules.js?v=20261020-data1');
    Promise.all([ready, rulesReady]).then(() => {
      const SVG = (window.GJ_ICON_CONTENT || {}).svg || {}, cache = {};
      const toData = name => cache[name] !== undefined ? cache[name] : (cache[name] = SVG[name] ? 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG[name]) + '")' : null);
      const swap = v => v.replace(/url\((['"]?)([^'")]*\/)?([^\/'")]+\.svg)\1\)/g, (m, q, dir, name) => toData(name) || m);
      const cssText = ((window.GJ_PREVIEW_DATA || {}).iconRules || []).map(r => r[1] + '{' + r[2] + ':' + swap(r[3]) + '}').join('\n');
      const fixEl = el => { const st = el.getAttribute && el.getAttribute('style'); if (st && st.indexOf('.svg') > -1) { const n = swap(st); if (n !== st) el.setAttribute('style', n); } };
      const scan = node => {
        if (!node || node.nodeType !== 1) return;
        fixEl(node); node.querySelectorAll('[style*=".svg"]').forEach(fixEl);
        if (node.tagName === 'IFRAME') watchFrame(node); node.querySelectorAll('iframe').forEach(watchFrame);
      };
      function fixDoc(d) {
        if (!d || !d.documentElement || d._gjFileIcons) return; d._gjFileIcons = true;
        const style = d.createElement('style'); style.dataset.gjFileIcons = '1'; style.textContent = cssText;
        (d.body || d.documentElement).appendChild(style); // 放在所有样式表之后，同优先级时覆盖原规则
        scan(d.documentElement);
        new MutationObserver(ms => ms.forEach(m => { if (m.type === 'attributes') fixEl(m.target); else m.addedNodes.forEach(scan); }))
          .observe(d.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
      }
      function watchFrame(f) {
        if (f._gjFileIcons) return; f._gjFileIcons = true;
        const go = () => { try { const d = f.contentDocument; if (d && d.readyState !== 'uninitialized' && d.body) fixDoc(d); } catch (e) { /* 跨域画框忽略 */ } };
        EventTarget.prototype.addEventListener.call(f, 'load', go); go();
      }
      const start = () => fixDoc(document);
      if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
    }).catch(() => { /* 图标数据缺失时保持原样 */ });
  }
  initFileIcons();

  window.GJPhone = { mount, swatch, ROOT, STYLES, upgradeControls };
})();
