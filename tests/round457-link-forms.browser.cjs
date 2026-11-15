const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 const r=await p.evaluate(()=>['vnd.youtube:dQw4w9WgXcQ','vnd.youtube://dQw4w9WgXcQ?t=5','https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg','https://www.youtube.com/playlist?list=PL1','programming'].map(window.__vpParseId));
 assert.deepEqual(r,['dQw4w9WgXcQ','dQw4w9WgXcQ','dQw4w9WgXcQ',null,null]);
 console.log('PASS round 457: vnd.youtube and ytimg links parse');
}).catch(e=>{console.error(e);process.exitCode=1;});
