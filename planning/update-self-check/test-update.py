"""Isolated integration tests: real Bash 3.2/curl/unzip/filesystem, local Release HTTP fixture.
No version bump, release build, push or upload. HOME remains unchanged.
"""
import contextlib,hashlib,http.server,json,os,pathlib,shutil,subprocess,tempfile,threading,time,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
SCRIPT=ROOT/'scripts/check-update.sh'
CACHE=pathlib.Path.home()/'.cache/gj-b2b-mobile-design-skill'
results=[];backups=[];requests=[]
with tempfile.TemporaryDirectory(prefix='gj-mobile-update-tests-') as td:
 t=pathlib.Path(td)
 shutil.copy2('/tmp/gj-mobile-latest-v1.0.0.zip',t/'published.zip')
 bin=t/'bin';bin.mkdir();skills=t/'skills';skills.mkdir()
 for ver,name in [('1.0.0','good.zip'),('0.8.0','bad.zip')]:
  with zipfile.ZipFile(t/name,'w',zipfile.ZIP_DEFLATED) as z:
   top='gj-b2b-mobile-design-skill-v1.0.0/'
   z.writestr(top+'package.json',json.dumps({'name':'gj-b2b-mobile-design-skill','version':ver}))
   z.writestr(top+'SKILL.md','# Updated fixture Skill')
   z.writestr(top+'scripts/check-update.sh',SCRIPT.read_bytes())
   z.writestr(top+'new-file.txt','new')
 class Handler(http.server.BaseHTTPRequestHandler):
  def log_message(self,*args):pass
  def do_HEAD(self):
   requests.append(('HEAD',self.path));self.send_response(302);self.send_header('Location','https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile/releases/tag/v1.0.0');self.end_headers()
  def do_GET(self):
   requests.append(('GET',self.path));data=(t/('published.zip' if self.path.startswith('/published/') else ('bad.zip' if self.path.startswith('/bad/') else 'good.zip'))).read_bytes();self.send_response(200);self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 realcurl=shutil.which('curl');port=server.server_port
 # Only transport is redirected; actual script logic and archive installation remain unchanged.
 shim='''#!/usr/bin/env python3
import os,sys,subprocess
args=sys.argv[1:];out=[];i=0
if os.environ.get('TEST_OFFLINE'):sys.exit(6)
if os.environ.get('TEST_DOWNLOAD_FAIL') and '-o' in args:sys.exit(22)
while i<len(args):
 a=args[i]
 if a in ['--proto','--proto-redir']:i+=2;continue
 if a.startswith('https://github.com/'):
  assert a.startswith('https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile/releases/'),a
  a='http://127.0.0.1:PORT/'+('published/' if os.environ.get('TEST_PUBLISHED') else ('bad/' if os.environ.get('TEST_BAD') else ''))+a.split('/releases/',1)[1]
 out.append(a);i+=1
sys.exit(subprocess.call([REAL]+out))
'''.replace('PORT',str(port)).replace('REAL',repr(realcurl))
 (bin/'curl').write_text(shim);(bin/'curl').chmod(0o755)
 def install(name,ver='0.9.0'):
  p=skills/name;(p/'scripts').mkdir(parents=True);shutil.copy2(SCRIPT,p/'scripts/check-update.sh');(p/'package.json').write_text(json.dumps({'dependencies':{'nested':{'version':'99.0.0'}},'version':ver}));(p/'SKILL.md').write_text('# Old fixture');(p/'obsolete.txt').write_text('old');(p/'node_modules/demo').mkdir(parents=True);(p/'node_modules/demo/index.js').write_text('user dependency');return p
 def run(p,*args,**extra):
  before=set(CACHE.glob('backup-*')) if CACHE.exists() else set();env={**os.environ,'PATH':str(bin)+os.pathsep+os.environ['PATH'],**extra};start=time.monotonic();r=subprocess.run(['/bin/bash',str(p/'scripts/check-update.sh'),*args],env=env,text=True,capture_output=True,timeout=15);backups.extend(set(CACHE.glob('backup-*'))-before);assert r.returncode==0,(r.stdout,r.stderr);return r.stdout,time.monotonic()-start
 def record(name,out,elapsed):results.append({'scenario':name,'result':'PASS','seconds':round(elapsed,3),'output':out.strip()})
 try:
  p=install('upgrade');out,elapsed=run(p);assert '已更新到 V1.0.0' in out,out;assert json.loads((p/'package.json').read_text())['version']=='1.0.0';assert not (p/'obsolete.txt').exists();assert (p/'new-file.txt').exists();assert (p/'node_modules/demo/index.js').read_text()=='user dependency';assert backups and all(x.parent==CACHE for x in backups);assert (backups[-1]/'obsolete.txt').exists();record('旧版本升级到 fixture latest 1.0.0；node_modules保留；旧文件移除；缓存备份',out,elapsed)
  count=len(requests);out,elapsed=run(p);assert len(requests)==count and '12 小时' in out;record('12小时内重复检查无网络请求',out,elapsed)
  out,elapsed=run(p,'--force');assert '已是最新' in out;record('--force越过时间戳并确认最新版',out,elapsed)
  p=install('latest','1.0.0');out,elapsed=run(p);assert '已是最新' in out;record('已是最新版',out,elapsed)
  p=install('check-only');out,elapsed=run(p,'--check-only');assert '发现新版本但未自动升级' in out and (p/'obsolete.txt').exists() and not (p/'new-file.txt').exists();record('--check-only不下载不更新',out,elapsed)
  p=install('offline');out,elapsed=run(p,TEST_OFFLINE='1');assert elapsed<3 and (p/'obsolete.txt').exists();record('DNS/不可达注入快速放行',out,elapsed)
  count=len(requests);out,elapsed=run(p);assert len(requests)==count and '12 小时' in out;record('断网检查也遵守12小时间隔',out,elapsed)
  for kind in ['directory','file']:
   p=install('git-'+kind)
   if kind=='directory':(p/'.git').mkdir()
   else:(p/'.git').write_text('gitdir: /temporary/worktree')
   count=len(requests);out,elapsed=run(p,'--force');assert '开发仓库' in out and len(requests)==count and not (p/'.update-check').exists();record('.git '+kind+'跳过',out,elapsed)
  p=install('mismatch');out,elapsed=run(p,TEST_BAD='1');assert '版本或结构' in out and (p/'obsolete.txt').exists() and not (p/'new-file.txt').exists();record('ZIP版本与Tag不一致拒绝覆盖',out,elapsed)
  p=install('published');out,elapsed=run(p,TEST_PUBLISHED='1');assert '版本或结构' in out and (p/'obsolete.txt').exists();record('真实GitHub v1.0.0附件缺package与updater：正确拒绝覆盖',out,elapsed)
  p=install('download-fail');out,elapsed=run(p,TEST_DOWNLOAD_FAIL='1');assert '下载失败' in out and (p/'obsolete.txt').exists();record('下载失败放行',out,elapsed)
  p=install('readonly');p.chmod(0o555)
  try:
   out,elapsed=run(p);assert '不可写' in out and (p/'obsolete.txt').exists();record('安装目录不可写放行',out,elapsed)
  finally:p.chmod(0o755)
  # Force a failure only at the final installation rename, allowing rollback.
  mv=bin/'mv';mv.write_text('#!/bin/bash\ncase "$1" in */.gj-mobile-stage.*) exit 1;; esac\nexec /bin/mv "$@"\n');mv.chmod(0o755)
  p=install('rollback');out,elapsed=run(p);assert '已恢复旧版本' in out and (p/'obsolete.txt').exists() and (p/'node_modules/demo/index.js').exists();record('安装rename失败恢复旧版',out,elapsed);mv.unlink()
  assert not list(skills.glob('.gj-mobile-*')),'staging or locks leaked'
  report={'bash':subprocess.check_output(['/bin/bash','--version'],text=True).splitlines()[0],'transport':'localhost Release HTTP fixture through real curl; failure injection via PATH wrappers','productionScriptSHA256':hashlib.sha256(SCRIPT.read_bytes()).hexdigest(),'results':results,'backupParent':str(CACHE),'releaseCreated':False}
  (ROOT/'planning/update-self-check/results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
 finally:
  server.shutdown()
  for b in backups:
   if b.exists():shutil.rmtree(b)
