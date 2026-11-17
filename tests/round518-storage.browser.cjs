const assert=require('node:assert/strict');
require('./round518-harness.cjs')(async({p,open,rows,boot,origin})=>{
 await open();await p.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='vp-remind517.v1')throw new DOMException('Test quota','QuotaExceededError');return set.call(this,k,v);};});
 await p.locator('#remQ1h517').click();assert.equal((await rows()).length,0);assert.match(await p.locator('#remMsg517').textContent(),/could not be saved/i,'failed save needs an explicit error, never a success toast');
 await boot();await open();await p.locator('#remQ1h517').click();let before=await rows();
 await p.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='vp-remind517.v1')throw new DOMException('Test quota','QuotaExceededError');return set.call(this,k,v);};});
 await p.locator('#remList517 button').first().click();assert.deepEqual(await rows(),before);assert.match(await p.locator('#remMsg517').textContent(),/could not be saved/i);
 await boot();await p.evaluate(()=>localStorage.setItem('vp-remind517.v1',JSON.stringify([{id:'dQw4w9WgXcQ',title:'Due reminder',at:Date.now()-1000}])));await boot();await p.locator('#remDue517').waitFor({state:'visible'});before=await rows();
 await p.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='vp-remind517.v1')throw new DOMException('Test quota','QuotaExceededError');return set.call(this,k,v);};});
 for(const id of ['remDueSnz517','remDueNo517','remDuePlay517']){await p.locator('#'+id).click();assert.equal(await p.locator('#remDue517').isVisible(),true,'failed write retains due card');assert.deepEqual(await rows(),before);}
 console.log('PASS reminder storage failures '+origin);
}).catch(e=>{console.error(e);process.exitCode=1;});
