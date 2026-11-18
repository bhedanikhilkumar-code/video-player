const assert=require('node:assert/strict'),fixture=require('./round548-fixture.cjs')(),lang=process.env.VP_QUIET_LANG||'hi';
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.setViewportSize({width:390,height:844});await p.locator('#lpFile').setInputFiles(fixture);await p.locator('#lpVideo').evaluate(v=>v.pause());await p.locator('#quietMap548 summary').click();
 await p.locator('#qmScan548').click();await p.waitForFunction(()=>document.querySelectorAll('#qmList548 li').length===3);
 await p.locator('#qmJump548-0-0').focus();await p.locator('#langBtn').click();if(lang==='gu')await p.locator('#langBtn').click();
 const title=lang==='gu'?'શાંત ભાગ નેવિગેટર':'शांत भाग नेविगेटर';await p.waitForFunction(t=>document.querySelector('#quietMap548 summary').textContent===t,title);assert.equal(await p.locator('#quietMap548 summary').textContent(),title);
 assert.equal(await p.locator('#qmScan548').textContent(),lang==='gu'?'શાંત ભાગ શોધો':'शांत भाग खोजें');
 assert.match(await p.locator('#qmStatus548').textContent(),lang==='gu'?/શાંત ભાગ મળ્યા: 3/:/शांत भाग मिले: 3/);
 assert.equal(await p.locator('#quietMap548').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);
 await p.locator('#qmJump548-0-1').click();assert.ok(Math.abs(await p.locator('#lpVideo').evaluate(v=>v.currentTime)-4.15)<.03);
 await p.locator('#qmClear548').click();assert.match(await p.locator('#qmStatus548').textContent(),lang==='gu'?/નકશો સાફ કર્યો/:/नक्शा हटाया/);
 assert.deepEqual(errors,[]);console.log('PASS '+lang+' quiet navigator: translated dynamic rows/status, 390px card, working jump and clear');
}).catch(e=>{console.error(e);process.exitCode=1;});
