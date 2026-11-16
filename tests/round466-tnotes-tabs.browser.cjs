const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 const note=(x)=>[{t:5,x}];
 await p.evaluate(n=>{localStorage.setItem('vp-tnotes306.v1',JSON.stringify({dQw4w9WgXcQ:n}));},note('mine'));
 await p.reload(); await p.waitForFunction(()=>window.__vpMainOk325===true);
 await p.locator('#linkInput').fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 await p.locator('#loadBtn').click(); await p.locator('#controls').waitFor({state:'visible'});
 await p.waitForFunction(()=>document.querySelectorAll('#tnoteList306 button.chip').length>=2,{timeout:8000});
 await p.evaluate(n=>{const m=JSON.parse(localStorage.getItem('vp-tnotes306.v1'));m.aaaaaaaaaaa=n;localStorage.setItem('vp-tnotes306.v1',JSON.stringify(m));window.dispatchEvent(new StorageEvent('storage',{key:'vp-tnotes306.v1'}));},note('other tab'));
 // a stale tab: this write reached storage but no storage event reached the page
 await p.evaluate(n=>{const m=JSON.parse(localStorage.getItem('vp-tnotes306.v1'));m.bbbbbbbbbbb=n;localStorage.setItem('vp-tnotes306.v1',JSON.stringify(m));},note('stale'));
 const dl=p.locator('#tnoteList306 button.chip').nth(1); await dl.click(); await dl.click();
 const keys=await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('vp-tnotes306.v1')||'{}')).sort());
 assert.deepEqual(keys,['aaaaaaaaaaa','bbbbbbbbbbb']);
 console.log('PASS round 466: deleting a timestamp note keeps the other tab\'s notes');
}).catch(e=>{console.error(e);process.exitCode=1;});
