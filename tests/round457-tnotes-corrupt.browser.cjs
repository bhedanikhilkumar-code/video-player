const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,origin})=>{
 await p.addInitScript(()=>{if(!localStorage.getItem('seeded457'))localStorage.setItem('vp-tnotes306.v1','{"x":[null,1,"a",{}],"dQw4w9WgXcQ":[null,{"t":5,"x":"keep me"},{"t":"z","x":"bad"},3]}');localStorage.setItem('seeded457','1');});
 await p.goto(origin+'/?cb=457-a&url=dQw4w9WgXcQ');
 await p.waitForFunction(()=>window.__vpMainOk325,null,{timeout:8000});
 const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('vp-tnotes306.v1')));
 assert.deepEqual(stored,{dQw4w9WgXcQ:[{t:5,x:'keep me'}]});
 console.log('PASS round 457: damaged timed-note entries no longer stop boot; valid note kept');
}).catch(e=>{console.error(e);process.exitCode=1;});
