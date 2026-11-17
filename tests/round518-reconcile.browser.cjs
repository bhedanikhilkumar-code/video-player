const assert=require('node:assert/strict');
require('./round518-harness.cjs')(async({p,boot,open,rows,origin})=>{
 await p.evaluate(()=>localStorage.setItem('vp-remind517.v1',JSON.stringify([{id:'dQw4w9WgXcQ',title:'Due reminder',at:Date.now()-1000}])));await boot();await open();await p.locator('#remDue517').waitFor({state:'visible'});
 await p.locator('#remList517 button').last().click();assert.equal((await rows()).length,0);await p.waitForTimeout(500);assert.equal(await p.locator('#remDue517').isVisible(),false,'cancelling a reminder must also dismiss its due card');
 await p.evaluate(()=>{localStorage.setItem('vp-remind517.v1',JSON.stringify([{id:'dQw4w9WgXcQ',title:'Restored due reminder',at:Date.now()-1000}]));document.dispatchEvent(new Event('vp-remind517-change'));});
 await p.locator('#remDue517').waitFor({state:'visible'});
 await p.evaluate(()=>{localStorage.setItem('vp-remind517.v1','[]');document.dispatchEvent(new Event('vp-remind517-change'));});await p.waitForTimeout(500);assert.equal(await p.locator('#remDue517').isVisible(),false,'backup restore must reconcile an already-visible due card');
 console.log('PASS reminder due-state reconciliation '+origin);
}).catch(e=>{console.error(e);process.exitCode=1;});
