const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 await p.evaluate(async()=>{const c=document.createElement('canvas');c.width=32;c.height=18;const b=await new Promise(r=>c.toBlob(r));await Promise.all([window.__vpFrameGalAdd(b,32,18),window.__vpFrameGalAdd(b,32,18)]);});
 await p.waitForTimeout(500);assert.equal(await p.locator('#lpGalGrid285>button').count(),2,'concurrent saves must render each saved frame only once');
 console.log('PASS concurrent gallery saves have unique thumbnails');
}).catch(e=>{console.error(e);process.exitCode=1});
