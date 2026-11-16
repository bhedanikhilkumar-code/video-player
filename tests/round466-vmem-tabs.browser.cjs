const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 await p.evaluate(()=>{localStorage.setItem('vp-vmem.v1',JSON.stringify({aaaaaaaaaaa:{ts:1,speed:1.5}}));});
 await p.reload(); await p.waitForFunction(()=>window.__vpMainOk325===true);
 await p.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 await p.locator('#loadBtn').click(); await p.locator('#controls').waitFor({state:'visible'});
 await p.waitForTimeout(1500);
 // a stale tab: another tab saved settings for a video this tab never saw, and no event reached the page
 await p.evaluate(()=>{const m=JSON.parse(localStorage.getItem('vp-vmem.v1'));m.bbbbbbbbbbb={ts:2,speed:2};localStorage.setItem('vp-vmem.v1',JSON.stringify(m));});
 await p.evaluate(()=>document.getElementById('pvVolBtn').click());
 await p.waitForTimeout(500);
 const keys=await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('vp-vmem.v1')||'{}')).sort());
 assert.deepEqual(keys,['aaaaaaaaaaa','bbbbbbbbbbb','dQw4w9WgXcQ']);
 console.log('PASS round 466: saving per-video memory keeps the other tab\'s videos');
}).catch(e=>{console.error(e);process.exitCode=1;});
