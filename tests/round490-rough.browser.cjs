const assert=require('node:assert/strict'),languageTap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,c,boot})=>{
 await c.addInitScript(()=>{if(localStorage.getItem('rough490seed'))return;localStorage.setItem('rough490seed','1');localStorage.setItem('vp-library.v1',JSON.stringify({hist:[],queue:[{id:'dQw4w9WgXcQ',title:'Rick Astley - Never Gonna Give You Up'}],favs:[{id:'dQw4w9WgXcQ',title:'Rick Astley - Never Gonna Give You Up'},{id:'9bZkp7q19f0',title:'PSY Gangnam Style'},{id:'aqz-KE-bpKQ',title:'गुजराती संगीत भजन'},{id:'kJQP7kiw5Fk',title:'ગુજરાતી ગીત સંગીત'}],later:[]}));let q=JSON.parse(localStorage.getItem('vp-prefs.v1')||'{}');q.customNames480={'9bZkp7q19f0':'Morning exercise mix'};localStorage.setItem('vp-prefs.v1',JSON.stringify(q));});
 await boot();await p.locator('#roughTitle490 summary').click();
 const search=async q=>{await p.locator('#roughInput490').fill(q);await p.waitForFunction(()=>!/Checking|कम से कम|ઓછામાં/.test(document.querySelector('#roughTitle490 [role=status]').textContent));await p.waitForTimeout(250);};
 await search('Rikc Astely');assert.equal(await p.locator('.rough-results490 li').count(),1,'two transposed words match one deduplicated title');assert.ok((await p.locator('.rough-results490 li').textContent()).includes('Rick Astley'));
 assert.equal(await p.locator('#libSearch').inputValue(),'','suggestions do not silently change exact search');assert.equal(await p.locator('#frameBox iframe').count(),0,'does not load a video');
 await p.locator('.rough-results490 button').click();assert.equal(await p.locator('#libSearch').inputValue(),'dQw4w9WgXcQ');
 await search('Mornign exercize');assert.equal(await p.locator('.rough-results490 li').count(),1,'custom names included');assert.ok((await p.locator('.rough-results490 li').textContent()).includes('Morning exercise mix'));
 await search('गुजराती संगीत');assert.equal(await p.locator('.rough-results490 li').count(),1,'Devanagari words retain combining marks');
 await search('ગુજરાતી ગીત');assert.equal(await p.locator('.rough-results490 li').count(),1,'Gujarati words retain vowel signs');
 await search('Rick Rick');assert.equal(await p.locator('.rough-results490 li').count(),1,'repeated input words are deduplicated');
 await search('Rick rocket');assert.equal(await p.locator('.rough-results490 li').count(),0,'one word cannot satisfy unrelated terms');
 await search('zzzzzzzz');assert.equal(await p.locator('.rough-results490 li').count(),0);assert.ok((await p.locator('#roughTitle490 [role=status]').textContent()).includes('No close'));
 await p.locator('#roughInput490').fill('a b c d e f g h i');await p.waitForFunction(()=>document.querySelector('#roughTitle490 [role=status]').textContent.includes('8 words'));
 await p.locator('#roughInput490').fill('Ri');await p.waitForFunction(()=>document.querySelector('#roughTitle490 [role=status]').textContent.includes('at least 3'));
 // Rapid edits must discard older results.
 await p.locator('#roughInput490').fill('Rick');await p.locator('#roughInput490').fill('zzzzzzzz');await p.waitForTimeout(400);assert.equal(await p.locator('.rough-results490 li').count(),0);
 await search('Rikc');await p.setViewportSize({width:390,height:844});
 for(const lang of ['en','hi','gu']){for(let i=0;i<3&&await p.locator('html').getAttribute('lang')!==lang;i++)await languageTap(p);await p.locator('#roughTitle490').scrollIntoViewIfNeeded();assert.ok(await p.locator('#roughTitle490').evaluate(e=>e.scrollWidth<=e.clientWidth+1));assert.equal(await p.locator('#roughInput490').inputValue(),'Rikc');await p.screenshot({path:'/downloads/round490-rough-'+lang+'.png'});}
 await p.locator('#spoilerBtn').click();assert.equal(await p.locator('.rough-results490').isVisible(),false,'no titles exposed in spoiler-free mode');await p.locator('#spoilerBtn').click();
 await p.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.classList.add('high-contrast','calm-motion','low-fx')});
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#roughInput490').inputValue(),'','temporary query resets after reload');await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);assert.equal(await p.locator('#roughTitle490').count(),1);
 console.log('PASS fuzzy transposition, Unicode, custom names, deduplication, explicit apply, unrelated terms, empty/long input, race cancellation, spoiler-free, en/hi/gu 390px, fresh/repeat reset');
}).catch(e=>{console.error(e);process.exitCode=1});
