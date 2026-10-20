#!/usr/bin/env python3
"""生成 preview/docs-controls.css：把基座里的表单类组件（选择器、多选框、单选框、开关、滑块、输入框、按钮、图标）
换算成 px，作用域限定在文档页交互演示的属性控制面板（.playground .controls）里使用。

文档页根字号是浏览器默认 16px，而基座按 375 基准 1rem = 100px 书写，所以不能直接在文档页里用 rem 版本；
这里按 1rem = 100px 把 rem 换成 px，并把 Token 里的 rem 值也换算后挂在作用域上，视觉与手机预览里一致。

用法（在 skill 根目录）：python3 scripts/build-docs-controls.py          生成
                      python3 scripts/build-docs-controls.py --check  只校验是否与当前基座一致（发布前必跑，不一致退出码 1）
基座或 Token 更新后重新运行，并同步 phone-stage.js 里 docs-controls.css 的版本号。
"""
import re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
COMP = ROOT / 'assets/styles/gj-b2b-mobile-components.css'
TOK = ROOT / 'assets/styles/gj-b2b-mobile-tokens.css'
OUT = ROOT / 'preview/docs-controls.css'
SCOPE = '.playground .controls'
PREFIXES = ('.gj-icon', '.gj-m-select', '.gj-m-checkbox', '.gj-m-radio', '.gj-m-switch', '.gj-m-slider', '.gj-m-input', '.gj-m-textarea', '.gj-m-button')

def rem2px(s):
    return re.sub(r'(-?\d*\.?\d+)rem\b', lambda m: (('%g' % (float(m.group(1)) * 100)) + 'px'), s)

def strip_comments(s):
    return re.sub(r'/\*.*?\*/', '', s, flags=re.S)

def top_rules(css):
    """把 CSS 拆成顶层块：返回 (prelude, body)；@media 的 body 再递归拆。"""
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: break
        pre = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        out.append((pre, css[j + 1:k - 1]))
        i = k
    return out

def scope_sel(sel):
    parts = [p.strip() for p in sel.split(',') if p.strip()]
    keep = [p for p in parts if any(x in p for x in PREFIXES)]
    return ', '.join(SCOPE + ' ' + p for p in keep)

def convert(css):
    res = []
    for pre, body in top_rules(css):
        if pre.startswith('@media') or pre.startswith('@supports'):
            inner = convert(body)
            if inner: res.append(pre + ' {\n' + inner + '\n}')
        elif pre.startswith('@'):
            continue
        else:
            sel = scope_sel(pre)
            if sel:
                body = rem2px(body).replace("url('../icons/", "url('../assets/icons/")
                res.append(sel + ' {' + body + '}')
    return '\n'.join(res)


EXTRA = """
/* —— 文档页适配（手写，生成脚本原样附加）—— */
.playground .controls .docs-ctl-select { position: relative; display: block; min-width: 0; }
.playground .controls .docs-ctl-select > select.gj-m-select { appearance: none; -webkit-appearance: none; display: block; padding-top: 0; padding-bottom: 0; padding-right: 32px; line-height: normal; text-overflow: ellipsis; }
.playground .controls .docs-ctl-select > select.gj-m-select:focus { outline: 0; --gj-m-select-bd: var(--ds-border-focused); }
.playground .controls .docs-ctl-select > select.gj-m-select:focus-visible { outline: 2px solid var(--ds-border-focused); outline-offset: 2px; }
.playground .controls .docs-ctl-select > .gj-m-select-arrow { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); padding: 0; pointer-events: none; }
.playground .controls .docs-ctl-select > .gj-m-select-arrow .gj-icon { width: 16px; height: 16px; color: var(--ds-text-tiatery); }
.playground .controls .docs-ctl-input > textarea { padding: 0; border: 0; background: transparent; outline: 0; height: auto; }
.playground .controls .docs-ctl-input > input { height: auto; padding: 0; border: 0; border-radius: 0; background: transparent; outline: 0; }
.playground .controls input.gj-m-slider { height: auto; padding: 0; border: 0; background: transparent; outline-offset: 4px; }
.playground .controls .docs-ctl-check { cursor: pointer; }
.playground .controls .gj-m-button { justify-self: start; }
"""

tok = strip_comments(TOK.read_text(encoding='utf-8'))
decls = []
for pre, body in top_rules(tok):
    if pre.strip() == ':root':
        for d in body.split(';'):
            d = d.strip()
            if d.startswith('--') and 'rem' in d:
                decls.append('  ' + rem2px(d) + ';')
comp = strip_comments(COMP.read_text(encoding='utf-8'))
out = ('/* 由 scripts/build-docs-controls.py 生成，请勿手改。属性控制面板使用基座组件（px 换算版，1rem = 100px）。 */\n'
       + SCOPE + ' {\n' + '\n'.join(decls) + '\n}\n' + convert(comp) + '\n' + EXTRA)
if '--check' in sys.argv:
    if not OUT.exists() or OUT.read_text(encoding='utf-8') != out:
        sys.exit('控制面板样式落后于基座：请运行 python3 scripts/build-docs-controls.py，并同步 phone-stage.js 里 docs-controls.css 的版本号')
    print('Verified', OUT.relative_to(ROOT))
else:
    OUT.write_text(out, encoding='utf-8')
    print(OUT, len(out), 'bytes,', len(decls), 'token decls')
