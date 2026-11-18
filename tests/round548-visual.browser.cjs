const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.setViewportSize({width:390,height:1080});await p.locator('#lpFile').setInputFiles(require('./round548-video-fixture.cjs')());await p.locator('#lpVideo').evaluate(v=>{v.loop=true;return v.play();});
 await p.locator('#quietMap548 summary').click();await p.locator('#qmScan548').click();await p.waitForFunction(()=>document.querySelectorAll('#qmList548 li').length>=2);assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false,'scanning does not pause a playing file');
 async function shot(id,name){await p.locator(id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.waitForTimeout(1000);const g=await p.locator('#lpVideo').evaluate(e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,w:r.width,h:r.height};});console.log(name,'video pixels',g);assert.ok(g.w>20&&g.h>20&&g.bottom>0&&g.top<1080);assert.equal(await p.locator('#quietMap548').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);assert.equal(await p.locator('html').evaluate(e=>e.scrollWidth<=innerWidth),true);await p.screenshot({path:'/downloads/'+name+'.png'});}
 await shot('#quietMap548','round548-en-navigator');
 await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#quietMap548 summary').textContent==='शांत भाग नेविगेटर');await shot('#quietMap548','round548-hi-390');
 await p.locator('#langBtn').click();await p.waitForFunction(()=>document.querySelector('#quietMap548 summary').textContent==='શાંત ભાગ નેવિગેટર');await p.locator('#qmClips548').click();await shot('#ciReview500','round548-gu-listening-review');await p.locator('#ciCancel500').click();
 for(let i=0;i<5;i++){if(await p.locator('html').getAttribute('data-theme')==='dark')break;await p.locator('#themeBtn').click();}
 if(await p.locator('#help').evaluate(e=>e.classList.contains('sec-collapsed')))await p.locator('#help .sec-toggle').click();await p.locator('#a11yHc').check();await p.locator('#a11yLow').check();await p.locator('#a11yCalm').check();await shot('#quietMap548','round548-gu-accessible');
 await p.locator('#qmJump548-0-1').click();assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),true);assert.deepEqual(errors,[]);
 console.log('PASS visual/real-video flow: on-device decode during playback, EN/HI/GU, listening review, 390px, docked video, dark High contrast, Calm, Low-end and working gap jump');
}).catch(e=>{console.error(e);process.exitCode=1;});
