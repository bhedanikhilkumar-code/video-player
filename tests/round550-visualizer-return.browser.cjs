const assert=require('node:assert/strict');
require('./round538-harness.cjs')(async({p,errors})=>{
 await p.locator('#lpFile').setInputFiles(require('./round548-fixture.cjs')());await p.locator('#lpVideo').evaluate(v=>{v.loop=true;return v.play();});
 await p.evaluate(()=>{window.__vizReads550=0;const proto=AnalyserNode.prototype,read=proto.getByteFrequencyData;proto.getByteFrequencyData=function(a){__vizReads550++;return read.call(this,a);};});
 await p.locator('#lpVizBtn').click();await p.waitForFunction(()=>window.__vizReads550>2);
 // Controlled visibility events reproduce the page's background/foreground branches.
 await p.evaluate(()=>{window.__hidden550=true;Object.defineProperty(document,'hidden',{configurable:true,get:()=>window.__hidden550});document.dispatchEvent(new Event('visibilitychange'));});await p.waitForTimeout(100);const stopped=await p.evaluate(()=>window.__vizReads550);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>window.__vizReads550),stopped,'no analyser reads while hidden');
 await p.evaluate(()=>{window.__hidden550=false;document.dispatchEvent(new Event('visibilitychange'));});await p.waitForFunction(n=>window.__vizReads550>n,stopped,{timeout:2000});
 await p.locator('#lpVideo').evaluate(v=>v.pause());await p.waitForTimeout(100);const paused=await p.evaluate(()=>window.__vizReads550);await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>window.__vizReads550),paused);
 await p.evaluate(()=>{delete document.hidden;});assert.deepEqual(errors,[]);console.log('PASS visualizer restarts on return from hidden tab, no reads while hidden or paused');
}).catch(e=>{console.error(e);process.exitCode=1;});
