#!/usr/bin/env python3
"""打包移动端 Skill 发布包。

用法：python3 scripts/build-release.py 1.0.0
输出：dist/gj-b2b-mobile-design-skill-v<版本>.zip 与 dist/release.json

发布包只保留 AI 执行与人工验收所需的正式资产：
SKILL.md、package.json、README.md、references/、assets/、preview/、scripts/。
不包含端到端示例与过程文档（planning/ 全部，留在仓库与规范网站上）、临时目录（_to_delete）、dist 自身与系统文件，
以及核对截图：references/ 下的 *.png（如 tokens/browser-validation/、组件 preview.png）和 planning/ 下的截图（*.png / *.jpg 等，如 e2e/*-shots/）。
它们是验证记录，仓库保留、发布包不带。
另外不带：Token 浏览器核对记录（references/tokens/browser-validation/）、毛玻璃图标根目录旧版 PNG（页面只用 glassicon/png/）、图标字体的 .otf 与 demo.html。
"""
import json, os, sys, zipfile, datetime, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCLUDE = ['SKILL.md', 'package.json', 'README.md', 'references', 'assets', 'preview', 'scripts']
# 发布方式（与 PC 端一致）：仓库推到 GitHub，发布包手动上传为 Release 附件（标签 v<版本>），规范网站的下载按钮链到 Release 地址
REPO = 'qzhang8365-lgtm/GJ_B2B_Mobile'
PACKAGE_JS = os.path.join('preview', '_data', 'package.js')  # 仓库里为 e2e:true；发布包里替换为 e2e:false（包内不带端到端示例）
SKIP_NAMES = {'.DS_Store', '__pycache__', 'Thumbs.db', 'node_modules', '.git', '.update-check'}
NAME = 'gj-b2b-mobile-design-skill'


SHOT_EXT = ('.png', '.jpg', '.jpeg', '.gif', '.webp')


GLASS = os.path.join('assets', 'icons', 'glassicon') + os.sep
FONT = os.path.join('assets', 'icons', 'iconfont', 'font') + os.sep


def excluded(rel):
    low = rel.lower()
    if rel.startswith('references' + os.sep) and low.endswith('.png'):
        return True
    if rel.startswith(os.path.join('references', 'tokens', 'browser-validation') + os.sep):
        return True  # Token 浏览器核对记录，仓库保留、发布包不带
    # 毛玻璃图标：页面只引用 glassicon/png/ 下的高清 PNG（glass-manifest.json 的 png 字段），根目录旧版 PNG 禁止引用，不打包
    if rel.startswith(GLASS) and low.endswith('.png') and os.sep not in rel[len(GLASS):]:
        return True
    # 图标字体：CSS 依次引用 woff2 / woff / ttf，打包保留 woff2（浏览器、WebView）与 ttf（小程序兜底）；otf 与 demo.html 是设计端 / 字体工具产物
    if rel.startswith(FONT) and (low.endswith('.otf') or low.endswith('demo.html')):
        return True
    return rel.startswith('planning' + os.sep) and low.endswith(SHOT_EXT)  # 端到端核对截图（如 e2e/*-shots/），仓库保留、发布包不带


def files():
    for item in INCLUDE:
        path = os.path.join(ROOT, item)
        if os.path.isfile(path):
            yield item
            continue
        for d, dirs, fs in os.walk(path):
            dirs[:] = sorted(x for x in dirs if x not in SKIP_NAMES and not x.startswith('.'))
            for f in sorted(fs):
                if f in SKIP_NAMES or f.startswith('.'):
                    continue
                rel = os.path.relpath(os.path.join(d, f), ROOT)
                if rel != PACKAGE_JS and not excluded(rel):
                    yield rel


def write_release_js(info):
    path = os.path.join(ROOT, 'preview', '_data', 'release.js')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write('/* 由 scripts/build-release.py 生成，请勿手改；只供预览站总览页使用。 */\n')
        f.write('(window.GJ_PREVIEW_DATA = window.GJ_PREVIEW_DATA || {}).release = ' + json.dumps(info, ensure_ascii=False) + ';\n')


def main():
    if len(sys.argv) != 2:
        sys.exit('用法：python3 scripts/build-release.py <版本号，如 1.0.0>')
    ver = sys.argv[1].lstrip('v')
    with open(os.path.join(ROOT, 'package.json'), encoding='utf-8') as f:
        package_version = json.load(f)['version']
    import re
    if not re.fullmatch(r'(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})', ver) or ver != package_version:
        sys.exit('发布版本必须与 package.json 的 version 一致（X.Y.Z）')
    if not os.path.isfile(os.path.join(ROOT, 'scripts', 'check-update.sh')):
        sys.exit('缺少 scripts/check-update.sh')
    dist = os.path.join(ROOT, 'dist')
    os.makedirs(dist, exist_ok=True)
    zname = f'{NAME}-v{ver}.zip'
    top = f'{NAME}-v{ver}'
    # 预览数据必须与数据源一致、预览站不能用 fetch（file:// 打开会空白）
    # 统一来源校验：控制面板样式 = 基座换算、组件写法 markup = 模板、预览数据 = JSON（且预览站不用 fetch）
    subprocess.run([sys.executable, os.path.join(ROOT, 'scripts', 'build-docs-controls.py'), '--check'], check=True)
    subprocess.run(['node', os.path.join(ROOT, 'scripts', 'build-markup.cjs'), '--check'], check=True)
    subprocess.run([sys.executable, os.path.join(ROOT, 'scripts', 'build-preview-data.py'), '--check'], check=True)
    # 预览展示与生成同一来源（page-rules PR-025）：需要 Playwright；未安装时提示，不阻断打包
    r = subprocess.run(['node', os.path.join(ROOT, 'scripts', 'check-preview-source.cjs')])
    if r.returncode == 1:
        sys.exit('预览站示例存在改写基座 / 自己画的组件，见上方清单（page-rules PR-025）')
    if r.returncode == 2:
        print('提示：未安装 Playwright，跳过预览站来源检查（node scripts/check-preview-source.cjs）')
    # 发布包里的总览页读 preview/_data/release.js（file:// 也能读）；体积打包后才知道，先写其余信息
    url = f'https://github.com/{REPO}/releases/download/v{ver}/{zname}'
    write_release_js({'version': ver, 'file': zname, 'url': url, 'built': datetime.date.today().isoformat()})
    n = 0
    with zipfile.ZipFile(os.path.join(dist, zname), 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in files():
            z.write(os.path.join(ROOT, rel), f'{top}/{rel}')
            n += 1
        z.writestr(f'{top}/{PACKAGE_JS}', '/* 发布包标记：包内不带端到端示例（planning/e2e 在仓库与规范网站上）。 */\n(window.GJ_PREVIEW_DATA = window.GJ_PREVIEW_DATA || {}).package = {"e2e": false};\n')
        n += 1
    size = os.path.getsize(os.path.join(dist, zname))
    info = {'version': ver, 'file': zname, 'url': url, 'tag': f'v{ver}', 'files': n, 'bytes': size,
            'built': datetime.date.today().isoformat(), 'include': INCLUDE}
    with open(os.path.join(dist, 'release.json'), 'w', encoding='utf-8') as f:
        json.dump(info, f, ensure_ascii=False, indent=2)
    write_release_js(info)
    print(f'{zname}: {n} 个文件，{size / 1024 / 1024:.1f} MB')
    print(f'发布：在 GitHub 新建 Release，标签 v{ver}，上传 dist/{zname}；下载地址 {url}')


if __name__ == '__main__':
    main()
