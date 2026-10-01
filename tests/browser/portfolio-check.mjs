import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({executablePath:process.env.TEST_CHROME||undefined,args:['--no-sandbox']});
const results=[],errors=[];await mkdir('docs/preview-evidence',{recursive:true});
async function check(name,fn,options={}){const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',...options}),page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push({name,error:e.message}));try{await fn(page);results.push({name,result:'pass'});}catch(error){results.push({name,result:'fail',detail:error.message});}finally{await context.close();}}
async function imageReady(page){await page.locator('.work-card-media img').evaluateAll(async images=>{for(const image of images){image.loading='eager';await image.decode();if(!image.naturalWidth)throw new Error(image.src);}});}
async function shot(page,name){const image=await page.screenshot({path:`docs/preview-evidence/portfolio-${name}.jpg`,type:'jpeg',quality:55});console.log(`FF_PORTFOLIO_VISUAL_${name}=${image.toString('base64')}`);}
await check('The collection has 20 unique local previews with source and reference actions',async page=>{
 await page.goto(base+'/work');assert.equal(await page.locator('.work-card').count(),20);
 const ids=await page.locator('.work-card').evaluateAll(cards=>cards.map(card=>card.dataset.project));assert.equal(new Set(ids).size,20);
 await imageReady(page);await page.evaluate(async()=>document.fonts.ready);await shot(page,'desktop');
 for(const card of await page.locator('.work-card').all()){
  const id=await card.getAttribute('data-project');await card.locator('button').click();
  await page.locator('.work-dialog[open]').waitFor();assert.equal(await page.locator('.work-source').getAttribute('href'),`https://motionsites.ai/?prompt=${id}`);
  assert.equal(await page.locator('.work-reference').getAttribute('href'),`/preview/start?reference=${id}`);
  await page.locator('.work-dialog-media img').evaluate(image=>image.decode());
  assert.ok((await page.locator('#work-dialog-description').textContent()).length>80);
  await page.getByRole('button',{name:'Close design preview'}).click();
 }
});
await check('Design filters update the collection, pressed state and announced count',async page=>{
 await page.goto(base+'/work');
 for(const group of ['Immersive','Editorial','Product','Expressive']){
  const button=page.getByRole('button',{name:new RegExp('^'+group)});await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');
  const sectors=await page.locator('.work-card-sector').allTextContents();assert.ok(sectors.length>1&&sectors.every(text=>text.endsWith(group)));
  assert.equal(await page.locator('.work-result-count').textContent(),String(sectors.length).padStart(2,'0')+' designs');
 }
 await page.getByRole('button',{name:/^All work/}).click();assert.equal(await page.locator('.work-card').count(),20);
});
await check('Keyboard exploration closes cleanly and restores focus to its card',async page=>{
 await page.goto(base+'/work');const trigger=page.getByRole('button',{name:'Explore Monolith Hero',exact:true});await trigger.click();
 assert.equal(await page.locator('#work-dialog-title').textContent(),'Monolith Hero');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#work-dialog-title').textContent(),'OYLA');
 await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#work-dialog-title').textContent(),'Monolith Hero');
 await page.keyboard.press('Escape');await page.locator('.work-dialog[open]').waitFor({state:'hidden'});assert.equal(await trigger.evaluate(element=>element===document.activeElement),true);assert.ok(!new URL(page.url()).searchParams.has('project'));assert.equal(await page.evaluate(()=>document.documentElement.style.overflow),'');
});
await check('Direct design links open the right preview and unknown designs remain safe',async page=>{
 await page.goto(base+'/work?project=oyla');await page.locator('.work-dialog[open]').waitFor();assert.equal(await page.locator('#work-dialog-title').textContent(),'OYLA');await page.getByRole('button',{name:'Close design preview'}).click();
 await page.goto(base+'/work?project=unknown');assert.equal(await page.locator('.work-dialog[open]').count(),0);assert.equal(await page.locator('.work-card').count(),20);
});
await check('Motion clips load only after an explicit play request',async page=>{
 const clips=[];page.on('request',request=>{if(request.url().includes('.mp4'))clips.push(request.url());});
 await page.goto(base+'/work');await page.getByRole('button',{name:'Explore Monolith Hero',exact:true}).click();assert.equal(clips.length,0);
 await page.getByRole('button',{name:'Play motion preview',exact:true}).click();await page.locator('.work-dialog video').evaluate(video=>new Promise((resolve,reject)=>{if(video.readyState>=1)return resolve();video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true});}));
 assert.ok(clips.length>0);assert.ok(await page.locator('.work-dialog video').evaluate(video=>video.videoWidth>0&&video.duration>0));
 await page.getByRole('button',{name:'Back to still preview'}).click();assert.equal(await page.locator('.work-dialog video').count(),0);
});
await check('A chosen design survives the example brief and seeds Initial Direction',async page=>{
 await page.goto(base+'/work?project=oyla');await page.locator('.work-reference').click();await page.locator('.obp-design-reference').waitFor();
 assert.match(await page.locator('.obp-design-reference').textContent(),/OYLA/);await page.getByRole('button',{name:'Use the Mori House example'}).click();assert.match(await page.locator('textarea').nth(1).inputValue(),/motionsites.ai\/\?prompt=oyla/);
 await page.getByRole('button',{name:'Save & continue'}).click();await page.getByRole('button',{name:'Explore example checkout'}).click();await page.getByRole('link',{name:'Open Initial Direction'}).click();
 await page.locator('[data-initial-text="links"]').waitFor();assert.match(await page.locator('[data-initial-text="links"]').inputValue(),/motionsites.ai\/\?prompt=oyla/);
});
await check('Choosing another design preserves an existing business brief and links',async page=>{
 await page.goto(base+'/preview/start');await page.evaluate(()=>localStorage.setItem('ff-preview-onboarding-v1',JSON.stringify({name:'Existing business',description:'Existing description',links:'https://example.com',goals:['Book'],feels:['Warm'],note:'Existing note'})));
 await page.goto(base+'/preview/start?reference=keel');await page.getByRole('button',{name:'Continue with Google'}).click();assert.equal(await page.getByRole('textbox',{name:'Business name',exact:true}).inputValue(),'Existing business');
 assert.equal(await page.locator('textarea').nth(1).inputValue(),'https://example.com\nhttps://motionsites.ai/?prompt=keel');await page.getByRole('button',{name:'Save & continue'}).click();
 const brief=await page.evaluate(()=>JSON.parse(localStorage.getItem('ff-preview-onboarding-v1')));assert.equal(brief.note,'Existing note');assert.deepEqual(brief.goals,['Book']);
});
await check('Portfolio, dialog and reference brief reflow at small widths',async page=>{
 for(const width of [320,390,768,1024]){
  await page.setViewportSize({width,height:844});await page.goto(base+'/work');await page.locator('.work-card').first().locator('button').click();
  assert.ok(await page.getByRole('button',{name:'Close design preview'}).isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.ok(await page.locator('.work-dialog').evaluate(element=>element.scrollWidth<=element.clientWidth+1));
  if(width===390)await shot(page,'phone-dialog');await page.keyboard.press('Escape');
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/work');await page.evaluate(async()=>document.fonts.ready);await shot(page,'phone');
 await page.goto(base+'/preview/start?reference=oyla');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
});
await check('The homepage features the portfolio and lets visitors compare visual directions',async page=>{
 await page.goto(base);await page.locator('.mk-hero-design-image').evaluate(image=>image.decode());assert.equal(await page.locator('.work-featured .work-card').count(),4);
 await page.getByRole('button',{name:'OYLA',exact:true}).click();assert.match(await page.locator('.mk-hero-design-image').getAttribute('alt'),/OYLA/);assert.equal(await page.locator('.mk-hero-design-link').getAttribute('href'),'/work?project=oyla');
 await page.locator('.work-collection-link').click();await page.locator('.work-card').nth(19).waitFor();
});
await check('Reduced motion and no JavaScript retain the complete readable collection',async page=>{
 await page.goto(base+'/work');assert.equal(await page.locator('.work-intro-star').evaluate(element=>getComputedStyle(element).animationName),'none');assert.ok(!(await page.locator('body').innerText()).includes('\u2014'));
},{reducedMotion:'reduce'});
const staticContext=await browser.newContext({javaScriptEnabled:false});const staticPage=await staticContext.newPage();await staticPage.goto(base+'/work');assert.equal(await staticPage.locator('.work-card').count(),20);assert.ok(await staticPage.getByRole('link',{name:'Start a site',exact:true}).isVisible());await staticContext.close();
await writeFile('docs/preview-evidence/portfolio-results.json',JSON.stringify({results,uncaughtErrors:errors},null,2));console.log(JSON.stringify({results,uncaughtErrors:errors},null,2));await browser.close();if(results.some(result=>result.result==='fail')||errors.length)process.exitCode=1;
