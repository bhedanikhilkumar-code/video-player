const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 const note=(n)=>({d:'data:image/jpeg;base64,AAAA',s:n,t:1000+n});
 await p.evaluate(n=>{localStorage.setItem('vp-vphotos.v1',JSON.stringify({dQw4w9WgXcQ:n}));},note(3));
 await p.reload(); await p.waitForFunction(()=>window.__vpMainOk325===true);
 await p.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 await p.locator('#loadBtn').click(); await p.locator('#controls').waitFor({state:'visible'});
 await p.waitForFunction(()=>{const b=document.getElementById('vphotoDel298');return b&&!b.hidden;},{timeout:8000});
 // "another tab" saves a voice note for a different video
 await p.evaluate(n=>{const m=JSON.parse(localStorage.getItem('vp-vphotos.v1'));m.aaaaaaaaaaa=n;localStorage.setItem('vp-vphotos.v1',JSON.stringify(m));window.dispatchEvent(new StorageEvent('storage',{key:'vp-vphotos.v1'}));},note(5));
 // simulate a stale tab: no storage event reached it
 await p.evaluate(()=>{const m=JSON.parse(localStorage.getItem('vp-vphotos.v1'));m.bbbbbbbbbbb={d:'data:image/jpeg;base64,BBBB',s:7,t:9};localStorage.setItem('vp-vphotos.v1',JSON.stringify(m));});
 await p.locator('#vphotoDel298').click();
 const keys=await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('vp-vphotos.v1')||'{}')).sort());
 assert.deepEqual(keys,['aaaaaaaaaaa','bbbbbbbbbbb']);
 console.log('PASS round 466: deleting a photo note keeps the other tab\'s notes');
}).catch(e=>{console.error(e);process.exitCode=1;});
