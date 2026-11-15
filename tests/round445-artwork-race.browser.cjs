const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();await p.locator('#lpVideo').evaluate(v=>v.play());
 assert.equal(await p.evaluate(()=>navigator.mediaSession.metadata.title),'Opening.mp4');
 await p.locator('#linkInput').fill('https://youtube.com/watch?v=dQw4w9WgXcQ');await p.locator('#loadBtn').click();
 await p.waitForTimeout(1500);
 assert.notEqual(await p.evaluate(()=>navigator.mediaSession.metadata&&navigator.mediaSession.metadata.title),'Opening.mp4','Delayed artwork must not reclaim a YouTube Media Session');
 console.log('PASS: delayed local artwork cannot reclaim Media Session after selecting YouTube.');
}).catch(e=>{console.error(e);process.exitCode=1;});
