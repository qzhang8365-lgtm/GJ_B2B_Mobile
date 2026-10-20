#!/usr/bin/env python3
"""生成预览站数据脚本（preview/_data/*.js），让预览页不依赖 fetch。

为什么：浏览器禁止 file:// 页面用 fetch / XHR 读本地文件，双击打开预览站时依赖 fetch 的页面会空白。
预览站统一用 <script> 引入数据（与 assets/scripts/gj-m-templates.js 同一机制）。JSON 仍是唯一数据源，本脚本只做转换。

输出：
  preview/_data/tokens.js     ← references/tokens/gj-b2b-mobile.tokens.json（去掉页面用不到的 Figma 溯源字段）
  preview/_data/divider.js    ← references/components/divider/source.json（只保留变体树）
  preview/_data/motion.js     ← assets/icons/animation/*.json（动效图标 Lottie 数据，图标页播放用 animationData，不走 lottie 的 path 加载）
  preview/_data/icon-rules.js ← 基座 CSS / 控制面板 CSS 中用 url(*.svg) 写的图标规则（file:// 下改用内嵌 SVG，见 phone-stage.js）
用法：python3 scripts/build-preview-data.py          生成
      python3 scripts/build-preview-data.py --check  校验产物与数据源一致、预览站没有 fetch / XHR（发布前必跑）
这些文件只供预览站使用，生成页面时不要读取。
"""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1]
DROP = {'figmaId', 'figmaKey', 'source', 'publication', 'scope'}
HEAD = '/* 由 scripts/build-preview-data.py 生成，请勿手改；只供预览站使用，生成页面时不要读取。 */\n'


def strip(o):
    if isinstance(o, dict):
        return {k: strip(v) for k, v in o.items() if k not in DROP}
    if isinstance(o, list):
        return [strip(v) for v in o]
    return o


def js(name, data):
    return HEAD + '(window.GJ_PREVIEW_DATA = window.GJ_PREVIEW_DATA || {})[' + json.dumps(name) + '] = ' + \
        json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'


def icon_rules():
    """CSS 中 url(...xxx.svg) 的声明：[样式表, 选择器, 属性, 原值, 图标文件名]。"""
    out = []
    for key, path in (('components', 'assets/styles/gj-b2b-mobile-components.css'), ('controls', 'preview/docs-controls.css')):
        css = re.sub(r'/\*.*?\*/', '', (ROOT / path).read_text(), flags=re.S)
        for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
            for prop, val in re.findall(r'([-\w]+)\s*:\s*([^;]*url\([^)]*\.svg[^)]*\)[^;]*)', body):
                m = re.search(r"url\(['\"]?[^'\")]*/([^/'\")]+\.svg)['\"]?\)", val)
                if m:
                    out.append([key, ' '.join(sel.split()), prop, val.strip(), m.group(1)])
    return out


def build():
    tokens = json.loads((ROOT / 'references/tokens/gj-b2b-mobile.tokens.json').read_text())
    tokens = strip({k: v for k, v in tokens.items() if k not in ('$schema', 'meta')})
    divider = json.loads((ROOT / 'references/components/divider/source.json').read_text())
    return {
        'preview/_data/tokens.js': js('tokens', tokens),
        'preview/_data/divider.js': js('divider', {'tree': {'children': divider['tree']['children']}}),
        'preview/_data/icon-rules.js': js('iconRules', icon_rules()),
        'preview/_data/motion.js': js('motion', {p.name: json.loads(p.read_text()) for p in sorted((ROOT / 'assets/icons/animation').glob('*.json'))}),
    }


def fetch_users():
    bad = []
    for p in sorted((ROOT / 'preview').rglob('*')):
        if p.suffix in ('.html', '.js') and '_data' not in p.parts and re.search(r'\bfetch\s*\(|XMLHttpRequest', p.read_text(errors='ignore')):
            bad.append(str(p.relative_to(ROOT)))
    return bad


if __name__ == '__main__':
    outputs = build()
    check = '--check' in sys.argv
    for path, text in outputs.items():
        t = ROOT / path
        if check:
            assert t.exists() and t.read_text() == text, '预览数据已过期，请运行 python3 scripts/build-preview-data.py：' + path
        else:
            t.parent.mkdir(parents=True, exist_ok=True)
            t.write_text(text)
    bad = fetch_users()
    if check:
        assert not bad, '预览站不得用 fetch / XHR 读本地文件（file:// 打开会失败），改用 preview/_data 下的数据脚本：' + ', '.join(bad)
    print(('Verified ' if check else 'Built ') + ', '.join(f'{p} ({len(t)//1024} KB)' for p, t in outputs.items()))
    if bad and not check:
        print('仍在使用 fetch / XHR：' + ', '.join(bad))
