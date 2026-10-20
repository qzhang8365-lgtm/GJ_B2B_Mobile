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
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch();
    const results = [];
    for (const width of [375, 320, 768]) {
      const page = await browser.newPage({ viewport: { width, height: 812 } });
      await page.goto(`http://127.0.0.1:${server.address().port}/planning/e2e/customer.html`);
      await page.evaluate(() => document.fonts.ready);
      while (await page.locator('[data-more-hold]').count()) await page.locator('[data-more-hold]').click();
      const rows = await page.locator('.ho-title').evaluateAll(heads => {
        function lines(el) {
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const centers = [];
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(walker.currentNode);
            for (const rect of range.getClientRects()) if (rect.width && rect.height) centers.push((rect.top + rect.bottom) / 2);
          }
          centers.sort((a,b) => a-b);
          const grouped = [];
          const tolerance = parseFloat(getComputedStyle(el).fontSize) * .55;
          for (const center of centers) if (!grouped.some(y => Math.abs(y-center) < tolerance)) grouped.push(center);
          return grouped.length;
        }
        return heads.map(head => {
          const left = head.firstElementChild, right = head.lastElementChild;
          const label = right.querySelector('.ho-mv-line .ho-sub').getBoundingClientRect();
          const value = right.querySelector('.num').getBoundingClientRect();
          return { name: left.querySelector('h3').textContent, leftLines: lines(left), rightLines: lines(right), leftHeight: left.getBoundingClientRect().height, rightHeight: right.getBoundingClientRect().height, labelValueOverlap: Math.min(label.bottom,value.bottom)-Math.max(label.top,value.top), overlap: left.getBoundingClientRect().right > right.getBoundingClientRect().left };
        });
      });
      assert(rows.length >= 6);
      for (const row of rows) {
        assert.equal(row.leftLines, 2, `${width} ${row.name} left`);
        assert.equal(row.rightLines, 2, `${width} ${row.name} right`);
        assert(row.labelValueOverlap > 0, '市值标签与金额必须同行');
        assert(!row.overlap, '左右信息不能重叠');
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const shots = path.join(__dirname,'customer-shots'); fs.mkdirSync(shots,{recursive:true});
      await page.screenshot({ path: path.join(shots, `holdings-two-lines-${width}.png`), fullPage: true });
      results.push({width, rows}); await page.close();
    }
    fs.writeFileSync(path.join(__dirname,'customer-layout-verification.json'), JSON.stringify({pass:true,results},null,2));
    console.log(JSON.stringify({pass:true,widths:results.map(r=>({width:r.width,items:r.rows.length,first:r.rows[0]}))}));
  } finally { if(browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exit(1); });
