const assert=require('node:assert/strict');
// Simulate the browser's file launching: capture the consumer, then hand it two device files.
require('./round445-harness.cjs')(async({p,c,files,bytes})=>{
 await c.addInitScript(()=>{Object.defineProperty(window,'launchQueue',{configurable:true,value:{setConsumer(fn){window.__lqFn=fn;}}});});
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325&&window.__vpOpenWith450&&window.__lqFn);
 await p.evaluate(()=>{const mk=n=>({getFile:()=>Promise.resolve(new File([new Uint8Array(10)],n,{type:'video/mp4'}))});const bad={getFile:()=>Promise.reject(new Error('x'))};const txt={getFile:()=>Promise.resolve(new File(['a'],'a.txt',{type:'text/plain'}))};window.__lqFn({files:[mk('One.mp4'),bad,txt,mk('Two.mp4')]});});
 await p.waitForTimeout(600);
 assert.equal(await p.evaluate(()=>document.getElementById('lpFile').files.length),2,'only the two videos reach the picker');
 assert.match(await p.locator('#vpToast').textContent(),/Opened 2 file/);
 // Empty launch does nothing and does not throw.
 await p.evaluate(()=>window.__lqFn({files:[]}));
});
