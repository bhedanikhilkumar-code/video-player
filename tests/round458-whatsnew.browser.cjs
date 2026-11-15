const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p})=>{
 // the round 458 entry must survive every later-staggered announcement (latest is 7220ms)
 await p.waitForFunction(()=>[...document.querySelectorAll('#whatsNewList .wnew-item')].some(b=>/Copy link at this time from the keyboard/.test(b.textContent)),{timeout:15000});
 const first=await p.evaluate(()=>document.querySelector('#whatsNewList .wnew-item .wnew-name').textContent);
 assert.match(first,/Copy link at this time from the keyboard/);
 console.log('PASS round 458: the What is new entry lands and stays on top after all announcements');
}).catch(e=>{console.error(e);process.exitCode=1;});
