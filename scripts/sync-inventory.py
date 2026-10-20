#!/usr/bin/env python3
"""用各组件 audit.md 的未关闭项重新生成 references/components/inventory.json 里的 status.pending，
并按各组件 mapping.json 同步 pageRules。

用法（在 skill 根目录）：python3 scripts/sync-inventory.py
- 审计行以 `| 编号 状态 | 问题 | 处理 |` 记录；第一格含“已关闭 / 已修复 / 已定 / ✅”等字样视为关闭。
- 未关闭项按第一格标记分三类：⏸ / 不处理 → 暂不处理；部分 → 部分修复；其余 → 待确认。
- previewVerified 不在此处自动改动，需实际在 375 / 320 下核对后手工更新。
"""
import json, os, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent / 'references/components'
CLOSED = re.compile(r"已关闭|已修复|已定|已处理|closed|✅|已确认|已解决|已完成|已同步|已按|不需处理|无需处理")
ROW = re.compile(r"^\|\s*([A-Z]{1,5}-M-\d+)([^|]*)\|([^|]*)\|")
inv_path = ROOT / 'inventory.json'
inv = json.loads(inv_path.read_text(encoding='utf-8'))
changed = []
for c in inv['components']:
    d = (c.get('dir') or '').strip('/')
    audit = ROOT / d / 'audit.md'
    if not d or not audit.is_file():
        continue
    pend, seen = [], set()
    for line in audit.read_text(encoding='utf-8').splitlines():
        m = ROW.match(line)
        if not m or m.group(1) in seen or CLOSED.search(m.group(2)):
            continue
        seen.add(m.group(1))
        lab = m.group(2)
        tag = '暂不处理' if ('⏸' in lab or '不处理' in lab) else ('部分修复' if '部分' in lab else '待确认')
        desc = re.sub(r'\s+', ' ', m.group(3).strip())[:60]
        pend.append('%s（%s）：%s' % (m.group(1), tag, desc))
    st = c.setdefault('status', {})
    if st.get('pending') != pend:
        changed.append(f"{c['id']}: {len(st.get('pending', []))} -> {len(pend)}")
        st['pending'] = pend
# 同步 pageRules：以各组件 mapping.json 的 pageRules 为准
for c in inv['components']:
    mp = ROOT / (c.get('dir') or '').strip('/') / 'mapping.json'
    if c.get('dir') and mp.is_file():
        pr = sorted((json.loads(mp.read_text(encoding='utf-8')).get('pageRules') or {}).keys())
        if pr != c.get('pageRules', []):
            changed.append(f"{c['id']}: pageRules -> {pr}")
            if pr: c['pageRules'] = pr
            else: c.pop('pageRules', None)
inv_path.write_text(json.dumps(inv, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('\n'.join(changed) or '无变化')
