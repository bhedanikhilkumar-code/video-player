const assert=require('node:assert/strict');
require('./round445-harness.cjs')(async({p,pick,files})=>{
 await pick(files.slice(0,1));await p.locator('#dualSub499>summary').click();
 await p.evaluate(()=>{const read=File.prototype.arrayBuffer;File.prototype.arrayBuffer=async function(){if(this.name==='slow.srt')await new Promise(r=>setTimeout(r,400));return read.call(this);};});
 const file=(name,buffer)=>({name,mimeType:'text/plain',buffer:Buffer.isBuffer(buffer)?buffer:Buffer.from(buffer)});
 await p.locator('#dualFile499').setInputFiles(file('slow.srt','1\n00:00:01,000 --> 00:00:04,000\nOld delayed result\n'));
 await p.locator('#dualFile499').setInputFiles(file('too-large.srt',Buffer.alloc(2*1024*1024+1,32)));
 await p.waitForTimeout(500);assert.equal(await p.locator('#dualSub499').getAttribute('aria-busy'),'false','rejected replacement must settle busy state');assert.equal(await p.locator('#dualName499').textContent(),'');assert.match(await p.locator('#dualStatus499').textContent(),/under 2 MB/);
 console.log('PASS pending companion read superseded by oversized file settles without stale install or stuck busy state');
}).catch(e=>{console.error(e);process.exitCode=1});
