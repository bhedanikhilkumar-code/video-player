const assert=require('node:assert/strict'),tap=require('./language-tap.cjs');
require('./round445-harness.cjs')(async({p,pick,files,errors})=>{
 await pick(files.slice(0,1));await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 await p.locator('#dualSub499>summary').click();
 const caps=(name,text)=>({name,mimeType:'text/plain',buffer:Buffer.from(text)});
 const first='1\n00:00:00,000 --> 00:00:12,000\nPrimary English\n\n2\n00:00:12,000 --> 00:00:30,000\nSecond line\n';
 const second='WEBVTT\n\n00:00:00.000 --> 00:00:12.000\nनमस्ते દુનિયા\n\n00:00:12.000 --> 00:00:30.000\n<test> &amp; literal\n';
 await p.locator('#lpSubFile').setInputFiles(caps('English.srt',first));
 await p.locator('#dualFile499').setInputFiles(caps('Companion.vtt',second));
 await p.waitForFunction(()=>document.querySelector('#dualStatus499').textContent.includes('2 lines'));
 const tracks=()=>p.evaluate(()=>Array.from(document.querySelector('#lpVideo').textTracks).map(t=>({label:t.label,mode:t.mode,cues:Array.from(t.cues||[]).map(c=>({text:c.text,line:c.line,start:c.startTime,end:c.endTime}))})));
 let ts=await tracks();assert.equal(ts.filter(t=>t.mode==='showing').length,2);assert.equal(ts.find(t=>t.label==='Companion captions').cues[0].line,0);
 await p.locator('#dualToggle499').click();assert.equal((await tracks()).find(t=>t.label==='Companion captions').mode,'disabled');await p.locator('#dualToggle499').click();
 await p.locator('#dualOffset499').fill('2.5');await p.locator('#dualApply499').click();assert.equal((await tracks()).find(t=>t.label==='Companion captions').cues[0].start,2.5);
 await p.locator('#dualOffset499').fill('-15');await p.locator('#dualApply499').click();ts=(await tracks()).find(t=>t.label==='Companion captions');assert.equal(ts.cues.length,1);assert.equal(ts.cues[0].start,0);assert.equal(ts.cues[0].end,15);
 await p.locator('#dualReset499').click();assert.equal((await tracks()).find(t=>t.label==='Companion captions').cues[0].start,0);
 // Replacing the primary must not silently disable the companion.
 await p.locator('#lpSubFile').setInputFiles(caps('Again.srt',first));await p.waitForFunction(()=>Array.from(document.querySelector('#lpVideo').textTracks).filter(t=>t.mode==='showing').length===2);
 await p.locator('#dualFile499').setInputFiles(caps('bad.srt','bad'));await p.waitForFunction(()=>document.querySelector('#dualSub499').getAttribute('aria-busy')==='false');assert.match(await p.locator('#dualStatus499').textContent(),/no readable/);assert.equal((await tracks()).find(t=>t.label==='Companion captions').cues.length,2);
 // Local mini docking does not move/remove native captions.
 const mini=p.locator('#lpMiniBtn447');if(await mini.count()){await mini.click();assert.equal((await tracks()).find(t=>t.label==='Companion captions').mode,'showing');await mini.click();}
 for(const lang of ['en','hi','gu']){for(let n=0;n<3&&(await p.locator('html').getAttribute('lang'))!==lang;n++)await tap(p);await p.setViewportSize({width:390,height:844});await p.locator('#dualSub499').scrollIntoViewIfNeeded();assert.ok(await p.locator('#dualSub499').evaluate(e=>e.scrollWidth<=e.clientWidth+1));await p.screenshot({path:'/downloads/round499-dual-'+lang+'.png'});}
 await pick(files.slice(1,2));await p.waitForFunction(()=>document.querySelector('#dualToggle499').disabled);assert.equal((await tracks()).find(t=>t.label==='Companion captions').cues.length,0);
 for(let i=0;i<2;i++){await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&document.querySelector('#dualSub499'));assert.equal(await p.locator('#dualToggle499').isDisabled(),true);}
 assert.deepEqual(errors,[]);console.log('PASS dual captions native tracks, primary replacement, toggle, invalid file preservation, video-change reset, fresh/repeat, en/hi/gu390');
}).catch(e=>{console.error(e);process.exitCode=1});
