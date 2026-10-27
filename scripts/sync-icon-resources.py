#!/usr/bin/env python3
"""Generate icon delivery caches from the sole canonical manifest and existing font map.
Usage: python3 scripts/sync-icon-resources.py [--root PATH] [--check]
Preserves names, filenames, Unicode, CSS classes and compatibility aliases.
"""
import argparse,collections,hashlib,json,pathlib,re,subprocess
p=argparse.ArgumentParser();p.add_argument('--root',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]);p.add_argument('--check',action='store_true');args=p.parse_args();root=args.root.resolve()
def readjs(path,var):
 code=(root/path).read_text();s=code.index('=',code.index('window.'+var))+1
 payload=re.sub(r'(?m)^(\s*)(line|fill):', r'\1"\2":',code[s:].lstrip())
 return json.JSONDecoder().raw_decode(payload)[0]
def emit(path,text):
 dst=root/path
 if args.check:assert dst.exists() and dst.read_text()==text,'Stale: '+str(path)
 elif not dst.exists() or dst.read_text()!=text:dst.parent.mkdir(parents=True,exist_ok=True);dst.write_text(text)
manifest=json.loads((root/'references/icons/manifest.json').read_text());icons=manifest['icons'];font=readjs('assets/icons/iconfont/font/iconfont-map.js','ICONFONT_MAP')
assert len(icons)==manifest['count']
assert collections.Counter(x['style'] for x in icons)=={style:len(entries) for style,entries in font.items()}
assert len({i['name'] for i in icons})==len(icons)
for i in icons:
 assert i['name'] in font[i['style']],i['name']
 assert (root/'assets/icons'/i['file']).is_file()
 assert font[i['style']][i['name']]['unicode']=='U+'+font[i['style']][i['name']]['codepoint'].lstrip('\\')
assert font['fill']['icf_system_delete-fill']['codepoint']=='F080'
# Keep historical runtime alias tables intact, separate from the canonical list.
old=(root/'assets/icons/iconfont/all-icons.js').read_text();alias=old[old.index('// Search may accept'): ] if '// Search may accept' in old else old[old.index('window.ICON_NAME_ALIASES'):]
rows=[[i['name'],i['category'],i['style'],pathlib.Path(i['file']).name,i['keywords']] for i in icons]
emit('assets/icons/iconfont/all-icons.js','window.ALL_ICONS='+json.dumps(rows,ensure_ascii=False,indent=1)+';\n\n'+alias)
# Refresh source-audit mirrors, preserving old filenames and source aliases.
sp=root/'references/icons/system-manifest.json';sm=json.loads(sp.read_text());byname={i['name']:i for i in icons}
for key in ['login','logout']:
 name='system/icon-'+key
 if not any(x['name']==name for x in sm['icons']):sm['icons'].append({'name':name,'category':'System','style':'line','file':name+'.svg','keywords':[key],'role':'compiled-resource-mirror'})
for i in sm['icons']:
 base=pathlib.Path(i['file']).stem.removeprefix('icon-')
 canonical='icf_system_'+base
 if base in ['attachment','link-line']:canonical='icf_file_'+base
 if base=='safe-flash-lineh-fill':canonical='icf_system_safe-flash-fill'
 assert canonical in byname,canonical
 i['compiledName']=canonical;i['style']=byname[canonical]['style']
 for field in ['sourceNodeId','sourceVerifiedOn']:
  if field in byname[canonical]:i[field]=byname[canonical][field]
  else:i.pop(field,None)
 emit(pathlib.Path('assets/icons/general')/i['file'],(root/'assets/icons'/byname[canonical]['file']).read_text())
sm['count']=len(sm['icons']);sm['relationship']['role']='derived-svg-audit-mirror';sm['relationship']['verification']={'sourceCount':len(sm['icons']),'compiledSystemCount':sum(i['category']=='System' for i in icons),'byteIdenticalSvgCount':sum(byname[i['compiledName']]['category']=='System' for i in sm['icons']),'categoryReassignments':['system/icon-attachment.svg → File/icf_file_attachment','system/link-line.svg → File/icf_file_link-line'],'note':'Derived audit mirror synchronized 2026-10-26 from current canonical SVG. Includes 2 File-class aliases; not an independent selectable catalog or original Figma export. Existing source filenames preserved.'}
emit('references/icons/system-manifest.json',json.dumps(sm,ensure_ascii=False,indent=2)+'\n')
emit('assets/icons/general/system-icons.js','window.SYSTEM_ICONS='+json.dumps(sm['icons'],ensure_ascii=False,separators=(',',':'))+';\n')
# Source text for copy/download uses the exact canonical SVG; retain other catalogs.
cachejs=root/'assets/icons/icon-content.js';cachejson=root/'assets/icons/icon-content.json'
cache=readjs('assets/icons/icon-content.js','GJ_ICON_CONTENT') if cachejs.exists() else json.loads(cachejson.read_text())
for i in icons:cache['svg'][pathlib.Path(i['file']).name]=(root/'assets/icons'/i['file']).read_text()
for i in sm['icons']:
 name=pathlib.Path(i['file']).name
 if name in cache['svg']:cache['svg'][name]=(root/'assets/icons/general'/i['file']).read_text()
if cachejs.exists():emit('assets/icons/icon-content.js','/* Generated from canonical icon manifest; exact SVG text for copy/download. */\nwindow.GJ_ICON_CONTENT = '+json.dumps(cache,ensure_ascii=False,separators=(',',':'))+';\n')
if cachejson.exists():emit('assets/icons/icon-content.json',json.dumps(cache,ensure_ascii=False,separators=(',',':'))+'\n')
# Version font binary URLs too: changing only the CSS URL does not invalidate its font cache.
for style in ['line','fill']:
 path=pathlib.Path('assets/icons/iconfont/font')/('gj-icon-'+style+'.css');css=(root/path).read_text()
 def fonturl(m):
  file=m[1];h=hashlib.sha256((root/'assets/icons/iconfont/font'/file).read_bytes()).hexdigest()[:12];return 'url("'+file+'?v='+h+'")'
 css=re.sub(r'url\("([^"?]+\.(?:woff2?|ttf))(?:\?[^\"]*)?"\)',fonturl,css);emit(path,css)
rev=hashlib.sha256(''.join((root/'assets/icons'/i['file']).read_text() for i in icons).encode()).hexdigest()[:12]
print(json.dumps({'root':str(root),'count':len(icons),'styles':dict(collections.Counter(i['style'] for i in icons)),'revision':rev,'auditMirrors':len(sm['icons']),'check':args.check},ensure_ascii=False))
