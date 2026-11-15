const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c})=>{
 await c.addInitScript(()=>Object.defineProperty(window,'launchQueue',{configurable:true,value:{setConsumer(fn){window.__lqFn=fn;}}}));
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&window.__lqFn);
 await p.evaluate(()=>{const mk=(name,ms)=>({getFile:()=>new Promise(r=>setTimeout(()=>r(new File(['media'],name,{type:'video/mp4'})),ms))});window.__lqFn({files:[mk('Old-launch.mp4',250)]});window.__lqFn({files:[mk('Newest-launch.mp4',0)]});});
 await p.waitForTimeout(550);
 assert.deepEqual(await p.locator('#lpFile').evaluate(el=>Array.from(el.files,f=>f.name)),['Newest-launch.mp4'],'a slow earlier launch cannot replace the most recent request');
 console.log('PASS newer system launch wins while older files are still being read');
}).catch(e=>{console.error(e);process.exitCode=1;});
