/* 图标内嵌（原型用）：把 CSS 遮罩画的图标换成真正的 SVG，便于 Figma「网页导入」等工具识别为矢量图层。
 * 基座图标的写法是 span.gj-icon + 背景色 + mask:url(图标.svg)；导入工具不支持 CSS 遮罩，图标会丢失。
 * 本脚本读取页面内嵌的图标数据 window.GJ_M_ICONS（由 scripts/embed-icons.cjs 写入页面，双击打开也可用），然后：
 *   1. 元素自身用遮罩的图标（.gj-icon 等空元素）：内嵌 <svg fill="currentColor">，颜色继续跟随文字色，交互状态变化照常；
 *   2. 伪元素（::before / ::after）用遮罩的图标（选择器箭头、勾选、关闭等）：改为按当前颜色生成的 SVG 背景图；
 *   3. <img> 引用的 Skill 图片（文件图标、空状态、头像、Logo 等）：src 换成页面内的 data URL（window.GJ_M_ASSETS），导入工具读不到本地文件；
 *   4. 描边：基座用内阴影画 1px 描边与分割线（box-shadow: inset 0 0 0 1px / inset 0 -1px 0，不占布局），导入工具会丢掉；
 *      改为等宽的 border，并从同侧内边距里扣掉同样宽度（内边距不够时固定为原尺寸），元素尺寸与内容位置不变（元素与伪元素都处理，状态变化后按当前颜色重算）；
 *   5. 手机状态栏（window.GJ_M_STATUSBAR，embed-icons.cjs 默认写入）：页面顶部加 44 高的系统状态栏示意（9:41、信号、电池），吸顶，
 *      背景取顶部导航的颜色；页面里吸顶的导航 / 页签等下移 44，滚动时停在状态栏下方。真实 H5 由系统提供状态栏，交付代码时用 --no-statusbar 去掉。
 * 页面内容变化（切换、弹层、重新渲染）后自动重新处理。除状态栏外不改变视觉，只改变实现方式。 */
(function () {
  var I = window.GJ_M_ICONS;
  if (!I || typeof document === 'undefined') return;
  var NAME = /(icf_[\w.-]+?)\.svg/;
  var nameOf = function (v) { var m = NAME.exec(v || ''); return m && I[m[1]] ? m[1] : null; };
  var base = document.createElement('style');
  base.textContent = '.gj-inline-icon{background:none!important;-webkit-mask:none!important;mask:none!important}' +
    '.gj-inline-icon>svg{display:block;width:100%;height:100%;pointer-events:none}';
  var pseudo = document.createElement('style');
  pseudo.setAttribute('data-gj-inline', 'pseudo');
  document.head.appendChild(base);
  document.head.appendChild(pseudo);
  var seq = 0, pending = false, mo = null;
  /* —— 手机状态栏 —— */
  var SB = window.GJ_M_STATUSBAR, SBH = 44, bar = null;
  if (SB) base.textContent += '.gj-m-statusbar{position:sticky;top:0;z-index:1000;height:' + SBH + 'px;background:#fff no-repeat left center/auto 100%;pointer-events:none}';
  function statusbar() {
    if (!SB || !document.body) return;
    if (!bar || !bar.isConnected) {
      bar = document.querySelector('.gj-m-statusbar');
      if (!bar) { bar = document.createElement('div'); bar.className = 'gj-m-statusbar'; bar.setAttribute('aria-hidden', 'true'); document.body.insertBefore(bar, document.body.firstChild); }
      bar.style.backgroundImage = 'url("' + SB + '")';
    }
    /* 背景取状态栏下方第一个有底色的元素（一般是顶部导航） */
    var r = bar.getBoundingClientRect(), el = document.elementFromPoint(Math.max(1, r.width / 2), SBH + 2), bg = '';
    while (el && el !== document.documentElement) { var c = getComputedStyle(el).backgroundColor; if (c && alpha(c) > 0) { bg = c; break; } el = el.parentElement; }
    bar.style.backgroundColor = bg || '#fff';
  }
  var stuck = [];
  function restoreSticky() { stuck.forEach(function (t) { if (t.v) t.el.style.setProperty('top', t.v[0], t.v[1]); else t.el.style.removeProperty('top'); }); stuck = []; }
  function offsetSticky(el, cs) {
    if (!SB || el === bar) return;
    var fixedTop = cs.position === 'fixed' && cs.bottom === 'auto' && el.offsetHeight < innerHeight / 2;
    if (cs.position !== 'sticky' && !fixedTop) return;
    var t = parseFloat(cs.top); if (isNaN(t) || t >= SBH) return;
    var v = el.style.getPropertyValue('top'); stuck.push({ el: el, v: v ? [v, el.style.getPropertyPriority('top')] : null });
    el.style.setProperty('top', (t + SBH) + 'px', 'important');
  }
  var dataUrl = function (svg, color) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace(/currentColor/g, color)) + '")'; };

  /* —— 描边：内阴影 → border —— */
  var SIDES = ['top', 'right', 'bottom', 'left'];
  function splitShadows(v) { var out = [], d = 0, cur = ''; for (var i = 0; i < v.length; i++) { var c = v[i]; if (c === '(') d++; if (c === ')') d--; if (c === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += c; } if (cur.trim()) out.push(cur.trim()); return out; }
  function fade(color, k) { var m = /rgba?\(([^)]+)\)/.exec(color); if (!m) return color; var p = m[1].split(/[\s,\/]+/).filter(Boolean); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + ((p.length > 3 ? parseFloat(p[3]) : 1) * k).toFixed(3) + ')'; }
  function alpha(color) { var m = /rgba?\(([^)]+)\)/.exec(color); if (!m) return 1; var p = m[1].split(/[\s,\/]+/).filter(Boolean); return p.length > 3 ? parseFloat(p[3]) : 1; }
  /* 返回 {sides:{top:[w,color]…}, rest:'剩余阴影'}；只转换无模糊的内阴影描边 / 单边线 */
  function parseInset(v, cs) {
    if (!v || v === 'none' || v.indexOf('inset') < 0) return null;
    var sides = {}, rest = [], any = false;
    splitShadows(v).forEach(function (sh) {
      var color = (/(rgba?\([^)]*\)|#[0-9a-f]+|transparent)/i.exec(sh) || [''])[0];
      var n = (sh.replace(color, '').match(/-?[\d.]+px/g) || []).map(parseFloat);
      var ok = /inset/.test(sh) && n.length >= 3 && !n[2] && color && alpha(color) > 0, side = null, w = 0;
      if (ok) {
        var x = n[0], y = n[1], sp = n[3] || 0;
        if (!x && !y && sp > 0) { side = 'all'; w = sp; }
        else if (!sp && !x && y) { side = y < 0 ? 'bottom' : 'top'; w = Math.abs(y); }
        else if (!sp && x && !y) { side = x < 0 ? 'right' : 'left'; w = Math.abs(x); }
      }
      if (side && w < 1) { color = fade(color, w); w = 1; }
      var list = side === 'all' ? SIDES : side ? [side] : [];
      var free = list.length && list.every(function (sd) { return !sides[sd] && (!cs || !parseFloat(cs['border-' + sd + '-width'] || cs.getPropertyValue('border-' + sd + '-width'))); });
      if (free) { list.forEach(function (sd) { sides[sd] = [w, color]; }); any = true; } else rest.push(sh);
    });
    return any ? { sides: sides, rest: rest.length ? rest.join(', ') : 'none' } : null;
  }
  var touched = [];
  function restoreBorders() { touched.forEach(function (t) { for (var k in t.s) { if (t.s[k]) t.el.style.setProperty(k, t.s[k][0], t.s[k][1]); else t.el.style.removeProperty(k); } }); touched = []; }
  function convertBorder(el, cs) {
    var r = parseInset(cs.boxShadow, cs); if (!r) return;
    var save = {}, keep = function (k) { if (!(k in save)) { var v = el.style.getPropertyValue(k); save[k] = v ? [v, el.style.getPropertyPriority(k)] : null; } };
    var h0 = el.offsetHeight, w0 = el.offsetWidth;
    keep('box-shadow'); el.style.setProperty('box-shadow', r.rest, 'important');
    for (var sd in r.sides) {
      var w = r.sides[sd][0], pad = parseFloat(cs.getPropertyValue('padding-' + sd)) || 0;
      keep('border-' + sd); keep('padding-' + sd);
      el.style.setProperty('border-' + sd, w + 'px solid ' + r.sides[sd][1], 'important');
      el.style.setProperty('padding-' + sd, Math.max(0, pad - w) + 'px', 'important');
    }
    /* 内边距不够扣（如页签栏底边线、内边距为 0）时元素会变大：固定为原尺寸（border-box），线留在原位置，相邻元素不动 */
    var dh = el.offsetHeight - h0, dw = el.offsetWidth - w0;
    if ((dh > 0.01 || dw > 0.01) && cs.display.indexOf('inline') !== 0) {
      keep('box-sizing'); el.style.setProperty('box-sizing', 'border-box', 'important');
      if (dh > 0.01) { keep('height'); el.style.setProperty('height', el.getBoundingClientRect().height - dh + 'px', 'important'); }
      if (dw > 0.01) { keep('width'); el.style.setProperty('width', el.getBoundingClientRect().width - dw + 'px', 'important'); }
    }
    touched.push({ el: el, s: save });
  }
  function pseudoBorder(sel, ps) {
    var r = parseInset(ps.boxShadow, ps); if (!r) return '';
    var css = 'box-shadow:' + r.rest + '!important;box-sizing:border-box!important;';
    for (var sd in r.sides) css += 'border-' + sd + ':' + r.sides[sd][0] + 'px solid ' + r.sides[sd][1] + '!important;';
    return sel + '{' + css + '}';
  }

  function run() {
    pending = false;
    pseudo.textContent = ''; // 先恢复原遮罩，按当前状态重新读取伪元素颜色
    restoreBorders(); // 先恢复原描边写法，按当前状态重新读取
    restoreSticky();
    statusbar();
    var rules = [];
    var all = document.body ? document.body.getElementsByTagName('*') : [];
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.namespaceURI === 'http://www.w3.org/2000/svg') continue;
      var cs = getComputedStyle(el);
      // 1. 元素自身：优先读 --gj-icon（内嵌后遮罩已去掉，变量仍在），否则读 mask-image
      var n = nameOf(cs.getPropertyValue('--gj-icon')) || nameOf(cs.webkitMaskImage || cs.maskImage);
      if (n && (el.classList.contains('gj-inline-icon') || !el.children.length)) {
        if (el.getAttribute('data-gj-icon') !== n) {
          el.innerHTML = I[n];
          el.setAttribute('data-gj-icon', n);
          el.classList.add('gj-inline-icon');
        }
      }
      convertBorder(el, cs);
      offsetSticky(el, cs);
      // 2. 伪元素
      for (var k = 0; k < 2; k++) {
        var p = k ? '::after' : '::before';
        var ps = getComputedStyle(el, p);
        if (ps.content === 'none' || ps.content === 'normal') continue;
        var pn = nameOf(ps.webkitMaskImage || ps.maskImage);
        var hasBd = ps.boxShadow && ps.boxShadow.indexOf('inset') >= 0;
        if (!pn && !hasBd) continue;
        var id = el.getAttribute('data-gj-p');
        if (!id) { id = String(++seq); el.setAttribute('data-gj-p', id); }
        var sel = '[data-gj-p="' + id + '"]' + p;
        if (pn) rules.push(sel + '{-webkit-mask:none!important;mask:none!important;background:' +
          dataUrl(I[pn], ps.backgroundColor) + ' center/contain no-repeat!important}');
        if (hasBd) { var pb = pseudoBorder(sel, ps); if (pb) rules.push(pb); }
      }
    }
    var A = window.GJ_M_ASSETS;
    if (A) {
      var imgs = document.images;
      for (var j = 0; j < imgs.length; j++) {
        var src = imgs[j].getAttribute('src') || '';
        if (src.indexOf('data:') === 0) continue;
        var m = /assets\/((?:icons|images)\/[^?#]+)/.exec(src);
        if (m && A[m[1]]) { imgs[j].setAttribute('data-gj-src', src); imgs[j].setAttribute('src', A[m[1]]); }
      }
    }
    var css = rules.join('\n');
    if (pseudo.textContent !== css) pseudo.textContent = css;
    if (mo) mo.takeRecords(); // 丢弃本次处理自身引起的变动，避免循环
  }
  function schedule() { if (!pending) { pending = true; (window.requestAnimationFrame || setTimeout)(run); } }
  mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) { var t = list[i].target; if (t !== pseudo && t.parentNode !== pseudo) { schedule(); return; } }
  });
  function start() { run(); document.addEventListener('change', schedule, true); document.addEventListener('click', schedule, true); mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'src', 'aria-checked', 'aria-pressed', 'aria-selected', 'aria-expanded', 'disabled', 'checked', 'open', 'hidden'] }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.GJInlineIcons = { refresh: run };
})();
