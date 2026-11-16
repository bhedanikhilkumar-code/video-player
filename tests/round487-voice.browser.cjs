const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,c})=>{
 await c.addInitScript(()=>{window.speechTests487=[];window.SpeechRecognition=class{constructor(){this.stops=0;speechTests487.push(this)}start(){}stop(){this.stops++;if(this.onend)this.onend()}}});
 await p.reload();await p.waitForFunction(()=>window.__vpMainOk325);await p.clock.install();
 await p.locator('#vsMic').click();await p.clock.fastForward(4000);await p.locator('#vsMic').click();
 await p.locator('#vsMic').click();await p.clock.fastForward(4001);
 assert.equal(await p.evaluate(()=>speechTests487[1].stops),0,'an old timeout must not stop a newer voice search');
 await p.evaluate(()=>speechTests487[0].onresult({results:[[{transcript:'STALE RESULT'}]]}));
 assert.notEqual(await p.locator('#libSearch').inputValue(),'STALE RESULT','late result from canceled recognition ignored');
 await p.clock.fastForward(4001);assert.equal(await p.evaluate(()=>speechTests487[1].stops),1,'the current search still times out after eight seconds');
 console.log('PASS voice search: old timeout and late result cannot affect the new session');
}).catch(e=>{console.error(e);process.exitCode=1;});
