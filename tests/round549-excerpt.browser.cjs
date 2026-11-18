const assert=require('node:assert/strict'),fs=require('node:fs'),fixture=require('./round548-fixture.cjs')();
require('./round538-harness.cjs')(async({p,c,boot,errors})=>{
 await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>{v.pause();v.currentTime=1;v.playbackRate=1.5;});
 await p.locator('#audioExcerpt549 > summary').click();
 await p.locator('#exStart549').fill('1');await p.locator('#exEnd549').fill('5');
 const initial=await p.locator('#lpVideo').evaluate(v=>({time:v.currentTime,rate:v.playbackRate,paused:v.paused}));
 await p.locator('#exBuild549').click();await p.waitForFunction(()=>!!document.querySelector('#exDownload549').getAttribute('href'));
 assert.deepEqual(await p.locator('#lpVideo').evaluate(v=>({time:v.currentTime,rate:v.playbackRate,paused:v.paused})),initial);
 assert.match(await p.locator('#exStatus549').textContent(),/4.00 seconds/);
 const download=await Promise.all([p.waitForEvent('download'),p.locator('#exDownload549').click()]);const b=fs.readFileSync(await download[0].path());
 assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.readUInt32LE(24),24000);assert.equal(b.readUInt16LE(22),2);assert.equal(b.length,44+4*24000*4);
 assert.equal(b.readInt16LE(44),0,'fade in starts at zero');assert.equal(b.readInt16LE(b.length-4),0,'fade out finishes at zero');
 // The source is left-only in 1-2 seconds, silent in 2-4, right-only in 4-5.
 function energy(channel,at){let sum=0;for(let i=Math.floor(at*24000);i<Math.floor((at+.1)*24000);i++)sum+=Math.abs(b.readInt16LE(44+(i*2+channel)*2));return sum;}
 assert.ok(energy(0,.4)>1000000);assert.ok(energy(1,.4)<100);assert.ok(energy(0,2)<100);assert.ok(energy(1,3.4)>1000000);
 const old=await p.locator('#exDownload549').getAttribute('href');await p.locator('#exStart549').fill('2');assert.equal(await p.locator('#exDownload549').isVisible(),false);
 assert.equal(await p.evaluate(async u=>{try{await fetch(u);return false;}catch{return true;}},old),true,'old object URL released');
 await p.locator('#exEnd549').fill('2.05');await p.locator('#exBuild549').click();assert.match(await p.locator('#exStatus549').textContent(),/0.1 to 60/);
 await p.locator('#exEnd549').fill('6');await p.locator('#exFade549').selectOption('0');await p.locator('#exBuild549').click();await p.waitForFunction(()=>!document.querySelector('#exDownload549').hidden);
 await p.locator('#exClear549').click();assert.equal(await p.locator('#exDownload549').getAttribute('href'),null);
 await p.locator('#exMarkIn549').click();assert.equal(await p.locator('#exStart549').inputValue(),'1.00');
 await p.locator('#lpVideo').evaluate(v=>v.currentTime=4);await p.locator('#exMarkOut549').click();assert.equal(await p.locator('#exEnd549').inputValue(),'4.00');
 // Native decode cannot be cancelled: no second decoder until the original settles.
 await p.evaluate(()=>{const C=OfflineAudioContext;window.__release549=null;window.__decodes549=0;window.OfflineAudioContext=function(...a){const ctx=new C(...a),decode=ctx.decodeAudioData.bind(ctx);ctx.decodeAudioData=(bytes,ok,fail)=>{window.__decodes549++;return new Promise((resolve,reject)=>{window.__release549=()=>decode(bytes).then(x=>{ok(x);resolve(x);},e=>{fail(e);reject(e);});});};return ctx;};});
 await p.locator('#exBuild549').click();await p.waitForFunction(()=>window.__decodes549===1);await p.locator('#exCancel549').click();assert.equal(await p.locator('#exBuild549').isDisabled(),true);assert.match(await p.locator('#exStatus549').textContent(),/Waiting/);
 await p.evaluate(()=>window.__release549());await p.waitForFunction(()=>!document.querySelector('#exBuild549').disabled);assert.equal(await p.locator('#exDownload549').getAttribute('href'),null);
 await boot();assert.equal(await p.locator('#exDownload549').getAttribute('href'),null);assert.equal(await p.locator('#exBuild549').isDisabled(),true);await boot();assert.deepEqual(errors,[]);
 console.log('PASS excerpt: real WAV decode/export, precise range and channels, edge fade, unchanged playback, revocation, invalid range, marks, single-flight cancel, fresh/repeat boot');
}).catch(e=>{console.error(e);process.exitCode=1;});
