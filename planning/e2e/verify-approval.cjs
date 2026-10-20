/* 2026-10-19 PR-024：逐条核对持仓头部真实文字行数，不按DOM子元素数判断。 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');
const root = path.resolve(__dirname, '../..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', ({ '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.ttf':'font/ttf' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{browser=await chromium.launch();const results=[];for(const width of [375,320,768]){const p=await browser.newPage({viewport:{width,height:812}});const errors=[];p.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/planning/e2e/approval.html`;await p.goto(url);await p.evaluate(()=>document.fonts.ready);
const heights=await p.locator('#flow .gj-m-step').evaluateAll(es=>es.map(e=>({height:e.getBoundingClientRect().height,desc:!!e.querySelector('.gj-m-step-description'),padding:parseFloat(getComputedStyle(e.querySelector('.gj-m-step-copy')).paddingBottom),min:getComputedStyle(e).minHeight})));assert(heights[0].height<heights[1].height);assert.equal(heights[0].min,'0px');assert.equal(heights[3].padding,0);assert.equal(await p.locator('#flow [aria-current=step]').count(),1);assert.equal(await p.locator('#flow time.is-placeholder').count(),2);
await p.locator('#flow').screenshot({path:path.join(__dirname,'approval-steps-'+width+'.png')});
for(const b of await p.locator('[data-view]').all()){await b.click();assert((await p.locator('#toast').textContent()).includes('预览'));}
await p.locator('#reject').click();await p.locator('#rejectOk').click();assert(await p.locator('#taErr').isVisible());await p.locator('#ta textarea').fill('请补充费用说明');assert.equal(await p.locator('#taErr').count(),0);await p.keyboard.press('Escape');assert(await p.locator('#reject').evaluate(e=>e===document.activeElement));await p.locator('#reject').click();await p.locator('#rejectLayer [data-close]').last().click();
await p.locator('#approve').click();await p.locator('#approveLayer [data-close]').click();await p.locator('#approve').click();await p.locator('#approveOk').click();assert.equal(await p.locator('#state').textContent(),'已同意');assert.equal(await p.locator('#bar').count(),0);assert.equal(await p.locator('#flow [data-state=process]').count(),1);
await p.goto(url);await p.locator('#reject').click();await p.locator('#ta textarea').fill('请补充完整发票及报销说明。'.repeat(5));await p.locator('#rejectOk').click();assert.equal(await p.locator('#state').textContent(),'已驳回');assert.equal(await p.locator('#flow [data-state=error]').count(),1);assert.equal(await p.locator('#bar').count(),0);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(errors.length,0,errors.join());results.push({width,heights,interactions:'附件预览/弹层取消/Esc/必填校验/输入计数/同意/驳回通过'});await p.close();}fs.writeFileSync(path.join(__dirname,'approval-steps-verification.json'),JSON.stringify({pass:true,results},null,2));console.log(JSON.stringify({pass:true,results}));}finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exit(1)});
