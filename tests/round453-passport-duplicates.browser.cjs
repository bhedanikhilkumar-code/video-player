const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,boot})=>{
 const id='abcdefghijk';
 await p.locator('#passImpFile449').setInputFiles({name:'duplicate-passport.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({kind:'vp-video-passport',v:1,id,marks:[{t:12,name:'First'},{t:12,name:'Duplicate'},{t:12.8,name:'Same floored second'},{t:25,name:'Second'}]}))});
 await p.locator('#passportApply453').click();await p.waitForTimeout(100);
 assert.deepEqual(await p.evaluate(id=>JSON.parse(localStorage.getItem('vp-marks.v1'))[id],id),[{t:12,name:'First'},{t:25,name:'Second'}],'duplicate seconds within one file should only consume one moment slot');
 await boot();await boot();
 assert.equal(await p.evaluate(id=>JSON.parse(localStorage.getItem('vp-marks.v1'))[id].length,id),2);
 console.log('PASS one passport cannot duplicate its own moments; persists on fresh and repeat loads');
}).catch(e=>{console.error(e);process.exitCode=1;});
