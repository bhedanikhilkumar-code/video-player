const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick})=>{
 await pick();
 await p.waitForTimeout(800);
 // a stale tab: another tab saved chapters for another file and no event reached this page
 await p.evaluate(()=>{const m=JSON.parse(localStorage.getItem('vp-chapters.v1')||'{}');m['other.mp4|123']=[{t:4,n:'Elsewhere'}];localStorage.setItem('vp-chapters.v1',JSON.stringify(m));});
 await p.evaluate(()=>document.getElementById('lpChAdd').click());
 await p.waitForTimeout(500);
 const keys=await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('vp-chapters.v1')||'{}')));
 assert.equal(keys.length,2,JSON.stringify(keys));
 assert.ok(keys.includes('other.mp4|123'));
 console.log('PASS round 466: adding a chapter keeps the other tab\'s chapters');
}).catch(e=>{console.error(e);process.exitCode=1;});
