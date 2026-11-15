const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick([files[0]]);
 await p.evaluate(()=>{const v=document.getElementById('lpVideo');v.muted=true;return v.play();});
 await p.waitForFunction(()=>!document.getElementById('lpVideo').paused);await p.waitForTimeout(750);
 await p.evaluate(()=>{const now=Date.now;try{Date.now=()=>1800000000000;window.__vpOneTab450.announce();}finally{Date.now=now;}const bc=new BroadcastChannel('vp-onetab.v1');bc.postMessage({k:'play',from:'!',t:1800000000000});setTimeout(()=>bc.close(),500);});
 await p.waitForTimeout(300);
 assert.equal(await p.locator('#lpVideo').evaluate(v=>v.paused),false,'the deterministic tie winner must keep playing');
 await p.evaluate(()=>{const bc=new BroadcastChannel('vp-onetab.v1');bc.postMessage({k:'play',from:'~',t:1800000000000});setTimeout(()=>bc.close(),500);});
 await p.waitForFunction(()=>document.getElementById('lpVideo').paused);
 console.log('PASS same-millisecond tab starts have exactly one winner, not two paused tabs');
}).catch(e=>{console.error(e);process.exitCode=1;});
