#!/usr/bin/env python3
"""Compile the mobile extraction only. No PC inputs or third-party dependencies."""
import json, re, hashlib, sys
from pathlib import Path
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
FILES={k:f'references/tokens/{k}.json' for k in ('colors','dimensions','controls','typography','styles')}
FILES['spacingSemantic']='references/tokens/spacing-semantic.json'
def number(v): return format(v,'.10g')
def rem(v): return number(v/100)+'rem'
def slug(v): return re.sub(r'-+','-',re.sub(r'[^a-z0-9-]', '-',v.lower())).strip('-')
def rgba(c): return 'rgba('+', '.join(number(c[k]*255) for k in ('r','g','b'))+', '+number(c.get('a',1))+')'
def build():
 data={k:json.loads((ROOT/p).read_text()) for k,p in FILES.items()}
 variables={}; classes=['.gj-mobile-input-text { font-family: var(--ds-font-family-ui); font-size: 0.16rem; font-size: max(0.16rem, 16px); }', '.gj-mobile-tabular-nums { font-variant-numeric: tabular-nums; }']
 def emit(name,value):
  if name in variables: raise ValueError('CSS name collision: '+name)
  variables[name]=value; return name
 def index(items):
  result={}
  for s in items:
   if s['name'] in result: raise ValueError('Duplicate source name: '+s['name'])
   result[s['name']]=s
  return result
 colors=index(data['colors']['colors']); color={'primitive':{},'semantic':{}}
 def resolve(name,seen=()):
  if name in seen: raise ValueError('Alias cycle: '+name)
  s=colors[name]
  return resolve(s['aliasOf'],(*seen,name)) if s.get('aliasOf') else s.get('rawValue',s['value'])
 for name,s in colors.items():
  resolved=resolve(name)
  var='--ds-'+slug(name)
  value='var(--ds-'+slug(s['aliasOf'])+')' if s.get('aliasOf') else rgba(resolved) if isinstance(resolved,dict) else resolved
  color['primitive' if name.startswith('Primitive/') else 'semantic'][name]={**s,'resolvedValue':resolved,'cssVariable':emit(var,value),'cssValue':value}
 dimension={}
 for name,s in index(data['dimensions']['dimensions']+data['controls']['controls']).items():
  assert s['unit']=='px'
  var=s.get('cssVariable') or ('--space-'+str(s['value']) if name.startswith('Interval/') else '--'+name.split('/')[-1])
  dimension[name]={**s,'cssVariable':emit(var,rem(s['value'])),'cssValue':rem(s['value']),'outputUnit':'rem'}
 # 语义间距：设计方确认，逐项映射到 Interval 阶梯，CSS 以 var() 引用基础间距
 semantic_spacing={}
 for t in data['spacingSemantic']['tokens']:
  def alias(n,v):
   if n is None: assert v==0,(t['name'],v); return '0'  # 0 不属于 Interval 阶梯，直接输出 0
   d=dimension[n]; assert n.startswith('Interval/') and d['value']==v,(t['name'],n,v); return 'var('+d['cssVariable']+')'
  if isinstance(t['value'],dict):
   css_vars={k:emit('--space-'+t['name']+'-'+k,alias(t['aliasOf'][k],t['value'][k])) for k in ('min','max')}
   semantic_spacing[t['name']]={**t,'cssVariables':css_vars}
  else:
   semantic_spacing[t['name']]={**t,'cssVariable':emit('--space-'+t['name'],alias(t['aliasOf'],t['value']))}
 emit('--ds-font-family-ui','system-ui, sans-serif')
 emit('--ds-font-family-numeric','GJTypeDisplay, var(--ds-font-family-ui)')
 types={}
 for name,s in index(data['typography']['textStyles']).items():
  numeric=s['fontFamily']=='GJTypeDisplay'; base='--ds-type-'+slug(name)
  assert s['fontSize']['unit']=='px' and s['lineHeight']['unit']=='PIXELS'
  ls=s['letterSpacing']; spacing=number(ls['value']/100)+'em' if ls['unit']=='PERCENT' else rem(ls['value'])
  vals={'font-family':'var(--ds-font-family-numeric)' if numeric else 'var(--ds-font-family-ui)','font-size':rem(s['fontSize']['value']),'font-weight':str({'Regular':400,'Medium':500,'Semibold':600,'Bold':700}[s['fontWeightName']]),'line-height':rem(s['lineHeight']['value']),'letter-spacing':spacing,'text-indent':rem(s['paragraphIndent']['value']),'text-transform':{'ORIGINAL':'none','UPPER':'uppercase','LOWER':'lowercase','TITLE':'capitalize'}[s['textCase']],'text-decoration':{'NONE':'none','UNDERLINE':'underline','STRIKETHROUGH':'line-through'}[s['textDecoration']]}
  if numeric: vals['font-variant-numeric']='tabular-nums'
  cssvars={p:emit(base+'-'+p,v) for p,v in vals.items()}
  emit(base+'-paragraph-spacing',rem(s['paragraphSpacing']['value']))
  cls='gj-mobile-type-'+slug(name)
  body=[f'  {p}: var({v});' for p,v in cssvars.items()]
  if s['fontSize']['value']<=11: body.append(f'  font-size: max(var({base}-font-size), 10px);')
  classes.append('.'+cls+' {\n'+'\n'.join(body)+'\n}')
  types[name]={**s,'cssClass':cls,'cssVariables':cssvars,'cssDeclarations':vals,'paragraphSpacingCssVariable':base+'-paragraph-spacing','numericFontStatus':'GJTypeDisplay webfont (assets/fonts, updated by design owner 2026-10-20) with system fallback' if numeric else 'system font'}
  size=s['fontSize']['value']
  floor=20 if numeric and size>=24 else 12 if name.startswith('P') and 12<=size<=14 else None
  if floor: classes.append(f'@media (max-width: 359px) {{ .{cls} {{ font-size: var({base}-font-size); font-size: max(var({base}-font-size), {floor}px); }} }}')
 effects={}
 for name,s in index(data['styles']['effectStyles']).items():
  shadows=[]; blur=[]
  for e in s['effects']:
   if not e['visible']:continue
   assert not e.get('boundVariables')
   if e['type']=='BACKGROUND_BLUR':blur.append('blur('+rem(e['radius'])+')');continue
   assert e['type'] in ('DROP_SHADOW','INNER_SHADOW') and e['blendMode']=='NORMAL'
   length=lambda v: number(v)+'px' if name=='bottom border' and v else rem(v)
   shadows.append(('inset ' if e['type']=='INNER_SHADOW' else '')+' '.join([length(e['offset']['x']),length(e['offset']['y']),length(e['radius']),length(e.get('spread',0)),rgba(e['color'])]))
  base='--ds-effect-'+slug(name); decl={}
  if shadows: decl['box-shadow']=emit(base,', '.join(shadows))
  if blur: decl['backdrop-filter']=emit(base+'-backdrop-filter',' '.join(blur))
  cls='gj-mobile-effect-'+slug(name)
  classes.append('.'+cls+' { '+ ' '.join(p+': var('+v+');' for p,v in decl.items())+(' -webkit-backdrop-filter: var('+decl['backdrop-filter']+');' if 'backdrop-filter' in decl else '')+' }')
  effects[name]={**s,'cssClass':cls,'cssVariables':decl,'renderingNote':'CSS box-shadow/backdrop-filter mapping; showShadowBehindNode retained in source, browser visual verification required'}
 gradients={}
 for name,s in index(data['styles']['paintStyles']).items():
  layers=[]
  for p in s['paints']:
   if not p['visible']:continue
   assert p['type']=='GRADIENT_LINEAR' and p['blendMode']=='NORMAL'
   (a,c,e),(b,d,f)=p['gradientTransform']; det=a*d-b*c
   assert abs(det)>1e-12
   inverse=[d/det,-b/det,-c/det,a/det,(c*f-d*e)/det,(b*e-a*f)/det]
   stops=''.join('<stop offset="'+number(t['position'])+'" stop-color="rgb('+','.join(number(t['color'][k]*255) for k in ('r','g','b'))+')" stop-opacity="'+number(t['color']['a']*p['opacity'])+'"/>' for t in p['gradientStops'])
   svg='<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><linearGradient id="g" x1="0" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox" gradientTransform="matrix('+' '.join(number(v) for v in inverse)+')">'+stops+'</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>'
   layers.append('url("data:image/svg+xml,'+quote(svg,safe='')+'")')
  var='--ds-gradient-'+s['figmaKey'][:12]
  gradients[name]={**s,'cssVariable':emit(var,', '.join(layers)),'encoding':'SVG objectBoundingBox; inverse Figma gradientTransform; preserves normalized geometry across aspect ratios'}
 # 栅格样式：列数为整数，槽宽与边距按 rem 输出
 grids={}
 for name,s in index(data['styles'].get('gridStyles',[])).items():
  g=[x for x in s['layoutGrids'] if x['visible']]
  assert len(g)==1 and g[0]['pattern']=='COLUMNS' and g[0]['alignment']=='STRETCH',name
  g=g[0]; base='--ds-'+slug(name)
  grids[name]={**s,'cssVariables':{'count':emit(base+'-count',str(g['count'])),'gutter':emit(base+'-gutter',rem(g['gutterSize'])),'offset':emit(base+'-offset',rem(g['offset']))}}
 package={'$schema':'gj-design-skill/mobile-unified-tokens/v1','meta':{'name':'GJ B2B Mobile Design Tokens','mode':'Mobile','sourceFiles':FILES,'sourceHashes':{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in FILES.values()},'sourcePolicy':'Generated from mobile extraction; do not hand-edit. H5 rules: references/h5-sizing-and-adaptation.md and h5-small-screen.md.','counts':{'primitiveColors':len(color['primitive']),'semanticColors':len(color['semantic']),'dimensions':len(dimension),'typographyStyles':len(types),'effects':len(effects),'gradients':len(gradients),'semanticSpacing':len(semantic_spacing),'gridStyles':len(grids)}},'color':color,'dimension':dimension,'spacing':{'semantic':semantic_spacing,'rules':data['spacingSemantic']['rules'],'source':data['spacingSemantic']['source']},'grid':grids,'typography':{'styles':types,'policy':{'ui':'system-ui, sans-serif','numeric':'GJTypeDisplay, var(--ds-font-family-ui) (assets/fonts/GJTypeDisplay-*.ttf)','numericFeature':'tabular-nums'}},'effect':effects,'gradient':gradients}
 FONT_FACES=''.join(f'@font-face {{\n  font-family: "GJTypeDisplay";\n  src: url("../fonts/GJTypeDisplay-{n}.ttf") format("truetype");\n  font-style: normal;\n  font-weight: {w};\n  font-display: swap;\n}}\n\n' for n,w in (('Regular',400),('Medium',500),('Bold',700)))
 css='/* Generated by scripts/build-tokens.py. Mobile source only. See token-contract.md. */\n'+FONT_FACES+':root {\n'+'\n'.join(f'  {k}: {v};' for k,v in variables.items())+'\n}\n\n'+'\n\n'.join(classes)+'\n'
 # Fail on dangling references, including CSS aliases.
 refs=set(re.findall(r'var\((--[\w-]+)',css)); assert refs<=variables.keys(),refs-variables.keys()
 return {'references/tokens/gj-b2b-mobile.tokens.json':json.dumps(package,ensure_ascii=False,indent=2)+'\n','assets/styles/gj-b2b-mobile-tokens.css':css}
if __name__=='__main__':
 outputs=build()
 for path,text in outputs.items():
  target=ROOT/path
  if '--check' in sys.argv:
   assert target.exists() and target.read_text()==text,'Stale output: '+path
  else:
   target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text)
 print('Verified' if '--check' in sys.argv else 'Built',', '.join(outputs))
 # 预览站数据（preview/_data/tokens.js）跟随 Token 重建 / 校验
 import subprocess; subprocess.run([sys.executable,str(ROOT/'scripts'/'build-preview-data.py')]+(['--check'] if '--check' in sys.argv else []),check=True)
