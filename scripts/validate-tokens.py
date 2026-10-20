#!/usr/bin/env python3
"""Validate generated artifacts against independent mobile-source expectations."""
import json, re, subprocess, sys
from pathlib import Path
from urllib.parse import unquote
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(ROOT/'scripts/build-tokens.py'),'--check'],check=True)
def read(n):return json.loads((ROOT/'references/tokens'/n).read_text())
p=read('gj-b2b-mobile.tokens.json'); css=(ROOT/'assets/styles/gj-b2b-mobile-tokens.css').read_text()
allcolors={**p['color']['primitive'],**p['color']['semantic']}
for s in read('colors.json')['colors']:
 t=allcolors[s['name']]
 assert t['source']==s['source'] and t['value']==s['value']
 if s.get('aliasOf'):
  assert t['cssValue']=='var('+allcolors[s['aliasOf']]['cssVariable']+')'
  val=t['resolvedValue']
  if isinstance(val,dict):
   hexval='#'+''.join(f'{round(val[k]*255):02X}' for k in ('r','g','b'))
   if val.get('a',1)<1:hexval+=f'{round(val["a"]*255):02X}'
   assert s['value'].upper()==hexval
for s in read('dimensions.json')['dimensions']+read('controls.json')['controls']:
 t=p['dimension'][s['name']];assert abs(float(t['cssValue'][:-3])*100-s['value'])<1e-8
 if s['name'].startswith('Components/'):assert t['cssVariable']==s['cssVariable']
# 语义间距：每项必须映射到同值的 Interval 阶梯，CSS 以 var() 引用该阶梯
ss=read('spacing-semantic.json'); ladder={s['name']:s['value'] for s in read('dimensions.json')['dimensions'] if s['name'].startswith('Interval/')}
assert len(p['spacing']['semantic'])==len(ss['tokens']) and p['spacing']['rules']==ss['rules']
for s in ss['tokens']:
 t=p['spacing']['semantic'][s['name']]
 pairs=[(s['aliasOf'][k],s['value'][k],t['cssVariables'][k]) for k in ('min','max')] if isinstance(s['value'],dict) else [(s['aliasOf'],s['value'],t['cssVariable'])]
 for alias,val,var in pairs:
  if alias is None:
   assert val==0 and re.search(re.escape(var)+r': 0;',css); continue
  assert ladder[alias]==val and val%4==0
  assert re.search(re.escape(var)+r': var\('+re.escape(p['dimension'][alias]['cssVariable'])+r'\);',css)
# 栅格样式：列数、槽宽、边距与 Figma 源值一致
for s in read('styles.json').get('gridStyles',[]):
 t=p['grid'][s['name']]; g=s['layoutGrids'][0]; v=t['cssVariables']
 assert re.search(re.escape(v['count'])+r': '+str(g['count'])+';',css)
 for k,src in (('gutter','gutterSize'),('offset','offset')):
  assert abs(float(re.search(re.escape(v[k])+r': ([\d.]+)rem;',css).group(1))*100-g[src])<1e-8
for width in [320,375,450,600,960]:
 root=min(width/3.75,120)
 assert abs(float(p['dimension']['Interval/space-16']['cssValue'][:-3])*root-16*min(width/375,1.2))<1e-8
for s in read('typography.json')['textStyles']:
 t=p['typography']['styles'][s['name']]
 assert t['source']==s['source']
 assert abs(float(t['cssDeclarations']['font-size'][:-3])*100-s['fontSize']['value'])<1e-8
 assert abs(float(t['cssDeclarations']['line-height'][:-3])*100-s['lineHeight']['value'])<1e-8
 assert 'GJType' not in t['cssDeclarations']['font-family']
for s in read('styles.json')['effectStyles']:assert p['effect'][s['name']]['effects']==s['effects']
for s in read('styles.json')['paintStyles']:
 t=p['gradient'][s['name']]; assert t['paints']==s['paints']
 declaration=re.search(re.escape(t['cssVariable'])+r': (.+);',css).group(1)
 svg=ET.fromstring(unquote(re.search(r'data:image/svg\+xml,([^\"]+)',declaration).group(1)))
 gradient=svg.find('.//{http://www.w3.org/2000/svg}linearGradient')
 vals=list(map(float,re.findall(r'[-+]?\d*\.?\d+(?:e[-+]?\d+)?',gradient.attrib['gradientTransform'])))
 ia,ib,ic,id_,ie,iff=vals
 (a,c,e),(b,d,f)=s['paints'][0]['gradientTransform']
 for u,v in [(0,.5),(1,.5),(0,0),(1,1)]:
  x,y=ia*u+ic*v+ie,ib*u+id_*v+iff
  assert abs(a*x+c*y+e-u)<1e-8 and abs(b*x+d*y+f-v)<1e-8
 assert len(gradient)==len(s['paints'][0]['gradientStops'])
assert 'PingFang' not in css
# 仅允许 GJType 数字字体的 400/500/700 三条 @font-face，且字体文件必须存在
faces=re.findall(r'@font-face \{(.*?)\}',css,re.S)
assert len(faces)==3 and all('font-family: "GJType"' in f for f in faces)
assert sorted(int(re.search(r'font-weight: (\d+)',f).group(1)) for f in faces)==[400,500,700]
for f in faces: assert (ROOT/'assets/styles'/re.search(r'url\("([^"]+)"\)',f).group(1)).resolve().is_file()
names=re.findall(r'^  (--[\w-]+):',css,re.M);assert len(names)==len(set(names))
assert set(re.findall(r'var\((--[\w-]+)',css))<=set(names)
print('PASS: coverage, source preservation, alias resolution, CSS names, rem scaling, typography, effect layers, gradient transforms, deterministic output')
