const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c})=>{
 await c.addInitScript(()=>Object.defineProperty(window,'launchQueue',{configurable:true,value:{setConsumer(fn){window.__lqFn=fn;}}}));
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&window.__lqFn);
 await p.evaluate(()=>{const mk=(name,ms,type='video/mp4')=>({getFile:()=>new Promise(r=>setTimeout(()=>r(new File(['media'],name,{type})),ms))});window.__lqFn({files:[mk('Opening.mp4',180),mk('ignored.txt',100,'text/plain'),mk('Middle.mp4',80),mk('Finale.mp4',0)]});});
 await p.waitForTimeout(500);
 assert.deepEqual(await p.locator('#lpFile').evaluate(el=>Array.from(el.files,f=>f.name)),['Opening.mp4','Middle.mp4','Finale.mp4'],'system file order must not depend on disk read completion');
 console.log('PASS system launch preserves file order despite delayed reads and rejected types');
}).catch(e=>{console.error(e);process.exitCode=1;});
