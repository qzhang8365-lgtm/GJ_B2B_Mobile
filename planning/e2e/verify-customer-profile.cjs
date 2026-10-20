/* 2026-10-19 PR-020：客户信息卡展开/收起与完整字段验收。 */
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
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch(); const results=[];
    for (const width of [375,320,768]) {
      const page=await browser.newPage({viewport:{width,height:812}});const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/planning/e2e/customer.html`);
      const collapsedHeight=await page.locator('#cu').evaluate(e=>e.getBoundingClientRect().height);
      await page.locator('[data-more]').click();
      assert.equal(await page.locator('[data-more]').getAttribute('aria-expanded'),'true');
      assert.equal(await page.locator('.cu-head>.cu-tags .gj-m-tag').count(),16);
      assert.equal(await page.locator('.cu-services a').count(),5);
      assert.equal(await page.locator('.cu-note .cu-tags .gj-m-tag').count(),14);
      assert.equal(await page.locator('.cu-note [role=progressbar]').getAttribute('aria-valuenow'),'67');
      assert((await page.locator('.cu-risk').textContent()).includes('2026-09-15'));
      assert((await page.locator('.cu-note-text p').textContent()).includes('对基金不感兴趣'));
      const geometry=await page.locator('#cu').evaluate(e=>({height:e.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth,serviceHeight:e.querySelector('.cu-services').getBoundingClientRect().height,progressWidth:e.querySelector('[role=progressbar]').getBoundingClientRect().width}));
      assert(!geometry.overflow);assert(geometry.progressWidth>20);assert(geometry.serviceHeight>40);
      await page.locator('[data-edit-profile]').click();assert((await page.locator('#toast').textContent()).includes('编辑客户标签备注'));
      await page.locator('.cu-services a').last().click();assert((await page.locator('#toast').textContent()).includes('已签服务'));
      await page.locator('[data-more]').click();assert.equal(await page.locator('.cu-note').count(),0);
      assert.equal(await page.locator('.cu-head>.cu-tags .gj-m-tag').count(),5);
      assert.equal(await page.locator('#cu').evaluate(e=>e.getBoundingClientRect().height),collapsedHeight);
      await page.locator('[data-more]').click();await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:path.join(__dirname,'customer-shots',`profile-expanded-${width}.png`),fullPage:true});
      assert.equal(errors.length,0,errors.join());results.push({width,collapsedHeight,...geometry,pass:true});await page.close();
    }
    fs.writeFileSync(path.join(__dirname,'customer-profile-verification.json'),JSON.stringify({pass:true,results},null,2));console.log(JSON.stringify({pass:true,results}));
  } finally {if(browser)await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1)});
