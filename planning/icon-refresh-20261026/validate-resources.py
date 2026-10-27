from pathlib import Path
import json,re,subprocess,hashlib,io,collections
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
ROOT=Path(__file__).resolve().parents[2]
def js_obj(text,var):
 payload=text.split('window.'+var,1)[1].split('=',1)[1].lstrip();payload=re.sub(r'(?m)^(\s*)(line|fill):',r'\1"\2":',payload);return json.JSONDecoder().raw_decode(payload)[0]
results=[]
for root in [ROOT,ROOT.parent/'国金B端设计skill（PC）']:
 manifest=json.loads((root/'references/icons/manifest.json').read_text());icons=manifest['icons'];mapping=js_obj((root/'assets/icons/iconfont/font/iconfont-map.js').read_text(),'ICONFONT_MAP')
 oldmap=js_obj(subprocess.check_output(['git','show','HEAD:assets/icons/iconfont/font/iconfont-map.js'],cwd=root,text=True),'ICONFONT_MAP')
 assert len(icons)==382 and collections.Counter(i['style'] for i in icons)=={'line':240,'fill':142}
 for style,entries in oldmap.items():
  for n,fields in entries.items():assert fields==mapping[style][n],n
 for ext in ['ttf','otf','woff','woff2']:
  for style,entries in mapping.items():
   f=TTFont(root/f'assets/icons/iconfont/font/{style}/GJB2B_general_{style}.{ext}');cm=f.getBestCmap()
   assert {int(i['unicode'][2:],16) for i in entries.values()}<=set(cm)
   assert any(n.toUnicode()=='GJB2B_general_'+style for n in f['name'].names if n.nameID==1)
 # F080 old SVG and font outlines remain exact, including its COLR layers.
 assert (root/'assets/icons/iconfont/icf_system_delete-fill.svg').read_bytes()==subprocess.check_output(['git','show','HEAD:assets/icons/iconfont/icf_system_delete-fill.svg'],cwd=root)
 def glyph_record(f):
  n=f.getBestCmap()[0xF080];gs=f.getGlyphSet();p=RecordingPen();gs[n].draw(p);layers=[]
  if 'COLR' in f:
   for layer in f['COLR'].ColorLayers.get(n,[]):
    pen=RecordingPen();gs[layer.name].draw(pen);layers.append((pen.value,layer.colorID))
  return p.value,layers
 for ext in ['ttf','otf','woff','woff2']:
  old=TTFont(io.BytesIO(subprocess.check_output(['git','show',f'HEAD:assets/icons/iconfont/font/fill/GJB2B_general_fill.{ext}'],cwd=root)))
  assert glyph_record(old)==glyph_record(TTFont(root/f'assets/icons/iconfont/font/fill/GJB2B_general_fill.{ext}'))
 cache=js_obj((root/'assets/icons/icon-content.js').read_text(),'GJ_ICON_CONTENT') if (root/'assets/icons/icon-content.js').exists() else json.loads((root/'assets/icons/icon-content.json').read_text())
 for i in icons:assert cache['svg'][Path(i['file']).name]==(root/'assets/icons'/i['file']).read_text()
 sm=json.loads((root/'references/icons/system-manifest.json').read_text());byname={i['name']:i for i in icons}
 for i in sm['icons']:assert (root/'assets/icons/general'/i['file']).read_bytes()==(root/'assets/icons'/byname[i['compiledName']]['file']).read_bytes()
 aliases={'icf_system_code_regular':'icf_system_code-regular','icf_system_delete_back':'icf_system_delete-back','icf_system_delete_back-fill':'icf_system_delete-back-fill'}
 cat=(root/'assets/icons/iconfont/all-icons.js').read_text();mp=(root/'assets/icons/iconfont/font/iconfont-map.js').read_text()
 for k,v in aliases.items():assert k in cat and v in cat and k in mp
 results.append({'platform':root.name,'icons':382,'line':240,'fill':142,'existingMappingEntriesPreserved':sum(map(len,oldmap.values())),'fontFormatsChecked':8,'F080':{'svg':'byte-identical to HEAD','glyphAndColorLayers':'same outlines in all four formats'},'sourceMirrors':len(sm['icons']),'cacheMatchesCanonical':True,'compatibilityAliasesPreserved':True})
# Both platforms really use the same SVG and binary fonts, not just equal counts.
other=ROOT.parent/'国金B端设计skill（PC）'
for i in json.loads((ROOT/'references/icons/manifest.json').read_text())['icons']:assert (ROOT/'assets/icons'/i['file']).read_bytes()==(other/'assets/icons'/i['file']).read_bytes()
for style in ['line','fill']:
 for ext in ['ttf','otf','woff','woff2']:
  p=Path(f'assets/icons/iconfont/font/{style}/GJB2B_general_{style}.{ext}');assert (ROOT/p).read_bytes()==(other/p).read_bytes()
(ROOT/'planning/icon-refresh-20261026/resource-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n');print(json.dumps(results,ensure_ascii=False,indent=2))
