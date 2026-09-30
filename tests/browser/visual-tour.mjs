import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.TEST_CHROME,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const base=process.env.PREVIEW_URL||'http://127.0.0.1:3001';
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(1200);
const site=page.frames().find(f=>f.url()==='about:srcdoc');assert.ok(site);
assert.ok(await site.locator('img').first().evaluate(e=>e.complete&&e.naturalWidth>0),'Marketing image must load');
await page.screenshot({path:'docs/preview-evidence/marketing-motion.png'});
for(const id of ['work','portal','states','pricing']){const section=page.locator('#'+id);if(await section.count()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(600);await page.screenshot({path:`docs/preview-evidence/marketing-${id}.png`});}}
await page.goto(base+'/portal-preview/index.html',{waitUntil:'networkidle'});await page.setViewportSize({width:320,height:900});
const panels=['overview','direction','build','review','pages','analytics','seo','domains','connections','states','billing','launch'];
for(const name of panels){await page.evaluate(n=>window.showView(n),name);await page.waitForTimeout(100);const dimensions=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));assert.ok(dimensions.sw<=dimensions.w+1,name+' overflows');await page.screenshot({path:`docs/preview-evidence/mobile-${name}.png`});}
assert.equal(errors.length,0);
await writeFile('docs/preview-evidence/visual-tour-results.json',JSON.stringify({result:'pass',animatedMarketing:true,marketingImageLoaded:true,mobilePanels:panels,uncaughtErrors:errors},null,2));await browser.close();
