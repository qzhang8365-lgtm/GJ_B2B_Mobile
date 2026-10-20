/* 图标内嵌（原型用）：把 CSS 遮罩画的图标换成真正的 SVG，便于 Figma「网页导入」等工具识别为矢量图层。
 * 基座图标的写法是 span.gj-icon + 背景色 + mask:url(图标.svg)；导入工具不支持 CSS 遮罩，图标会丢失。
 * 本脚本读取页面内嵌的图标数据 window.GJ_M_ICONS（由 scripts/embed-icons.cjs 写入页面，双击打开也可用），然后：
 *   1. 元素自身用遮罩的图标（.gj-icon 等空元素）：内嵌 <svg fill="currentColor">，颜色继续跟随文字色，交互状态变化照常；
 *   2. 伪元素（::before / ::after）用遮罩的图标（选择器箭头、勾选、关闭等）：改为按当前颜色生成的 SVG 背景图；
 *   3. <img> 引用的 Skill 图片（文件图标、空状态、头像、Logo 等）：src 换成页面内的 data URL（window.GJ_M_ASSETS），导入工具读不到本地文件；
 * 页面内容变化（切换、弹层、重新渲染）后自动重新处理。不改变视觉，只改变图标的实现方式。 */
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
  var seq = 0, pending = false;
  var dataUrl = function (svg, color) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace(/currentColor/g, color)) + '")'; };

  function run() {
    pending = false;
    pseudo.textContent = ''; // 先恢复原遮罩，按当前状态重新读取伪元素颜色
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
      // 2. 伪元素
      for (var k = 0; k < 2; k++) {
        var p = k ? '::after' : '::before';
        var ps = getComputedStyle(el, p);
        if (ps.content === 'none' || ps.content === 'normal') continue;
        var pn = nameOf(ps.webkitMaskImage || ps.maskImage);
        if (!pn) continue;
        var id = el.getAttribute('data-gj-p');
        if (!id) { id = String(++seq); el.setAttribute('data-gj-p', id); }
        rules.push('[data-gj-p="' + id + '"]' + p + '{-webkit-mask:none!important;mask:none!important;background:' +
          dataUrl(I[pn], ps.backgroundColor) + ' center/contain no-repeat!important}');
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
  }
  function schedule() { if (!pending) { pending = true; (window.requestAnimationFrame || setTimeout)(run); } }
  var mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) { var t = list[i].target; if (t !== pseudo && t.parentNode !== pseudo) { schedule(); return; } }
  });
  function start() { run(); document.addEventListener('change', schedule, true); document.addEventListener('click', schedule, true); mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style', 'src', 'aria-checked', 'aria-pressed', 'aria-selected', 'aria-expanded', 'disabled', 'checked', 'open', 'hidden'] }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.GJInlineIcons = { refresh: run };
})();
