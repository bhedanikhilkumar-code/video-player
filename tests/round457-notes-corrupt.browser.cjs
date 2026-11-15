const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.addInitScript(()=>{if(!localStorage.getItem('seeded457n')){localStorage.setItem('vp-notes.v1','{"dQw4w9WgXcQ":["x"],"abcdefghijk":7,"9bZkp7q19f0":"keep"}');localStorage.setItem('vp-tnotes306.v1','{"dQw4w9WgXcQ":[null,{"t":"x"},{"t":5,"x":"ok"}]}');localStorage.setItem('seeded457n','1');}});
 await p.goto(origin+'/?cb=457-b&url=dQw4w9WgXcQ');
 await p.waitForFunction(()=>window.__vpMainOk325,null,{timeout:8000});
 assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-notes.v1'))),{'9bZkp7q19f0':'keep'});
 console.log('PASS round 457: non-text notes dropped, text note kept, boot ok');
}).catch(e=>{console.error(e);process.exitCode=1;});
